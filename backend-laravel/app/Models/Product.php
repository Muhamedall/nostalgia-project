<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Product extends Model
{
    use HasFactory;
     protected $fillable = [
        'external_id',
        'title',
        'price',
        'old_price',
        'description',
        'sku',
        'url',
        'images',
        'source',
        'handle',
        'available',

        // Keep old fields if your frontend still uses them
        'background_image',
        'main_image',
    ];
       protected $casts = [
        'images' => 'array',
        'available' => 'boolean',
    ];

    
    public function favoritedBy()
    {
        return $this->belongsToMany(User::class, 'favorites');
    }
}
