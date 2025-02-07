<?php

namespace App\Http\Controllers\Api\V1;

use App\Enums\Status;
use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Http\Resources\MedicineResource;
use App\Services\Medicine\MedicineService;
use App\Repositories\Medicine\MedicineRepository;
use Symfony\Component\HttpFoundation\Response;
use App\Http\Requests\UpdateByFieldRequest;
use App\Http\Requests\Medicine\StoreMedicineRequest;
use App\Http\Requests\Medicine\UpdateMedicineRequest;
use Illuminate\Foundation\Auth\Access\AuthorizesRequests;

class MedicineController extends Controller
{
    use AuthorizesRequests;
    protected $medicineService;
    protected $medicineRepository;
    protected $auth;

    public function __construct(
        MedicineService $medicineService,
        MedicineRepository $medicineRepository,
    ) {
        $this->medicineService = $medicineService;
        $this->medicineRepository = $medicineRepository;
        $this->auth = auth('api')->user();
    }

    public function index(Request $request)
    {
        try {
            if ($request->input('medicine_catalogue_id') == null) {
                $this->authorize('modules', '/medicine/index');
            }
            $medicines = $this->medicineService->paginate($request);
            return response()->json([
                'medicines' =>  method_exists($medicines, 'items') ? MedicineResource::collection($medicines->items()) : $medicines,
                'links' => method_exists($medicines, 'items') ? $medicines->linkCollection() : null,
                'current_page' => method_exists($medicines, 'items') ? $medicines->currentPage() : null,
                'last_page' => method_exists($medicines, 'items') ? $medicines->lastPage() : null,
            ], Response::HTTP_OK);
        } catch (\Illuminate\Auth\Access\AuthorizationException $e) {
            return response()->json([
                'message' => 'Không có quyền truy cập',
                'tags' => [],
                'code' => Status::ERROR
            ], Response::HTTP_FORBIDDEN);
        }
    }

    public function create(StoreMedicineRequest $request)
    {
        $auth = auth('api')->user();
        $data = $this->medicineService->create($request, $auth);
        if ($data['code'] == Status::SUCCESS) {
            return response()->json([
                'message' => 'Thêm mới bản ghi thành công',
                'medicine_catalogues' => new MedicineResource($data['medicine'])
            ], Response::HTTP_OK);
        }
        return response()->json([
            'message' => $data['message']
        ], Response::HTTP_INTERNAL_SERVER_ERROR);
    }

    public function update(UpdateMedicineRequest $request, $id)
    {
        $auth = auth('api')->user();
        $data = $this->medicineService->update($request, $id, $auth);
        if ($data['code'] == Status::SUCCESS) {
            return response()->json([
                'message' => 'Cập nhật bản ghi thành công',
                'medicine_catalogues' => new MedicineResource($data['medicine']),
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
            $medicine = $this->medicineRepository->findById($id);
            return response()->json(
                new MedicineResource($medicine)
            );
        } catch (\Exception $e) {
            return response()->json([
                'code' => Status::ERROR,
                'message' => 'Network Error'
            ], Response::HTTP_NOT_FOUND);
        }
    }

    public function destroy($id, Request $request)
    {
        $medicine = $this->medicineRepository->findById($id);
        if (!$medicine) {
            return response()->json([
                'message' => 'Không tìm thấy bản ghi cần xóa',
                'code' => Status::SUCCESS
            ], Response::HTTP_NOT_FOUND);
        }

        if ($this->medicineService->delete($id, $this->auth)) {
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
        $respository = 'App\Repositories\Medicine\MedicineRepository';
        if ($this->medicineService->updateByField($request, $id, $respository)) {

            return response()->json([
                'message' =>  'Cập nhật dữ liệu thành công',
            ], Response::HTTP_OK);
        }
        return response()->json([
            'message' =>  'Cập nhật dữ liệu không thành công',
        ], Response::HTTP_INTERNAL_SERVER_ERROR);
    }
}
