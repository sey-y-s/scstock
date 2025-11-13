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
        $query = Stock::with([
            'product' => function($q) {
                $q->select('id', 'reference', 'name', 'image_url', 'low_stock_alert')
                    ->with('packagingType:id,name,code');
            },
            'warehouse' => function($q) {
                $q->select('id', 'name', 'type', 'code');
            }
        ])->latest('updated_at');

        // Filtre entrepôt
        if ($request->warehouse_id) {
            $query->where('warehouse_id', $request->warehouse_id);
        }

        // Filtre produit
        if ($request->product_id) {
            $query->where('product_id', $request->product_id);
        }

        // Filtre niveau de stock
        if ($request->stock_level) {
            if ($request->stock_level === 'low') {
                $query->where('quantity', '>', 0)
                    ->whereRaw('quantity <= (SELECT low_stock_alert FROM products WHERE products.id = stocks.product_id)');
            } elseif ($request->stock_level === 'out') {
                $query->where('quantity', '<=', 0);
            } elseif ($request->stock_level === 'normal') {
                $query->whereRaw('quantity > (SELECT low_stock_alert FROM products WHERE products.id = stocks.product_id)');
            }
        }

        $stocks = $query->paginate(5);

        return Inertia::render('Stocks/Index', [
            'stocks' => $stocks,
            'warehouses' => Warehouse::select('id', 'name', 'type')->get(),
            'products' => Product::select('id', 'reference', 'name')->limit(50)->get(), // Réduit pour performance | modifier plus tard
            'filters' => $request->all()
        ]);
    }

    public function create(Request $request)
    {
        $id = $request->warehouse_id;
        return Inertia::render('Stocks/Create', [
            'products' => Product::with(['packagingType'])->where('is_active', true)->get(),
            'warehouses' => Warehouse::where('is_active', true)->get(),
            'id' => $id,
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
