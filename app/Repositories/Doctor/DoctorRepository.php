<?php

namespace App\Repositories\Doctor;

use App\Repositories\BaseRepository;
use App\Models\Doctor;

class DoctorRepository extends BaseRepository
{
    protected $model;
    public function __construct(
        Doctor $model
    ) {
        $this->model = $model;
    }
}
