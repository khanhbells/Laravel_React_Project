<?php

namespace App\Http\Controllers\Api\V1;

use App\Enums\Status;
use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\File;
use Symfony\Component\HttpFoundation\Response;
use Illuminate\Support\Str;

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
}
