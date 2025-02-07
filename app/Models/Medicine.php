<?php

namespace App\Models;

use Illuminate\Notifications\Notifiable;
use App\Traits\QueryTrait;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;

class Medicine extends Model
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
    ];

    protected $table = 'medicines';

    public function medicine_catalogues(): BelongsToMany
    {
        return $this->belongsToMany(MedicineCatalogue::class, 'medicine_catalogue_medicine', 'medicine_id', 'medicine_catalogue_id')->withTimestamps();
    }
    public function bookings(): BelongsToMany
    {
        return $this->belongsToMany(Booking::class, 'booking_medicine', 'medicine_id', 'booking_id')->withPivot('dosage', 'qty', 'usage')->withTimestamps();
    }

    public function tags()
    {
        return $this->morphToMany(Tag::class, 'taggable');
    }
}
