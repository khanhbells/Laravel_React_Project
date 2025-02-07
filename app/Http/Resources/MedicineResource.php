<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;
use Illuminate\Support\Carbon;
use App\Http\Resources\TagResource;


class MedicineResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @return array<string, mixed>
     */

    public function toArray(Request $request): array
    {
        $medicineCatalogueId = $this->medicine_catalogue_id;
        return [
            'id' => $this->id,
            'name' => $this->name,
            'description' => $this->description,
            'catalogues' => $this->medicine_catalogues->pluck('id')
                ->reject(function ($id) use ($medicineCatalogueId) {
                    return $id === $medicineCatalogueId;
                })
                ->toArray(),
            'cats' => $this->medicine_catalogues->pluck('name')->toArray(),
            'content' => $this->content,
            'album' => $this->album,
            'meta_title' => $this->meta_title ?? '',
            'meta_keyword' => $this->meta_keyword ?? '',
            'meta_description' => $this->meta_description ?? '',
            'canonical' => $this->canonical,
            'medicine_catalogue_id' => (string)$this->medicine_catalogue_id,
            'image' => getImages($this->image),
            'icon' => getImages($this->icon),
            'publish' => $this->publish,
            'follow' => $this->follow,
            'order' => $this->order,
            'tags' => $this->tags->map(function ($tag) {
                return [
                    'label' => $tag->name,
                    'value' => $tag->id,
                ];
            })
        ];
    }
}
