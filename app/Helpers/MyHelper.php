<?php

use Illuminate\Support\Str;

if (!function_exists('growth')) {
    function growth($currentValue, $previousValue)
    {
        if ($previousValue == 0) {
            return ($currentValue > 0) ? 100 : 0; // Nếu có đơn hàng thì 100%, còn không thì 0%
        }

        $grow = ($currentValue - $previousValue) / $previousValue * 100;
        return number_format($grow, 0);
    }
}

if (!function_exists('getImages')) {
    function getImages($image, ?string $thumb = null)
    {
        if (strpos($image, 'image')) {
            $newImage = str_replace('public', 'storage', $image);
            if ($thumb) {
                $newImage = str_replace('image', 'thumb', $newImage);
            }
            $basename = basename($newImage); //lay moi ten anh
            $thumbName = (($thumb) ? $thumb . '_' : '') . $basename;
            $newImage = str_replace($basename, $thumbName, $newImage);

            return (!empty($newImage)) ? config('app.url') . $newImage : null;
        }
        return $image;
    }
}
if (!function_exists('loadClass')) {
    function loadClass($model, $classType, $isSubFolder = true)
    {
        $folder = [
            'Repository' => 'Repositories',
            'Service' => 'Services'
        ];
        //VD:post_catalogues => PostCatalogue
        $name =  Str::studly(Str::singular($model));
        $subFolder = Str::studly(Str::singular(current(explode('_', $model))));
        $className = $isSubFolder ? "App\\{$folder[$classType]}\\{$subFolder}\\{$name}{$classType}"
            : "App\{$folder[$classType]}\\{$name}{$classType}";

        return $className;
    }
}

if (!function_exists('convert_price')) {
    function convert_price(mixed $price = '', $flag = false)
    {
        if ($price == null) {
            return 0;
        }
        return ($flag == false) ? str_replace('.', '', $price) : number_format($price, 0, ',', '.');
    }
}

if (!function_exists('convert_price')) {
    function convert_price(mixed $price = '', $flag = false)
    {
        if ($price == null) {
            return 0;
        }
        return ($flag == false) ? str_replace('.', '', $price) : number_format($price, 0, ',', '.');
    }
}

if (!function_exists('convertRevenueChartData')) {
    function convertRevenueChartData($chartData, $data = 'monthly_revenue', $label = 'month', $text = 'Tháng')
    {
        $newArray = [];
        if (!is_null($chartData) && count($chartData)) {
            foreach ($chartData as $key => $val) {
                $newArray['data'][] = $val->{$data};
                $newArray['label'][] = $text != 'Giờ' ? $text . ' ' . $val->{$label} : $val->{$label};
            }
        }
        return $newArray;
    }
}

if (!function_exists('callRepository')) {
    function callRepository($model, $isFolder = true)
    {
        // Singular xóa chữ s ở cuối chuỗi
        // Studly viết hoa chữ cái đầu
        $singularModel = Str::singular($model);
        $modelClass = Str::studly($singularModel);
        $folder = Str::studly(current(explode('_', $singularModel)));

        $repository = $isFolder ? "App\Repositories\\{$folder}\\{$modelClass}Repository"
            : "App\Repositories\\{$modelClass}Repository";
        return $repository;
    }
}
if (!function_exists('customRepository')) {
    function customRepository($model)
    {
        $customRepository = app(callRepository($model));
        return $customRepository;
    }
}

if (!function_exists('vnpayConfig')) {
    function vnpayConfig($bookingId)
    {
        return [
            'vnp_Url' => 'https://sandbox.vnpayment.vn/paymentv2/vpcpay.html',
            'vnp_Returnurl' => url(env('FRONTEND_URL') . "homepage/success/{$bookingId}"),
            'vnp_TmnCode' => '18FMRWD4',
            'vnp_HashSecret' => 'I512616ZHQMGFMQF4EZ4L70WWUJ4YYLS',
            'vnp_apiUrl' => 'http://sandbox.vnpayment.vn/merchant_webapi/merchant.html',
            'apiUrl' => 'https://sandbox.vnpayment.vn/merchant_webapi/api/transaction'
        ];
    }
}

if (!function_exists('momoConfig')) {
    function momoConfig()
    {
        return [
            'partnerCode' => 'MOMOBKUN20180529',
            'accessKey' => 'klm05TvNBzhg7h7j',
            'secretKey' => 'at67qH6mk8w5Y1nAyMoYKMWACiEi2bsa'
        ];
    }
}

if (!function_exists('execPostRequest')) {
    function execPostRequest($url, $data)
    {
        $ch = curl_init($url);
        curl_setopt($ch, CURLOPT_CUSTOMREQUEST, "POST");
        curl_setopt($ch, CURLOPT_POSTFIELDS, $data);
        curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
        curl_setopt(
            $ch,
            CURLOPT_HTTPHEADER,
            array(
                'Content-Type: application/json',
                'Content-Length: ' . strlen($data)
            )
        );
        curl_setopt($ch, CURLOPT_TIMEOUT, 5);
        curl_setopt($ch, CURLOPT_CONNECTTIMEOUT, 5);
        //execute post
        $result = curl_exec($ch);
        //close connection
        curl_close($ch);
        return $result;
    }
}
// tác dụng của studly chuyển chuỗi thành kiểu chữ "StudlyCase" (còn gọi là PascalCase), trong đó mỗi từ bắt đầu bằng chữ cái viết hoa và không có dấu gạch dưới hoặc khoảng trắng.
// tác dụng của singular chuyển đổi một chuỗi từ số nhiều (plural) thành số ít (singular).
