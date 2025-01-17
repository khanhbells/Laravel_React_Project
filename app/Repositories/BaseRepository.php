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
        $query = $this->model->newQuery();
        $query->select($params['select'])
            ->condition($params['condition'] ?? [])
            ->keyword($params['keyword'] ?? '')
            ->relationWith($params['relations'] ?? [])
            ->relationWhereHas($params['whereHas'] ?? [])
            ->relationCount($params['relationCount'] ?? [])
            ->orderBy($params['orderBy'][0], $params['orderBy'][1]);

        // return $query->toSql();
        if ($params['perpage']) {
            return $query->paginate($params['perpage']);
        }
        return $query->get();
    }

    public function create($payload = [])
    {
        return $this->model->create($payload);
    }

    public function createMany($payload = [])
    {

        return $this->model->insert($payload);
        // return 
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
        $relation = [],
        $column = ['*'],

    ) {
        return $this->model->select($column)->with($relation['relations'] ?? [])->find($modelId);
    }

    public function findByCondition(
        $condition = [],
        $flag = false,
        $relation = [],
        array $orderBy = ['id', 'desc'],
        array $param = [],
        array $withCount = []
    ) {
        $query = $this->model->newQuery();
        foreach ($condition as $key => $val) {
            $query->where($val[0], $val[1], $val[2]);
        }

        if (isset($param['whereIn'])) {
            $query->whereIn($param['whereInField'], $param['whereIn']);
        }

        $query->with($relation);
        $query->withCount($withCount);
        $query->orderBy($orderBy[0], $orderBy[1]);
        return ($flag == false) ? $query->first() : $query->get();
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
