<?php

namespace App\Http\Controllers\Api\V1;

use App\Enums\Status;
use App\Http\Controllers\Controller;
use App\Http\Requests\SortRequest;
use App\Http\Resources\HospitalResource;
use App\Http\Resources\LocationResource;
use App\Http\Resources\PostCatalogueResource;
use App\Http\Resources\SpecialtyCatalogueResource;
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

    public function menus()
    {

        try {
            $repositoryHospital = $this->customRepository('hospitals');
            $repositorySpecialtyCatalogue = $this->customRepository('specialty_catalogues');
            $repositoryPostCatalogue = $this->customRepository('post_catalogues');
            $params = [
                'select' => '*',
                'orderBy' => ['id', 'desc'],
                'perpage' => 10
            ];
            $hospitals = $repositoryHospital->pagination($params);
            $specialtyCatalogues = $repositorySpecialtyCatalogue->pagination($params);
            $postCatalogues = $repositoryPostCatalogue->pagination($params);
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
}
