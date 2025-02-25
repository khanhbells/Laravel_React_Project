<?php

namespace App\Models;

// use Illuminate\Contracts\Auth\MustVerifyEmail;
use Illuminate\Notifications\Notifiable;
use App\Traits\QueryTrait;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;
use Illuminate\Database\Eloquent\SoftDeletes;

class Specialty extends Model
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

    protected $table = 'specialties';


    public function hospitals(): BelongsToMany
    {
        return $this->belongsToMany(Hospital::class, 'hospital_specialty', 'specialty_id', 'hospital_id');
    }

    public function specialty_catalogues(): BelongsToMany
    {
        return $this->belongsToMany(SpecialtyCatalogue::class, 'specialty_catalogue_specialty', 'specialty_id', 'specialty_catalogue_id')->withTimestamps();
    }

    public function tags()
    {
        return $this->morphToMany(Tag::class, 'taggable');
    }

    public function doctors(): BelongsToMany
    {
        return $this->belongsToMany(Doctor::class, 'doctor_specialty', 'specialty_id', 'doctor_id');
    }
}
