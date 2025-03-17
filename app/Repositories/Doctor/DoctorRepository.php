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
            'doctors.canonical',
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
                'doctors.canonical',
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

    public function listRevenueDetailDoctor($doctor_id)
    {
        $data = DB::table('bookings')
                ->select(
                    DB::raw('DATE(bookings.created_at) as examinationDate'),
                    DB::raw('COALESCE(SUM(CASE WHEN bookings.status = "confirm" AND bookings.payment_status = "confirm" THEN bookings.total_price ELSE 0 END), 0) as revenue'),
                    DB::raw('COUNT(CASE WHEN bookings.status = "confirm" AND bookings.payment_status = "confirm" THEN bookings.id END) as totalBookingSuccess'),
                    DB::raw('COUNT(CASE WHEN bookings.status = "stop" THEN bookings.id END) as totalBookingStop'),
                    DB::raw('COUNT(CASE WHEN bookings.status = "pending" OR bookings.payment_status = "pending" THEN bookings.id END) as totalBookingPending')
                )
                ->where('bookings.doctor_id', $doctor_id)
                ->groupBy(DB::raw('DATE(bookings.created_at)'))
                ->orderBy(DB::raw('DATE(bookings.created_at)'), 'ASC')
                ->get();

        $totalRevenue = DB::table('bookings')
            ->where('doctor_id', $doctor_id)
            ->where('status', 'confirm')
            ->where('payment_status', 'confirm')
            ->sum('total_price');

        $totalBooking = DB::table('bookings')
            ->where('doctor_id', $doctor_id)
            ->count();

        $totalBookingConfirm = DB::table('bookings')
            ->where('doctor_id', $doctor_id)
            ->where('status', 'confirm')
            ->where('payment_status', 'confirm')
            ->count();

        $totalBookingStop = DB::table('bookings')
            ->where('doctor_id', $doctor_id)
            ->where('status', 'stop')
            ->count();

        return [
            'listRevenueDetailDoctor' => $data,
            'totalRevenue' => $totalRevenue,
            'totalBooking' => $totalBooking,
            'totalBookingConfirm' => $totalBookingConfirm,
            'totalBookingStop' => $totalBookingStop,
        ];
    }
}
