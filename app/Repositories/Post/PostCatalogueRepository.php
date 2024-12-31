<?php

namespace App\Repositories\Post;

use App\Repositories\BaseRepository;
use App\Models\PostCatalogue;

class PostCatalogueRepository extends BaseRepository
{
    protected $model;
    public function __construct(
        PostCatalogue $model
    ) {
        $this->model = $model;
    }
}
