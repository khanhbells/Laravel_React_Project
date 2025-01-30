<?php

namespace App\Http\Controllers\Api\V1;

use App\Enums\Status;
use App\Http\Controllers\Controller;
use Illuminate\Foundation\Auth\Access\AuthorizesRequests;
use Illuminate\Http\Request;
use App\Http\Resources\DetailDoctorResource;
use App\Http\Resources\DoctorResource;
use App\Services\Doctor\DoctorService;
use App\Repositories\Doctor\DoctorRepository;
use Symfony\Component\HttpFoundation\Response;
use App\Http\Requests\UpdateByFieldRequest;
use App\Http\Requests\Doctor\StoreDoctorRequest;
use App\Http\Requests\Doctor\UpdateDoctorRequest;

class DoctorController extends Controller
{
    use AuthorizesRequests;
    protected $doctorService;
    protected $doctorRepository;
    public function __construct(
        DoctorService $doctorService,
        DoctorRepository $doctorRepository,
    ) {
        $this->doctorService = $doctorService;
        $this->doctorRepository = $doctorRepository;
    }

    public function index(Request $request)
    {
        try {
            $permission =  $request->input('permission') ?? null;
            if ($permission == null) {
                $this->authorize('modules', '/doctor/index');
            }
            $doctors = $this->doctorService->paginate($request);
            return response()->json([
                'doctors' =>  DetailDoctorResource::collection($doctors),
                'links' => method_exists($doctors, 'items') ? $doctors->linkCollection() : null,
                'current_page' => method_exists($doctors, 'items') ? $doctors->currentPage() : null,
                'last_page' => method_exists($doctors, 'items') ? $doctors->lastPage() : null,
            ], Response::HTTP_OK);
        } catch (\Illuminate\Auth\Access\AuthorizationException $e) {
            return response()->json([
                'message' => 'Không có quyền truy cập',
                'doctors' => [],
                'code' => Status::ERROR
            ], Response::HTTP_FORBIDDEN);
        }
    }

    // public function create(StoreDoctorRequest $request)
    // {
    //     $auth = auth()->user();
    //     $data = $this->doctorService->create($request);
    //     if ($data['code'] == Status::SUCCESS) {
    //         return response()->json([
    //             'message' => 'Thêm mới bản ghi thành công',
    //             'doctor' => new DoctorResource($data['doctor'])
    //         ], Response::HTTP_OK);
    //     }
    //     return response()->json([
    //         'message' => $data['message']
    //     ], Response::HTTP_INTERNAL_SERVER_ERROR);
    // }

    public function update(UpdateDoctorRequest $request, $id)
    {
        $auth = auth('api')->user();
        $data = $this->doctorService->update($request, $id, $auth);
        return $data;
        if ($data['code'] == Status::SUCCESS) {
            return response()->json([
                'message' => 'Cập nhật bản ghi thành công',
                'doctor' => new DoctorResource($data['doctor']),
                'code' => Response::HTTP_OK
            ], Response::HTTP_OK);
        }
    }

    public function show(Request $request, $id)
    {
        try {
            $this->authorize('modules', '/update/doctor');
            if (empty($id) || $id < 0) {
                return $this->returnIfIdValidateFail();
            }
            $userDoctor = $this->doctorService->findUserDoctor($id);
            if (!$userDoctor) {
                return response()->json([
                    'code' => Status::ERROR,
                    'message' => 'Không có dữ liệu phù hợp'
                ], Response::HTTP_NOT_FOUND);
            } else {
                return response()->json(
                    new DoctorResource($userDoctor)
                );
            }
        } catch (\Illuminate\Auth\Access\AuthorizationException $e) {
            return response()->json([
                'message' => 'Không có quyền truy cập',
                'doctors' => [],
                'code' => Status::ERROR
            ], Response::HTTP_FORBIDDEN);
        }
    }
    public function showDoctor(Request $request, $id)
    {
        if (empty($id) || $id < 0) {
            return $this->returnIfIdValidateFail();
        }
        $doctor = $this->doctorRepository->findById($id);


        if (!$doctor) {
            return response()->json([
                'code' => Status::ERROR,
                'message' => 'Không có dữ liệu phù hợp'
            ], Response::HTTP_NOT_FOUND);
        } else {
            return response()->json(
                new DetailDoctorResource($doctor)
            );
        }
    }



    // public function destroy($id, Request $request)
    // {
    //     if (empty($id) || $id < 0) {
    //         return $this->returnIfIdValidateFail();
    //     }

    //     $doctor = $this->doctorRepository->findById($id);

    //     if (!$doctor) {
    //         return response()->json([
    //             'message' => 'Không tìm thấy bản ghi cần xóa',
    //             'code' => Status::SUCCESS
    //         ], Response::HTTP_NOT_FOUND);
    //     }

    //     if ($this->doctorService->delete($id)) {
    //         return response()->json([
    //             'message' => 'Xóa bản ghi thành công',
    //             'code' => Status::SUCCESS
    //         ], Response::HTTP_OK);
    //     }
    //     return response()->json([
    //         'message' => 'Network Error',
    //         'code' => Status::ERROR
    //     ], Response::HTTP_INTERNAL_SERVER_ERROR);
    // }

    // public function updateStatusByField(UpdateByFieldRequest $request, $id)
    // {
    //     $respository = 'App\Repositories\Doctor\DoctorRepository';
    //     if ($this->doctorService->updateByField($request, $id, $respository)) {

    //         return response()->json([
    //             'message' =>  'Cập nhật dữ liệu thành công',
    //         ], Response::HTTP_OK);
    //     }
    //     return response()->json([
    //         'message' =>  'Cập nhật dữ liệu không thành công',
    //     ], Response::HTTP_INTERNAL_SERVER_ERROR);
    // }

    private function returnIfIdValidateFail()
    {
        return response()->json([
            'message' => 'Mã ID không hợp lệ',
            'code' => Status::ERROR
        ], Response::HTTP_INTERNAL_SERVER_ERROR);
    }
}
