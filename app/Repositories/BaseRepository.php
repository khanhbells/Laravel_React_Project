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
            ->findByCondition($params['findByCondition'] ?? [])
            ->keyword($params['keyword'] ?? '')
            ->relationWith($params['relations'] ?? [])
            ->relationWhereHas($params['whereHas'] ?? [])
            // ->rightJoin(is_array($params['rightJoin']) ? $params['rightJoin'] : [])
            ->relationCount($params['relationCount'] ?? [])
            ->orderBy($params['orderBy'][0], $params['orderBy'][1]);
            

        if (!empty($params['limit'])) {
            $query->limit($params['limit']);
        }

        if (!empty($params['innerJoin']) && is_array($params['innerJoin'])){

            foreach ($params['innerJoin'] as $val) {
                if (is_array($val) && count($val) >= 4) {
                    $query->join($val[0], $val[1], $val[2], $val[3]);
                }
            }
        }
        
        if (isset($params['perpage']) && !empty($params['perpage'])) {
            return $query->paginate($params['perpage']);
        }
        // dd($query->toSql());

        return $query->get();
    }

    public function create($payload = [])
    {
        return $this->model->create($payload);
    }

    public function createMany($payload = [])
    {
        $ids = [];

        foreach ($payload as $data) {
            $ids[] = $this->model->insertGetId($data);
        }

        return $this->model->whereIn('id', $ids)->get()->toArray();
    }

    public function update($id, $payload)
    {
        $model = $this->findById($id);
        $model->fill($payload);
        $model->save();
        return $model;
    }

    public function updateOrInsert(array $payload = [], array $condition = [])
    {
        return $this->model->updateOrInsert($condition, $payload);
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
    public function total()
    {
        return $this->model->count();
    }
}
