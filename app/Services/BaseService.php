<?php

namespace App\Services;

use Illuminate\Support\Facades\DB;
use App\Classes\FileUploader;
use Illuminate\Support\Facades\File;
use Illuminate\Support\Str;

class BaseService
{
    protected $fileUploader;
    protected $payload = [];
    protected $model;

    public function __construct($model = null)
    {
        $this->model = $model;
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
    protected function initializePayload($request, $except = [])
    {
        $this->payload = $request->except(['_method', 'created_at', ...$except]);
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
            $this->fileUploader = new FileUploader($auth->email);
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
