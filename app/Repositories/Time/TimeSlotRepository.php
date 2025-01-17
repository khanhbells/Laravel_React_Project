<?php

namespace App\Repositories\Time;

use App\Repositories\BaseRepository;
use App\Models\TimeSlot;

class TimeSlotRepository extends BaseRepository
{
    protected $model;
    public function __construct(
        TimeSlot $model
    ) {
        $this->model = $model;
    }
}
