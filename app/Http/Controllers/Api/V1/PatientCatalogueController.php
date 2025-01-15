<?php

namespace App\Http\Controllers\Api\V1;

use App\Enums\Status;
use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Http\Resources\PatientCatalogueResource;
use App\Services\Patient\PatientCatalogueService;
use App\Repositories\Patient\PatientCatalogueRepository;
use Symfony\Component\HttpFoundation\Response;
use App\Http\Requests\UpdateByFieldRequest;
use App\Http\Controllers\Api\V1\AuthController;
use App\Http\Requests\Patient\StorePatientCatalogueRequest;
use Illuminate\Foundation\Auth\Access\AuthorizesRequests;


class PatientCatalogueController extends Controller
{
    use AuthorizesRequests;


    protected $patientCatalogueService;
    protected $patientCatalogueRepository;
    protected $patientCatalogue;
    public function __construct(
        PatientCatalogueService $patientCatalogueService,
        PatientCatalogueRepository $patientCatalogueRepository,
        AuthController $patientCatalogue,
    ) {
        $this->patientCatalogueService = $patientCatalogueService;
        $this->patientCatalogueRepository = $patientCatalogueRepository;
        $this->patientCatalogue = $patientCatalogue;
    }

    public function index(Request $request)
    {
        try {
            $this->authorize('modules', '/patient/catalogue/index');
            $patientCatalogues = $this->patientCatalogueService->paginate($request);
            return response()->json([
                'patient_catalogues' =>  method_exists($patientCatalogues, 'items') ? PatientCatalogueResource::collection($patientCatalogues->items()) : $patientCatalogues,
                'links' => method_exists($patientCatalogues, 'items') ? $patientCatalogues->linkCollection() : null,
                'current_page' => method_exists($patientCatalogues, 'items') ? $patientCatalogues->currentPage() : null,
                'last_page' => method_exists($patientCatalogues, 'items') ? $patientCatalogues->lastPage() : null,
            ], Response::HTTP_OK);
        } catch (\Illuminate\Auth\Access\AuthorizationException $e) {
            return response()->json([
                'message' => 'Không có quyền truy cập',
                'tags' => [],
                'code' => Status::ERROR
            ], Response::HTTP_FORBIDDEN);
        }
    }

    public function create(StorePatientCatalogueRequest $request)
    {
        $data = $this->patientCatalogueService->create($request);
        if ($data['code'] == Status::SUCCESS) {
            return response()->json([
                'message' => 'Thêm mới bản ghi thành công',
                'patient_catalogues' => new PatientCatalogueResource($data['patientCatalogue'])
            ], Response::HTTP_OK);
        }
        return response()->json([
            'message' => $data['message']
        ], Response::HTTP_INTERNAL_SERVER_ERROR);
    }

    public function update(StorePatientCatalogueRequest $request, $id)
    {
        $data = $this->patientCatalogueService->update($request, $id);
        if ($data['code'] == Status::SUCCESS) {
            return response()->json([
                'message' => 'Cập nhật bản ghi thành công',
                'patient_catalogues' => new PatientCatalogueResource($data['patientCatalogue']),
                'code' => Response::HTTP_OK
            ], Response::HTTP_OK);
        }
    }

    public function show(Request $request, $id)
    {
        if (empty($id) || $id < 0) {
            return $this->returnIfIdValidateFail();
        }
        $patientCatalogue = $this->patientCatalogueRepository->findById($id);
        if (!$patientCatalogue) {
            return response()->json([
                'code' => Status::ERROR,
                'message' => 'Không có dữ liệu phù hợp'
            ], Response::HTTP_NOT_FOUND);
        } else {
            return response()->json(
                new PatientCatalogueResource($patientCatalogue)
            );
        }
    }

    public function destroy($id, Request $request)
    {
        if (empty($id) || $id < 0) {
            return $this->returnIfIdValidateFail();
        }

        $patientCatalogue = $this->patientCatalogueRepository->findById($id);

        if (!$patientCatalogue) {
            return response()->json([
                'message' => 'Không tìm thấy bản ghi cần xóa',
                'code' => Status::SUCCESS
            ], Response::HTTP_NOT_FOUND);
        }

        if ($this->patientCatalogueService->delete($id)) {
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
        $respository = 'App\Repositories\Patient\PatientCatalogueRepository';
        if ($this->patientCatalogueService->updateByField($request, $id, $respository)) {

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
