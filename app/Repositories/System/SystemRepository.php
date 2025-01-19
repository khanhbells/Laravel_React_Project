<?php

namespace App\Repositories\System;

use App\Repositories\BaseRepository;
use App\Models\System;

class SystemRepository extends BaseRepository
{
    protected $model;
    public function __construct(
        System $model
    ) {
        $this->model = $model;
    }
}
