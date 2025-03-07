<?php

namespace App\Http\Controllers\Api\V1;

use App\Enums\Status;
use App\Http\Controllers\Controller;
use Illuminate\Foundation\Auth\Access\AuthorizesRequests;
use Illuminate\Http\Request;
use App\Http\Resources\ScheduleResource;
use App\Services\Schedule\ScheduleService;
use App\Repositories\Schedule\ScheduleRepository;
use Symfony\Component\HttpFoundation\Response;
use App\Http\Requests\UpdateByFieldRequest;
use App\Http\Requests\Schedule\StoreScheduleRequest;
use App\Http\Requests\Schedule\UpdateScheduleRequest;
use App\Models\Schedule;
use Mockery\Undefined;

class ScheduleController extends Controller
{
    use AuthorizesRequests;
    protected $scheduleService;
    protected $scheduleRepository;
    public function __construct(
        ScheduleService $scheduleService,
        ScheduleRepository $scheduleRepository,
    ) {
        $this->scheduleService = $scheduleService;
        $this->scheduleRepository = $scheduleRepository;
    }

    public function index(Request $request)
    {
        try {
            $permission =  $request->input('permission') ?? null;
            if ($permission == null) {
                $this->authorize('modules', '/schedule/index');
            }
            $auth = auth('api')->user();
            $schedules = $this->scheduleService->paginate($request, $auth);
            return response()->json([
                'schedules' =>  method_exists($schedules, 'items') ? ScheduleResource::collection($schedules->items()) : $schedules,
                'links' => method_exists($schedules, 'items') ? $schedules->linkCollection() : null,
                'current_page' => method_exists($schedules, 'items') ? $schedules->currentPage() : null,
                'last_page' => method_exists($schedules, 'items') ? $schedules->lastPage() : null,
            ], Response::HTTP_OK);
        } catch (\Illuminate\Auth\Access\AuthorizationException $e) {
            return response()->json([
                'message' => 'Không có quyền truy cập',
                'schedules' => [],
                'code' => Status::ERROR
            ], Response::HTTP_FORBIDDEN);
        }
    }

    public function create(Request $request)
    {
        $data = $this->scheduleService->create($request); //1

        if ($data['code'] == Status::SUCCESS) { //2
            $dataResource = new ScheduleResource($data['schedule']);

            return response()->json([ //3
                'message' => 'Thêm mới bản ghi thành công',
                'schedule' => $data['schedule']
            ], Response::HTTP_OK);
        }
        return response()->json([ //4
            'message' => $data['message']
        ], Response::HTTP_INTERNAL_SERVER_ERROR);
    }

    public function update(UpdateScheduleRequest $request, $id)
    {
        $data = $this->scheduleService->update($request, $id);
        if ($data['code'] == Status::SUCCESS) {
            return response()->json([
                'message' => 'Cập nhật bản ghi thành công',
                'schedule' => new ScheduleResource($data['schedule']),
                'code' => Response::HTTP_OK
            ], Response::HTTP_OK);
        }
    }

    public function show(Request $request, $id)
    {
        if (empty($id) || $id < 0) {
            return $this->returnIfIdValidateFail();
        }
        $schedule = $this->scheduleRepository->findById($id);
        if (!$schedule) {
            return response()->json([
                'code' => Status::ERROR,
                'message' => 'Không có dữ liệu phù hợp'
            ], Response::HTTP_NOT_FOUND);
        } else {
            return response()->json(
                new ScheduleResource($schedule)
            );
        }
    }

    public function destroy($id, Request $request)
    {
        if (empty($id) || $id < 0) {
            return $this->returnIfIdValidateFail();
        }

        $schedule = $this->scheduleRepository->findById($id);

        if (!$schedule) {
            return response()->json([
                'message' => 'Không tìm thấy bản ghi cần xóa',
                'code' => Status::SUCCESS
            ], Response::HTTP_NOT_FOUND);
        }

        if ($this->scheduleService->delete($id)) {
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
        $respository = 'App\Repositories\Schedule\ScheduleRepository';
        if ($this->scheduleService->updateByField($request, $id, $respository)) {

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
