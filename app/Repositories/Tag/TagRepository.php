<?php

namespace App\Repositories\Tag;

use App\Repositories\BaseRepository;
use App\Models\Tag;

class TagRepository extends BaseRepository
{
    protected $model;
    public function __construct(
        Tag $model
    ) {
        $this->model = $model;
    }
}
