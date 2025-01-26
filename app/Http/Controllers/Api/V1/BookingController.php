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
use App\Mail\BookingMail;
use App\Mail\ConfirmBooking;
use Illuminate\Support\Facades\Mail;

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
            $auth = auth()->user();
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

    public function create(StoreBookingRequest $request)
    {
        $data = $this->bookingService->create($request);
        if ($data['code'] == Status::SUCCESS) {
            $dataBooking = new BookingResource($data['booking']);
            $this->sendMail($dataBooking);
            return response()->json([
                'message' => 'Thêm mới bản ghi thành công',
                'booking' => $dataBooking
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

    public function update(UpdateBookingRequest $request, $id)
    {
        $data = $this->bookingService->update($request, $id);
        if ($data['code'] == Status::SUCCESS) {
            $dataBooking = new BookingResource($data['booking']);
            if ($dataBooking->status == 'confirm' || $dataBooking->status == 'stop') {
                $this->confirmMail($dataBooking);
            }
            return response()->json([
                'message' => 'Cập nhật bản ghi thành công',
                'booking' => $dataBooking,
                'code' => Response::HTTP_OK
            ], Response::HTTP_OK);
        }
    }

    private function sendMail($dataBooking)
    {
        $to = $dataBooking->email;
        $cc = 'dtc2054802010305@ictu.edu.vn';
        Mail::to($to)->cc($cc)->send(new BookingMail($dataBooking));
    }

    private function confirmMail($dataBooking)
    {
        $to = $dataBooking->email;
        $cc = 'dtc2054802010305@ictu.edu.vn';
        Mail::to($to)->cc($cc)->send(new ConfirmBooking($dataBooking));
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
