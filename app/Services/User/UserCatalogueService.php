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
            // 'relation' => ['users'],
            'select' => ['*'],
            'orderBy' => $request->input('sort') ? explode(',', $request->input('sort')) : ['id', 'desc'],
        ];
    }

    public function create($request)
    {
        DB::beginTransaction();
        try {
            $except = [];
            $payload = $this->request($request);
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
            $except = ['user_counts'];
            $payload = $this->request($request);
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
