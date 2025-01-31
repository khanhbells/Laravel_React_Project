<?php

namespace App\Services\Booking;

use App\Services\BaseService;
use App\Repositories\Booking\BookingRepository;
use App\Repositories\Schedule\ScheduleRepository;
use Illuminate\Support\Facades\DB;
use App\Enums\Status;
use App\Http\Resources\BookingResource;
use App\Mail\BookingMail;
use App\Mail\ConfirmBooking;
use Illuminate\Support\Carbon;
use Illuminate\Support\Facades\Mail;

class BookingService extends BaseService
{
    protected $bookingRepository;
    protected $scheduleRepository;
    public function __construct(
        BookingRepository $bookingRepository,
        ScheduleRepository $scheduleRepository,
    ) {
        $this->bookingRepository = $bookingRepository;
        $this->scheduleRepository = $scheduleRepository;
    }

    public function paginate($request, $auth)
    {
        $agrument = $this->paginateAgrument($request, $auth);
        if (isset($auth->user_catalogue_id) && $auth->user_catalogue_id == 2) {
            $agrument['whereHas'] = $this->whereHas($auth->id);
        } else {
            if ($request->input('user_id')) {
                $agrument['whereHas'] = $this->whereHas($request->input('user_id'));
            }
        }
        $bookings = $this->bookingRepository->pagination([...$agrument]);
        return $bookings;
    }

    private function whereHas($user_id)
    {
        return [
            'doctors' => function ($query) use ($user_id) {
                $query->where('user_id', $user_id)
                    ->where('publish', 2);
            }
        ];
    }

    private function paginateAgrument($request, $auth = null)
    {
        $condition = [
            'publish' => $request->integer('publish'),
        ];
        if (isset($auth->patient_catalogue_id) && $auth != null) {
            $condition['patient_id'] = $auth->id;
        }
        if ($request->input('status')) {
            $condition['status'] = $request->input('status');
        }
        return [
            'perpage' => $request->input('perpage') ?? 10,
            'keyword' => [
                'search' => $request->input('keyword') ?? '',
                'field' => ['name']
            ],
            'condition' => $condition,
            'select' => ['*'],
            'orderBy' => $request->input('sort') ? explode(',', $request->input('sort')) : ['id', 'desc'],
            'relations' => ['doctors.users', 'schedules.time_slots', 'provinces', 'districts', 'wards']
        ];
    }

    public function create($request)
    {
        DB::beginTransaction();
        try {
            $except = ['price_schedule', 'image', 'name', 'patient_catalogue_id', 'patient_catalogues', 'publish', 'id'];
            $payload = $this->initializePayload($request, $except)->getPayload();
            $payload['booking_date'] = Carbon::now()->toDateTimeString();
            $payload['status'] = 'pending';
            $payload['payment_status'] = 'pending';
            if ($request->input('id')) {
                $payload['patient_id'] = $request->input('id');
            }
            $booking = $this->bookingRepository->create($payload);
            $dataBooking = new BookingResource($booking);
            $this->sendMail($dataBooking);
            DB::commit();
            return [
                'booking' => $booking,
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
            $only = ['status', 'payment_status'];
            $payload = $this->initializePayload($request, $except, $only)->getPayload();
            $oldBooking = $this->bookingRepository->findById($id);
            if ($payload['status'] == 'confirm') {
                $payloadSchedule['status'] = 'CLOSE';
                $this->scheduleRepository->update($request->input('schedule_id'), $payloadSchedule);
            } else if ($payload['status'] == 'pending') {
                $payloadSchedule['status'] = 'OPEN';
                $this->scheduleRepository->update($request->input('schedule_id'), $payloadSchedule);
            } else if ($payload['status'] == 'stop') {
                $payload['payment_status'] = 'stop';
                $payloadSchedule['status'] = 'OPEN';
                $this->scheduleRepository->update($request->input('schedule_id'), $payloadSchedule);
            }
            $booking = $this->bookingRepository->update($id, $payload);

            if ($oldBooking->status != 'confirm' && $oldBooking->status != 'stop') {
                // dd(123);
                $dataBooking = new BookingResource($booking);
                if ($dataBooking->status == 'confirm' || $dataBooking->status == 'stop') {
                    $this->confirmMail($dataBooking);
                }
            }
            // dd(456);
            DB::commit();
            return [
                'booking' => $booking,
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
            $this->bookingRepository->delete($id);
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

    private function confirmMail($dataBooking)
    {
        $to = $dataBooking->email;
        $cc = 'dtc2054802010305@ictu.edu.vn';
        Mail::to($to)->cc($cc)->send(new ConfirmBooking($dataBooking));
    }

    private function sendMail($dataBooking)
    {
        $to = $dataBooking->email;
        $cc = 'dtc2054802010305@ictu.edu.vn';
        Mail::to($to)->cc($cc)->send(new BookingMail($dataBooking));
    }
}
