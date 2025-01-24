<?php

namespace App\Services\Booking;

use App\Services\BaseService;
use App\Repositories\Booking\BookingRepository;
use Illuminate\Support\Facades\DB;
use App\Enums\Status;
use Illuminate\Support\Carbon;

class BookingService extends BaseService
{
    protected $bookingRepository;
    public function __construct(
        BookingRepository $bookingRepository,
    ) {
        $this->bookingRepository = $bookingRepository;
    }

    public function paginate($request)
    {
        $agrument = $this->paginateAgrument($request);
        $bookings = $this->bookingRepository->pagination([...$agrument]);
        // dd($bookings);
        return $bookings;
    }

    private function paginateAgrument($request)
    {
        return [
            'perpage' => $request->input('perpage') ?? 10,
            'keyword' => [
                'search' => $request->input('keyword') ?? '',
                'field' => ['name']
            ],
            'condition' => [
                'publish' => $request->integer('publish'),
            ],
            'select' => ['*'],
            'orderBy' => $request->input('sort') ? explode(',', $request->input('sort')) : ['id', 'desc'],
            'relations' => ['doctors.users', 'schedules.time_slots']
        ];
    }

    public function create($request)
    {
        DB::beginTransaction();
        try {
            $except = ['price_schedule'];
            $payload = $this->initializePayload($request, $except)->getPayload();
            $payload['booking_date'] = Carbon::now()->toDateTimeString();
            $payload['status'] = 'pending';
            $payload['payment_status'] = 'pending';
            $booking = $this->bookingRepository->create($payload);

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
            $payload = $this->initializePayload($request, $except)->processCanonical()->getPayload();
            $booking = $this->bookingRepository->update($id, $payload);
            // dd($booking);
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
}
