<?php

namespace App\Services\Post;

use App\Services\BaseService;
use App\Repositories\Post\PostCatalogueRepository;
use Illuminate\Support\Facades\DB;
use App\Enums\Status;


class PostCatalogueService extends BaseService
{
    protected $postCatalogueRepository;
    public function __construct(
        PostCatalogueRepository $postCatalogueRepository,
    ) {
        $this->postCatalogueRepository = $postCatalogueRepository;
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
            'orderBy' => $request->input('sort') ? explode(',', $request->input('sort')) : ['id', 'desc'],
        ];
    }

    public function create($request)
    {
        DB::beginTransaction();
        try {
            $except = [];
            $payload = $this->request($request);
            $postCatalogue = $this->postCatalogueRepository->create($payload);

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

    public function update($request, $id)
    {
        DB::beginTransaction();
        try {
            $except = ['post_counts'];
            $payload = $this->request($request);
            $postCatalogue = $this->postCatalogueRepository->update($id, $payload);
            // dd($postCatalogue);
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

    public function delete($id)
    {
        DB::beginTransaction();
        try {
            $this->postCatalogueRepository->delete($id);
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
