<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;
use Illuminate\Support\Carbon;

class DetailDoctorResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        $doctorSpecial = [];
        if ($this->specialties != null) {
            $doctorSpecial = $this->specialties->map(function ($special) {
                return [
                    'label' => $special->name,
                    'value' => $special->id,
                    'canonical' => $special->canonical,
                ];
            });
        }
        return [
            'id' => $this->id ?? '',
            'user_id' => $this->users->id ?? '',
            'name' => $this->users->name,
            'image' => getImages($this->users->image),
            'description' => $this->description ?? '',
            'content' => $this->content ?? '',
            'album' => $this->album ?? '',
            'meta_title' => $this->meta_title ?? '',
            'meta_keyword' => $this->meta_keyword ?? '',
            'meta_description' => $this->meta_description ?? '',
            'canonical' => $this->canonical ?? '',
            'hospital_id' => (string)$this->hospital_id ?? '',
            'publish' => $this->publish ?? '',
            'follow' => $this->follow ?? '',
            // 'order' => $this->order ?? '',
            'exp' => $this->exp ?? '',
            'clinic_name' => $this->clinic_name ?? '',
            'clinic_address' => $this->clinic_address ?? '',
            'specialties' => $doctorSpecial,
            'tags' => $this->tags ? $this->tags->map(function ($tag) {
                return [
                    'label' => $tag->name,
                    'value' => $tag->id,
                ];
            }) : []
        ];
    }
}
