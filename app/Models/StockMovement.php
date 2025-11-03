<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class StockMovement extends Model
{
    protected $fillable = [
        'reference', 'type', 'status', 'from_warehouse_id', 'to_warehouse_id',
        'supplier_id', 'customer_id', 'user_id', 'notes', 'movement_date'
    ];

    protected $appends = ['total_quantity', 'total_value'];

    protected $casts = [
        'movement_date' => 'datetime',
        'status' => 'string' // draft, completed, cancelled
    ];

    public static function generateReference($type)
    {
        $prefixes = [
            'in' => 'APP',
            'out' => 'VT',
            'transfer' => 'TRF'
        ];

        $prefix = $prefixes[$type] ?? 'MV';
        $year = date('Y');

        $lastMovement = self::where('reference', 'like', "{$prefix}-{$year}-%")
            ->orderBy('reference', 'desc')
            ->first();

        $nextNumber = 1;
        if ($lastMovement) {
            preg_match('/-(\d+)$/', $lastMovement->reference, $matches);
            $nextNumber = intval($matches[1]) + 1;
        }

        return "{$prefix}-{$year}-" . str_pad($nextNumber, 6, '0', STR_PAD_LEFT);
    }

    // Relations
    public function fromWarehouse()
    {
        return $this->belongsTo(Warehouse::class, 'from_warehouse_id');
    }

    public function toWarehouse()
    {
        return $this->belongsTo(Warehouse::class, 'to_warehouse_id');
    }

    public function supplier()
    {
        return $this->belongsTo(Supplier::class);
    }

    public function customer()
    {
        return $this->belongsTo(Customer::class);
    }

    public function user()
    {
        return $this->belongsTo(User::class);
    }

    public function items()
    {
        return $this->hasMany(StockMovementItem::class);
    }

    // Scopes
    public function scopeCompleted($query)
    {
        return $query->where('status', 'completed');
    }

    public function scopeDraft($query)
    {
        return $query->where('status', 'draft');
    }

    // Accessors
    public function getTotalQuantityAttribute()
    {
        return $this->items->sum('quantity');
    }

    public function getTotalValueAttribute()
    {
        return $this->items->sum(function($item) {
            return $item->quantity * $item->unit_price;
        });
    }
}
