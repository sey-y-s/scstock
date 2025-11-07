<?php

namespace App\Http\Controllers;

use Inertia\Inertia;
use Illuminate\Support\Facades\DB;
use App\Models\Product;
use App\Models\Warehouse;
use App\Models\Stock;
use App\Models\StockMovement;

class DashboardController extends Controller
{
    public function index()
    {
        // Statistiques principales
        $totalProducts = Product::count();
        $totalWarehouses = Warehouse::count();
        $totalStockValue = (float) $this->calculateTotalStockValue();
        $lowStockProducts = $this->getLowStockProductsCount();

        // Mouvements récents
        $recentMovements = $this->getRecentMovements();
        $movementsChart = $this->getMovementsChartData();

        // Produits les plus mouvementés
        $topProducts = $this->getTopProducts();

        // Alertes stock faible
        $stockAlerts = $this->getStockAlerts();

        return Inertia::render('Dashboard', [
            'stats' => [
                'totalProducts' => $totalProducts,
                'totalWarehouses' => $totalWarehouses,
                'totalStockValue' => number_format($totalStockValue),
                'lowStockProducts' => $lowStockProducts,
            ],
            'recentMovements' => $recentMovements,
            'movementsChart' => $movementsChart,
            'topProducts' => $topProducts,
            'stockAlerts' => $stockAlerts,
        ]);
    }

    private function calculateTotalStockValue($warehouseId = null)
    {
        // Calcule la valeur totale du stock en multipliant la quantité par le prix d'achat moyen
        // si un entrepôt est spécifié, returne la valeur pour cet entrepôt uniquement
        $query = Stock::join('products', 'stocks.product_id', '=', 'products.id')
            ->select(DB::raw('SUM(stocks.quantity * products.purchase_price) as total_value'));
            if ($warehouseId) {
                $query->where('stocks.warehouse_id', $warehouseId);
            }
        $result = $query->first();
        return $result->total_value ?? 0;
    }

    private function getLowStockProductsCount()
    {
        return Stock::join('products', 'stocks.product_id', '=', 'products.id')
            ->where('stocks.quantity', '>', 0)
            ->whereRaw('stocks.quantity <= products.low_stock_alert')
            ->distinct('stocks.product_id')
            ->count('stocks.product_id');
    }

    private function getRecentMovements($days = 10, $limit = 5)
    {
        return StockMovement::with(['fromWarehouse', 'toWarehouse', 'user'])
            ->where('status', 'completed')
            ->where('created_at', '>=', now()->subDays($days))
            ->orderBy('created_at', 'desc')
            ->limit($limit)
            ->get()
            ->map(function($movement) {
                return [
                    'id' => $movement->id,
                    'type' => $movement->type,
                    'reference' => $movement->reference,
                    'source' => $movement->fromWarehouse?->name,
                    'destination' => $movement->toWarehouse?->name,
                    'user' => $movement->user->name,
                    'created_at' => $movement->created_at->format('d/m H:i'),
                    'items_count' => $movement->items->count(),
                ];
            });
    }

    private function getMovementsChartData($days = 30)
    {
        $startDate = now()->subDays($days);

        $movements = StockMovement::where('status', 'completed')
            ->where('created_at', '>=', $startDate)
            ->selectRaw('DATE(created_at) as date, type, COUNT(*) as count')
            ->groupBy('date', 'type')
            ->get();

        // Préparer les données pour Chart.js
        $dates = [];
        $entreeData = [];
        $sortieData = [];
        $transfertData = [];

        for ($i = $days; $i >= 0; $i--) {
            $date = now()->subDays($i)->format('Y-m-d');
            $dates[] = now()->subDays($i)->format('d/m');

            $entreeData[] = $movements->where('date', $date)->where('type', 'in')->sum('count');
            $sortieData[] = $movements->where('date', $date)->where('type', 'out')->sum('count');
            $transfertData[] = $movements->where('date', $date)->where('type', 'transfer')->sum('count');
        }

        return [
            'labels' => $dates,
            'datasets' => [
                [
                    'label' => 'Entrées',
                    'data' => $entreeData,
                    'borderColor' => '#10B981',
                    'backgroundColor' => 'rgba(16, 185, 129, 0.1)',
                ],
                [
                    'label' => 'Sorties',
                    'data' => $sortieData,
                    'borderColor' => '#EF4444',
                    'backgroundColor' => 'rgba(239, 68, 68, 0.1)',
                ],
                [
                    'label' => 'Transferts',
                    'data' => $transfertData,
                    'borderColor' => '#3B82F6',
                    'backgroundColor' => 'rgba(59, 130, 246, 0.1)',
                ],
            ],
        ];
    }

    private function getTopProducts($limit = 5)
    {
        return Product::withSum(['stockMovementItems as total_movement' => function($query) {
            $query->join('stock_movements', 'stock_movement_items.stock_movement_id', '=', 'stock_movements.id')
                  ->where('stock_movements.status', 'completed')
                  ->where('stock_movements.created_at', '>=', now()->subDays(30));
        }], 'quantity')
        ->orderBy('total_movement', 'desc')
        ->limit($limit)
        ->get(['id', 'reference', 'name', 'image_url'])
        ->map(function($product) {
            return [
                'id' => $product->id,
                'reference' => $product->reference,
                'name' => $product->name,
                'image_url' => $product->image_url,
                'movement_count' => (float) ($product->total_movement ?? 0),
            ];
        });
    }

    private function getStockAlerts($limit = 5)
    {
        return Stock::with(['product', 'warehouse'])
            ->join('products', 'stocks.product_id', '=', 'products.id')
            ->where('stocks.quantity', '>', 0)
            ->whereRaw('stocks.quantity <= products.low_stock_alert')
            ->select('stocks.*')
            ->orderBy('stocks.quantity', 'asc')
            ->limit($limit)
            ->get()
            ->map(function($stock) {
                return [
                    'id' => $stock->id,
                    'product_id' => $stock->product_id,
                    'product_reference' => $stock->product->reference,
                    'product_name' => $stock->product->name,
                    'warehouse_name' => $stock->warehouse->name,
                    'current_stock' => (float) $stock->quantity,
                    'alert_threshold' => (float) $stock->product->low_stock_alert,
                    'image_url' => $stock->product->image_url,
                ];
            });
    }
}
