<?php

namespace App\Services\User;

use App\Services\BaseService;
use App\Repositories\User\UserRepository;
use Illuminate\Support\Facades\DB;
use App\Enums\Status;
use Illuminate\Support\Facades\Hash;

class UserService extends BaseService
{
    protected $userRepository;
    protected $files = ['image'];

    public function __construct(
        UserRepository $userRepository,
    ) {
        $this->userRepository = $userRepository;
    }

    public function paginate($request)
    {
        $agrument = $this->paginateAgrument($request);

        $users = $this->userRepository->pagination([...$agrument]);
        return $users;
    }

    private function paginateAgrument($request)
    {
        return [
            'perpage' => $request->input('perpage') ?? 10,
            'keyword' => [
                'search' => $request->input('keyword') ?? '',
                'field' => ['name', 'email', 'address', 'phone']
            ],
            'condition' => [
                'publish' => $request->integer('publish'),
                'user_catalogue_id' => $request->integer('user_catalogue_id'),
            ],
            'select' => ['*'],
            'orderBy' => $request->input('sort') ? explode(',', $request->input('sort')) : ['id', 'desc'],
            'relations' => ['user_catalogues']
        ];
    }

    protected function hashPassword($request)
    {
        if ($request->input('password')) {
            $this->payload['password'] = Hash::make($this->payload['password']);
        }
        return $this;
    }

    private function initializeRequest($request, $except, $auth)
    {
        return $this->initializePayload($request, $except)
            ->processFiles($request, $auth, $this->files)
            ->hashPassword($request)
            ->getPayload();
    }

    public function create($request, $auth)
    {
        DB::beginTransaction();
        try {
            $except = ['confirmPassword', 'id'];
            $payload = $this->initializeRequest($request, $except, $auth);

            $user = $this->userRepository->create($payload);

            DB::commit();
            return [
                'user' => $user,
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

    public function update($request, $id, $auth)
    {
        DB::beginTransaction();
        try {
            $except = ['confirmPassword', 'id'];
            $payload = $this->initializeRequest($request, $except, $auth);

            $user = $this->userRepository->update($id, $payload);
            // dd($user);
            DB::commit();
            return [
                'user' => $user,
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
            $this->userRepository->delete($id);
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
