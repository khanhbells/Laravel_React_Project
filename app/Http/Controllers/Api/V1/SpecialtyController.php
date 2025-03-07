<?php

namespace App\Http\Controllers\Api\V1;

use App\Enums\Status;
use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Http\Resources\SpecialtyResource;
use App\Services\Specialty\SpecialtyService;
use App\Repositories\Specialty\SpecialtyRepository;
use Symfony\Component\HttpFoundation\Response;
use App\Http\Requests\UpdateByFieldRequest;
use App\Http\Requests\Specialty\StoreSpecialtyRequest;
use App\Http\Requests\Specialty\UpdateSpecialtyRequest;
use Illuminate\Foundation\Auth\Access\AuthorizesRequests;

class SpecialtyController extends Controller
{
    use AuthorizesRequests;
    protected $specialtyService;
    protected $specialtyRepository;
    protected $auth;

    public function __construct(
        SpecialtyService $specialtyService,
        SpecialtyRepository $specialtyRepository,
    ) {
        $this->specialtyService = $specialtyService;
        $this->specialtyRepository = $specialtyRepository;
        $this->auth = auth('api')->user();
    }

    public function index(Request $request)
    {
        try {
            if ($request->input('specialty_catalogue_id') == null) {
                $this->authorize('modules', '/specialty/index');
            }
            $specialties = $this->specialtyService->paginate($request);
            return response()->json([
                'specialties' =>  method_exists($specialties, 'items') ? SpecialtyResource::collection($specialties->items()) : $specialties,
                'links' => method_exists($specialties, 'items') ? $specialties->linkCollection() : null,
                'current_page' => method_exists($specialties, 'items') ? $specialties->currentPage() : null,
                'last_page' => method_exists($specialties, 'items') ? $specialties->lastPage() : null,
            ], Response::HTTP_OK);
        } catch (\Illuminate\Auth\Access\AuthorizationException $e) {
            return response()->json([
                'message' => 'Không có quyền truy cập',
                'tags' => [],
                'code' => Status::ERROR
            ], Response::HTTP_FORBIDDEN);
        }
    }

    public function create(StoreSpecialtyRequest $request)
    {
        $auth = auth('api')->user(); //1
        $data = $this->specialtyService->create($request, $auth); //2
        if ($data['code'] == Status::SUCCESS) { //3
            return response()->json([ //4
                'message' => 'Thêm mới bản ghi thành công',
                'specialty_catalogues' => new SpecialtyResource($data['specialty'])
            ], Response::HTTP_OK);
        }
        return response()->json([ //5
            'message' => $data['message']
        ], Response::HTTP_INTERNAL_SERVER_ERROR);
    }

    public function update(UpdateSpecialtyRequest $request, $id)
    {
        $auth = auth('api')->user();
        $data = $this->specialtyService->update($request, $id, $auth);
        if ($data['code'] == Status::SUCCESS) {
            return response()->json([
                'message' => 'Cập nhật bản ghi thành công',
                'specialty_catalogues' => new SpecialtyResource($data['specialty']),
                'code' => Response::HTTP_OK
            ], Response::HTTP_OK);
        } else {
            return response()->json([
                'message' => $data['message'],
                'code' => Response::HTTP_NOT_FOUND
            ], Response::HTTP_NOT_FOUND);
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
            $specialty = $this->specialtyRepository->findById($id);
            return response()->json(
                new SpecialtyResource($specialty)
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
        $specialty = $this->specialtyRepository->findById($id);
        if (!$specialty) {
            return response()->json([
                'message' => 'Không tìm thấy bản ghi cần xóa',
                'code' => Status::SUCCESS
            ], Response::HTTP_NOT_FOUND);
        }

        if ($this->specialtyService->delete($id, $this->auth)) {
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
        $respository = 'App\Repositories\Specialty\SpecialtyRepository';
        if ($this->specialtyService->updateByField($request, $id, $respository)) {

            return response()->json([
                'message' =>  'Cập nhật dữ liệu thành công',
            ], Response::HTTP_OK);
        }
        return response()->json([
            'message' =>  'Cập nhật dữ liệu không thành công',
        ], Response::HTTP_INTERNAL_SERVER_ERROR);
    }
}
