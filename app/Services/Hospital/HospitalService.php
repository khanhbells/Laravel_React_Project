<?php

namespace App\Services\Hospital;

use App\Services\BaseService;
use App\Repositories\Hospital\HospitalRepository;
use Illuminate\Support\Facades\DB;
use App\Enums\Status;
use App\Classes\Nested;


class HospitalService extends BaseService
{
    protected $hospitalRepository;
    protected $fileUploader;
    protected $files = ['image', 'icon'];
    protected $except = [];

    public function __construct(
        HospitalRepository $hospitalRepository,
    ) {
        $this->hospitalRepository = $hospitalRepository;
    }

    public function paginate($request)
    {
        $agrument = $this->paginateAgrument($request);
        $hospitals = $this->hospitalRepository->pagination([...$agrument]);
        // dd($hospitals);
        return $hospitals;
    }

    private function paginateAgrument($request)
    {
        return [
            'perpage' => $request->input('perpage') ?? 10,
            'keyword' => [
                'search' => $request->input('keyword') ?? '',
                'field' => ['name', 'description', 'content']
            ],
            'condition' => [
                'publish' => $request->integer('publish'),
            ],
            // 'relations' => ['posts'],
            'select' => ['*'],
            'orderBy' => $request->input('sort') ? explode(',', $request->input('sort')) : ['id', 'asc'],
        ];
    }

    private function imageAgrument()
    {
        return [
            'customFolder' => ['hospitals'],
            'imageType' => 'image'
        ];
    }

    private function initializeRequest($request, $auth, $except)
    {
        return $this->initializePayload($request, $except)
            ->handleUserId($auth)
            ->processFiles($request, $auth, $this->files, ...$this->imageAgrument())
            ->processCanonical()
            ->processAlbum($request, $auth, $this->imageAgrument()['customFolder'])
            ->getPayload();
    }


    public function create($request, $auth)
    {
        DB::beginTransaction();
        try {
            $except = ['specialties'];
            $payload = $this->initializeRequest($request, $auth, $except);
            $hospital = $this->hospitalRepository->create($payload);
            if ($hospital->id > 0) {
                $this->createHospitalRelation($request, $hospital);
            }
            DB::commit();
            return [
                'hospital' => $hospital,
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

    public function update($request, $id, $auth)
    {
        DB::beginTransaction();
        try {
            $except = ['specialties'];
            $payload = $this->initializeRequest($request, $auth, $except);
            $hospital = $this->hospitalRepository->update($id, $payload);
            if ($hospital) {
                $detachArray = ['specialties'];
                $this->detachRelation($hospital, $detachArray);
                $this->createHospitalRelation($request, $hospital);
            }
            DB::commit();
            return [
                'hospital' => $hospital,
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

    private function createHospitalRelation($request, $hospital)
    {
        $arrayRelation = explode(',', $request->input('specialties'));
        $hospital->specialties()->attach($arrayRelation);
    }

    public function delete($id, $auth)
    {
        DB::beginTransaction();
        try {
            $this->hospitalRepository->delete($id);
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
