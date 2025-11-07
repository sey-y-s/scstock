<?php

namespace App\Models;

use App\Models\StockMovement;
use Illuminate\Database\Eloquent\Model;

class Customer extends Model
{

    protected $fillable = ['name', 'contact_email', 'contact_phone', 'address', 'is_active'];

    public function stockMovements()
    {
        return $this->hasMany(StockMovement::class);
    }

    protected $casts = [
        'is_active' => 'boolean',
    ];

    public function movements()
    {
        return $this->hasMany(StockMovement::class, 'customer_id');
    }

    public function recentMovements($limit = 10)
    {
        return $this->movements()
                    ->with(['fromWarehouse', 'user'])
                    ->where('status', 'completed')
                    ->orderBy('created_at', 'desc')
                    ->limit($limit)
                    ->get();
    }

    public function getTotalTransactionsAttribute()
    {
        return $this->movements()->where('status', 'completed')->count();
    }
}

