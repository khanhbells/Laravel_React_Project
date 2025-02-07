<?php

namespace App\Services\Medicine;

use App\Services\BaseService;
use App\Repositories\Medicine\MedicineCatalogueRepository;
use Illuminate\Support\Facades\DB;
use App\Enums\Status;
use App\Classes\Nested;


class MedicineCatalogueService extends BaseService
{
    protected $medicineCatalogueRepository;
    protected $fileUploader;
    protected $files = ['image', 'icon'];
    protected $except = [];
    protected $nested;

    public function __construct(
        MedicineCatalogueRepository $medicineCatalogueRepository,
    ) {
        $this->medicineCatalogueRepository = $medicineCatalogueRepository;
        $this->nested = new Nested([
            'table' => 'medicine_catalogues'
        ]);
    }

    public function paginate($request)
    {
        $agrument = $this->paginateAgrument($request);
        $medicineCatalogues = $this->medicineCatalogueRepository->pagination([...$agrument]);
        // dd($medicineCatalogues);
        return $medicineCatalogues;
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
            // 'relations' => ['medicines'],
            'select' => ['*'],
            'orderBy' => $request->input('sort') ? explode(',', $request->input('sort')) : ['lft', 'asc'],
        ];
    }

    private function imageAgrument()
    {
        return [
            'customFolder' => ['medicine_catalogues'],
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
            $medicineCatalogue = $this->medicineCatalogueRepository->create($payload);
            if ($medicineCatalogue->id > 0) {
                $nested = $this->nested;
                $this->nestedset($auth, $nested);
            }
            DB::commit();
            return [
                'medicineCatalogue' => $medicineCatalogue,
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
            $except = ['medicine_counts'];
            $payload = $this->initializeRequest($request, $auth, $except);
            $medicineCatalogue = $this->medicineCatalogueRepository->update($id, $payload);
            $nested = $this->nested;
            $this->nestedset($auth, $nested);
            DB::commit();
            return [
                'medicineCatalogue' => $medicineCatalogue,
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
            $this->medicineCatalogueRepository->delete($id);
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
