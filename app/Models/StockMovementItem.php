<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class StockMovementItem extends Model
{
    protected $fillable = [
        'stock_movement_id',
        'product_id',
        'quantity',
        'unit_price'
    ];


    protected $casts = [
        'quantity' => 'decimal:2',
        'unit_price' => 'integer',
    ];

    public function stockMovement()
    {
        return $this->belongsTo(StockMovement::class);
    }

    public function product()
    {
        return $this->belongsTo(Product::class);
    }

    public function getQuantityAttribute($value)
    {
        return (float) $value;
    }

    public function getUnitPriceAttribute($value)
    {
        return (int) $value;
    }
}
