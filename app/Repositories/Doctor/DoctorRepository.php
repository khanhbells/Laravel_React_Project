<?php

namespace App\Repositories\Doctor;

use App\Repositories\BaseRepository;
use App\Models\Doctor;

class DoctorRepository extends BaseRepository
{
    protected $model;
    public function __construct(
        Doctor $model
    ) {
        $this->model = $model;
    }

    public function pagination($params = [])
    {
        $query = $this->model->newQuery();
        $query->select($params['select'])
            ->condition($params['condition'] ?? [])
            ->keyword($params['keyword'] ?? '')
            ->relationWhereHas($params['whereHas'] ?? [])
            ->relationCount($params['relationCount'] ?? [])
            ->orderBy($params['orderBy'][0], $params['orderBy'][1])
            ->innerJoin($params['join'] ?? []);
        if (isset($params['relations']) && count($params['relations'])) {
            $query->with($params['relations']);
        }
        if ($params['perpage']) {
            return $query->paginate($params['perpage']);
        }
        return $query->get();
    }
}
