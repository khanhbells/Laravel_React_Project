<?php

namespace App\Models;

// use Illuminate\Contracts\Auth\MustVerifyEmail;
use Illuminate\Notifications\Notifiable;
use App\Traits\QueryTrait;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;
use Illuminate\Database\Eloquent\SoftDeletes;

class Doctor extends Model
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
        'publish' => 2,
        'follow' => 2,
    ];

    protected $table = 'doctors';

    public function users()
    {
        return $this->belongsTo(User::class, 'user_id', 'id');
    }

    public function specialties(): BelongsToMany
    {
        return $this->belongsToMany(Specialty::class, 'doctor_specialty', 'doctor_id', 'specialty_id');
    }

    public function hospitals()
    {
        return $this->belongsTo(Hospital::class, 'hospital_id', 'id');
    }

    public function tags()
    {
        return $this->morphToMany(Tag::class, 'taggable');
    }
}
