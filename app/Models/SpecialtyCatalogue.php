<?php

namespace App\Models;

// use Illuminate\Contracts\Auth\MustVerifyEmail;
use Illuminate\Notifications\Notifiable;
use App\Traits\QueryTrait;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;
use Illuminate\Database\Eloquent\SoftDeletes;

class SpecialtyCatalogue extends Model
{
    use  Notifiable, QueryTrait, SoftDeletes;

    /**
     * The attributes that are mass assignable.
     *
     * @var array<int, string>
     */
    protected $guarded = [];

    protected $casts = [
        'album' => 'json'
    ];

    public $attributes = [
        'order' => 0,
        'lft' => 0,
        'rgt' => 0,
        'level' => 0,
        'parent_id' => 0,
    ];

    protected $table = 'specialty_catalogues';

    public static function hasChildren($id = 0)
    {
        $specialtyCatalogue = SpecialtyCatalogue::find($id);
        if ($specialtyCatalogue->rgt - $specialtyCatalogue->lft !== 1) {
            return false;
        } else {
            return true;
        }
    }

    public function specialties(): BelongsToMany
    {
        return $this->belongsToMany(Specialty::class, 'specialty_catalogue_specialty', 'specialty_catalogue_id', 'specialty_id');
    }
}
