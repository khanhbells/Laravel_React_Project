<?php

namespace App\Http\Controllers\Api\V1;

use App\Enums\Status;
use App\Http\Controllers\Controller;
use App\Http\Requests\Specialty\DeleteSpecialtyCatalogueRequest;
use Illuminate\Http\Request;
use App\Http\Resources\SpecialtyCatalogueResource;
use App\Services\Specialty\SpecialtyCatalogueService;
use App\Repositories\Specialty\SpecialtyCatalogueRepository;
use Symfony\Component\HttpFoundation\Response;
use App\Http\Requests\UpdateByFieldRequest;
use App\Http\Requests\Specialty\StoreSpecialtyCatalogueRequest;
use Illuminate\Foundation\Auth\Access\AuthorizesRequests;

class SpecialtyCatalogueController extends Controller
{
    use AuthorizesRequests;
    protected $specialtyCatalogueService;
    protected $specialtyCatalogueRepository;
    protected $auth;

    public function __construct(
        SpecialtyCatalogueService $specialtyCatalogueService,
        SpecialtyCatalogueRepository $specialtyCatalogueRepository,
    ) {
        $this->specialtyCatalogueService = $specialtyCatalogueService;
        $this->specialtyCatalogueRepository = $specialtyCatalogueRepository;
        $this->auth = auth()->user();
    }

    public function index(Request $request)
    {
        try {
            $this->authorize('modules', '/specialty/catalogue/index');
            $specialtyCatalogues = $this->specialtyCatalogueService->paginate($request);
            return response()->json([
                'specialty_catalogues' =>  method_exists($specialtyCatalogues, 'items') ? SpecialtyCatalogueResource::collection($specialtyCatalogues->items()) : $specialtyCatalogues,
                'links' => method_exists($specialtyCatalogues, 'items') ? $specialtyCatalogues->linkCollection() : null,
                'current_page' => method_exists($specialtyCatalogues, 'items') ? $specialtyCatalogues->currentPage() : null,
                'last_page' => method_exists($specialtyCatalogues, 'items') ? $specialtyCatalogues->lastPage() : null,
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
        $auth = auth()->user();
        $data = $this->specialtyCatalogueService->create($request, $auth);

        if ($data['code'] == Status::SUCCESS) {
            return response()->json([
                'message' => 'Thêm mới bản ghi thành công',
                'specialty_catalogues' => new SpecialtyCatalogueResource($data['specialtyCatalogue'])
            ], Response::HTTP_OK);
        }
        return response()->json([
            'message' => $data['message']
        ], Response::HTTP_INTERNAL_SERVER_ERROR);
    }

    public function update(Request $request, $id)
    {
        $auth = auth()->user();
        $data = $this->specialtyCatalogueService->update($request, $id, $auth);
        // return $data;
        if ($data['code'] == Status::SUCCESS) {
            return response()->json([
                'message' => 'Cập nhật bản ghi thành công',
                'specialty_catalogues' => new SpecialtyCatalogueResource($data['specialtyCatalogue']),
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
            $specialtyCatalogue = $this->specialtyCatalogueRepository->findById($id);
            return response()->json(
                new SpecialtyCatalogueResource($specialtyCatalogue)
            );
        } catch (\Exception $e) {
            return response()->json([
                'code' => Status::ERROR,
                'message' => 'Network Error'
            ], Response::HTTP_NOT_FOUND);
        }
    }

    public function destroy($id, DeleteSpecialtyCatalogueRequest $request)
    {
        $specialtyCatalogue = $this->specialtyCatalogueRepository->findById($id);
        if (!$specialtyCatalogue) {
            return response()->json([
                'message' => 'Không tìm thấy bản ghi cần xóa',
                'code' => Status::SUCCESS
            ], Response::HTTP_NOT_FOUND);
        }

        if ($this->specialtyCatalogueService->delete($id, $this->auth)) {
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
        $respository = 'App\Repositories\Specialty\SpecialtyCatalogueRepository';
        if ($this->specialtyCatalogueService->updateByField($request, $id, $respository)) {

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
