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
use App\Http\Requests\UpdateByFieldRequest;
use App\Http\Requests\Booking\StoreBookingRequest;
use App\Http\Requests\Booking\UpdateBookingRequest;

class BookingController extends Controller
{
    use AuthorizesRequests;
    protected $bookingService;
    protected $bookingRepository;
    public function __construct(
        BookingService $bookingService,
        BookingRepository $bookingRepository,
    ) {
        $this->bookingService = $bookingService;
        $this->bookingRepository = $bookingRepository;
    }

    public function index(Request $request)
    {
        try {
            $bookings = $this->bookingService->paginate($request);
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

    public function create(StoreBookingRequest $request)
    {
        $data = $this->bookingService->create($request);
        return $data;
        if ($data['code'] == Status::SUCCESS) {
            return response()->json([
                'message' => 'Thêm mới bản ghi thành công',
                'booking' => new BookingResource($data['booking'])
            ], Response::HTTP_OK);
        }
        return response()->json([
            'message' => $data['message']
        ], Response::HTTP_INTERNAL_SERVER_ERROR);
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
        } else {
            return response()->json(
                new BookingResource($booking)
            );
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
