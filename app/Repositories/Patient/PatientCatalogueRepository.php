<?php

namespace App\Repositories\Patient;

use App\Repositories\BaseRepository;
use App\Models\PatientCatalogue;

class PatientCatalogueRepository extends BaseRepository
{
    protected $model;
    public function __construct(
        PatientCatalogue $model
    ) {
        $this->model = $model;
    }
}
