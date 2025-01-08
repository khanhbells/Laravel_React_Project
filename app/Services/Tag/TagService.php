<?php

namespace App\Services\Tag;

use App\Services\BaseService;
use App\Repositories\Tag\TagRepository;
use Illuminate\Support\Facades\DB;
use App\Enums\Status;


class TagService extends BaseService
{
    protected $tagRepository;
    public function __construct(
        TagRepository $tagRepository,
    ) {
        $this->tagRepository = $tagRepository;
    }

    public function paginate($request)
    {
        $agrument = $this->paginateAgrument($request);
        $tags = $this->tagRepository->pagination([...$agrument]);
        // dd($tags);
        return $tags;
    }

    private function paginateAgrument($request)
    {
        return [
            'perpage' => $request->input('perpage') ?? 10,
            'keyword' => [
                'search' => $request->input('keyword') ?? '',
                'field' => ['name']
            ],
            'condition' => [
                'publish' => $request->integer('publish'),
            ],
            'relationCount' => ['posts'],
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
            $except = [];
            $payload = $this->initializePayload($request, $except)->processCanonical()->getPayload();
            $tag = $this->tagRepository->create($payload);

            DB::commit();
            return [
                'tag' => $tag,
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
            $except = [];
            $payload = $this->initializePayload($request, $except)->processCanonical()->getPayload();
            $tag = $this->tagRepository->update($id, $payload);
            // dd($tag);
            DB::commit();
            return [
                'tag' => $tag,
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
            $this->tagRepository->delete($id);
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
