<?php

namespace App\Services\Schedule;

use App\Services\BaseService;
use App\Repositories\Schedule\ScheduleRepository;
use App\Repositories\User\UserRepository;
use Illuminate\Support\Facades\DB;
use App\Enums\Status;
use Illuminate\Support\Carbon;

class ScheduleService extends BaseService
{
    protected $scheduleRepository;
    protected $userRepository;
    public function __construct(
        ScheduleRepository $scheduleRepository,
        UserRepository $userRepository,
    ) {
        $this->scheduleRepository = $scheduleRepository;
        $this->userRepository = $userRepository;
    }

    public function paginate($request, $auth)
    {
        $agrument = $this->paginateAgrument($request, $auth);
        $schedules = $this->scheduleRepository->pagination([...$agrument]);
        return $schedules;
    }

    private function paginateAgrument($request, $auth)
    {
        $condition = [
            'publish' => $request->integer('publish'),
            'doctor_id' => $request->integer('doctor_id'),
        ];
        // Nếu $auth->user_catalogue_id == 2, thêm điều kiện 'id'
        if (isset($auth)) {
            if ($auth->user_catalogue_id == 2) {
                $condition['user_id'] = $auth->id;
            } else if ($request->input('user_id')) {
                $condition['user_id'] = $request->input('user_id');
            }
        }
        if ($request->input('date')) {
            $condition['date'] = $request->input('date');
        }
        $findByCondition = [];
        $permission = $request->input('permission') ?? null;
        if ($permission != null) {
            $findByCondition = [
                ['date', '>=', Carbon::now()->toDateString()],
                ['status', '=', $request->input('status')],
            ];
        }
        return [
            'perpage' => $request->input('perpage') ?? 20,
            'keyword' => [
                'search' => $request->input('keyword') ?? '',
                'field' => ['price', 'status']
            ],
            'condition' => $condition,
            'select' => ['*'],
            'orderBy' => $request->input('sort') ? explode(',', $request->input('sort')) : ['id', 'desc'],
            'relations' => ['users', 'time_slots'],
            'findByCondition' => $findByCondition
        ];
    }



    public function create($request)
    {
        DB::beginTransaction();
        try {
            $except = ['time_slots'];
            $param = [
                'relations' => ['doctors']
            ];
            $payload = $this->initializePayload($request, $except)->getPayload();
            $replaceTimeSlot = json_decode($request->input('time_slots'), true);
            $userDoctor = $this->userRepository->findById($payload['user_id'], $param);
            $payload['doctor_id'] = $userDoctor->doctors->id;


            $findDates = $this->scheduleRepository->findByCondition(
                [
                    ['date', '=', $payload['date']],
                    ['user_id', '=', $payload['user_id']],
                ],
                true
            );

            // Chuyển findDates thành key-value để dễ kiểm tra
            $existingTimeSlots = [];
            foreach ($findDates as $existing) {
                $existingTimeSlots[$existing['time_slot_id']] = $existing;
            }
            $timeSlotData = [];

            foreach ($replaceTimeSlot as $valTimeSlot) {
                if (isset($existingTimeSlots[$valTimeSlot['time_slot_id']])) {
                    // Nếu đã tồn tại, cập nhật giá trị price
                    $this->scheduleRepository->update(
                        $existingTimeSlots[$valTimeSlot['time_slot_id']]['id'],
                        ['price' => convert_price($valTimeSlot['price'])]
                    );
                } else {
                    // Nếu chưa tồn tại, thêm vào mảng để tạo mới
                    $timeSlotData[] = [
                        'user_id' => $payload['user_id'],
                        'doctor_id' => $payload['doctor_id'],
                        'date' => $payload['date'],
                        'time_slot_id' => $valTimeSlot['time_slot_id'],
                        'price' => convert_price($valTimeSlot['price']),
                    ];
                }
            }

            // Tạo mới các time slots chưa tồn tại
            if (!empty($timeSlotData)) {
                $schedule = $this->scheduleRepository->createMany($timeSlotData);
            } else {
                $schedule = [];
            }
            DB::commit();
            return [
                'schedule' => $schedule,
                'code' => Status::SUCCESS
            ];
        } catch (\Exception $e) {
            DB::rollBack();
            return [
                'code' => Status::ERROR,
                'message' => $e->getMessage()
            ];
        }
    }

    public function update($request, $id)
    {
        DB::beginTransaction();
        try {
            $except = [];
            $only = ['date', 'price', 'status'];
            $payload = $this->initializePayload($request, $except, $only)->getPayload();
            $payload['price'] = convert_price($payload['price']);
            $schedule = $this->scheduleRepository->update($id, $payload);
            // dd($schedule);
            DB::commit();
            return [
                'schedule' => $schedule,
                'code' => Status::SUCCESS
            ];
        } catch (\Exception $e) {
            DB::rollBack();
            return [
                'code' => Status::ERROR,
                'message' => $e->getMessage()
            ];
        }
    }

    public function delete($id)
    {
        DB::beginTransaction();
        try {
            $this->scheduleRepository->delete($id);
            DB::commit();
            return [
                'code' => Status::SUCCESS
            ];
        } catch (\Exception $e) {
            DB::rollBack();
            return [
                'code' => Status::ERROR,
                'message' => $e->getMessage()
            ];
        }
    }
}
