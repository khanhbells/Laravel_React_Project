<?php

namespace App\Services\User;

use App\Services\BaseService;
use App\Repositories\User\UserRepository;
use Illuminate\Support\Facades\DB;
use App\Classes\FileUploader;
use App\Enums\Status;
use Illuminate\Support\Facades\Hash;


class UserService extends BaseService
{
    protected $userRepository;
    protected $fileUploader;
    public function __construct(
        UserRepository $userRepository,
    ) {
        $this->userRepository = $userRepository;
    }

    public function paginate($request)
    {
        $agrument = $this->paginateAgrument($request);
        $users = $this->userRepository->pagination([...$agrument]);
        // dd($users);
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
                // 'user_catalogue_id' => $request->integer('user_catalogue_id'),
            ],
            'select' => ['*'],
            'orderBy' => $request->input('sort') ? explode(',', $request->input('sort')) : ['id', 'desc'],
        ];
    }

    public function create($request, $auth)
    {
        DB::beginTransaction();
        try {
            $payload = $this->request($request, $auth);


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
            $payload = $this->request($request, $auth);

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

    private function request($request, $auth)
    {

        $payload = $request->except(['re_password', '_method', 'created_at']);
        $customFolder = ['avatar'];
        if ($request->file('image')) {
            $imageType = 'image';
            $this->fileUploader = new FileUploader($auth->email);
            $payload['image'] = $this->fileUploader->uploadFile($request->file('image'), $imageType, $customFolder);
        } else {
            $payload['image'] = str_replace(config('app.url') . 'storage', 'public', $payload['image']);
        }
        if ($request->input('password') && !empty($request->input('password'))) {
            $payload['password'] = Hash::make($payload['password']);
        }
        $payload['publish'] = 1;
        return $payload;
    }
}
