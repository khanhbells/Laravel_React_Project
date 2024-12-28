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
    public function pagination($params = [])
    {
        return $this->model
            ->select($params['select'])
            ->condition($params['condition'] ?? [])
            ->keyword($params['keyword'] ?? '')
            ->orderBy($params['orderBy'][0], $params['orderBy'][1])
            ->paginate($params['perpage']);
    }

    public function create($payload = [])
    {
        return $this->model->create($payload);
    }

    public function update($id, $payload)
    {
        $model = $this->findById($id);
        $model->fill($payload);

        $model->save();
        return $model;
    }

    public function delete($id)
    {
        return $this->findById($id)->delete($id);
    }

    public function findById(
        $modelId,
        $column = ['*'],
        $relation = []
    ) {
        return $this->model->select($column)->with($relation)->find($modelId);
    }

    public function deleteBatch($ids = [])
    {
        return $this->model->whereIn('id', $ids)->delete();
    }

    public function updateBatch($payload = [], $whereIn = [], $condition = [])
    {
        return $this->model->whereIn($whereIn['whereInField'], $whereIn['whereInValue'])->update($payload);
    }

    public function all($select = ['*'])
    {
        return $this->model->all($select);
    }

    public function findByParentId($parentId, $field, $select)
    {
        return $this->model->where($field, '=', $parentId)->get($select);
    }
}
