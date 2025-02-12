<?php

namespace App\Http\Controllers\Api\V1;

use App\Enums\Status;
use App\Http\Controllers\Controller;
use Illuminate\Foundation\Auth\Access\AuthorizesRequests;
use Illuminate\Http\Request;
use App\Http\Resources\BookingResource;
use App\Services\Booking\BookingService;
use App\Repositories\Booking\BookingRepository;
use Symfony\Component\HttpFoundation\Response;
use App\Http\Requests\Booking\StoreBookingRequest;
use App\Http\Requests\Booking\UpdateBookingRequest;
use App\Classes\Vnpay;
use App\Classes\Momo;
use App\Classes\Paypal;
use App\Classes\Zalopay;
use App\Http\Controllers\Api\V1\VNPayController;
use App\Http\Controllers\Api\V1\MomoController;
use App\Http\Controllers\Api\V1\PaypalController;
use App\Http\Controllers\Api\V1\ZaloPayController;

class BookingController extends Controller
{
    use AuthorizesRequests;
    protected $bookingService;
    protected $bookingRepository;
    protected $vnpay;
    protected $momo;
    protected $paypal;
    protected $zalopay;
    protected $vnpayController;
    protected $momoController;
    protected $paypalController;
    protected $zalopayController;

    public function __construct(
        BookingService $bookingService,
        BookingRepository $bookingRepository,
        Vnpay $vnpay,
        Momo $momo,
        Paypal $paypal,
        Zalopay $zalopay,
        VNPayController $vnpayController,
        MomoController $momoController,
        PaypalController $paypalController,
        ZaloPayController $zalopayController,
    ) {
        $this->bookingService = $bookingService;
        $this->bookingRepository = $bookingRepository;
        $this->vnpay = $vnpay;
        $this->momo = $momo;
        $this->paypal = $paypal;
        $this->zalopay = $zalopay;
        $this->vnpayController = $vnpayController;
        $this->momoController = $momoController;
        $this->paypalController = $paypalController;
        $this->zalopayController = $zalopayController;
    }

    public function index(Request $request)
    {
        try {
            $auth = auth('api')->user();
            $bookings = $this->bookingService->paginate($request, $auth);
            return response()->json([
                'bookings' =>  method_exists($bookings, 'items') ? BookingResource::collection($bookings->items()) : $bookings,
                'links' => method_exists($bookings, 'items') ? $bookings->linkCollection() : null,
                'current_page' => method_exists($bookings, 'items') ? $bookings->currentPage() : null,
                'last_page' => method_exists($bookings, 'items') ? $bookings->lastPage() : null,
            ], Response::HTTP_OK);
        } catch (\Illuminate\Auth\Access\AuthorizationException $e) {
            return response()->json([
                'message' => 'Không có quyền truy cập',
                'bookings' => [],
                'code' => Status::ERROR
            ], Response::HTTP_FORBIDDEN);
        }
    }
    public function indexHistory(Request $request)
    {
        try {
            $auth = auth('patient')->user();
            $historys = $this->bookingService->paginate($request, $auth);
            return response()->json([
                'historys' =>  method_exists($historys, 'items') ? BookingResource::collection($historys->items()) : $historys,
                'links' => method_exists($historys, 'items') ? $historys->linkCollection() : null,
                'current_page' => method_exists($historys, 'items') ? $historys->currentPage() : null,
                'last_page' => method_exists($historys, 'items') ? $historys->lastPage() : null,
            ], Response::HTTP_OK);
        } catch (\Illuminate\Auth\Access\AuthorizationException $e) {
            return response()->json([
                'message' => 'Không có quyền truy cập',
                'historys' => [],
                'code' => Status::ERROR
            ], Response::HTTP_FORBIDDEN);
        }
    }



    public function create(StoreBookingRequest $request)
    {
        $data = $this->bookingService->create($request);
        if ($data['code'] == Status::SUCCESS) {
            if ($data['booking']->method != 'cod') {
                return $this->paymentOnline($data['booking']);
            }
            return response()->json([
                'message' => 'Thêm mới bản ghi thành công',
                'booking' => new BookingResource($data['booking'])
            ], Response::HTTP_OK);
        }
        return response()->json([
            'message' => $data['message']
        ], Response::HTTP_INTERNAL_SERVER_ERROR);
    }

