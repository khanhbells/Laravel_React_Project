<?php

namespace App\Http\Controllers\Api\V1;

use App\Enums\Status;
use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Http\Resources\TimeSlotResource;
use App\Services\TimeSlot\TimeSlotService;
use App\Repositories\TimeSlot\TimeSlotRepository;
use Symfony\Component\HttpFoundation\Response;
use App\Http\Requests\UpdateByFieldRequest;
use App\Http\Controllers\Api\V1\AuthController;
use App\Http\Requests\TimeSlot\StoreTimeSlotRequest;
use Illuminate\Foundation\Auth\Access\AuthorizesRequests;


class TimeSlotController extends Controller
{
    use AuthorizesRequests;


    protected $timeSlotService;
    protected $timeSlotRepository;
    protected $timeSlot;
    public function __construct(
        TimeSlotService $timeSlotService,
        TimeSlotRepository $timeSlotRepository,
        AuthController $timeSlot,
    ) {
        $this->timeSlotService = $timeSlotService;
        $this->timeSlotRepository = $timeSlotRepository;
        $this->timeSlot = $timeSlot;
    }

    public function index(Request $request)
    {
        try {
            $this->authorize('modules', '/setting/timeSlot/index');
            $timeSlots = $this->timeSlotService->paginate($request);
            return response()->json([
                'time_slots' =>  method_exists($timeSlots, 'items') ? TimeSlotResource::collection($timeSlots->items()) : $timeSlots,
                'links' => method_exists($timeSlots, 'items') ? $timeSlots->linkCollection() : null,
                'current_page' => method_exists($timeSlots, 'items') ? $timeSlots->currentPage() : null,
                'last_page' => method_exists($timeSlots, 'items') ? $timeSlots->lastPage() : null,
            ], Response::HTTP_OK);
        } catch (\Illuminate\Auth\Access\AuthorizationException $e) {
            return response()->json([
                'message' => 'Không có quyền truy cập',
                'tags' => [],
                'code' => Status::ERROR
            ], Response::HTTP_FORBIDDEN);
        }
    }

    public function create(StoreTimeSlotRequest $request)
    {
        $data = $this->timeSlotService->create($request);
        if ($data['code'] == Status::SUCCESS) {
            return response()->json([
                'message' => 'Thêm mới bản ghi thành công',
                'time_slots' => new TimeSlotResource($data['timeSlot'])
            ], Response::HTTP_OK);
        }
        return response()->json([
            'message' => $data['message']
        ], Response::HTTP_INTERNAL_SERVER_ERROR);
    }

    public function update(StoreTimeSlotRequest $request, $id)
    {
        $data = $this->timeSlotService->update($request, $id);
        if ($data['code'] == Status::SUCCESS) {
            return response()->json([
                'message' => 'Cập nhật bản ghi thành công',
                'time_slots' => new TimeSlotResource($data['timeSlot']),
                'code' => Response::HTTP_OK
            ], Response::HTTP_OK);
        }
    }

    public function show(Request $request, $id)
    {
        if (empty($id) || $id < 0) {
            return $this->returnIfIdValidateFail();
        }
        $timeSlot = $this->timeSlotRepository->findById($id);
        if (!$timeSlot) {
            return response()->json([
                'code' => Status::ERROR,
                'message' => 'Không có dữ liệu phù hợp'
            ], Response::HTTP_NOT_FOUND);
        } else {
            return response()->json(
                new TimeSlotResource($timeSlot)
            );
        }
    }

    public function destroy($id, Request $request)
    {
        if (empty($id) || $id < 0) {
            return $this->returnIfIdValidateFail();
        }

        $timeSlot = $this->timeSlotRepository->findById($id);

        if (!$timeSlot) {
            return response()->json([
                'message' => 'Không tìm thấy bản ghi cần xóa',
                'code' => Status::SUCCESS
            ], Response::HTTP_NOT_FOUND);
        }

        if ($this->timeSlotService->delete($id)) {
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
        $respository = 'App\Repositories\TimeSlot\TimeSlotRepository';
        if ($this->timeSlotService->updateByField($request, $id, $respository)) {

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
