<?php

namespace App\Services\Specialty;

use App\Services\BaseService;
use App\Repositories\Specialty\SpecialtyRepository;
use Illuminate\Support\Facades\DB;
use App\Enums\Status;
use App\Classes\Nested;


class SpecialtyService extends BaseService
{
    protected $specialtyRepository;
    protected $fileUploader;
    protected $files = ['image', 'icon'];
    protected $except = [];

    public function __construct(
        SpecialtyRepository $specialtyRepository,
    ) {
        $this->specialtyRepository = $specialtyRepository;
        parent::__construct('specialty');
    }

    public function paginate($request)
    {
        $agrument = $this->paginateAgrument($request);
        $specialties = $this->specialtyRepository->pagination([...$agrument]);
        return $specialties;
    }

    //Where đến relations
    private function whereHas($request)
    {
        $model = $this->model;
        return [
            $model . '_catalogues' => [
                $this->whereHasCatalogueId($request)
            ],
        ];
    }

    private function paginateAgrument($request)
    {
        return [
            'perpage' => $request->input('perpage') ?? 10,
            'keyword' => [
                'search' => $request->input('keyword') ?? '',
                'field' => ['name', 'description', 'content']
            ],
            'condition' => [
                'publish' => $request->integer('publish'),
            ],
            'whereHas' => $this->whereHas($request),
            'select' => ['*'],
            'orderBy' => $request->input('sort') ? explode(',', $request->input('sort')) : ['id', 'desc'],
        ];
    }

    private function imageAgrument()
    {
        return [
            'customFolder' => ['specialties'],
            'imageType' => 'image'
        ];
    }

    private function initializeRequest($request, $auth, $except)
    {
        return $this->initializePayload($request, $except)
            ->handleUserId($auth)
            ->processFiles($request, $auth, $this->files, ...$this->imageAgrument())
            ->processAlbum($request, $auth, $this->imageAgrument()['customFolder'])
            ->processCanonical()
            ->getPayload();
    }


    public function create($request, $auth)
    {
        DB::beginTransaction();
        try {
            $except = ['catalogues', 'tags'];
            $payload = $this->initializeRequest($request, $auth, $except);
            $specialty = $this->specialtyRepository->create($payload);
            if ($specialty->id > 0) {
                $this->createCatRelation($request, $specialty, 'specialty');
                $this->createTagRelation($request, $specialty);
            }
            DB::commit();
            return [
                'specialty' => $specialty,
                'code' => Status::SUCCESS
            ];
        } catch (\Exception $e) {
            DB::rollBack();
            return [
                'code' => Status::ERROR,
                'message' => $e->getMessage()
            ];
        }
    }

    public function update($request, $id, $auth)
    {
        DB::beginTransaction();
        try {
            $except = ['specialty_counts', 'catalogues', 'cats', 'tags'];
            $payload = $this->initializeRequest($request, $auth, $except);
            $specialty = $this->specialtyRepository->update($id, $payload);
            if ($specialty) {
                $detachArray = ['specialty_catalogues', 'tags'];
                $this->detachRelation($specialty, $detachArray);
                $this->createCatRelation($request, $specialty, 'specialty');
                $this->createTagRelation($request, $specialty);
            }
            DB::commit();
            return [
                'specialty' => $specialty,
                'code' => Status::SUCCESS
            ];
        } catch (\Exception $e) {
            DB::rollBack();
            return [
                'code' => Status::ERROR,
                'message' => $e->getMessage()
            ];
        }
    }

    public function delete($id, $auth)
    {
        DB::beginTransaction();
        try {
            $this->specialtyRepository->delete($id);
            DB::commit();
            return [
                'code' => Status::SUCCESS
            ];
        } catch (\Exception $e) {
            DB::rollBack();
            return [
                'code' => Status::ERROR,
                'message' => $e->getMessage()
            ];
        }
    }
}
