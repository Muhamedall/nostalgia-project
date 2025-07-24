<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Product extends Model
{
    use HasFactory;

    protected $fillable = ['title', 'price', 'background_image', 'main_image'];
    
    public function favoritedBy()
    {
        return $this->belongsToMany(User::class, 'favorites');
    }
}
