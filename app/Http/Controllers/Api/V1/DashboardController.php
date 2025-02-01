<?php

namespace App\Http\Controllers\Api\V1;

use App\Enums\Status;
use App\Http\Controllers\Controller;
use App\Http\Requests\SortRequest;
use App\Http\Resources\LocationResource;
use Exception;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Symfony\Component\HttpFoundation\Response;
use Illuminate\Support\Str;
use App\Services\DashboardService;
use Illuminate\Support\Carbon;

class DashboardController extends Controller
{

    protected $dashboardService;

    public function __construct(DashboardService $dashboardService)
    {
        $this->dashboardService = $dashboardService;
    }

    public function deleteBatch(Request $request)
    {
        DB::beginTransaction();
        try {
            $ids = $request->input('ids');
            $model = $request->input('model');
            if (!is_array($ids) || count($ids) == 0) {
                return response()->json([
                    'error' => 'Danh sách id không hợp lệ'
                ], Response::HTTP_BAD_REQUEST);
            }

            //Cau hinh duong dan den class Repository tương ứng
            $repository = app($this->callRepository($model));

            $deletedCount = $repository->deleteBatch($ids);

            DB::commit();

            return response()->json([
                'message' => "Đã xóa thành công {$deletedCount} bản ghi"
            ], Response::HTTP_OK);
        } catch (\Exception $e) {
            DB::rollBack();
            return response()->json(['error' => $e->getMessage()], Response::HTTP_INTERNAL_SERVER_ERROR);
        }
    }

    public function updateBatch(Request $request)
    {
        DB::beginTransaction();
        try {
            $ids = $request->input('ids');
            $model = $request->input('model');
            $field = $request->input('field');
            $value = $request->input('value');

            if (!is_array($ids) || count($ids) == 0) {
                return response()->json([
                    'error' => 'Danh sách id không hợp lệ'
                ], Response::HTTP_BAD_REQUEST);
            }

            $repository = app($this->callRepository($model));

            $whereIn = [
                'whereInField' => 'id',
                'whereInValue' => $ids
            ];

            $payload[$field] = $value;

            $updateCount = $repository->updateBatch($payload, $whereIn);
            DB::commit();

            return response()->json([
                'message' => "Đã cập nhật thành công {$updateCount} bản ghi"
            ], Response::HTTP_OK);
        } catch (\Exception $e) {
            DB::rollBack();
            return response()->json(['error' => $e->getMessage()], Response::HTTP_INTERNAL_SERVER_ERROR);
        }
    }

    private function callRepository($model, $isFolder = true)
    {
        // Singular xóa chữ s ở cuối chuỗi
        // Studly viết hoa chữ cái đầu
        $singularModel = Str::singular($model);
        $modelClass = Str::studly($singularModel);
        $folder = Str::studly(current(explode('_', $singularModel)));

        $repository = $isFolder ? "App\Repositories\\{$folder}\\{$modelClass}Repository"
            : "App\Repositories\\{$modelClass}Repository";
        return $repository;
    }
    public function location(Request $request)
    {
        try {
            $type = $request->input('locationType');
            $parentId = $request->input('parent_id');
            if (empty($type)) {
                return response()->json([
                    'message' => 'Không đủ thông tin của loại vị trí muốn lấy.'
                ], 400);
            }
            $foreignColumn = [
                'provinces' => '',
                'districts' => 'province',
                'wards' => 'district'
            ];
            $locationMapping = [
                'provinces' => 'provinces',
                'districts' => 'districts',
                'wards' => 'wards',
            ];
            $isFolder = false;
            $repository = app($this->callRepository($type, $isFolder));
            $data = empty($parentId) ? $repository->all(['code', 'name']) : $repository->findByParentId($parentId, (($foreignColumn[$type] !== '') ? $foreignColumn[$type] . '_code' : ''), ['code', 'name']);



            $locationName = $locationMapping[$type];

            return response()->json([
                'data' => LocationResource::collection($data)
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'message' => $e->getMessage()
            ], 400);
        }
    }

    public function sort(SortRequest $request)
    {
        $sort = $this->dashboardService->sort($request);
        if ($sort['code'] == Status::SUCCESS) {
            return response()->json([
                'message' => 'Sắp xếp thành công!'
            ], Response::HTTP_OK);
        };

        return response()->json([
            'code' => Status::ERROR,
            'message' => 'Error!'
        ], Response::HTTP_INTERNAL_SERVER_ERROR);
    }

