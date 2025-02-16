<?php

namespace App\Services\Specialty;

use App\Services\BaseService;
use App\Repositories\Specialty\SpecialtyCatalogueRepository;
use Illuminate\Support\Facades\DB;
use App\Enums\Status;
use App\Classes\Nested;


class SpecialtyCatalogueService extends BaseService
{
    protected $specialtyCatalogueRepository;
    protected $fileUploader;
    protected $files = ['image', 'icon'];
    protected $except = [];
    protected $nested;

    public function __construct(
        SpecialtyCatalogueRepository $specialtyCatalogueRepository,
    ) {
        $this->specialtyCatalogueRepository = $specialtyCatalogueRepository;
        $this->nested = new Nested([
            'table' => 'specialty_catalogues'
        ]);
    }

    public function paginate($request)
    {
        $agrument = $this->paginateAgrument($request);
        $specialtyCatalogues = $this->specialtyCatalogueRepository->pagination([...$agrument]);
        // dd($specialtyCatalogues);
        return $specialtyCatalogues;
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
            // 'relations' => ['specialtys'],
            'select' => ['*'],
            'orderBy' => $request->input('sort') ? explode(',', $request->input('sort')) : ['lft', 'asc'],
        ];
    }

    private function imageAgrument()
    {
        return [
            'customFolder' => ['specialty_catalogues'],
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
            $except = [];
            $payload = $this->initializeRequest($request, $auth, $except);
            $specialtyCatalogue = $this->specialtyCatalogueRepository->create($payload);
            if ($specialtyCatalogue->id > 0) {
                $nested = $this->nested;
                $this->nestedset($auth, $nested);
            }
            DB::commit();
            return [
                'specialtyCatalogue' => $specialtyCatalogue,
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
            $except = ['specialty_counts'];
            $payload = $this->initializeRequest($request, $auth, $except);

            $specialtyCatalogue = $this->specialtyCatalogueRepository->update($id, $payload);
            $nested = $this->nested;
            $this->nestedset($auth, $nested);
            DB::commit();
            return [
                'specialtyCatalogue' => $specialtyCatalogue,
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

    public function delete($id, $auth)
    {
        DB::beginTransaction();
        try {
            $this->specialtyCatalogueRepository->delete($id);
            $nested = $this->nested;
            $this->nestedset($auth, $nested);
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
