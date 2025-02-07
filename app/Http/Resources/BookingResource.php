<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;
use Illuminate\Support\Carbon;

class BookingResource extends JsonResource
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
            'name_doctor' => $this->doctors->users->name,
            'image' => getImages($this->doctors->users->image),
            'date' => $this->schedules->date,
            'start_time' => $this->schedules->time_slots->start_time,
            'end_time' => $this->schedules->time_slots->end_time,
            'patient_id' => $this->patient_id,
            'doctor_id' => $this->doctor_id,
            'schedule_id' => $this->schedule_id,
            'booking_date' => $this->booking_date,
            'full_name' => $this->full_name,
            'phone' => $this->phone,
            'email' => $this->email,
            'province_id' => $this->province_id,
            'district_id' => $this->district_id,
            'ward_id' => $this->ward_id,
            'name_province' => $this->provinces->name,
            'name_district' => $this->districts->name,
            'name_ward' => $this->wards->name,
            'address' => $this->address,
            'note' => $this->note,
            'total_price' => $this->total_price,
            'status' => $this->status,
            'payment_status' => $this->payment_status,
            'method' => $this->method,
            'birthday' => $this->birthday,
            'gender' => (string)$this->gender,
            'medicines' => $this->medicines->map(function ($medicine) {
                return [
                    'id' => $medicine->id,
                    'name' => $medicine->name,
                    'dosage' => $medicine->pivot->dosage,
                    'qty' => $medicine->pivot->qty,
                    'usage' => $medicine->pivot->usage,
                ];
            }) ?? null
        ];
    }
}