    public function paymentOnline($booking)
    {
        $class = $booking->method;
        $response = $this->{$class}->payment($booking);
        return $this->responsePaymentOnline($response, $booking);
    }

    public function responsePaymentOnline($response, $booking)
    {
        if ($response['errorCode'] == 0) {
            return response()->json([
                'message' => 'Thêm mới bản ghi thành công',
                'booking' => new BookingResource($booking),
                'payUrl' => $response['url'] ?? null // Trả về link thanh toán nếu có
            ], Response::HTTP_OK);
        } else {
            $booking->delete();
            return response()->json([
                'message' => 'Không thể tạo thanh toán, vui lòng thử lại!',
                'error' => $response['message'] ?? 'Lỗi không xác định'
            ], Response::HTTP_INTERNAL_SERVER_ERROR);
        }
    }

    public function show(Request $request, $id)
    {
        if (empty($id) || $id < 0) {
            return $this->returnIfIdValidateFail();
        }
        $booking = $this->bookingRepository->findById($id);
        if (!$booking) {
            return response()->json([
                'code' => Status::ERROR,
                'message' => 'Không có dữ liệu phù hợp'
            ], Response::HTTP_NOT_FOUND);
        }
        // Lấy GET từ query params
        $queryParams = $request->query();
        if (count($queryParams)) {
            return $this->paymentReturn($request, $queryParams, $booking);
        }

        return response()->json([
            'bookings' => new BookingResource($booking),
        ], Response::HTTP_OK);
    }

    public function paymentReturn($request, $queryParams, $booking)
    {
        switch ($booking->method) {
            case 'vnpay':
                if ($request->has('vnp_ResponseCode')) {
                    return $this->vnpayController->vnpay_return($booking, $queryParams);
                }
                break;
            case 'momo':
                if ($request->has('responseTime')) {
                    $this->momoController->momo_ipn($booking, $queryParams);
                    return $this->momoController->momo_return($booking, $queryParams);
                }
                break;
            case 'paypal':
                return $this->paypalController->success($request, $booking);
                break;
            case 'zalopay':
                if ($request->has('checksum')) {
                    return $this->zalopayController->zalopay_return($booking);
                }
                break;
            default:
                # code...
                break;
        }
    }

    public function update(UpdateBookingRequest $request, $id)
    {
        $data = $this->bookingService->update($request, $id);
        if ($data['code'] == Status::SUCCESS) {
            return response()->json([
                'message' => 'Cập nhật bản ghi thành công',
                'booking' => new BookingResource($data['booking']),
                'code' => Response::HTTP_OK
            ], Response::HTTP_OK);
        }
    }

    public function storeBookingMedicine(Request $request, $id)
    {
        $data = $this->bookingService->createBookingMedicine($request, $id);
        if ($data['code'] == Status::SUCCESS) {
            return response()->json([
                'message' => 'Tạo bản ghi thành công',
                'booking' => $data['bookingMedicine'],
                'code' => Response::HTTP_OK
            ], Response::HTTP_OK);
        }
    }





    // public function destroy($id, Request $request)
    // {
    //     if (empty($id) || $id < 0) {
    //         return $this->returnIfIdValidateFail();
    //     }

    //     $booking = $this->bookingRepository->findById($id);

    //     if (!$booking) {
    //         return response()->json([
    //             'message' => 'Không tìm thấy bản ghi cần xóa',
    //             'code' => Status::SUCCESS
    //         ], Response::HTTP_NOT_FOUND);
    //     }

    //     if ($this->bookingService->delete($id)) {
    //         return response()->json([
    //             'message' => 'Xóa bản ghi thành công',
    //             'code' => Status::SUCCESS
    //         ], Response::HTTP_OK);
    //     }
    //     return response()->json([
    //         'message' => 'Network Error',
    //         'code' => Status::ERROR
    //     ], Response::HTTP_INTERNAL_SERVER_ERROR);
    // }

    private function returnIfIdValidateFail()
    {
        return response()->json([
            'message' => 'Mã ID không hợp lệ',
            'code' => Status::ERROR
        ], Response::HTTP_INTERNAL_SERVER_ERROR);
    }
}
