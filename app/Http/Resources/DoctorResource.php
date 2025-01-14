<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;
use Illuminate\Support\Carbon;

class DoctorResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        $doctorSpecial = [];
        if ($this->doctors != null) {
            $doctorSpecial = $this->doctors->specialties->map(function ($special) {
                return [
                    'label' => $special->name,
                    'value' => $special->id,
                ];
            });
        }
        return [
            'id' => $this->doctors->id ?? '',
            'user_id' => $this->id ?? '',
            'name' => $this->name,
            'image' => getImages($this->image),
            'description' => $this->doctors->description ?? '',
            'content' => $this->doctors->content ?? '',
            'album' => $this->doctors->album ?? '',
            'meta_title' => $this->doctors->meta_title ?? '',
            'meta_keyword' => $this->doctors->meta_keyword ?? '',
            'meta_description' => $this->doctors->meta_description ?? '',
            'canonical' => $this->doctors->canonical ?? '',
            'hospital_id' => $this->doctors ? (string)$this->doctors->hospital_id : '',
            'publish' => $this->doctors->publish ?? '',
            'follow' => $this->doctors->follow ?? '',
            // 'order' => $this->doctors->order ?? '',
            'exp' => $this->doctors->exp ?? '',
            'clinic_name' => $this->doctors->clinic_name ?? '',
            'clinic_address' => $this->doctors->clinic_address ?? '',
            'specialties' => $doctorSpecial,
            'tags' => $this->doctors ? $this->doctors->tags->map(function ($tag) {
                return [
                    'label' => $tag->name,
                    'value' => $tag->id,
                ];
            }) : []
        ];
    }
}
