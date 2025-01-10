<?php

namespace App\Services\User;

use App\Services\BaseService;
use App\Repositories\User\UserCatalogueRepository;
use Illuminate\Support\Facades\DB;
use App\Enums\Status;


class UserCatalogueService extends BaseService
{
    protected $userCatalogueRepository;
    public function __construct(
        UserCatalogueRepository $userCatalogueRepository,
    ) {
        $this->userCatalogueRepository = $userCatalogueRepository;
    }

    public function paginate($request)
    {
        $agrument = $this->paginateAgrument($request);
        $userCatalogues = $this->userCatalogueRepository->pagination([...$agrument]);
        // dd($userCatalogues);
        return $userCatalogues;
    }

    private function paginateAgrument($request)
    {
        return [
            'perpage' => $request->input('perpage') ?? 10,
            'keyword' => [
                'search' => $request->input('keyword') ?? '',
                'field' => ['name', 'description']
            ],
            'condition' => [
                'publish' => $request->integer('publish'),
                // 'user_catalogue_id' => $request->integer('user_catalogue_id'),
            ],
            'relationCount' => ['users'],
            // 'relations' => ['users'],
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
            $except = ['id'];
            $payload = $this->initializeRequest($request, $except);
            $userCatalogue = $this->userCatalogueRepository->create($payload);

            DB::commit();
            return [
                'userCatalogue' => $userCatalogue,
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
            $except = ['user_counts', 'id'];
            $payload = $this->initializeRequest($request, $except);
            $userCatalogue = $this->userCatalogueRepository->update($id, $payload);
            // dd($userCatalogue);
            DB::commit();
            return [
                'userCatalogue' => $userCatalogue,
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

    public function updatePermission($request)
    {
        DB::beginTransaction();
        try {
            $except = [];
            $payload = $this->initializePayload($request, $except)->getPayload();

            $userCatalogue = $this->userCatalogueRepository->findById($payload['userCatalogueId']);
            $permissionId = $payload['permissionId'];
            $status = $payload['status'];

            if ($status) {
                // Kiểm tra xem mối quan hệ đã tồn tại chưa trước khi thêm
                if (!$userCatalogue->permissions()->where('permission_id', $permissionId)->exists()) {
                    $userCatalogue->permissions()->attach($permissionId);
                }
            } else {
                // Gỡ bỏ mối quan hệ nếu tồn tại
                if ($userCatalogue->permissions()->where('permission_id', $permissionId)->exists()) {
                    $userCatalogue->permissions()->detach($permissionId);
                }
            }

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

    public function delete($id)
    {
        DB::beginTransaction();
        try {
            $this->userCatalogueRepository->delete($id);
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
