<?php

namespace App\Services\Doctor;

use App\Services\BaseService;
use App\Repositories\Doctor\DoctorRepository;
use App\Repositories\User\UserRepository;
use Illuminate\Support\Facades\DB;
use App\Enums\Status;
use GuzzleHttp\Psr7\Query;
use Illuminate\Support\Facades\Hash;

class DoctorService extends BaseService
{
    protected $doctorRepository;
    protected $userRepository;
    protected $files = ['image'];

    public function __construct(
        DoctorRepository $doctorRepository,
        UserRepository $userRepository,
    ) {
        $this->doctorRepository = $doctorRepository;
        $this->userRepository = $userRepository;
    }

    public function paginate($request)
    {
        $agrument = $this->paginateAgrument($request);

        if ($request->input('specialty_id')) {
            $agrument['whereHas'] = $this->whereHas($request);
        }

        $doctors = $this->doctorRepository->pagination([...$agrument]);

        return $doctors;
    }

    private function whereHas($request)
    {
        return [
            'specialties' => function ($query) use ($request) {
                $query->where('specialty_id', $request->integer('specialty_id'))
                    ->where('publish', 2);
            }
        ];
    }

    private function paginateAgrument($request)
    {
        return [
            'perpage' => $request->input('perpage') ?? 10,
            'keyword' => [
                'search' => $request->input('keyword') ?? '',
                'field' => ['mete_title']
            ],
            'condition' => [
                'publish' => $request->integer('publish'),
            ],
            'select' => ['*'],
            'orderBy' => $request->input('sort') ? explode(',', $request->input('sort')) : ['id', 'desc'],
            'relations' => ['users', 'specialties', 'tags'],
            // 'limit' => 10,
        ];
    }


    private function imageAgrument()
    {
        return [
            'customFolder' => ['doctors'],
            'imageType' => 'image'
        ];
    }
    public function update($request, $id, $auth)
    {
        DB::beginTransaction();
        try {
            $onlyOrExcept = ['name', 'image'];
            $idDoctor = $request->input('id');
            $payloadUser = $this->initializePayload($request, [], $onlyOrExcept)->processFiles($request, $auth, $this->files)->getPayload();
            $updateUser = $this->userRepository->update($id, $payloadUser);
            $payloadDoctor = $this->initializePayload($request, [...$onlyOrExcept, 'id', 'specialties', 'tags'])->processAlbum($request, $auth, $this->imageAgrument()['customFolder'])->processCanonical()->getPayload();
            if (is_null($idDoctor)) {
                $doctor = $this->doctorRepository->create($payloadDoctor);
            } else {
                $doctor = $this->doctorRepository->update($idDoctor, $payloadDoctor);
            }
            if ($doctor) {
                $detachArray = ['specialties', 'tags'];
                $this->detachRelation($doctor, $detachArray);
                $this->createDoctorRelation($request, $doctor);
                $this->createTagRelation($request, $doctor);
            }
            // dd($doctor);
            DB::commit();
            return [
                'doctor' => $doctor,
                'code' => Status::SUCCESS
            ];
        } catch (\Exception $e) {
            DB::rollBack();
            return [
                'code' => Status::ERROR,
                'message' => $e->getMessage()
            ];
        }
    }

    private function createDoctorRelation($request, $doctor)
    {
        $arrayRelation = explode(',', $request->input('specialties'));
        $doctor->specialties()->attach($arrayRelation);
    }

    public function findUserDoctor($id)
    {
        $param = [
            'relations' => ['doctors.specialties']
        ];
        $userDoctor = $this->userRepository->findById($id, $param);
        return $userDoctor;
    }

    public function delete($id)
    {
        DB::beginTransaction();
        try {
            $this->doctorRepository->delete($id);
            DB::commit();
            return [
                'code' => Status::SUCCESS
            ];
        } catch (\Exception $e) {
            DB::rollBack();
            return [
                'code' => Status::ERROR,
                'message' => $e->getMessage()
            ];
        }
    }
}
