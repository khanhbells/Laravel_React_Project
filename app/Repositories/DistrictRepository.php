<?php

namespace App\Repositories;

use App\Repositories\BaseRepository;
use App\Models\District;

class DistrictRepository extends BaseRepository
{
    protected $model;
    public function __construct(
        District $model
    ) {
        $this->model = $model;
    }

    // public function findDistrictByParentId(){
    //     return $this->model->where()
    // }
}
