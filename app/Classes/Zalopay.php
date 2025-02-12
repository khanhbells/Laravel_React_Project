<?php

namespace App\Classes;

use Illuminate\Support\Facades\Http;

class Zalopay
{

    public function __construct() {}
    public function payment($booking)
    {
        $bookingCode = str_pad($booking->code, 6, "0", STR_PAD_LEFT); // Hoặc lấy ID từ database
        $amount = intval($booking->total_price);  // Số tiền
        $description = "Thanh toán đơn hàng #$bookingCode qua ZaloPay";
        $items = [
            [
                "itemid" => $booking->id,
                "itemname" => $booking->full_name,
                "itemprice" => $booking->total_price,
            ]
        ];
        $embeddata = json_encode([
            // "merchantinfo" => "embeddata123",
            "redirecturl" => config('zalopay.callback_url') . "/{$booking->id}",
        ]);
        $transID = rand(0, 1000000);
        $order = [
            'appid' => config('zalopay.app_id'),
            'apptime' => round(microtime(true) * 1000),
            'apptransid' => date("ymd") . "_" . $transID,
            'appuser' => "user123",
            'item' => json_encode($items, JSON_UNESCAPED_UNICODE),
            'embeddata' => $embeddata,
            'amount' => $amount,
            'description' => $description,
            'bankcode' => "",
            'callbackurl' => "https://1923-2405-4802-ac68-2340-b41d-aafe-b6ec-6837.ngrok-free.app/api/v1/zalopay/callback",
        ];
        $data = $order["appid"] . "|" . $order["apptransid"] . "|" . $order["appuser"] . "|" . $order["amount"]
            . "|" . $order["apptime"] . "|" . $order["embeddata"] . "|" . $order["item"];
        $order["mac"] = hash_hmac("sha256", $data, config('zalopay.key1'));
        // Gửi request đến ZaloPay
        $context = stream_context_create([
            "http" => [
                "header" => "Content-type: application/x-www-form-urlencoded\r\n",
                "method" => "POST",
                "content" => http_build_query($order)
            ]
        ]);

        $resp = file_get_contents(config('zalopay.endpoint'), false, $context);
        $result = json_decode($resp, true);
        if ($result['orderurl'] == null) {
            return [
                'errorCode' => 1,
                'message' => 'Không lấy được URL thanh toán',
                'errorDetail' => $result,
                'url' => null,
            ];
        }

        return [
            'errorCode' => 0,
            'message' => 'success',
            'url' => $result['orderurl'], // URL để chuyển hướng đến trang thanh toán
        ];
    }
}
