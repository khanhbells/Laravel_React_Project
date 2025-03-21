<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;
use Illuminate\Support\Carbon;

class UserResource extends JsonResource
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
            'doctor_id' => $this->doctors->id ?? null,
            'name' => $this->name,
            'email' => $this->email,
            'phone' => $this->phone,
            'address' => $this->address,
            'image' => getImages($this->image),
            'created_at' => Carbon::parse($this->created_at)->format('d/m/Y H:i'),
            'publish' => $this->publish,
            'user_catalogue_id' => $this->user_catalogue_id,
            'province_id' => $this->province_id,
            'district_id' => $this->district_id,
            'ward_id' => $this->ward_id,
            'birthday' => Carbon::parse($this->birthday)->format('Y-m-d'),
            'user_catalogues' => $this->user_catalogues->name,
            'doctors' => $this->doctors ?? []
        ];
    }
}
