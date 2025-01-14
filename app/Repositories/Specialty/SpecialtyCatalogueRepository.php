<?php

namespace App\Repositories\Specialty;

use App\Repositories\BaseRepository;
use App\Models\SpecialtyCatalogue;

class SpecialtyCatalogueRepository extends BaseRepository
{
    protected $model;
    public function __construct(
        SpecialtyCatalogue $model
    ) {
        $this->model = $model;
    }
}
