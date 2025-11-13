<?php

namespace App\Http\Controllers;

use App\Models\Warehouse;
use App\Models\Stock;
use Inertia\Inertia;
use Illuminate\Http\Request;

class WarehouseController extends Controller
{
    public function index(Request $request)
    {
        $warehouses = Warehouse::withCount(['stocks as total_products'])
            ->with(['stocks' => function($query) {
                $query->select('product_id', 'warehouse_id', 'quantity')
                      ->with('product:id,reference,name,image_url,low_stock_alert,packaging_type_id');
                    //   ->where('quantity', '>', 0);
            }])
            ->get();

        return Inertia::render('Warehouses/Index', [
            'warehouses' => $warehouses,
            'filters' => $request->all()
        ]);
    }

    public function show(Warehouse $warehouse, Request $request)
    {
        $stocks = $warehouse->stocks()
            ->with(['product' => function($query) {
                $query->select('id', 'reference', 'name', 'image_url', 'low_stock_alert', 'packaging_type_id')
                      ->with('packagingType:id,code');
            }])
            ->when($request->stock_level, function($query, $stockLevel) {
                if ($stockLevel === 'low') {
                    $query->where('quantity', '>', 0)
                          ->whereRaw('quantity <= (SELECT low_stock_alert FROM products WHERE products.id = stocks.product_id)');
                } elseif ($stockLevel === 'out') {
                    $query->where('quantity', '<=', 0);
                } elseif ($stockLevel === 'normal') {
                    $query->whereRaw('quantity > (SELECT low_stock_alert FROM products WHERE products.id = stocks.product_id)');
                }
            })
            ->paginate(5);

        return Inertia::render('Warehouses/Show', [
            'warehouse' => $warehouse,
            'stocks' => $stocks,
            'filters' => $request->all()
        ]);
    }

    public function create()
    {
        return Inertia::render('Warehouses/Create');
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'type' => 'required|in:depot,point_de_vente',
            'address' => 'nullable|string',
        ]);

        $validated['code'] = Warehouse::generateCode($request->type);

        Warehouse::create($validated);

        return redirect()->route('warehouses.index')
            ->with('success', 'Entrepôt créé avec succès');
    }

    public function edit(Warehouse $warehouse)
    {
        return Inertia::render('Warehouses/Edit', [
            'warehouse' => $warehouse
        ]);
    }

    public function update(Request $request, Warehouse $warehouse)
    {
        $request->validate([
            'name' => 'required|string|max:255',
            'type' => 'required|in:depot,point_de_vente',
            'address' => 'nullable|string',
        ]);

        $warehouse->update($request->all());

        return redirect()->route('warehouses.index')
            ->with('success', 'Entrepôt modifié avec succès');
    }

    public function destroy(Warehouse $warehouse)
    {
        // Vérifier s'il y a des stocks avant suppression
        if ($warehouse->stocks()->count() > 0) {
            return redirect()->back()
                ->with('error', 'Impossible de supprimer cet entrepôt car il contient des stocks');
        }

        $warehouse->delete();

        return redirect()->route('warehouses.index')
            ->with('success', 'Entrepôt supprimé avec succès');
    }

    // Méthode spécifique pour la vue stocks (alternative à show)
    public function stocks(Warehouse $warehouse, Request $request)
    {
        // Même logique que show() mais avec une vue différente si besoin
        return $this->show($warehouse, $request);
    }
}
