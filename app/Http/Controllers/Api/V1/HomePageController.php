<?php

namespace App\Http\Controllers\Api\V1;

use App\Enums\Status;
use App\Http\Controllers\Controller;
use App\Http\Requests\SortRequest;
use App\Http\Resources\DetailDoctorResource;
use App\Http\Resources\HospitalResource;
use App\Http\Resources\LocationResource;
use App\Http\Resources\PostCatalogueResource;
use App\Http\Resources\SpecialtyCatalogueResource;
use App\Http\Resources\SpecialtyResource;
use App\Http\Resources\UserDoctorResource;
use App\Http\Resources\UserResource;
use App\Models\System;
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

    public function systems(Request $request)
    {
        try {
            $systems = convert_array(System::get(), 'keyword', 'content');
            return response()->json([
                'systems' => $systems,
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

    public function search(Request $request)
    {
        try {
            $repositories = [
                [
                    'repo' => $this->customRepository('specialties'),
                    'args' => $this->paginateAgrument($request, true, 'specialty'),
                    'resource' => SpecialtyResource::class
                ],
                [
                    'repo' => $this->customRepository('hospitals'),
                    'args' => $this->paginateAgrument($request),
                    'resource' => HospitalResource::class
                ],
                [
                    'repo' => $this->customRepository('users'),
                    'args' => $this->paginateAgrument(
                        $request, 
                        false,
                        null, 
                        ['doctors.specialties.specialty_catalogues'],
                        [
                            'users.publish' => 2,
                            'user_catalogue_id' => 2
                        ],
                        [
                            [
                                'doctors',
                                'users.id',
                                '=',
                                'doctors.user_id'
                            ],
                            [
                                'hospitals',
                                'doctors.hospital_id',
                                '=',
                                'hospitals.id'
                            ]
                        ],
                        ['users.*'],
                        ['users.name'],
                        ['users.id', 'desc']
                    ),
                    'resource' => UserDoctorResource::class
                ],
            ];
    
            $searchAll = array_filter(array_map(function ($item) {
                $data = $item['repo']->pagination([...$item['args']]);
                return $data->isNotEmpty() ? $item['resource']::collection($data->items()) : null;
            }, $repositories));
    
            return response()->json([
                'searchAll' => array_values($searchAll),
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
    

    private function paginateAgrument(
        $request, 
        $flag = false, 
        $model = null, 
        $relations = [], 
        $condition = [
            'publish' => 2
        ],
        $join = [],
        $select = ['*'],
        $field  = ['name'],
        $orderBy = ['id', 'desc']
    )
    {
        return [
            'select' => $select,
            'orderBy' => $orderBy,
            'perpage' => 10,
            'keyword' => [
                'search' => $request->input('keyword') ?? '',
                'field' => $field
            ],
            'condition' => $condition,
            'whereHas' => $flag && $model != null ? $this->whereHas($request, $model) : [],
            'relations' => $relations,
            'innerJoin' => $join && count($join) > 0 ? $join : []
        ];
    }

    private function whereHas($request, $model)
    {
        return [
            $model . '_catalogues' => function ($query) use ($request) {
                $query->where('publish', 2);
            }
        ];
    }
}
