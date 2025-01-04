<?php

namespace App\Http\Controllers\Api\V1;

use App\Enums\Status;
use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\File;
use Symfony\Component\HttpFoundation\Response;
use Illuminate\Support\Str;
use Illuminate\Support\Facades\Storage;

class UploadController extends Controller
{


    public function __construct() {}

    public function uploadToTempotary(Request $request)
    {
        try {
            // sleep(3);
            $auth = auth()->user();
            $emailPrefix = Str::before($auth->email, '@');


            $tempotaryPath = public_path('tempotary/' . strtolower($emailPrefix));

            if (!File::exists($tempotaryPath)) {
                File::makeDirectory($tempotaryPath, 0755, true);
            }

            $image = $request->file('image');

            $fileName = Str::uuid() . '.' . $image->clientExtension();
            $image->move($tempotaryPath, $fileName);

            return response()->json([
                'url' => asset('tempotary/' . strtolower($emailPrefix) . '/' . $fileName),
                'code' => Status::SUCCESS,
                'message' => 'Upload thành công'
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'code' => Status::ERROR,
                'message' => $e->getMessage()
            ], Response::HTTP_INTERNAL_SERVER_ERROR);
        }
    }

    public function uploadCkeditor(Request $request)
    {
        try {
            $auth = auth()->user();
            $emailPrefix = Str::before($auth->email, '@');
            $contentFolderPath = storage_path('app/public/' . $emailPrefix . '/image/content');
            if (!File::exists($contentFolderPath)) {
                File::makeDirectory($contentFolderPath, 0755, true);
            }

            if ($request->hasFile('image')) {
                $file = $request->file('image');
                $fileName = Str::uuid() . '.' . $file->clientExtension();
                $filePath =  $contentFolderPath;
                $file->move($filePath, $fileName);
                $url =  config('app.url') . 'storage' . '/' . $emailPrefix . '/image/content/' . $fileName;
                return response()->json([
                    'url' => $url,
                    'code' => Status::SUCCESS,
                    'message' => 'Upload hình ảnh thành công vào CKEDITOR'
                ]);
            }
        } catch (\Exception $e) {
            return response()->json([
                'code' => Status::ERROR,
                'message' => $e->getMessage()
            ], Response::HTTP_INTERNAL_SERVER_ERROR);
        }
    }

    public function deleteCkeditor(Request $request)
    {

        try {
            $url = $request->input('url');
            $relativePath = str_replace('/storage/', '', parse_url($url, PHP_URL_PATH));

            if (Storage::disk('public')->exists($relativePath)) {
                Storage::disk('public')->delete($relativePath);
                return response()->json([
                    'code' => Status::SUCCESS,
                    'message' => 'Xóa ảnh khỏi Ckeditor thành công'
                ]);
            }
        } catch (\Exception $e) {
            return response()->json([
                'code' => Status::ERROR,
                'message' => $e->getMessage()
            ], Response::HTTP_INTERNAL_SERVER_ERROR);
        }
    }
}
