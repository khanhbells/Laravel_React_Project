<?php

namespace App\Repositories\Permission;

use App\Repositories\BaseRepository;
use App\Models\Permission;

class PermissionRepository extends BaseRepository
{
    protected $model;
    public function __construct(
        Permission $model
    ) {
        $this->model = $model;
    }
}
