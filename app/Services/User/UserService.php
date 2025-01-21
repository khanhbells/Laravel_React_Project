<?php

namespace App\Services\User;

use App\Services\BaseService;
use App\Repositories\User\UserRepository;
use App\Repositories\Doctor\DoctorRepository;
use Illuminate\Support\Facades\DB;
use App\Enums\Status;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Str;

class UserService extends BaseService
{
    protected $userRepository;
    protected $doctorRepository;
    protected $files = ['image'];

    public function __construct(
        UserRepository $userRepository,
        DoctorRepository $doctorRepository,
    ) {
        $this->userRepository = $userRepository;
        $this->doctorRepository = $doctorRepository;
    }

    public function paginate($request, $auth)
    {
        $agrument = $this->paginateAgrument($request, $auth);
        $users = $this->userRepository->pagination([...$agrument]);
        return $users;
    }

    private function paginateAgrument($request, $auth)
    {
        $condition = [
            'publish' => $request->integer('publish'),
            'user_catalogue_id' => $request->integer('user_catalogue_id'),
        ];

        // Nếu $auth->user_catalogue_id == 2, thêm điều kiện 'id'
        if (isset($auth) && $auth->user_catalogue_id == 2) {
            $condition['id'] = $auth->id;
        }
        return [
            'perpage' => $request->input('perpage') ?? 10,
            'keyword' => [
                'search' => $request->input('keyword') ?? '',
                'field' => ['name', 'email', 'address', 'phone']
            ],
            'condition' => $condition,
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
            if ($user && $user->user_catalogue_id == 2) {
                $payloadDoctor = [
                    'user_id' => $user->id,
                    'canonical' => Str::slug($user->name)
                ];
                $this->doctorRepository->create($payloadDoctor);
            }
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
