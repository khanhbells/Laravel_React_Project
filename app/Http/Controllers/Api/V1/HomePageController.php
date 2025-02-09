<?php

namespace App\Http\Controllers\Api\V1;

use App\Enums\Status;
use App\Http\Controllers\Controller;
use App\Http\Requests\SortRequest;
use App\Http\Resources\HospitalResource;
use App\Http\Resources\LocationResource;
use App\Http\Resources\PostCatalogueResource;
use App\Http\Resources\SpecialtyCatalogueResource;
use App\Http\Resources\SpecialtyResource;
use Exception;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Symfony\Component\HttpFoundation\Response;
use Illuminate\Support\Str;
use Illuminate\Support\Carbon;

class HomePageController extends Controller
{
    public function __construct() {}
    public function customRepository($model)
    {
        $customRepository = app(callRepository($model));
        return $customRepository;
    }

    public function menus(Request $request)
    {

        try {
            $repositoryHospital = $this->customRepository('hospitals');
            $repositorySpecialtyCatalogue = $this->customRepository('specialty_catalogues');
            $repositoryPostCatalogue = $this->customRepository('post_catalogues');
            $agrument = $this->paginateAgrument($request);
            $hospitals = $repositoryHospital->pagination([...$agrument]);
            $specialtyCatalogues = $repositorySpecialtyCatalogue->pagination([...$agrument]);
            $postCatalogues = $repositoryPostCatalogue->pagination([...$agrument]);
            $menu = [
                'hospitals' => HospitalResource::collection($hospitals->items()),
                'specialty_catalogues' => SpecialtyCatalogueResource::collection($specialtyCatalogues->items()),
                'post_catalogues' => PostCatalogueResource::collection($postCatalogues->items())
            ];

            return response()->json([
                'menus' => $menu,
                'code' => Response::HTTP_OK
            ], Response::HTTP_OK);
        } catch (\Exception $e) {
            return response()->json([
                'error' => 'Có lỗi xảy ra, vui lòng thử lại sau.',
                'message' => $e->getMessage(),
                'code' => Status::ERROR
            ], Response::HTTP_INTERNAL_SERVER_ERROR);
        }
    }

    public function paginateAgrument($request)
    {
        return [
            'select' => '*',
            'orderBy' => ['id', 'desc'],
            'perpage' => 10,
            'keyword' => [
                'search' => $request->input('keyword') ?? '',
                'field' => ['name']
            ],
        ];
    }

    public function search(Request $request)
    {

        try {
            $agrument = $this->paginateAgrument($request);
            $repositorySpecialty = $this->customRepository('specialties');
            $repositoryHospital = $this->customRepository('hospitals');
            $specialties = $repositorySpecialty->pagination([...$agrument]);
            $hospitals = $repositoryHospital->pagination([...$agrument]);
            $searchAll = [];

            if ($specialties->count() > 0) {
                $searchAll[] = SpecialtyResource::collection($specialties->items());
            }

            if ($hospitals->count() > 0) {
                $searchAll[] = HospitalResource::collection($hospitals->items());
            }

            return response()->json([
                'searchAll' => $searchAll,
                'code' => Response::HTTP_OK
            ], Response::HTTP_OK);
        } catch (\Exception $e) {
            return response()->json([
                'error' => 'Có lỗi xảy ra, vui lòng thử lại sau.',
                'message' => $e->getMessage(),
                'code' => Status::ERROR
            ], Response::HTTP_INTERNAL_SERVER_ERROR);
        }
    }
}
