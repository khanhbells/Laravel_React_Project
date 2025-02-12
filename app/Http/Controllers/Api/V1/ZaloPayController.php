<?php

namespace App\Http\Controllers\Api\V1;

use App\Enums\Status;
use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Http\Resources\BookingResource;
use Exception;
use Illuminate\Support\Facades\DB;
use Symfony\Component\HttpFoundation\Response;
use Illuminate\Support\Facades\Log;

class ZaloPayController extends Controller
{

    public function __construct() {}


    public function zalopay_return($booking)
    {
        $result = [];
        $repositoryBooking = customRepository('bookings');
        // try {
        //     $key2 = "Iyz2habzyr7AG8SgvoBCbKwKi3UzlLi3";
        //     $postdata = file_get_contents('php://input');

        //     $postdatajson = json_decode($postdata, true);
        //     $mac = hash_hmac("sha256", $postdatajson["data"], $key2);

        //     $requestmac = $postdatajson["mac"];

        //     // kiểm tra callback hợp lệ (đến từ ZaloPay server)
        //     if (strcmp($mac, $requestmac) != 0) {
        //         // callback không hợp lệ
        //         $result["returncode"] = -1;
        //         $result["returnmessage"] = "Callback không hợp lệ";
        //     } else {
        //         // thanh toán thành công
        //         // merchant cập nhật trạng thái cho đơn hàng
        //         $datajson = json_decode($postdatajson["data"], true);
        //     }
        // } catch (Exception $e) {
        //     $result["returncode"] = 0; // ZaloPay server sẽ callback lại (tối đa 3 lần)
        //     $result["returnmessage"] = $e->getMessage();
        // }
        // thông báo kết quả cho ZaloPay server
        $result["returncode"] = 1;
        $result["returnmessage"] = "success";
        $payload['payment_status'] = 'confirm';
        $repositoryBooking->update($booking->id, $payload);
        return response()->json([
            'bookings' => new BookingResource($booking),
            'result' => $result,
        ], Response::HTTP_OK);
    }
}
