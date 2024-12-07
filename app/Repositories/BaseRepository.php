<?php

namespace App\Repositories;

use App\Services\BaseService;
use Illuminate\Database\Eloquent\Model;

class BaseRepository
{
    protected $model;
    public function __construct(
        Model $model
    ) {
        $this->model = $model;
    }
    public function pagination()
    {
        return $this->model->paginate(10);
    }

    public function update($id, $payload)
    {
        $model = $this->findById($id);
        $model->fill($payload);
        $model->save();
        return $model;
    }

    public function findById(
        $modelId,
        $column = ['*'],
        $relation = []
    ) {
        return $this->model->select($column)->with($relation)->findOrFail($modelId);
    }

    public function deleteBatch($ids = [])
    {
        return $this->model->whereIn('id', $ids)->delete();
    }

    public function updateBatch($payload = [], $whereIn = [], $condition = [])
    {
        return $this->model->whereIn($whereIn['whereInField'], $whereIn['whereInValue'])->update($payload);
    }
}
