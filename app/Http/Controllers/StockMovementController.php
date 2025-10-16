<?php

namespace App\Http\Controllers;

use App\Models\StockMovement;
use App\Models\Product;
use App\Models\Warehouse;
use App\Models\Supplier;
use App\Models\Customer;
use Illuminate\Http\Request;
use Inertia\Inertia;

class StockMovementController extends Controller
{
    public function index()
    {
        return Inertia::render('StockMovements/Index', [
            'movements' => StockMovement::with([
                'fromWarehouse', 
                'toWarehouse', 
                'supplier', 
                'customer',
                'user',
                'items.product'
            ])->latest()->get()
        ]);
    }

    public function create()
    {
        return Inertia::render('StockMovements/Create', [
            'products' => Product::with(['packagingType'])->where('is_active', true)->get(),
            'warehouses' => Warehouse::where('is_active', true)->get(),
            'suppliers' => Supplier::where('is_active', true)->get(),
            'customers' => Customer::where('is_active', true)->get(),
            'references' => [
                'in' => StockMovement::generateReference('in'),
                'out' => StockMovement::generateReference('out'),
                'transfer' => StockMovement::generateReference('transfer')
            ]
        ]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'type' => 'required|in:in,out,transfer',
            'from_warehouse_id' => 'required_if:type,out,transfer|exists:warehouses,id',
            'to_warehouse_id' => 'required_if:type,in,transfer|exists:warehouses,id',
            'supplier_id' => 'required_if:type,in|exists:suppliers,id',
            'customer_id' => 'required_if:type,out|exists:customers,id',
            'notes' => 'nullable|string',
            'movement_date' => 'required|date',
            'items' => 'required|array|min:1',
            'items.*.product_id' => 'required|exists:products,id',
            'items.*.quantity' => 'required|numeric|min:0.125',
            'items.*.unit_price' => 'required|numeric|min:0',
        ]);

        // Créer le mouvement
        $movement = StockMovement::create(array_merge($validated, [
            'reference' => StockMovement::generateReference($validated->type),
            'user_id' => auth()->id(),
            'status' => 'completed'
        ]));

        // Ajouter les items
        foreach ($request->items as $item) {
            $movement->items()->create($item);
            
            // Mettre à jour les stocks (à implémenter)
            $this->updateStock($movement, $item);
        }

        return redirect()->route('stock-movements.show', $movement)
            ->with('success', 'Mouvement de stock créé avec succès.');
    }

    public function show(StockMovement $stockMovement)
    {
        return Inertia::render('StockMovements/Show', [
            'movement' => $stockMovement->load([
                'fromWarehouse', 
                'toWarehouse', 
                'supplier', 
                'customer',
                'user',
                'items.product.packagingType'
            ])
        ]);
    }

    public function edit(StockMovement $stockMovement)
    {
        return Inertia::render('StockMovements/Edit', [
            'movement' => $stockMovement->load(['items.product.packagingType']),
            'products' => Product::with(['packagingType'])->where('is_active', true)->get(),
            'warehouses' => Warehouse::where('is_active', true)->get(),
            'suppliers' => Supplier::where('is_active', true)->get(),
            'customers' => Customer::where('is_active', true)->get(),
        ]);
    }

    public function update(Request $request, StockMovement $stockMovement)
    {
        $validated = $request->validate([
            'type' => 'required|in:in,out,transfer',
            'from_warehouse_id' => 'required_if:type,out,transfer|exists:warehouses,id',
            'to_warehouse_id' => 'required_if:type,in,transfer|exists:warehouses,id',
            'supplier_id' => 'required_if:type,in|exists:suppliers,id',
            'customer_id' => 'required_if:type,out|exists:customers,id',
            'notes' => 'nullable|string',
            'movement_date' => 'required|date',
            'items' => 'required|array|min:1',
            'items.*.product_id' => 'required|exists:products,id',
            'items.*.quantity' => 'required|numeric|min:0.125',
            'items.*.unit_price' => 'required|numeric|min:0',
        ]);

        // Mettre à jour le mouvement
        $stockMovement->update($validated);

        // Synchroniser les items
        $stockMovement->items()->delete();
        foreach ($request->items as $item) {
            $stockMovement->items()->create($item);
        }

        return redirect()->route('stock-movements.show', $stockMovement)
            ->with('success', 'Mouvement de stock mis à jour avec succès.');
    }

    public function destroy(StockMovement $stockMovement)
    {
        $stockMovement->items()->delete();
        $stockMovement->delete();

        return redirect()->route('stock-movements.index')
            ->with('success', 'Mouvement de stock supprimé avec succès.');
    }

    private function updateStock(StockMovement $movement, $item)
    {
        // À implémenter : logique de mise à jour des stocks
        // selon le type de mouvement (in, out, transfer)
    }
}