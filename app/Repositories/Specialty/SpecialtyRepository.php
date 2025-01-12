<?php

namespace App\Repositories\Specialty;

use App\Repositories\BaseRepository;
use App\Models\Specialty;

class SpecialtyRepository extends BaseRepository
{
    protected $model;
    public function __construct(
        Specialty $model
    ) {
        $this->model = $model;
    }
}
