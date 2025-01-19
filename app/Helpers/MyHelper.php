<?php

use Illuminate\Support\Str;

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

// tác dụng của studly chuyển chuỗi thành kiểu chữ "StudlyCase" (còn gọi là PascalCase), trong đó mỗi từ bắt đầu bằng chữ cái viết hoa và không có dấu gạch dưới hoặc khoảng trắng.
// tác dụng của singular chuyển đổi một chuỗi từ số nhiều (plural) thành số ít (singular).
