<?php

namespace App\Repositories\Schedule;

use App\Repositories\BaseRepository;
use App\Models\Schedule;

class ScheduleRepository extends BaseRepository
{
    protected $model;
    public function __construct(
        Schedule $model
    ) {
        $this->model = $model;
    }
}
