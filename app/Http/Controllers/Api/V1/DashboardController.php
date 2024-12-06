<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Symfony\Component\HttpFoundation\Response;
use Illuminate\Support\Str;

class DashboardController extends Controller
{
    public function __construct() {}

    public function deleteBatch(Request $request)
    {
        DB::beginTransaction();
        try {
            $ids = $request->input('ids');
            $model = $request->input('model');
            if (!is_array($ids) || count($ids) == 0) {
                return response()->json([
                    'error' => 'Danh sách id không hợp lệ'
                ], Response::HTTP_BAD_REQUEST);
            }
            // Singular xóa chữ s ở cuối chuỗi
            // Studly viết hoa chữ cái đầu
            $singularModel = Str::singular($model);
            $modelClass = Str::studly($singularModel);
            $folder = Str::studly(current(explode('_', $singularModel)));

            $repository = "App\Repositories\\{$folder}\\{$modelClass}Repository";
            $repository = app($repository);

            $deletedCount = $repository->deleteMultiple($ids);

            DB::commit();

            return response()->json([
                'message' => "Đã xóa thành công {$deletedCount} bản ghi"
            ], Response::HTTP_OK);
        } catch (\Exception $e) {
            DB::rollBack();
            return response()->json(['error' => 'Có vấn đề xảy ra'], Response::HTTP_INTERNAL_SERVER_ERROR);
        }
    }
}
