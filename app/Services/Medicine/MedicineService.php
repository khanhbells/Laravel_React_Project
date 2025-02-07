<?php

namespace App\Services\Medicine;

use App\Services\BaseService;
use App\Repositories\Medicine\MedicineRepository;
use Illuminate\Support\Facades\DB;
use App\Enums\Status;
use App\Classes\Nested;


class MedicineService extends BaseService
{
    protected $medicineRepository;
    protected $fileUploader;
    protected $files = ['image', 'icon'];
    protected $except = [];

    public function __construct(
        MedicineRepository $medicineRepository,
    ) {
        $this->medicineRepository = $medicineRepository;
        parent::__construct('medicine');
    }

    public function paginate($request)
    {
        $agrument = $this->paginateAgrument($request);
        $medicines = $this->medicineRepository->pagination([...$agrument]);
        return $medicines;
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
            'customFolder' => ['medicines'],
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
            $medicine = $this->medicineRepository->create($payload);
            if ($medicine->id > 0) {
                $this->createCatRelation($request, $medicine, 'medicine');
                $this->createTagRelation($request, $medicine);
            }
            DB::commit();
            return [
                'medicine' => $medicine,
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
            $except = ['medicine_counts', 'catalogues', 'cats', 'tags'];
            $payload = $this->initializeRequest($request, $auth, $except);
            $medicine = $this->medicineRepository->update($id, $payload);
            if ($medicine) {
                $detachArray = ['medicine_catalogues', 'tags'];
                $this->detachRelation($medicine, $detachArray);
                $this->createCatRelation($request, $medicine, 'medicine');
                $this->createTagRelation($request, $medicine);
            }
            DB::commit();
            return [
                'medicine' => $medicine,
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
            $this->medicineRepository->delete($id);
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
