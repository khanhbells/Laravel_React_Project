<?php

namespace App\Repositories\Doctor;

use App\Repositories\BaseRepository;
use App\Models\Doctor;
use Illuminate\Support\Facades\DB;

class DoctorRepository extends BaseRepository
{
    protected $model;
    public function __construct(
        Doctor $model
    ) {
        $this->model = $model;
    }

    public function getTopDoctors()
    {
        return $this->model->select(
            'doctors.id',
            'users.name',
            'users.email',
            'users.phone',
            'users.image',
            DB::raw('COUNT(bookings.id) as total_bookings'),
            DB::raw('SUM(bookings.total_price) as total_prices')
        )
            ->join('users', 'doctors.user_id', '=', 'users.id')
            ->join('bookings', 'bookings.doctor_id', '=', 'doctors.id')
            ->where('status', '=', 'confirm')
            ->where('payment_status', '=', 'confirm')
            ->groupBy(
                'doctors.id',
                'users.name',
                'users.email',
                'users.phone',
                'users.image',
            )
            ->orderByDesc('total_prices')
            ->limit(5)
            ->get()
        ;
    }
}
