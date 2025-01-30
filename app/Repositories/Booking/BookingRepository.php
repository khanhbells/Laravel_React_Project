<?php

namespace App\Repositories\Booking;

use App\Repositories\BaseRepository;
use App\Models\Booking;

class BookingRepository extends BaseRepository
{
    protected $model;
    public function __construct(
        Booking $model
    ) {
        $this->model = $model;
    }

    public function getStopBooking()
    {
        return $this->model->where('status', '=', 'stop')->count();
    }

    public function getPendingBooking()
    {
        return $this->model->where('status', '=', 'pending')->count();
    }

    public function getRevenueBookingAll()
    {
        return $this->model
            // ->join('order_product', 'order_product.order_id', '=', 'orders.id')
            ->where('status', '=', 'confirm')
            ->where('payment_status', '=', 'confirm')
            ->sum('total_price')
        ;
    }

    public function getBookingByTime($month, $year)
    {
        return $this->model
            ->whereMonth('created_at', $month)
            ->whereYear('created_at', $year)
            ->count()
        ;
    }
}
