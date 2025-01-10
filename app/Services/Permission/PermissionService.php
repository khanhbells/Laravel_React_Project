<?php

namespace App\Services\Permission;

use App\Services\BaseService;
use App\Repositories\Permission\PermissionRepository;
use Illuminate\Support\Facades\DB;
use App\Enums\Status;


class PermissionService extends BaseService
{
    protected $permissionRepository;
    public function __construct(
        PermissionRepository $permissionRepository,
    ) {
        $this->permissionRepository = $permissionRepository;
    }

    public function paginate($request)
    {
        $agrument = $this->paginateAgrument($request);
        $permissions = $this->permissionRepository->pagination([...$agrument]);
        // dd($permissions);
        return $permissions;
    }

    private function paginateAgrument($request)
    {
        return [
            'perpage' => $request->input('perpage') ?? 10,
            'keyword' => [
                'search' => $request->input('keyword') ?? '',
                'field' => ['name']
            ],
            'condition' => [
                'publish' => $request->integer('publish'),
            ],
            // 'relationCount' => ['posts'],
            'select' => ['*'],
            'orderBy' => $request->input('sort') ? explode(',', $request->input('sort')) : ['id', 'desc'],
        ];
    }

    private function initializeRequest($request, $except)
    {
        return $this->initializePayload($request, $except)
            ->getPayload();
    }

    public function create($request)
    {
        DB::beginTransaction();
        try {
            $except = [];
            $payload = $this->initializePayload($request, $except)->getPayload();
            $permission = $this->permissionRepository->create($payload);

            DB::commit();
            return [
                'permission' => $permission,
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
            $payload = $this->initializePayload($request, $except)->getPayload();
            $permission = $this->permissionRepository->update($id, $payload);
            // dd($permission);
            DB::commit();
            return [
                'permission' => $permission,
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
            $this->permissionRepository->delete($id);
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
