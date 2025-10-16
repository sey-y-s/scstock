<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class PackagingType extends Model
{
    protected $fillable = ['name', 'code', 'is_active'];

    public function products()
    {
        return $this->hasMany(Product::class);
    }
}