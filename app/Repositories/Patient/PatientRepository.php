<?php

namespace App\Repositories\Patient;

use App\Repositories\BaseRepository;
use App\Models\Patient;

class PatientRepository extends BaseRepository
{
    protected $model;
    public function __construct(
        Patient $model
    ) {
        $this->model = $model;
    }
}
