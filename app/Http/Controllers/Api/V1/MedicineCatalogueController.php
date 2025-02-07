<?php

namespace App\Http\Controllers\Api\V1;

use App\Enums\Status;
use App\Http\Controllers\Controller;
use App\Http\Requests\Medicine\DeleteMedicineCatalogueRequest;
use Illuminate\Http\Request;
use App\Http\Resources\MedicineCatalogueResource;
use App\Services\Medicine\MedicineCatalogueService;
use App\Repositories\Medicine\MedicineCatalogueRepository;
use Symfony\Component\HttpFoundation\Response;
use App\Http\Requests\UpdateByFieldRequest;
use App\Http\Requests\Medicine\StoreMedicineCatalogueRequest;
use Illuminate\Foundation\Auth\Access\AuthorizesRequests;

class MedicineCatalogueController extends Controller
{
    use AuthorizesRequests;
    protected $medicineCatalogueService;
    protected $medicineCatalogueRepository;
    protected $auth;

    public function __construct(
        MedicineCatalogueService $medicineCatalogueService,
        MedicineCatalogueRepository $medicineCatalogueRepository,
    ) {
        $this->medicineCatalogueService = $medicineCatalogueService;
        $this->medicineCatalogueRepository = $medicineCatalogueRepository;
        $this->auth = auth('api')->user();
    }

    public function index(Request $request)
    {
        try {
            $this->authorize('modules', '/medicine/catalogue/index');
            $medicineCatalogues = $this->medicineCatalogueService->paginate($request);
            return response()->json([
                'medicine_catalogues' =>  method_exists($medicineCatalogues, 'items') ? MedicineCatalogueResource::collection($medicineCatalogues->items()) : $medicineCatalogues,
                'links' => method_exists($medicineCatalogues, 'items') ? $medicineCatalogues->linkCollection() : null,
                'current_page' => method_exists($medicineCatalogues, 'items') ? $medicineCatalogues->currentPage() : null,
                'last_page' => method_exists($medicineCatalogues, 'items') ? $medicineCatalogues->lastPage() : null,
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
        $data = $this->medicineCatalogueService->create($request, $auth);

        if ($data['code'] == Status::SUCCESS) {
            return response()->json([
                'message' => 'Thêm mới bản ghi thành công',
                'medicine_catalogues' => new MedicineCatalogueResource($data['medicineCatalogue'])
            ], Response::HTTP_OK);
        }
        return response()->json([
            'message' => $data['message']
        ], Response::HTTP_INTERNAL_SERVER_ERROR);
    }

    public function update(Request $request, $id)
    {
        $auth = auth('api')->user();
        $data = $this->medicineCatalogueService->update($request, $id, $auth);
        // return $data;
        if ($data['code'] == Status::SUCCESS) {
            return response()->json([
                'message' => 'Cập nhật bản ghi thành công',
                'medicine_catalogues' => new MedicineCatalogueResource($data['medicineCatalogue']),
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
            $medicineCatalogue = $this->medicineCatalogueRepository->findById($id);
            return response()->json(
                new MedicineCatalogueResource($medicineCatalogue)
            );
        } catch (\Exception $e) {
            return response()->json([
                'code' => Status::ERROR,
                'message' => 'Network Error'
            ], Response::HTTP_NOT_FOUND);
        }
    }

    public function destroy($id, DeleteMedicineCatalogueRequest $request)
    {
        $medicineCatalogue = $this->medicineCatalogueRepository->findById($id);
        if (!$medicineCatalogue) {
            return response()->json([
                'message' => 'Không tìm thấy bản ghi cần xóa',
                'code' => Status::SUCCESS
            ], Response::HTTP_NOT_FOUND);
        }

        if ($this->medicineCatalogueService->delete($id, $this->auth)) {
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
        $respository = 'App\Repositories\Medicine\MedicineCatalogueRepository';
        if ($this->medicineCatalogueService->updateByField($request, $id, $respository)) {

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
