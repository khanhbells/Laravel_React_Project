<?php

namespace App\Services\Time;

use App\Services\BaseService;
use App\Repositories\Time\TimeSlotRepository;
use Illuminate\Support\Facades\DB;
use App\Enums\Status;


class TimeSlotService extends BaseService
{
    protected $timeSlotRepository;
    public function __construct(
        TimeSlotRepository $timeSlotRepository,
    ) {
        $this->timeSlotRepository = $timeSlotRepository;
    }

    public function paginate($request)
    {
        $agrument = $this->paginateAgrument($request);
        $timeSlots = $this->timeSlotRepository->pagination([...$agrument]);
        // dd($timeSlots);
        return $timeSlots;
    }

    private function paginateAgrument($request)
    {
        return [
            'perpage' => $request->input('perpage') ?? 10,
            'keyword' => [
                'search' => $request->input('keyword') ?? '',
                'field' => ['name', 'description']
            ],
            'condition' => [
                'publish' => $request->integer('publish'),
                // 'user_catalogue_id' => $request->integer('user_catalogue_id'),
            ],
            'select' => ['*'],
            'orderBy' => $request->input('sort') ? explode(',', $request->input('sort')) : ['id', 'desc'],
        ];
    }

    private function initializeRequest($request, $except)
    {
        return $this->initializePayload($request, $except)
            ->getPayload();
    }

    public function create($request)
    {
        DB::beginTransaction();
        try {
            $except = ['id'];
            $payload = $this->initializeRequest($request, $except);
            $timeSlot = $this->timeSlotRepository->create($payload);

            DB::commit();
            return [
                'timeSlot' => $timeSlot,
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

    public function update($request, $id)
    {
        DB::beginTransaction();
        try {
            $except = ['id'];
            $payload = $this->initializeRequest($request, $except);
            $timeSlot = $this->timeSlotRepository->update($id, $payload);
            // dd($timeSlot);
            DB::commit();
            return [
                'timeSlot' => $timeSlot,
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

    public function delete($id)
    {
        DB::beginTransaction();
        try {
            $this->timeSlotRepository->delete($id);
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
