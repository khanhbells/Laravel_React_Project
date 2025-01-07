<?php

namespace App\Http\Controllers\Api\V1;

use App\Enums\Status;
use App\Http\Controllers\Controller;
use App\Http\Requests\Post\DeletePostRequest;
use Illuminate\Http\Request;
use App\Http\Resources\PostResource;
use App\Services\Post\PostService;
use App\Repositories\Post\PostRepository;
use Symfony\Component\HttpFoundation\Response;
use App\Http\Requests\UpdateByFieldRequest;
use App\Http\Requests\Post\StorePostRequest;

class PostController extends Controller
{
    protected $postService;
    protected $postRepository;
    protected $auth;

    public function __construct(
        PostService $postService,
        PostRepository $postRepository,
    ) {
        $this->postService = $postService;
        $this->postRepository = $postRepository;
        $this->auth = auth()->user();
    }

    public function index(Request $request)
    {
        $posts = $this->postService->paginate($request);
        return response()->json([
            'posts' =>  method_exists($posts, 'items') ? PostResource::collection($posts->items()) : $posts,
            'links' => method_exists($posts, 'items') ? $posts->linkCollection() : null,
            'current_page' => method_exists($posts, 'items') ? $posts->currentPage() : null,
            'last_page' => method_exists($posts, 'items') ? $posts->lastPage() : null,
        ], Response::HTTP_OK);
    }

    public function create(Request $request)
    {
        $auth = auth()->user();
        $data = $this->postService->create($request, $auth);
        return $data;
        if ($data['code'] == Status::SUCCESS) {
            return response()->json([
                'message' => 'Thêm mới bản ghi thành công',
                'post_catalogues' => new PostResource($data['post'])
            ], Response::HTTP_OK);
        }
        return response()->json([
            'message' => $data['message']
        ], Response::HTTP_INTERNAL_SERVER_ERROR);
    }

    public function update(Request $request, $id)
    {
        $auth = auth()->user();
        $data = $this->postService->update($request, $id, $auth);
        // return $data;
        if ($data['code'] == Status::SUCCESS) {
            return response()->json([
                'message' => 'Cập nhật bản ghi thành công',
                'post_catalogues' => new PostResource($data['post']),
                'code' => Response::HTTP_OK
            ], Response::HTTP_OK);
        }
    }

    public function show(Request $request, $id)
    {

        try {
            if (!$id) {
                return response()->json([
                    'code' => Status::ERROR,
                    'message' => 'Không tìm thấy dữ liệu phù hợp'
                ], Response::HTTP_NOT_FOUND);
            }
            $post = $this->postRepository->findById($id);
            return response()->json(
                new PostResource($post)
            );
        } catch (\Exception $e) {
            return response()->json([
                'code' => Status::ERROR,
                'message' => 'Network Error'
            ], Response::HTTP_NOT_FOUND);
        }
    }

    public function destroy($id, DeletePostRequest $request)
    {
        $post = $this->postRepository->findById($id);
        if (!$post) {
            return response()->json([
                'message' => 'Không tìm thấy bản ghi cần xóa',
                'code' => Status::SUCCESS
            ], Response::HTTP_NOT_FOUND);
        }

        if ($this->postService->delete($id, $this->auth)) {
            return response()->json([
                'message' => 'Xóa bản ghi thành công',
                'code' => Status::SUCCESS
            ], Response::HTTP_OK);
        }
        return response()->json([
            'message' => 'Network Error',
            'code' => Status::ERROR
        ], Response::HTTP_INTERNAL_SERVER_ERROR);
    }

    public function updateStatusByField(UpdateByFieldRequest $request, $id)
    {
        $respository = 'App\Repositories\Post\PostRepository';
        if ($this->postService->updateByField($request, $id, $respository)) {

            return response()->json([
                'message' =>  'Cập nhật dữ liệu thành công',
            ], Response::HTTP_OK);
        }
        return response()->json([
            'message' =>  'Cập nhật dữ liệu không thành công',
        ], Response::HTTP_INTERNAL_SERVER_ERROR);
    }
}
