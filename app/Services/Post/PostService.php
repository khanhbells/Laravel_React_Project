<?php

namespace App\Services\Post;

use App\Services\BaseService;
use App\Repositories\Post\PostRepository;
use Illuminate\Support\Facades\DB;
use App\Enums\Status;
use App\Classes\Nested;


class PostService extends BaseService
{
    protected $postRepository;
    protected $fileUploader;
    protected $files = ['image', 'icon'];
    protected $except = [];

    public function __construct(
        PostRepository $postRepository,
    ) {
        $this->postRepository = $postRepository;
        parent::__construct('post');
    }

    public function paginate($request)
    {
        $agrument = $this->paginateAgrument($request);
        $posts = $this->postRepository->pagination([...$agrument]);
        return $posts;
    }

    //Where đến relations
    private function whereHas($request)
    {
        $model = $this->model;
        return [
            $model . '_catalogues' => [
                $this->whereHasCatalogueId($request)
            ],
        ];
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
            'whereHas' => $this->whereHas($request),
            'select' => ['*'],
            'orderBy' => $request->input('sort') ? explode(',', $request->input('sort')) : ['id', 'desc'],
        ];
    }

    private function imageAgrument()
    {
        return [
            'customFolder' => ['posts'],
            'imageType' => 'image'
        ];
    }

    private function initializeRequest($request, $auth, $except)
    {
        return $this->initializePayload($request, $except)
            ->handleUserId($auth)
            ->processFiles($request, $auth, $this->files, ...$this->imageAgrument())
            ->processAlbum($request, $auth, $this->imageAgrument()['customFolder'])
            ->processCanonical()
            ->getPayload();
    }


    public function create($request, $auth)
    {
        DB::beginTransaction();
        try {
            $except = ['catalogues', 'tags'];
            $payload = $this->initializeRequest($request, $auth, $except);
            $post = $this->postRepository->create($payload);
            if ($post->id > 0) {
                $this->createCatRelation($request, $post, 'post');
                $this->createTagRelation($request, $post);
            }
            DB::commit();
            return [
                'post' => $post,
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
            $except = ['post_counts', 'catalogues', 'cats', 'tags'];
            $payload = $this->initializeRequest($request, $auth, $except);
            $post = $this->postRepository->update($id, $payload);
            if ($post) {
                $detachArray = ['post_catalogues', 'tags'];
                $this->detachRelation($post, $detachArray);
                $this->createCatRelation($request, $post, 'post');
                $this->createTagRelation($request, $post);
            }
            DB::commit();
            return [
                'post' => $post,
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
            $this->postRepository->delete($id);
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
