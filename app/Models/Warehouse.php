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

    public static function generateCode($type)
    {
        $prefix = $type === 'depot' ? 'DPT' : 'PDV';
        $latestWarehouse = self::where('type', $type)->latest('created_at')->first();

        if (!$latestWarehouse) {
            return $prefix . '01';
        }

        $lastCode = $latestWarehouse->code;
        $number = (int) substr($lastCode, 3) + 1;
        return $prefix . str_pad($number, 2, '0', STR_PAD_LEFT);
    }
}
