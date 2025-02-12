<?php

return [
    'app_id' => env('ZALOPAY_APP_ID'),  // App ID từ ZaloPay
    'key1' => env('ZALOPAY_KEY1'),      // Key1 để tạo chữ ký
    'key2' => env('ZALOPAY_KEY2'),      // Key2 dùng để xác minh
    'endpoint' => env('ZALOPAY_ENDPOINT', 'https://sandbox.zalopay.com.vn/v001/tpe/createorder'),
    'callback_url' => env('FRONTEND_URL') . 'homepage/success',
];
