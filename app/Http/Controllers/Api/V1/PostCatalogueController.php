<?php

namespace App\Http\Controllers\Api\V1;

use App\Enums\Status;
use App\Http\Controllers\Controller;
use App\Http\Requests\Post\DeletePostCatalogueRequest;
use Illuminate\Http\Request;
use App\Http\Resources\PostCatalogueResource;
use App\Services\Post\PostCatalogueService;
use App\Repositories\Post\PostCatalogueRepository;
use Symfony\Component\HttpFoundation\Response;
use App\Http\Requests\UpdateByFieldRequest;
use App\Http\Requests\Post\StorePostCatalogueRequest;
use Illuminate\Foundation\Auth\Access\AuthorizesRequests;

class PostCatalogueController extends Controller
{
    use AuthorizesRequests;
    protected $postCatalogueService;
    protected $postCatalogueRepository;
    protected $auth;

    public function __construct(
        PostCatalogueService $postCatalogueService,
        PostCatalogueRepository $postCatalogueRepository,
    ) {
        $this->postCatalogueService = $postCatalogueService;
        $this->postCatalogueRepository = $postCatalogueRepository;
        $this->auth = auth('api')->user();
    }

    public function index(Request $request)
    {
        try {
            $this->authorize('modules', '/post/catalogue/index');
            $postCatalogues = $this->postCatalogueService->paginate($request);
            return response()->json([
                'post_catalogues' =>  method_exists($postCatalogues, 'items') ? PostCatalogueResource::collection($postCatalogues->items()) : $postCatalogues,
                'links' => method_exists($postCatalogues, 'items') ? $postCatalogues->linkCollection() : null,
                'current_page' => method_exists($postCatalogues, 'items') ? $postCatalogues->currentPage() : null,
                'last_page' => method_exists($postCatalogues, 'items') ? $postCatalogues->lastPage() : null,
            ], Response::HTTP_OK);
        } catch (\Illuminate\Auth\Access\AuthorizationException $e) {
            return response()->json([
                'message' => 'Không có quyền truy cập',
                'tags' => [],
                'code' => Status::ERROR
            ], Response::HTTP_FORBIDDEN);
        }
    }

    public function create(Request $request)
    {
        $auth = auth('api')->user();
        $data = $this->postCatalogueService->create($request, $auth);

        if ($data['code'] == Status::SUCCESS) {
            return response()->json([
                'message' => 'Thêm mới bản ghi thành công',
                'post_catalogues' => new PostCatalogueResource($data['postCatalogue'])
            ], Response::HTTP_OK);
        }
        return response()->json([
            'message' => $data['message']
        ], Response::HTTP_INTERNAL_SERVER_ERROR);
    }

    public function update(Request $request, $id)
    {
        $auth = auth('api')->user();
        $data = $this->postCatalogueService->update($request, $id, $auth);
        // return $data;
        if ($data['code'] == Status::SUCCESS) {
            return response()->json([
                'message' => 'Cập nhật bản ghi thành công',
                'post_catalogues' => new PostCatalogueResource($data['postCatalogue']),
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
            $postCatalogue = $this->postCatalogueRepository->findById($id);
            return response()->json(
                new PostCatalogueResource($postCatalogue)
            );
        } catch (\Exception $e) {
            return response()->json([
                'code' => Status::ERROR,
                'message' => 'Network Error'
            ], Response::HTTP_NOT_FOUND);
        }
    }

    public function destroy($id, DeletePostCatalogueRequest $request)
    {
        $postCatalogue = $this->postCatalogueRepository->findById($id);
        if (!$postCatalogue) {
            return response()->json([
                'message' => 'Không tìm thấy bản ghi cần xóa',
                'code' => Status::SUCCESS
            ], Response::HTTP_NOT_FOUND);
        }

        if ($this->postCatalogueService->delete($id, $this->auth)) {
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
        $respository = 'App\Repositories\Post\PostCatalogueRepository';
        if ($this->postCatalogueService->updateByField($request, $id, $respository)) {

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
