<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class StockMovementItem extends Model
{
    protected $fillable = [
        'stock_movement_id', 'product_id', 'quantity_in_base_unit',
        'entered_quantity', 'entered_unit', 'unit_price'
    ];

    public function stockMovement()
    {
        return $this->belongsTo(StockMovement::class);
    }

    public function product()
    {
        return $this->belongsTo(Product::class);
    }
}
