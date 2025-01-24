<?php

namespace App\Repositories\Booking;

use App\Repositories\BaseRepository;
use App\Models\Booking;

class BookingRepository extends BaseRepository
{
    protected $model;
    public function __construct(
        Booking $model
    ) {
        $this->model = $model;
    }
}
