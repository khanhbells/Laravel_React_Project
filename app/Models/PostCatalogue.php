<?php

namespace App\Models;

// use Illuminate\Contracts\Auth\MustVerifyEmail;
use Illuminate\Notifications\Notifiable;
use App\Traits\QueryTrait;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class PostCatalogue extends Model
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
        'level' => 0
    ];

    protected $table = 'post_catalogues';

    public static function hasChildren($id = 0)
    {
        $postCatalogue = PostCatalogue::find($id);
        if ($postCatalogue->rgt - $postCatalogue->lft !== 1) {
            return false;
        } else {
            return true;
        }
    }

    // public function users()
    // {
    //     return $this->hasMany(User::class, 'user_catalogue_id', 'id');
    // }

}
