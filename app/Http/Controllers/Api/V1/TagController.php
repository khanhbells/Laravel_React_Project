<?php

namespace App\Http\Controllers\Api\V1;

use App\Enums\Status;
use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Http\Resources\TagResource;
use App\Services\Tag\TagService;
use App\Repositories\Tag\TagRepository;
use Symfony\Component\HttpFoundation\Response;
use App\Http\Requests\UpdateByFieldRequest;
use App\Http\Requests\Tag\StoreTagRequest;
use App\Http\Requests\Tag\UpdateTagRequest;

class TagController extends Controller
{
    protected $tagService;
    protected $tagRepository;
    public function __construct(
        TagService $tagService,
        TagRepository $tagRepository,
    ) {
        $this->tagService = $tagService;
        $this->tagRepository = $tagRepository;
    }

    public function index(Request $request)
    {
        $tags = $this->tagService->paginate($request);
        return response()->json([
            'tags' =>  method_exists($tags, 'items') ? TagResource::collection($tags->items()) : $tags,
            'links' => method_exists($tags, 'items') ? $tags->linkCollection() : null,
            'current_page' => method_exists($tags, 'items') ? $tags->currentPage() : null,
            'last_page' => method_exists($tags, 'items') ? $tags->lastPage() : null,
        ], Response::HTTP_OK);
    }

    public function create(StoreTagRequest $request)
    {
        $auth = auth()->user();
        $data = $this->tagService->create($request);
        if ($data['code'] == Status::SUCCESS) {
            return response()->json([
                'message' => 'Thêm mới bản ghi thành công',
                'user_catalogues' => new TagResource($data['tag'])
            ], Response::HTTP_OK);
        }
        return response()->json([
            'message' => $data['message']
        ], Response::HTTP_INTERNAL_SERVER_ERROR);
    }

    public function update(UpdateTagRequest $request, $id)
    {
        $data = $this->tagService->update($request, $id);
        if ($data['code'] == Status::SUCCESS) {
            return response()->json([
                'message' => 'Cập nhật bản ghi thành công',
                'user_catalogues' => new TagResource($data['tag']),
                'code' => Response::HTTP_OK
            ], Response::HTTP_OK);
        }
    }

    public function show(Request $request, $id)
    {
        if (empty($id) || $id < 0) {
            return $this->returnIfIdValidateFail();
        }
        $tag = $this->tagRepository->findById($id);
        if (!$tag) {
            return response()->json([
                'code' => Status::ERROR,
                'message' => 'Không có dữ liệu phù hợp'
            ], Response::HTTP_NOT_FOUND);
        } else {
            return response()->json(
                new TagResource($tag)
            );
        }
    }

    public function destroy($id, Request $request)
    {
        if (empty($id) || $id < 0) {
            return $this->returnIfIdValidateFail();
        }

        $tag = $this->tagRepository->findById($id);

        if (!$tag) {
            return response()->json([
                'message' => 'Không tìm thấy bản ghi cần xóa',
                'code' => Status::SUCCESS
            ], Response::HTTP_NOT_FOUND);
        }

        if ($this->tagService->delete($id)) {
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
        $respository = 'App\Repositories\Tag\TagRepository';
        if ($this->tagService->updateByField($request, $id, $respository)) {

            return response()->json([
                'message' =>  'Cập nhật dữ liệu thành công',
            ], Response::HTTP_OK);
        }
        return response()->json([
            'message' =>  'Cập nhật dữ liệu không thành công',
        ], Response::HTTP_INTERNAL_SERVER_ERROR);
    }

    private function returnIfIdValidateFail()
    {
        return response()->json([
            'message' => 'Mã ID không hợp lệ',
            'code' => Status::ERROR
        ], Response::HTTP_INTERNAL_SERVER_ERROR);
    }
}
