<?php

namespace App\Services;

use App\Services\BaseService;
use Illuminate\Support\Facades\DB;
use App\Enums\Status;


class DashboardService extends BaseService
{
    public function __construct() {}

    public function sort($request)
    {
        DB::beginTransaction();
        try {
            $post = $request->only(['id', 'model', 'value']);
            $payload['order'] = (int)$post['value'];
            $model = loadClass($post['model'], 'Repository');
            if (class_exists($model)) {
                $modelIntance = app($model);
                $modelIntance->update($post['id'], $payload);
                DB::commit();
                return [
                    'code' => Status::SUCCESS
                ];
            } else {
                return [
                    'code' => Status::ERROR,
                    'message' => 'Network Error'
                ];
            }
        } catch (\Exception $e) {
            DB::rollBack();
            return [
                'code' => Status::ERROR,
                'message' => $e->getMessage()
            ];
        }
    }
}
