<?php

namespace App\Traits;

trait QueryTrait
{
    public function scopeCondition($query, $condition)
    {
        if (isset($condition) && is_array($condition) && count($condition)) {
            foreach ($condition as $key => $val) {
                if ($val !== 0) {
                    $query->where($key, $val);
                }
            }
        }
        return $query;
    }

    public function scopeKeyword($query, $keyword)
    {
        if (isset($keyword) && is_array($keyword) && count($keyword)) {
            if (!empty($keyword['search'])) {
                if (count($keyword['field'])) {
                    $query->where(function ($subQuery) use ($keyword) {
                        foreach ($keyword['field'] as $key => $val) {
                            $subQuery->orWhere($val, 'LIKE', '%' . $keyword['search'] . '%');
                        }
                    });
                } else {
                    $query->where('name', 'LIKE', '%' . $keyword['search'] . '%');
                }
            }
        }
        return $query;
    }
    public function scopeRelationCount($query, $relationCount)
    {
        if (isset($relationCount) && is_array($relationCount) && count($relationCount)) {
            $query->withCount($relationCount);
        }
        return $query;
    }
    public function scopeRelation($query, $relation)
    {
        if (isset($relation) && is_array($relation) && count($relation)) {
            $query->with($relation);
        }
        return $query;
    }

    public function scopeRelationWhereHas($query, $whereHas)
    {
        if (isset($whereHas) && is_array($whereHas) && count($whereHas)) {
            foreach ($whereHas as $relation => $conditions) {
                if (is_array($conditions)) {
                    foreach ($conditions as $callback) {
                        $query->whereHas($relation, $callback);
                    }
                } else if (is_callable($conditions)) {
                    $query->whereHas($relation, $conditions);
                }
            }
        }
        return $query;
    }

    public function scopeRelationWith($query, $relations)
    {
        if (isset($relations) && count($relations)) {
            foreach ($relations as $key => $value) {
                $query->with($value);
            }
        }
    }

    public function scopeInnerJoin($query, $join)
    {
        if (!empty($join)) {
            foreach ($join as $key => $val) {
                $query->join($val[0], $val[1], $val[2], $val[3]);
            }
        }
        return $query;
    }
}
