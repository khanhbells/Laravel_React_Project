<?php

namespace App\Repositories\Hospital;

use App\Repositories\BaseRepository;
use App\Models\Hospital;

class HospitalRepository extends BaseRepository
{
    protected $model;
    public function __construct(
        Hospital $model
    ) {
        $this->model = $model;
    }
}
