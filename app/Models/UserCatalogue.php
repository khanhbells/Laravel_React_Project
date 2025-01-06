<?php

namespace App\Models;

// use Illuminate\Contracts\Auth\MustVerifyEmail;
use Illuminate\Notifications\Notifiable;
use App\Traits\QueryTrait;
use Illuminate\Database\Eloquent\Model;


class UserCatalogue extends Model
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
    ];

    protected $table = 'user_catalogues';

    public function users()
    {
        return $this->hasMany(User::class, 'user_catalogue_id', 'id');
    }

    public function attributes()
    {
        return [
            'publish' == 1,
        ];
    }
}
