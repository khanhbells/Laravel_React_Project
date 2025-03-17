<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;
use Illuminate\Support\Carbon;

use function PHPSTORM_META\map;

class UserDoctorResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        $relationDoctors = optional($this->doctors)->specialties?->map(function ($specialty) {
            return [
                'specialty_id' => $specialty->id,
                'specialty_canonical' => $specialty->canonical,
                'specialty_catalogues' => optional($specialty->specialty_catalogues)?->map(function ($specialty_catalogue) {
                    return [
                        'specialty_catalogue_id' => $specialty_catalogue->id,
                        'specialty_catalogue_canonical' => $specialty_catalogue->canonical
                    ];
                }) ?? []
            ];
        }) ?? [];

        return [
            'doctor_id' => $this->doctors->id,
            'doctor_canonical' => $this->doctors->canonical,
            'name' => $this->name,
            'image' => getImages($this->image),
            'doctors' => $relationDoctors,
        ];
    }
}
