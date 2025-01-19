<?php

namespace App\Services\System;

use App\Services\BaseService;
use App\Repositories\System\SystemRepository;
use Illuminate\Support\Facades\DB;
use App\Enums\Status;


class SystemService extends BaseService
{
    protected $systemRepository;
    protected $files = [
        'homepage_favicon',
        'homepage_logon',
        'seo_meta_images'
    ];

    public function __construct(
        SystemRepository $systemRepository,
    ) {
        $this->systemRepository = $systemRepository;
    }

    public function paginate($request)
    {
        $agrument = $this->paginateAgrument($request);
        $systems = $this->systemRepository->pagination([...$agrument]);
        // dd($systems);
        return $systems;
    }

    private function paginateAgrument($request)
    {
        return [
            'perpage' => $request->input('perpage') ?? 30,
            'keyword' => [
                'search' => $request->input('keyword') ?? '',
                'field' => ['name']
            ],
            'condition' => [
                'publish' => $request->integer('publish'),
            ],
            'select' => ['*'],
            'orderBy' => $request->input('sort') ? explode(',', $request->input('sort')) : ['id', 'desc'],
        ];
    }

    public function create($request, $auth)
    {
        DB::beginTransaction();
        try {
            $except = [];
            $config = $this->initializePayload($request, $except)->processFiles($request, $auth, $this->files)->getPayload();
            $payload = [];
            if (count($config)) {
                foreach ($config as $key => $val) {
                    if (strpos($val, "[object FileList]") === 0) {
                        continue;
                    }
                    $payload = [
                        'keyword' => $key,
                        'content' => $val,
                        'user_id' => $auth->id,
                    ];
                    $condition = ['keyword' => $key];
                    $this->systemRepository->updateOrInsert($payload, $condition);
                }
            }

            DB::commit();
            return [
                'system' => "Cập nhật dữ liệu thành công",
                'code' => Status::SUCCESS
            ];
        } catch (\Exception $e) {
            DB::rollBack();
            return [
                'code' => Status::ERROR,
                'message' => $e->getMessage()
            ];
        }
    }

    public function update($request, $id)
    {
        DB::beginTransaction();
        try {
            $except = [];
            $payload = $this->initializePayload($request, $except)->processCanonical()->getPayload();
            $system = $this->systemRepository->update($id, $payload);
            // dd($system);
            DB::commit();
            return [
                'system' => $system,
                'code' => Status::SUCCESS
            ];
        } catch (\Exception $e) {
            DB::rollBack();
            return [
                'code' => Status::ERROR,
                'message' => $e->getMessage()
            ];
        }
    }

    public function delete($id)
    {
        DB::beginTransaction();
        try {
            $this->systemRepository->delete($id);
            DB::commit();
            return [
                'code' => Status::SUCCESS
            ];
        } catch (\Exception $e) {
            DB::rollBack();
            return [
                'code' => Status::ERROR,
                'message' => $e->getMessage()
            ];
        }
    }
}
