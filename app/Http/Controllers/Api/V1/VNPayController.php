<?php

namespace App\Http\Controllers\Api\V1;

use App\Enums\Status;
use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Http\Resources\BookingResource;
use Symfony\Component\HttpFoundation\Response;

class VNPayController extends Controller
{

    public function __construct() {}


    public function vnpay_return($booking, $queryParams)
    {
        $configVnpay = vnpayConfig($booking->id);
        $vnp_HashSecret = $configVnpay['vnp_HashSecret']; //Chuỗi bí mật
        //Config input format
        $vnp_SecureHash = $queryParams['vnp_SecureHash'];
        $inputData = array();
        foreach ($queryParams as $key => $value) {
            if (substr($key, 0, 4) == "vnp_") {
                $inputData[$key] = $value;
            }
        }
        unset($inputData['vnp_SecureHash']);
        ksort($inputData);
        $i = 0;
        $hashData = "";
        foreach ($inputData as $key => $value) {
            if ($i == 1) {
                $hashData = $hashData . '&' . urlencode($key) . "=" . urlencode($value);
            } else {
                $hashData = $hashData . urlencode($key) . "=" . urlencode($value);
                $i = 1;
            }
        }
        $secureHash = hash_hmac('sha512', $hashData, $vnp_HashSecret);
        if ($secureHash == $vnp_SecureHash) {
            if ($queryParams['vnp_ResponseCode'] == '00') {
                $repositoryBooking = $this->customRepository('bookings');
                $payload['payment_status'] = 'confirm';
                $repositoryBooking->update($booking->id, $payload);
                return response()->json([
                    'bookings' => new BookingResource($booking),
                    'secureHash' => $secureHash,
                    'vnp_SecureHash' => $vnp_SecureHash
                ], Response::HTTP_OK);
            } else {
                return response()->json([
                    'message' => 'Giao dịch không thành công',
                    'code' => Status::ERROR,
                ], Response::HTTP_NOT_FOUND);
            }
        } else {
            return response()->json([
                'message' => 'Chữ ký không hợp lệ',
                'error' => Status::ERROR,
            ], Response::HTTP_INTERNAL_SERVER_ERROR);
        }
    }

    public function customRepository($model)
    {
        $customRepository = app(callRepository($model));
        return $customRepository;
    }
}
