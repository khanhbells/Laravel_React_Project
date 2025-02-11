<?php

namespace App\Classes;

use Srmklive\PayPal\Services\PayPal as PayPalClient;

class Paypal
{
    public function __construct() {}

    public function payment($booking)
    {
        // Khởi tạo lớp PayPalClient

        $usd = 25530;
        $total_price = $booking->total_price;
        $paypalValue = number_format($total_price / $usd, 2, '.', '');
        $provider = new PayPalClient;

        // Thiết lập thông tin API
        $provider = \PayPal::setProvider();

        // Lấy mã truy cập
        $accessToken = $provider->getAccessToken();
        $data = [
            "intent" => "CAPTURE",
            "application_context" => [
                'return_url' => url(env('FRONTEND_URL') . "homepage/success/{$booking->id}"),
                'cancel_url' => url(env('FRONTEND_URL') . "homepage/cancel/{$booking->id}"),
            ],
            "purchase_units" => [
                [
                    "amount" => [
                        "currency_code" => "USD",
                        "value" => $paypalValue
                    ]
                ]
            ]
        ];
        $response = $provider->createOrder($data);
        $res['url'] = '';
        if (!empty($response['id']) && $response['id'] != '') {
            foreach ($response['links'] as $key => $val) {
                if ($val['rel'] == 'approve') {
                    $res['url'] = $val['href'];
                    $res['errorCode'] = 0;
                }
            }
        }
        return $res;
    }
}
