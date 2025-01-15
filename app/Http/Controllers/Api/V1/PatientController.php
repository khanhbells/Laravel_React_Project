<?php

namespace App\Http\Controllers\Api\V1;

use App\Enums\Status;
use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Http\Resources\PatientResource;
use App\Services\Patient\PatientService;
use App\Repositories\Patient\PatientRepository;
use Symfony\Component\HttpFoundation\Response;
use App\Http\Requests\UpdateByFieldRequest;
use App\Http\Controllers\Api\V1\AuthController;
use App\Http\Requests\Patient\StorePatientRequest;
use App\Http\Requests\Patient\ChangePasswordPatientRequest;
use App\Http\Requests\Patient\UpdatePatientRequest;
use Illuminate\Foundation\Auth\Access\AuthorizesRequests;

class PatientController extends Controller
{
    use AuthorizesRequests;

    protected $patientService;
    protected $patientRepository;
    protected $patient;
    public function __construct(
        PatientService $patientService,
        PatientRepository $patientRepository,
        AuthController $patient,
    ) {
        $this->patientService = $patientService;
        $this->patientRepository = $patientRepository;
        $this->patient = $patient;
    }

    public function index(Request $request)
    {
        try {
            $this->authorize('modules', '/patient/index');
            $patients = $this->patientService->paginate($request);
            return response()->json([
                'patients' =>  PatientResource::collection($patients->items()),
                'links' => $patients->linkCollection(),
                'current_page' => $patients->currentPage(),
                'last_page' => $patients->lastPage(),
            ], Response::HTTP_OK);
        } catch (\Illuminate\Auth\Access\AuthorizationException $e) {
            return response()->json([
                'message' => 'Không có quyền truy cập',
                'tags' => [],
                'code' => Status::ERROR
            ], Response::HTTP_FORBIDDEN);
        }
    }
    public function create(StorePatientRequest $request)
    {
        $auth = auth()->user();
        $data = $this->patientService->create($request, $auth);
        if ($data['code'] == Status::SUCCESS) {
            return response()->json([
                'message' => 'Thêm mới bản ghi thành công',
                'patient' => new PatientResource($data['patient'])
            ], Response::HTTP_OK);
        }
        return response()->json([
            'message' => $data['message']
        ], Response::HTTP_INTERNAL_SERVER_ERROR);
    }

    public function update(UpdatePatientRequest $request, $id)
    {
        return $this->baseUpdate($request, $id);
    }

    public function resetPassword(ChangePasswordPatientRequest $request, $id)
    {
        return $this->baseUpdate($request, $id);
    }

    public function show(Request $request, $id)
    {
        if (empty($id) || $id < 0) {
            return $this->returnIfIdValidateFail();
        }



        $patient = $this->patientRepository->findById($id);


        if (!$patient) {
            return response()->json([
                'code' => Status::ERROR,
                'message' => 'Không có dữ liệu phù hợp'
            ], Response::HTTP_NOT_FOUND);
        } else {
            return response()->json(
                new PatientResource($patient)
            );
        }
    }

    public function destroy($id, Request $request)
    {
        if (empty($id) || $id < 0) {
            return $this->returnIfIdValidateFail();
        }
        $patient = $this->patientRepository->findById($id);

        if (!$patient) {
            return response()->json([
                'message' => 'Không tìm thấy bản ghi cần xóa',
                'code' => Status::SUCCESS
            ], Response::HTTP_NOT_FOUND);
        }

        if ($this->patientService->delete($id)) {
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
        $respository = 'App\Repositories\Patient\PatientRepository';
        if ($this->patientService->updateByField($request, $id, $respository)) {
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

    private function baseUpdate($request, $id)
    {
        $auth = auth()->user();
        $data = $this->patientService->update($request, $id, $auth);

        if ($data['code'] == Status::SUCCESS) {
            return response()->json([
                'message' => 'Cập nhật bản ghi thành công',
                'patient' => new PatientResource($data['patient']),
                'code' => Response::HTTP_OK
            ], Response::HTTP_OK);
        }
    }
}
