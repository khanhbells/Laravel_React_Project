<?php

namespace App\Models;

// use Illuminate\Contracts\Auth\MustVerifyEmail;
use Illuminate\Notifications\Notifiable;
use App\Traits\QueryTrait;
use Illuminate\Database\Eloquent\Model;


class TimeSlot extends Model
{
    use  Notifiable, QueryTrait;

    /**
     * The attributes that are mass assignable.
     *
     * @var array<int, string>
     */
    protected $fillable = [
        'start_time',
        'end_time',
        'publish'
    ];

    protected $table = 'time_slots';

    public $attributes = [
        'publish' => 2,
    ];

    public function schedules()
    {
        return $this->hasMany(Schedule::class, 'time_slot_id', 'id');
    }
}
