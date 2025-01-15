<?php

namespace App\Services\Patient;

use App\Services\BaseService;
use App\Repositories\Patient\PatientRepository;
use Illuminate\Support\Facades\DB;
use App\Enums\Status;
use Illuminate\Support\Facades\Hash;

class PatientService extends BaseService
{
    protected $patientRepository;
    protected $files = ['image'];

    public function __construct(
        PatientRepository $patientRepository,
    ) {
        $this->patientRepository = $patientRepository;
    }

    public function paginate($request)
    {
        $agrument = $this->paginateAgrument($request);

        $patients = $this->patientRepository->pagination([...$agrument]);
        return $patients;
    }

    private function paginateAgrument($request)
    {
        return [
            'perpage' => $request->input('perpage') ?? 10,
            'keyword' => [
                'search' => $request->input('keyword') ?? '',
                'field' => ['name', 'email', 'address', 'phone']
            ],
            'condition' => [
                'publish' => $request->integer('publish'),
                'patient_catalogue_id' => $request->integer('patient_catalogue_id'),
            ],
            'select' => ['*'],
            'orderBy' => $request->input('sort') ? explode(',', $request->input('sort')) : ['id', 'desc'],
            'relations' => ['patient_catalogues']
        ];
    }

    protected function hashPassword($request)
    {
        if ($request->input('password')) {
            $this->payload['password'] = Hash::make($this->payload['password']);
        }
        return $this;
    }

    private function initializeRequest($request, $except, $auth)
    {
        return $this->initializePayload($request, $except)
            ->processFiles($request, $auth, $this->files)
            ->hashPassword($request)
            ->getPayload();
    }

    public function create($request, $auth)
    {
        DB::beginTransaction();
        try {
            $except = ['confirmPassword', 'id'];
            $payload = $this->initializeRequest($request, $except, $auth);
            $patient = $this->patientRepository->create($payload);
            DB::commit();
            return [
                'patient' => $patient,
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
            $except = ['confirmPassword', 'id'];
            $payload = $this->initializeRequest($request, $except, $auth);

            $patient = $this->patientRepository->update($id, $payload);
            // dd($patient);
            DB::commit();
            return [
                'patient' => $patient,
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

    public function delete($id)
    {
        DB::beginTransaction();
        try {
            $this->patientRepository->delete($id);
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
