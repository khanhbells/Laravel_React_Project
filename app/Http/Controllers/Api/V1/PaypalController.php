<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Resources\BookingResource;
use Illuminate\Http\Request;
use Srmklive\PayPal\Services\PayPal as PayPalClient;
use Symfony\Component\HttpFoundation\Response;

class PaypalController
{
    public function __construct() {}

    public function success($request, $booking)
    {
        $provider = new PayPalClient;
        $provider->setApiCredentials(config('paypal'));
        $paypalToken = $provider->getAccessToken();
        $response = $provider->capturePaymentOrder($request->token);

        if (isset($response['status']) && $response['status'] == 'COMPLETED') {
            $repositoryBooking = customRepository('bookings');
            $payload['payment_status'] = 'confirm';
            $repositoryBooking->update($booking->id, $payload);
            return response()->json([
                'bookings' => new BookingResource($booking),
            ], Response::HTTP_OK);
        }
    }
    public function cancel()
    {
        echo 'Hủy thanh toán thành công';
        die();
    }
}
