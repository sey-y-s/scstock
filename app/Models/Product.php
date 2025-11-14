<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Facades\Storage;

class Product extends Model
{
    protected $fillable = [
        'reference', 'name', 'description', 'category_id', 'packaging_type_id',
        'purchase_price', 'low_stock_alert', 'image_url', 'is_active'
    ];

    protected $casts = [
        'purchase_price' => 'integer',
        'low_stock_alert' => 'decimal:2',
        'is_active' => 'boolean'
    ];

    public static function generateReference($categoryCode)
    {
        $lastProduct = self::where('reference', 'like', $categoryCode . '-%')
            ->orderBy('reference', 'desc')
            ->first();

        $nextNumber = 1;
        if ($lastProduct) {
            $lastNumber = intval(substr($lastProduct->reference, -4));
            $nextNumber = $lastNumber + 1;
        }

        return $categoryCode . '-' . str_pad($nextNumber, 4, '0', STR_PAD_LEFT);
    }

    public function category()
    {
        return $this->belongsTo(ProductCategory::class);
    }

    public function packagingType()
    {
        return $this->belongsTo(PackagingType::class);
    }

    public function stockMovementItems()
    {
        return $this->hasMany(StockMovementItem::class);
    }

    public function stocks()
    {
        return $this->hasMany(Stock::class);
    }

    // Accessor pour l'URL de l'image
    public function getImageUrlAttribute($value)
    {
        return $value ? asset($value) : null;
    }

    // Méthode pour vérifier le stock faible
    public function getIsLowStockAttribute()
    {
        $totalStock = $this->stocks->sum('quantity');
        return $totalStock <= $this->low_stock_alert;
    }
}
