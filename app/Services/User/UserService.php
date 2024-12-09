<?php

namespace App\Services\User;

use App\Services\BaseService;
use App\Repositories\User\UserRepository;



class UserService extends BaseService
{
    protected $userRepository;
    public function __construct(
        UserRepository $userRepository
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
}
