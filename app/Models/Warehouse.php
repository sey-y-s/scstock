<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Warehouse extends Model
{
    protected $fillable = ['name', 'code', 'type', 'address', 'is_active'];

    public function users()
    {
        return $this->belongsToMany(User::class);
    }

    public function fromMovements()
    {
        return $this->hasMany(StockMovement::class, 'from_warehouse_id');
    }

    public function toMovements()
    {
        return $this->hasMany(StockMovement::class, 'to_warehouse_id');
    }

    public function stocks()
    {
        return $this->hasMany(Stock::class);
    }
}