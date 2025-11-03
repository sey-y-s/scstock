<?php

namespace App\Http\Controllers;

use App\Models\Stock;
use App\Models\Product;
use App\Models\Warehouse;
use Illuminate\Http\Request;
use Inertia\Inertia;

class StockController extends Controller
{
    public function index(Request $request)
    {
        // Filtres possibles
        $warehouseId = $request->get('warehouse_id');
        $productId = $request->get('product_id');
        $stockLevel = $request->get('stock_level'); // low, normal, out

        $query = Stock::with(['product.packagingType', 'product.category', 'warehouse'])
            ->join('products', 'stocks.product_id', '=', 'products.id')
            ->select('stocks.*');

        // Filtre par entrepôt
        if ($warehouseId) {
            $query->where('stocks.warehouse_id', $warehouseId);
        }

        // Filtre par produit
        if ($productId) {
            $query->where('stocks.product_id', $productId);
        }

        // Filtre par niveau de stock
        if ($stockLevel) {
            switch ($stockLevel) {
                case 'low':
                    $query->whereRaw('stocks.quantity <= products.low_stock_alert');
                    break;
                case 'out':
                    $query->where('stocks.quantity', '<=', 0);
                    break;
                case 'normal':
                    $query->whereRaw('stocks.quantity > products.low_stock_alert');
                    break;
            }
        }

        $stocks = $query->orderBy('products.name')
            ->paginate(25)
            ->withQueryString();

        return Inertia::render('Stocks/Index', [
            'stocks' => $stocks,
            'warehouses' => Warehouse::where('is_active', true)->get(),
            'products' => Product::with(['category'])->where('is_active', true)->get(),
            'filters' => [
                'warehouse_id' => $warehouseId,
                'product_id' => $productId,
                'stock_level' => $stockLevel,
            ]
        ]);
    }

    public function create()
    {
        return Inertia::render('Stocks/Create', [
            'products' => Product::with(['packagingType'])->where('is_active', true)->get(),
            'warehouses' => Warehouse::where('is_active', true)->get(),
        ]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'product_id' => 'required|exists:products,id',
            'warehouse_id' => 'required|exists:warehouses,id',
            'quantity' => 'required|numeric|min:0',
        ]);

        // Vérifier si le stock existe déjà
        $existingStock = Stock::where('product_id', $validated['product_id'])
            ->where('warehouse_id', $validated['warehouse_id'])
            ->first();

        if ($existingStock) {
            return back()->withErrors([
                'product_id' => 'Ce produit est déjà en stock dans cet entrepôt. Utilisez la modification.'
            ])->withInput();
        }

        Stock::create($validated);

        return redirect()->route('stocks.index')
            ->with('success', 'Stock créé avec succès.');
    }

    public function show(Stock $stock)
    {
        $stock->load([
            'product.packagingType',
            'product.category',
            'warehouse',
            'product.stockMovementItems.stockMovement' => function($query) use ($stock) {
                $query->where('from_warehouse_id', $stock->warehouse_id)
                      ->orWhere('to_warehouse_id', $stock->warehouse_id)
                      ->orderBy('movement_date', 'desc')
                      ->limit(10);
            }
        ]);

        return Inertia::render('Stocks/Show', [
            'stock' => $stock,
            'recentMovements' => $stock->product->stockMovementItems->take(10)
        ]);
    }

    public function edit(Stock $stock)
    {
        $stock->load(['product.packagingType', 'warehouse']);

        return Inertia::render('Stocks/Edit', [
            'stock' => $stock,
            'products' => Product::where('is_active', true)->get(),
            'warehouses' => Warehouse::where('is_active', true)->get(),
        ]);
    }

    public function update(Request $request, Stock $stock)
    {
        $validated = $request->validate([
            'product_id' => 'required|exists:products,id',
            'warehouse_id' => 'required|exists:warehouses,id',
            'quantity' => 'required|numeric|min:0',
        ]);

        // Vérifier les conflits (même produit dans même entrepôt mais stock différent)
        $conflictingStock = Stock::where('product_id', $validated['product_id'])
            ->where('warehouse_id', $validated['warehouse_id'])
            ->where('id', '!=', $stock->id)
            ->first();

        if ($conflictingStock) {
            return back()->withErrors([
                'product_id' => 'Ce produit est déjà en stock dans cet entrepôt avec un autre enregistrement.'
            ])->withInput();
        }

        $stock->update($validated);

        return redirect()->route('stocks.show', $stock)
            ->with('success', 'Stock mis à jour avec succès.');
    }

    public function destroy(Stock $stock)
    {
        $stock->delete();

        return redirect()->route('stocks.index')
            ->with('success', 'Stock supprimé avec succès.');
    }

    /**
     * API pour les stocks faibles
     */
    public function lowStockAlerts()
    {
        $lowStocks = Stock::with(['product.packagingType', 'warehouse'])
            ->join('products', 'stocks.product_id', '=', 'products.id')
            ->whereRaw('stocks.quantity <= products.low_stock_alert')
            ->where('stocks.quantity', '>', 0)
            ->orderBy('stocks.quantity', 'asc')
            ->get(['stocks.*']);

        return response()->json($lowStocks);
    }

    /**
     * API pour les ruptures de stock
     */
    public function outOfStock()
    {
        $outOfStocks = Stock::with(['product.packagingType', 'warehouse'])
            ->where('quantity', '<=', 0)
            ->orderBy('product_id')
            ->get();

        return response()->json($outOfStocks);
    }
}
