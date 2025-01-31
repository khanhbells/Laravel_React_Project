<?php

namespace App\Repositories\Booking;

use App\Repositories\BaseRepository;
use App\Models\Booking;
use Illuminate\Support\Facades\DB;

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

    public function revenueByYear($year)
    {
        return $this->model->select(
            DB::raw('
                months.month, 
                COALESCE(SUM(total_price), 0) as monthly_revenue
            ')
        )
            ->from(DB::raw('(
                SELECT 1 AS month
                    UNION SELECT 2
                    UNION SELECT 3
                    UNION SELECT 4
                    UNION SELECT 5
                    UNION SELECT 6
                    UNION SELECT 7
                    UNION SELECT 8
                    UNION SELECT 9
                    UNION SELECT 10
                    UNION SELECT 11
                    UNION SELECT 12
            ) as months'))
            ->leftJoin('bookings', function ($join) use ($year) {
                $join->on(DB::raw('months.month'), '=', DB::raw('MONTH(bookings.created_at)'))
                    ->where('bookings.status', '=', 'confirm')
                    ->where('bookings.payment_status', '=', 'confirm')
                    ->where(DB::raw('YEAR(bookings.created_at)'), '=', $year);
            })
            ->groupBy('months.month')
            ->get()
        ;
    }

    public function revenue7Day()
    {
        return $this->model
            ->select(DB::raw('
            dates.date,
            COALESCE(SUM(total_price), 0) as daily_revenue
        '))
            ->from(DB::raw('(
            SELECT CURDATE() - INTERVAL (a.a + (10*b.a) + (100 * c.a)) DAY as date
            FROM (
                SELECT 0 AS a UNION ALL
                SELECT 1 UNION ALL
                SELECT 2 UNION ALL
                SELECT 3 UNION ALL
                SELECT 4 UNION ALL
                SELECT 5 UNION ALL
                SELECT 6 UNION ALL
                SELECT 7 UNION ALL
                SELECT 8 UNION ALL
                SELECT 9 
            ) as a
            CROSS JOIN (
                SELECT 0 AS a UNION ALL
                SELECT 1 UNION ALL
                SELECT 2 UNION ALL
                SELECT 3 UNION ALL
                SELECT 4 UNION ALL
                SELECT 5 UNION ALL
                SELECT 6 UNION ALL
                SELECT 7 UNION ALL
                SELECT 8 UNION ALL
                SELECT 9 
            ) as b
            CROSS JOIN (
                SELECT 0 AS a UNION ALL
                SELECT 1 UNION ALL
                SELECT 2 UNION ALL
                SELECT 3 UNION ALL
                SELECT 4 UNION ALL
                SELECT 5 UNION ALL
                SELECT 6 UNION ALL
                SELECT 7 UNION ALL
                SELECT 8 UNION ALL
                SELECT 9 
            ) as c
        ) as dates'))
            ->leftJoin('bookings', function ($join) {
                $join->on(DB::raw('DATE(bookings.created_at)'), '=', DB::raw('dates.date'))
                    ->where('bookings.status', '=', 'confirm')
                    ->where('bookings.payment_status', '=', 'confirm')
                ;
            })
            ->where(DB::raw('dates.date'), '>=', DB::raw('CURDATE() - INTERVAL 6 DAY'))
            ->groupBy(DB::raw('dates.date'))
            ->orderBy(DB::raw('dates.date'), 'ASC')
            ->get()
        ;
    }

    public function revenueCurrentMonth($currentMonth, $currentYear)
    {
        return $this->model
            ->select(
                DB::raw('DAY(created_at) as day'),
                DB::raw('COALESCE(SUM(total_price), 0) as daily_revenue')
            )
            ->whereMonth('created_at', $currentMonth)
            ->whereYear('created_at', $currentYear)
            ->where('status', '=', 'confirm')
            ->where('payment_status', '=', 'confirm')
            ->groupBy(DB::raw('DAY(created_at)'))
            ->orderBy(DB::raw('DAY(created_at)'))
            ->get()->toArray();
    }

    public function getAnalytics()
    {
        $totalBookings = $this->model->count();

        if ($totalBookings === 0) {
            return [
                'data' => [
                    [
                        'label' => 'Đã duyệt',
                        'value' => 0
                    ],
                    [
                        'label' => 'Chưa duyệt',
                        'value' => 0
                    ],
                    [
                        'label' => 'Đã hủy',
                        'value' => 0
                    ],
                ],
            ];
        }

        $confirmed = $this->model->where('status', 'confirm')->count();
        $pending = $this->model->where('status', 'pending')->count();
        $stopped = $this->model->where('status', 'stop')->count();
        return [
            'data' => [
                [
                    'label' => 'Đã duyệt',
                    'value' => round(($confirmed / $totalBookings) * 100, 2)
                ],
                [
                    'label' => 'Chưa duyệt',
                    'value' => round(($pending / $totalBookings) * 100, 2)
                ],
                [
                    'label' => 'Đã hủy',
                    'value' => round(($stopped / $totalBookings) * 100, 2)
                ],
            ],
        ];
    }
}
