<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;
use Illuminate\Support\Carbon;

class UserCatalogueResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        $userCataloguePermission = $this->permissions()->pluck('id')->toArray();
        return [
            'id' => $this->id,
            'name' => $this->name,
            'description' => $this->description,
            'users_count' => $this->users_count,
            'publish' => $this->publish,
            'user_catalogue_permissions' => count($userCataloguePermission) > 0 ? $userCataloguePermission : null,
        ];
    }
}
