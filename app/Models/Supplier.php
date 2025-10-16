<?php

namespace App\Models;

use App\Models\StockMovement;
use Illuminate\Database\Eloquent\Model;

class Supplier extends Model
{
    protected $fillable = ['name', 'contact_email', 'contact_phone', 'address', 'is_active'];

    public function stockMovements()
    {
        return $this->hasMany(StockMovement::class);
    }
}
