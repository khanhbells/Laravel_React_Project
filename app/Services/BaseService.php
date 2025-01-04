<?php

namespace App\Services;

use Illuminate\Support\Facades\DB;
use App\Classes\FileUploader;
use Illuminate\Support\Facades\File;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Str;

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
            $payload['user_id'] = $auth->id;
        }
        if ($request->input('password') && !empty($request->input('password'))) {
            $payload['password'] = Hash::make($payload['password']);
        }

        if ($request->input('canonical') && !empty($request->input('canonical'))) {
            $payload['canonical'] = Str::slug($payload['canonical']);
        }

        $payload['album'] = $this->makeAlbum($request, $auth, $customFolder);
        return $payload;
    }

    private function makeAlbum($request, $auth, $customFolder)
    {
        if ($request->input('album') && !empty($request->input('album'))) {
            $album = explode(',', $request->input('album'));
            $temp = [];
            if (isset($album) && count($album)) {
                foreach ($album as $key => $val) {
                    $imageName = basename($val);
                    $emailPrefix = Str::before($auth->email, '@');
                    $sourcePath = public_path('tempotary/' . $emailPrefix . '/', $imageName);
                    $destinationPath = storage_path('app/public');

                    if (isset($customFolder) && count($customFolder)) {
                        $destinationPath .= '/' . $emailPrefix . '/' . 'image' . '/' . implode('/', $customFolder);
                    }

                    if (!File::exists($destinationPath)) {
                        File::makeDirectory($destinationPath, 0755, true);
                    }

                    $destinationFile = $destinationPath . '/' . $imageName;
                    if (File::exists($sourcePath)) {
                        File::move($sourcePath, $destinationFile);
                    }
                    $temp[] = 'public/storage/' . $emailPrefix . '/' . 'image' . '/' . implode('/', $customFolder) . '/' . $imageName;
                }
            }

            return $temp;
        }
    }

    protected function nestedset($auth, $nested)
    {
        $nested->Get();
        $nested->Recursive(0, $nested->Set());
        $nested->Action($auth);
    }
}
