<?php

namespace App\Services\Test;

use Illuminate\Support\Facades\DB;
use App\Classes\FileUploader;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Facades\File;
use Illuminate\Support\Str;

class BaseService
{
    protected $fileUploader;
    protected $payload = [];
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
            ->relationCount($params['relationCount'] ?? [])
            ->orderBy($params['orderBy'][0], $params['orderBy'][1]);

        if (!empty($params['limit'])) {
            $query->limit($params['limit']);
        }
        // return $query->toSql();
        if (isset($params['perpage']) && !empty($params['perpage'])) {
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

    public function updateByField($request, $id, $respository)
    {
        DB::beginTransaction();
        try {
            $column = $request->input('column');
            $value = $request->input('value');
            $payload[$column] = $value === true ? 2 : 1;
            $respository = app($respository);
            $modelCollection = $respository->update($id, $payload);
            DB::commit();
            return true;
        } catch (\Exception $e) {
            DB::rollBack();
            return false;
        }
    }



    //Xử lý nhận và loại bỏ dữ liệu 
    protected function initializePayload($request, $except = [], $only = [])
    {
        if (count($only)) {
            $this->payload = $request->only([...$only]);
        } else {
            $this->payload = $request->except(['_method', 'created_at', ...$except]);
        }
        return $this;
    }

    //Xử lý thông tin user_id
    protected function handleUserId($auth = null)
    {
        if ($auth) {
            $this->payload['user_id'] = $auth->id;
        }
        return $this;
    }

    //Xử lý upload imageFile
    protected function processFiles(
        $request,
        $auth,
        $files = ['images'],
        $customFolder = ['avatar'],
        $imageType = 'image'
    ) {

        if ($auth && count($files) && is_array($files)) {
            if (isset($auth->email)) {

                $this->fileUploader = new FileUploader($auth->email);
            } else {
                $this->fileUploader = new FileUploader($auth);
            }

            foreach ($files as $keyFile => $file) {
                if ($request->file($file)) {

                    $this->payload[$file] = $this->fileUploader->uploadFile($request->file($file), $imageType, $customFolder);
                } else {

                    if ($request->input($file)) {
                        $this->payload[$file] = str_replace(config('app.url') . 'storage', 'public', $this->payload[$file]);
                    }
                }
            }
        }
        return $this;
    }

    //Xử lý đường dẫn
    protected function processCanonical()
    {
        $this->payload['canonical'] = Str::slug($this->payload['canonical']);
        return $this;
    }

    //Xử lý album
    protected function processAlbum($request, $auth, $customFolder)
    {
        if ($request->input('album') && !empty($request->input('album'))) {
            $album = explode(',', $request->input('album'));
            $temp = [];
            if (isset($album) && count($album)) {
                foreach ($album as $key => $val) {
                    $imageName = basename($val);
                    $emailPrefix = Str::before($auth->email, '@');
                    $sourcePath = public_path('tempotary/' . $emailPrefix . '/' . $imageName);
                    $destinationPath = storage_path('app/public');

                    if (isset($customFolder) && count($customFolder)) {
                        $destinationPath .= '/' . $emailPrefix . '/' . 'image' . '/' . implode('/', $customFolder);
                    }

                    if (!File::exists($destinationPath)) {
                        File::makeDirectory($destinationPath, 0755, true);
                    }

                    $destinationFile = $destinationPath . '/' . $imageName;
                    if (File::exists($sourcePath)) {
                        File::move($sourcePath, $destinationFile);
                    }
                    $temp[] = 'storage/' . $emailPrefix . '/' . 'image' . '/' . implode('/', $customFolder) . '/' . $imageName;
                }
            }
            $this->payload['album'] = $temp;
        }
        return $this;
    }

    protected function getPayload()
    {
        return $this->payload;
    }

    protected function catRelationArray($request, $instance, $model)
    {
        $catalogue = explode(',', $request->input('catalogues'));
        $catalogue = array_filter($catalogue, function ($item) {
            return !empty(trim($item));
        });
        $foreignKey = $model . '_catalogue_id';
        $newCatArray = array_unique([...$catalogue, ...[$instance->{$foreignKey}]]);
        return $newCatArray;
    }



    //array_unique loại bỏ phần tử bị trùng
    protected function createCatRelation($request, $instance, $model = 'post')
    {
        $relation = $model . '_catalogues';
        $cataDataArray = $this->catRelationArray($request, $instance, $model);
        $instance->{$relation}()->attach($cataDataArray);
    }

    protected function createTagRelation($request, $instance)
    {
        if ($request->input('tags') && $request->input('tags') !== null) {
            $tagId = explode(',', $request->input('tags'));
            $instance->tags()->attach($tagId);
        }
    }

    public function detachRelation($instance, $relation = [])
    {
        if (isset($relation) && count($relation)) {
            foreach ($relation as $key => $val) {
                $instance->{$val}()->detach();
            }
        }
    }


    //Truy van nang cao
    protected function whereHasCatalogueId($request)
    {
        $catId = $request->integer($this->model . '_catalogue_id');
        $table = $this->model . '_catalogues';
        $callback = null;
        if ($catId > 0) {
            //Closure
            $callback = function ($query) use ($catId, $table) {
                if ($catId > 0) {
                    $query->whereIn($this->model . '_catalogue_id', function ($subQuery) use ($catId, $table) {
                        $subQuery->select('id')
                            ->from($table)
                            ->where('lft', '>=', function ($innerQuery) use ($catId, $table) {
                                $innerQuery->select('lft')
                                    ->from($table)
                                    ->where('id', $catId);
                            })
                            ->where('rgt', '<=', function ($innerQuery) use ($catId, $table) {
                                $innerQuery->select('rgt')
                                    ->from($table)
                                    ->where('id', $catId);
                            });
                    });
                }
            };
        }
        return $callback;
    }


    protected function nestedset($auth, $nested)
    {
        $nested->Get();
        $nested->Recursive(0, $nested->Set());
        $nested->Action($auth);
    }
}

// Pure SQL
/*
post_catalogue_post.post_catalogue_id IN (
    SELECT id
    FROM post_catalogues
    WHERE 
    lft >= (SELECT lft FROM post_catalogues WHERE id = ?)
    rgt <= (SELECT rgt FROM post_catalogues WHERE id = ?)
)
*/
