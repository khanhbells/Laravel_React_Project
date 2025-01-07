<?php

namespace App\Models;

use Illuminate\Notifications\Notifiable;
use App\Traits\QueryTrait;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;

class Post extends Model
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

    protected $table = 'posts';

    public function post_catalogues(): BelongsToMany
    {
        return $this->belongsToMany(PostCatalogue::class, 'post_catalogue_post', 'post_id', 'post_catalogue_id')->withTimestamps();
    }
}
