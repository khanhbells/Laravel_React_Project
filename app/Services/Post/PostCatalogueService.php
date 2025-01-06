<?php

namespace App\Services\Post;

use App\Services\BaseService;
use App\Repositories\Post\PostCatalogueRepository;
use Illuminate\Support\Facades\DB;
use App\Enums\Status;
use App\Classes\Nested;


class PostCatalogueService extends BaseService
{
    protected $postCatalogueRepository;
    protected $fileUploader;
    protected $files = ['image', 'icon'];
    protected $except = [];
    protected $nested;

    public function __construct(
        PostCatalogueRepository $postCatalogueRepository,
    ) {
        $this->postCatalogueRepository = $postCatalogueRepository;
        $this->nested = new Nested([
            'table' => 'post_catalogues'
        ]);
    }

    public function paginate($request)
    {
        $agrument = $this->paginateAgrument($request);
        $postCatalogues = $this->postCatalogueRepository->pagination([...$agrument]);
        // dd($postCatalogues);
        return $postCatalogues;
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
            'orderBy' => $request->input('sort') ? explode(',', $request->input('sort')) : ['lft', 'asc'],
        ];
    }

    private function imageAgrument()
    {
        return [
            'customFolder' => ['post_catalogues'],
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
            $postCatalogue = $this->postCatalogueRepository->create($payload);
            if ($postCatalogue->id > 0) {
                $nested = $this->nested;
                $this->nestedset($auth, $nested);
            }
            DB::commit();
            return [
                'postCatalogue' => $postCatalogue,
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
            $except = ['post_counts'];
            $payload = $this->initializeRequest($request, $auth, $except);
            $postCatalogue = $this->postCatalogueRepository->update($id, $payload);
            $nested = $this->nested;
            $this->nestedset($auth, $nested);
            DB::commit();
            return [
                'postCatalogue' => $postCatalogue,
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
            $this->postCatalogueRepository->delete($id);
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
