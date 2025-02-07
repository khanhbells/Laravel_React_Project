<?php

namespace App\Repositories\Medicine;

use App\Repositories\BaseRepository;
use App\Models\Medicine;

class MedicineRepository extends BaseRepository
{
    protected $model;
    public function __construct(
        Medicine $model
    ) {
        $this->model = $model;
    }
}
