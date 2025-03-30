<?php

namespace App\Repositories\Gemini;

use App\Repositories\BaseRepository;
use App\Models\Gemini;

class GeminiRepository extends BaseRepository
{
    protected $model;
    public function __construct(
        Gemini $model
    ) {
        $this->model = $model;
    }
}
