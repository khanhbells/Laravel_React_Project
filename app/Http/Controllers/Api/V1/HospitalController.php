<?php

namespace App\Http\Controllers\Api\V1;

use App\Enums\Status;
use App\Http\Controllers\Controller;
use App\Http\Requests\Hospital\DeleteHospitalRequest;
use Illuminate\Http\Request;
use App\Http\Resources\HospitalResource;
use App\Services\Hospital\HospitalService;
use App\Repositories\Hospital\HospitalRepository;
use Symfony\Component\HttpFoundation\Response;
use App\Http\Requests\UpdateByFieldRequest;
use App\Http\Requests\Hospital\StoreHospitalRequest;
use Illuminate\Foundation\Auth\Access\AuthorizesRequests;

class HospitalController extends Controller
{
    use AuthorizesRequests;
    protected $hospitalService;
    protected $hospitalRepository;
    protected $auth;

    public function __construct(
        HospitalService $hospitalService,
        HospitalRepository $hospitalRepository,
    ) {
        $this->hospitalService = $hospitalService;
        $this->hospitalRepository = $hospitalRepository;
        $this->auth = auth()->user();
    }

    public function index(Request $request)
    {
        try {
            $this->authorize('modules', '/hospital/index');
            $hospitals = $this->hospitalService->paginate($request);
            return response()->json([
                'hospitals' =>  method_exists($hospitals, 'items') ? HospitalResource::collection($hospitals->items()) : $hospitals,
                'links' => method_exists($hospitals, 'items') ? $hospitals->linkCollection() : null,
                'current_page' => method_exists($hospitals, 'items') ? $hospitals->currentPage() : null,
                'last_page' => method_exists($hospitals, 'items') ? $hospitals->lastPage() : null,
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
        $data = $this->hospitalService->create($request, $auth);

        if ($data['code'] == Status::SUCCESS) {
            return response()->json([
                'message' => 'Thêm mới bản ghi thành công',
                'hospitals' => new HospitalResource($data['hospital'])
            ], Response::HTTP_OK);
        }
        return response()->json([
            'message' => $data['message']
        ], Response::HTTP_INTERNAL_SERVER_ERROR);
    }

    public function update(Request $request, $id)
    {
        $auth = auth()->user();
        $data = $this->hospitalService->update($request, $id, $auth);
        // return $data;
        if ($data['code'] == Status::SUCCESS) {
            return response()->json([
                'message' => 'Cập nhật bản ghi thành công',
                'hospitals' => new HospitalResource($data['hospital']),
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
            $hospital = $this->hospitalRepository->findById($id);
            return response()->json(
                new HospitalResource($hospital)
            );
        } catch (\Exception $e) {
            return response()->json([
                'code' => Status::ERROR,
                'message' => 'Network Error'
            ], Response::HTTP_NOT_FOUND);
        }
    }

    public function destroy($id)
    {
        $hospital = $this->hospitalRepository->findById($id);
        if (!$hospital) {
            return response()->json([
                'message' => 'Không tìm thấy bản ghi cần xóa',
                'code' => Status::SUCCESS
            ], Response::HTTP_NOT_FOUND);
        }

        if ($this->hospitalService->delete($id, $this->auth)) {
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
        $respository = 'App\Repositories\Hospital\HospitalRepository';
        if ($this->hospitalService->updateByField($request, $id, $respository)) {

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
