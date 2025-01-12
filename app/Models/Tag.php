<?php

namespace App\Models;

use Illuminate\Notifications\Notifiable;
use App\Traits\QueryTrait;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;

class Tag extends Model
{
    use  Notifiable, QueryTrait, SoftDeletes;

    /**
     * The attributes that are mass assignable.
     *
     * @var array<int, string>
     */
    protected $fillable = [
        'name',
        'canonical',
        'meta_title',
        'meta_keyword',
        'meta_description',
        'publish',
        'user_id',
    ];


    protected $table = 'tags';

    public function posts()
    {
        return $this->morphToMany(Post::class, 'taggable', 'taggables', 'tag_id', 'taggable_id');
    }

    public function specialties()
    {
        return $this->morphToMany(Specialty::class, 'taggable', 'taggables', 'tag_id', 'taggable_id');
    }
}
