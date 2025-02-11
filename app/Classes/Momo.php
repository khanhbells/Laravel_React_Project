<?php

namespace App\Classes;

class Momo
{

    public function __construct() {}
    public function payment($booking)
    {
        $endpoint = "https://test-payment.momo.vn/v2/gateway/api/create";

        $momoConfig = momoConfig();

        $partnerCode = $momoConfig['partnerCode'];
        $accessKey = $momoConfig['accessKey'];
        $secretKey = $momoConfig['secretKey'];
        $bookingInfo = 'Thanh toán đơn hàng #' . $booking->code . ' qua ví MOMO';
        $amount = (string)($booking->total_price);
        $bookingId = $booking->code;


        $ipnUrl = url(env('FRONTEND_URL') . "homepage/return/ipn");
        $redirectUrl = url(env('FRONTEND_URL') . "homepage/success/{$booking->id}");
        $extraData = "";
        $requestId = time() . "";
        $requestType = "payWithATM";

        $rawHash = "accessKey=" . $accessKey . "&amount=" . $amount . "&extraData=" . $extraData . "&ipnUrl=" . $ipnUrl . "&orderId=" . $bookingId . "&orderInfo=" . $bookingInfo . "&partnerCode=" . $partnerCode . "&redirectUrl=" . $redirectUrl . "&requestId=" . $requestId . "&requestType=" . $requestType;

        $signature = hash_hmac("sha256", $rawHash, $secretKey);


        $data =  array(
            'partnerCode' => $partnerCode,
            'accessKey' => $accessKey,
            'requestId' => $requestId,
            'amount' => $amount,
            'orderId' => $bookingId,
            'orderInfo' => $bookingInfo,
            'redirectUrl' => $redirectUrl,
            'ipnUrl' => $ipnUrl,
            'lang' => 'vi',
            'extraData' => $extraData,
            'requestType' => $requestType,
            'signature' => $signature
        );
        $result = execPostRequest($endpoint, json_encode($data));
        $jsonResult = json_decode($result, true);  // decode json
        $jsonResult['errorCode'] = $jsonResult['resultCode'];
        $jsonResult['url'] = $jsonResult['payUrl'];
        return $jsonResult;
    }
}
