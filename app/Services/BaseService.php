<?php

namespace App\Services;

use Illuminate\Support\Facades\DB;
use App\Classes\FileUploader;
use Illuminate\Support\Facades\Hash;

class BaseService
{
    protected $fileUploader;
    public function __construct() {}
    public function updateByField($request, $id, $respository)
    {
        DB::beginTransaction();
        try {
            $column = $request->input('column');
            $value = $request->input('value');
            $payload[$column] = $value === true ? 2 : 1;
            $respository = app($respository);
            $modelCollection = $respository->update($id, $payload);
            DB::commit();
            return true;
        } catch (\Exception $e) {
            DB::rollBack();
            return false;
        }
    }
    protected function request(
        $request,
        $auth = null,
        $except = [],
        $files = ['image'],
        $customFolder = ['avatar'],
        $imageType = 'image',

    ) {
        $payload = $request->except(['_method', 'created_at', ...$except]);
        if ($auth != null) {
            if (count($files) && is_array($files)) {
                foreach ($files as $keyFile => $file) {
                    if ($request->file($file)) {

                        $this->fileUploader = new FileUploader($auth->email);
                        $payload[$file] = $this->fileUploader->uploadFile($request->file($file), $imageType, $customFolder);
                    } else {
                        if ($request->input($file)) {
                            $payload[$file] = str_replace(config('app.url') . 'storage', 'public', $payload[$file]);
                            // dd($payload['image']);
                        }
                    }
                }
            }
        }
        if ($request->input('password') && !empty($request->input('password'))) {
            $payload['password'] = Hash::make($payload['password']);
        }

        return $payload;
    }
}
