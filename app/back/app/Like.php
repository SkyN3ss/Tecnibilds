<?php

namespace Tbappback;

use Illuminate\Database\Eloquent\Model;

class Like extends Model
{
    protected $fillable = [
        'post_id', 'post_comment_id', 'user_id'
    ];

    public function posts()
    {
        return $this->belongsTo(Post::class);
    }

    public function PostComments()
    {
        return $this->belongsTo(PostComment::class);
    }

    public function user()
    {
        return $this->belongsTo(User::class);
    }
}
