<?php

namespace App\Models;

// use Illuminate\Contracts\Auth\MustVerifyEmail;
use Illuminate\Notifications\Notifiable;
use App\Traits\QueryTrait;
use Illuminate\Database\Eloquent\Model;


class PatientCatalogue extends Model
{
    use  Notifiable, QueryTrait;

    /**
     * The attributes that are mass assignable.
     *
     * @var array<int, string>
     */
    protected $fillable = [
        'name',
        'description',
        'publish'
    ];

    protected $table = 'patient_catalogues';

    public function patients()
    {
        return $this->hasMany(Patient::class, 'patient_catalogue_id', 'id');
    }

    public $attributes = [
        'publish' => 1,
    ];
}
