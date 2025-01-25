<?php

namespace App\Models;

use Illuminate\Notifications\Notifiable;
use App\Traits\QueryTrait;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;

class Booking extends Model
{
    use  Notifiable, QueryTrait, SoftDeletes;

    /**
     * The attributes that are mass assignable.
     *
     * @var array<int, string>
     */
    protected $guarded = [];

    protected $table = 'bookings';

    public function patients()
    {
        return $this->belongsTo(Patient::class, 'patient_id', 'id');
    }

    public function doctors()
    {
        return $this->belongsTo(Doctor::class, 'doctor_id', 'id');
    }

    public function schedules()
    {
        return $this->belongsTo(Schedule::class, 'schedule_id', 'id');
    }

    public function provinces()
    {
        return $this->belongsTo(Province::class, 'province_id', 'code');
    }
    public function districts()
    {
        return $this->belongsTo(District::class, 'district_id', 'code');
    }
    public function wards()
    {
        return $this->belongsTo(Ward::class, 'ward_id', 'code');
    }
}
