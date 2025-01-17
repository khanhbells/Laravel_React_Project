<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;
use Illuminate\Support\Carbon;

class ScheduleResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'image' => getImages($this->users->image),
            'user_id' => $this->user_id,
            'name' => $this->users->name,
            'doctor_id' => $this->doctor_id,
            'time_slot_id' => $this->time_slot_id,
            'start_time' => $this->time_slots->start_time,
            'end_time' => $this->time_slots->end_time,
            'date' => $this->date,
            'status' => $this->status,
            'publish' => $this->publish,
        ];
    }
}