    public function statistic(Request $request)
    {
        try {
            $month = now()->month;
            $year = now()->year;
            $previousMonth = ($month == 1) ? 12 : $month - 1;
            $previousYear = ($month == 1) ? $year - 1 : $year;
            $repositoryBooking = $this->customRepository('bookings');

            $totalDoctor = $this->statisticTotal('doctors');
            $totalPatient = $this->statisticTotal('patients');

            $totalBooking = $this->statisticTotal('bookings');
            $totalStopBooking = $repositoryBooking->getStopBooking();
            $totalPendingBooking = $repositoryBooking->getPendingBooking();
            $totalBookingCurrentMonth = $repositoryBooking->getBookingByTime($month, $year);
            $totalBookingPreviousMonth = $repositoryBooking->getBookingByTime($previousMonth, $previousYear);
            $revenueAll =  $repositoryBooking->getRevenueBookingAll();

            $data = [
                'totalDoctor' => $totalDoctor,
                'totalPatient' => $totalPatient,
                'totalBooking' => $totalBooking,
                'totalStopBooking' => $totalStopBooking,
                'totalPendingBooking' => $totalPendingBooking,
                'totalPendingBooking' => $totalPendingBooking,
                'revenueAll' => $revenueAll,
                'totalBookingCurrentMonth' => $totalBookingCurrentMonth,
                'totalBookingPreviousMonth' => $totalBookingPreviousMonth,
                'growBooking' => growth($totalBookingCurrentMonth, $totalBookingPreviousMonth),
            ];

            return response()->json([
                'statistic' => $data,
                'code' => Response::HTTP_OK
            ], Response::HTTP_OK);
        } catch (\Exception $e) {
            return response()->json([
                'error' => 'Có lỗi xảy ra, vui lòng thử lại sau.',
                'message' => $e->getMessage(),
                'code' => Status::ERROR
            ], Response::HTTP_INTERNAL_SERVER_ERROR);
        }
    }

    public function chart(Request $request)
    {
        try {
            $repositoryBooking = $this->customRepository('bookings');
            $type = $request->input('chartType');
            switch ($type) {
                case '1':
                    $year = now()->year;
                    $chart = convertRevenueChartData($repositoryBooking->revenueByYear($year));
                    break;
                case '7':
                    // dd($repositoryBooking->revenue7Day());
                    $chart = convertRevenueChartData($repositoryBooking->revenue7Day(), 'daily_revenue', 'date', 'Ngày');
                    break;
                case '30':
                    $currentMonth = now()->month;
                    $currentYear = now()->year;
                    $dayInMonth = Carbon::createFromDate($currentYear, $currentMonth, 1)->daysInMonth;
                    $allDays = range(1, $dayInMonth);
                    $temp = $repositoryBooking->revenueCurrentMonth($currentMonth, $currentYear);

                    $label = [];
                    $data = [];
                    $temp2 = array_map(function ($day) use ($temp, &$label, &$data) {
                        $found = collect($temp)->first(function ($record) use ($day) {
                            return $record['day'] == $day;
                        });
                        $label[] = 'Ngày ' . $day;
                        $data[] = $found ? $found['daily_revenue'] : 0;
                    }, $allDays);
                    $chart = [
                        'label' => $label,
                        'data' => $data
                    ];
                    break;
                case '24':
                    $chart = convertRevenueChartData($repositoryBooking->revenue24Hours(), 'hourly_revenue', 'hour', 'Giờ');
                    break;
            }
            return response()->json([
                'chart' => $chart,
                'code' => Response::HTTP_OK
            ], Response::HTTP_OK);
        } catch (\Exception $e) {
            return response()->json([
                'error' => 'Có lỗi xảy ra, vui lòng thử lại sau.',
                'message' => $e->getMessage(),
                'code' => Status::ERROR
            ], Response::HTTP_INTERNAL_SERVER_ERROR);
        }
    }

    public function analytics(Request $request)
    {
        try {
            $repositoryBooking = $this->customRepository('bookings');
            $analytics = $repositoryBooking->getAnalytics();

            return response()->json([
                'analytics' => $analytics,
                'code' => Response::HTTP_OK
            ], Response::HTTP_OK);
        } catch (\Exception $e) {
            return response()->json([
                'error' => 'Có lỗi xảy ra, vui lòng thử lại sau.',
                'message' => $e->getMessage(),
                'code' => Status::ERROR
            ], Response::HTTP_INTERNAL_SERVER_ERROR);
        }
    }

    public function topDoctors(Request $request)
    {
        try {
            $repositoryDoctors = $this->customRepository('doctors');
            $topDoctors = $repositoryDoctors->getTopDoctors()->toArray();
            foreach ($topDoctors as $key => $value) {
                $topDoctors[$key]['image'] = getImages($value['image']);
            }

            return response()->json([
                'topDoctors' => $topDoctors,
                'code' => Response::HTTP_OK
            ], Response::HTTP_OK);
        } catch (\Exception $e) {
            return response()->json([
                'error' => 'Có lỗi xảy ra, vui lòng thử lại sau.',
                'message' => $e->getMessage(),
                'code' => Status::ERROR
            ], Response::HTTP_INTERNAL_SERVER_ERROR);
        }
    }

    public function customRepository($model)
    {
        $customRepository = app($this->callRepository($model));
        return $customRepository;
    }

    public function statisticTotal($model)
    {
        $repository = $this->customRepository($model);
        $total = $repository->total();

        if ($total === null || $total === false) {
            return response()->json([
                'error' => `Không thể lấy dữ liệu từ {$model}`,
            ], Response::HTTP_INTERNAL_SERVER_ERROR);
        }

        return $total;
    }
}
