<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Resources\BookingResource;
use Exception;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class MomoController
{
    public function __construct() {}

    public function momo_return($booking, $queryParams)
    {
        $momoConfig = momoConfig();

        $secretKey = $momoConfig['secretKey']; //Put your secret key in there
        $partnerCode = $momoConfig['partnerCode'];
        $accessKey = $momoConfig['accessKey'];

        if (!empty($queryParams)) {

            $rawData = "accessKey=" . $accessKey;
            $rawData .= "&amount=" . $queryParams['amount'];
            $rawData .= "&extraData=" . $queryParams['extraData'];
            $rawData .= "&message=" . $queryParams['message'];
            $rawData .= "&orderId=" . $queryParams['orderId'];
            $rawData .= "&orderInfo=" . $queryParams['orderInfo'];
            $rawData .= "&orderType=" . $queryParams['orderType'];
            $rawData .= "&partnerCode=" . $queryParams['partnerCode'];
            $rawData .= "&payType=" . $queryParams['payType'];
            $rawData .= "&requestId=" . $queryParams['requestId'];
            $rawData .= "&responseTime=" . $queryParams['responseTime'];
            $rawData .= "&resultCode=" . $queryParams['resultCode'];
            $rawData .= "&transId=" . $queryParams['transId'];


            $partnerSignature = hash_hmac("sha256", $rawData, $secretKey);
            $m2signature = $queryParams['signature'];

            if ($m2signature == $partnerSignature) {
                $repositoryBooking = customRepository('bookings');
                $payload['payment_status'] = 'confirm';
                $repositoryBooking->update($booking->id, $payload);
            }

            $momo = [
                'm2signature' => $m2signature,
                'partnerSignature' => $partnerSignature,
                'message' => $queryParams['message'],
            ];
            return response()->json([
                'bookings' => new BookingResource($booking),
                'momo' => $momo,
            ], Response::HTTP_OK);
        }
    }

    public function momo_ipn($queryParams, $booking)
    {
        http_response_code(200); //200 - Everything will be 200 Oke
        $momoConfig = momoConfig();

        $secretKey = $momoConfig['secretKey']; //Put your secret key in there
        $accessKey = $momoConfig['accessKey'];
        if (!empty($_POST)) {
            $response = array();
            try {
                //Checksum
                $rawData = "accessKey=" . $accessKey;
                $rawData .= "&amount=" . $_POST['amount'];
                $rawData .= "&extraData=" . $_POST['extraData'];
                $rawData .= "&message=" . $_POST['message'];
                $rawData .= "&orderId=" . $_POST['orderId'];
                $rawData .= "&orderInfo=" . $_POST['orderInfo'];
                $rawData .= "&orderType=" . $_POST['orderType'];
                $rawData .= "&partnerCode=" . $_POST['partnerCode'];
                $rawData .= "&payType=" . $_POST['payType'];
                $rawData .= "&requestId=" . $_POST['requestId'];
                $rawData .= "&responseTime=" . $_POST['responseTime'];
                $rawData .= "&resultCode=" . $_POST['resultCode'];
                $rawData .= "&transId=" . $_POST['transId'];

                $partnerSignature = hash_hmac("sha256", $rawData, $secretKey);
                $m2signature = $queryParams['signature'];

                if ($m2signature == $partnerSignature) {
                    $repositoryBooking = customRepository('bookings');
                    $payload['payment_status'] = 'confirm';
                    $repositoryBooking->update($booking->id, $payload);
                } else {
                    $result = '<div class="alert alert-danger">This transaction could be hacked, please check your signature and returned signature</div>';
                }
            } catch (Exception $e) {
                echo $response['message'] = $e;
            }

            $debugger = array();
            $debugger['rawData'] = $rawData;
            $debugger['momoSignature'] = $m2signature;
            $debugger['partnerSignature'] = $partnerSignature;

            if ($m2signature == $partnerSignature) {
                $response['message'] = "Received payment result success";
            } else {
                $response['message'] = "ERROR! Fail checksum";
            }
            $response['debugger'] = $debugger;
            echo json_encode($response);
        }
    }
}
