<?php

namespace App\Repositories\Medicine;

use App\Repositories\BaseRepository;
use App\Models\MedicineCatalogue;

class MedicineCatalogueRepository extends BaseRepository
{
    protected $model;
    public function __construct(
        MedicineCatalogue $model
    ) {
        $this->model = $model;
    }
}
