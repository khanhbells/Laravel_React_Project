<?php

namespace App\Services\Gemini;

use App\Services\BaseService;
use App\Repositories\Gemini\GeminiRepository;
use Illuminate\Support\Facades\DB;
use App\Enums\Status;
use App\Classes\Nested;


class GeminiService extends BaseService
{
    protected $geminiRepository;
    protected $fileUploader;
    protected $files = ['image', 'icon'];
    protected $except = [];

    public function __construct(
        GeminiRepository $geminiRepository,
    ) {
        $this->geminiRepository = $geminiRepository;
        parent::__construct('gemini');
    }

    public function paginate($request)
    {
        $agrument = $this->paginateAgrument($request);
        $geminis = $this->geminiRepository->pagination([...$agrument]);
        return $geminis;
    }

    private function paginateAgrument($request)
    {
        return [
            'perpage' => $request->input('perpage') ?? 10,
            'keyword' => [
                'search' => $request->input('keyword') ?? '',
                'field' => ['user_message', 'bot_response']
            ],
            'condition' => [
                'publish' => $request->integer('publish'),
            ],
            'select' => ['*'],
            'orderBy' => $request->input('sort') ? explode(',', $request->input('sort')) : ['id', 'desc'],
        ];
    }

    private function initializeRequest($request, $auth, $except)
    {
        return $this->initializePayload($request, $except)->getPayload();
    }


    public function create($request, $auth)
    {
        DB::beginTransaction();
        try {
            $except = [];
            $payload = $this->initializeRequest($request, $auth, $except);
            $gemini = $this->geminiRepository->create($payload);
            DB::commit();
            return [
                'gemini' => $gemini,
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
            $except = ['gemini_counts', 'catalogues', 'cats', 'tags'];
            $payload = $this->initializeRequest($request, $auth, $except);
            $gemini = $this->geminiRepository->update($id, $payload);
            if ($gemini) {
                $detachArray = ['gemini_catalogues', 'tags'];
                $this->detachRelation($gemini, $detachArray);
                $this->createCatRelation($request, $gemini, 'gemini');
                $this->createTagRelation($request, $gemini);
            }
            DB::commit();
            return [
                'gemini' => $gemini,
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
            $this->geminiRepository->delete($id);
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
