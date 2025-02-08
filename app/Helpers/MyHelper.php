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

// tác dụng của studly chuyển chuỗi thành kiểu chữ "StudlyCase" (còn gọi là PascalCase), trong đó mỗi từ bắt đầu bằng chữ cái viết hoa và không có dấu gạch dưới hoặc khoảng trắng.
// tác dụng của singular chuyển đổi một chuỗi từ số nhiều (plural) thành số ít (singular).
