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
            DB::raw('SUM(bookings.total_price) as total_prices'),
            DB::raw('GROUP_CONCAT(DISTINCT specialties.name ORDER BY specialties.name SEPARATOR ", ") as specialty_names'),
            DB::raw('GROUP_CONCAT(DISTINCT specialties.canonical ORDER BY specialties.canonical SEPARATOR ", ") as specialty_canonicals'),
            DB::raw('GROUP_CONCAT(DISTINCT specialties.id ORDER BY specialties.id SEPARATOR ", ") as specialty_ids')
        )
            ->join('users', 'doctors.user_id', '=', 'users.id')
            ->join('bookings', 'bookings.doctor_id', '=', 'doctors.id')
            ->leftJoin('doctor_specialty', 'doctors.id', '=', 'doctor_specialty.doctor_id')
            ->leftJoin('specialties', 'doctor_specialty.specialty_id', '=', 'specialties.id')
            ->where('bookings.status', '=', 'confirm')
            ->where('bookings.payment_status', '=', 'confirm')
            ->groupBy(
                'doctors.id',
                'users.name',
                'users.email',
                'users.phone',
                'users.image'
            )
            ->orderByDesc('total_prices')
            ->limit(5)
            ->get();
    }
}
