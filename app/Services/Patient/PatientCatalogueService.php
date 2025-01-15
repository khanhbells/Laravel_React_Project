<?php

namespace App\Services\Patient;

use App\Services\BaseService;
use App\Repositories\Patient\PatientCatalogueRepository;
use Illuminate\Support\Facades\DB;
use App\Enums\Status;


class PatientCatalogueService extends BaseService
{
    protected $patientCatalogueRepository;
    public function __construct(
        PatientCatalogueRepository $patientCatalogueRepository,
    ) {
        $this->patientCatalogueRepository = $patientCatalogueRepository;
    }

    public function paginate($request)
    {
        $agrument = $this->paginateAgrument($request);
        $patientCatalogues = $this->patientCatalogueRepository->pagination([...$agrument]);
        // dd($patientCatalogues);
        return $patientCatalogues;
    }

    private function paginateAgrument($request)
    {
        return [
            'perpage' => $request->input('perpage') ?? 10,
            'keyword' => [
                'search' => $request->input('keyword') ?? '',
                'field' => ['name', 'description']
            ],
            'condition' => [
                'publish' => $request->integer('publish'),
                // 'patient_catalogue_id' => $request->integer('patient_catalogue_id'),
            ],
            'relationCount' => ['patients'],
            // 'relations' => ['patients'],
            'select' => ['*'],
            'orderBy' => $request->input('sort') ? explode(',', $request->input('sort')) : ['id', 'desc'],
        ];
    }

    private function initializeRequest($request, $except)
    {
        return $this->initializePayload($request, $except)
            ->getPayload();
    }

    public function create($request)
    {
        DB::beginTransaction();
        try {
            $except = ['id'];
            $payload = $this->initializeRequest($request, $except);
            $patientCatalogue = $this->patientCatalogueRepository->create($payload);

            DB::commit();
            return [
                'patientCatalogue' => $patientCatalogue,
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

    public function update($request, $id)
    {
        DB::beginTransaction();
        try {
            $except = ['patient_counts', 'id'];
            $payload = $this->initializeRequest($request, $except);
            $patientCatalogue = $this->patientCatalogueRepository->update($id, $payload);
            // dd($patientCatalogue);
            DB::commit();
            return [
                'patientCatalogue' => $patientCatalogue,
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
            $this->patientCatalogueRepository->delete($id);
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
