<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;
use Illuminate\Support\Carbon;

class PostResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @return array<string, mixed>
     */

    public function toArray(Request $request): array
    {
        $postCatalogueId = $this->post_catalogue_id;
        return [
            'id' => $this->id,
            'name' => $this->name,
            'description' => $this->description,
            'catalogues' => $this->post_catalogues->pluck('id')
                ->reject(function ($id) use ($postCatalogueId) {
                    return $id === $postCatalogueId;
                })
                ->toArray(),
            'cats' => $this->post_catalogues->pluck('name')->toArray(),
            'content' => $this->content,
            'album' => $this->album,
            'meta_title' => $this->meta_title ?? '',
            'meta_keyword' => $this->meta_keyword ?? '',
            'meta_description' => $this->meta_description ?? '',
            'canonical' => $this->canonical,
            'post_catalogue_id' => (string)$this->post_catalogue_id,
            'image' => getImages($this->image),
            'icon' => getImages($this->icon),
            'publish' => $this->publish,
            'follow' => $this->follow,
            'order' => $this->order,
        ];
    }
}
