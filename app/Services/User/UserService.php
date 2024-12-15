<?php

namespace App\Services\User;

use App\Services\BaseService;
use App\Repositories\User\UserRepository;
use Illuminate\Support\Facades\DB;
use App\Classes\FileUploader;

class UserService extends BaseService
{
    protected $userRepository;
    protected $fileUploader;
    public function __construct(
        UserRepository $userRepository,
        FileUploader $fileUploader
    ) {
        $this->userRepository = $userRepository;
        $this->fileUploader = $fileUploader;
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

    public function create($request, $user)
    {
        DB::beginTransaction();
        try {
            $payload = $request->except(['re_password', 'image']);
            $payload['image'] = $this->fileUploader->upload($request, $user);

            // DB::commit();
            return $payload;
        } catch (\Exception $e) {
            DB::rollBack();
            return [
                'code' => 'ERROR',
                'message' => $e->getMessage()
            ];
        }
    }
}
