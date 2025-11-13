<?php

namespace App\Http\Controllers;

use Inertia\Inertia;
use App\Models\Stock;
use App\Models\Product;
use App\Models\Customer;
use App\Models\Supplier;
use App\Models\Warehouse;
use Illuminate\Http\Request;
use App\Models\StockMovement;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Auth;

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
                'items.product.packagingType'
            ])->latest()->paginate(5)
        ]);
    }

    public function create()
    {
        return Inertia::render('StockMovements/Create');
    }

    //-----------------------------------------------------------------------

    public function createIncoming()
    {
        return Inertia::render('StockMovements/Create/Incoming', [
            'products' => Product::with(['packagingType'])->where('is_active', true)->get(),
            'warehouses' => Warehouse::where('is_active', true)->get(),
            'suppliers' => Supplier::where('is_active', true)->get(),
            'reference' => StockMovement::generateReference('in')
        ]);
    }

    public function createOutgoing()
    {
        return Inertia::render('StockMovements/Create/Outgoing', [
            'products' => Product::with(['packagingType'])->where('is_active', true)->get(),
            'warehouses' => Warehouse::where('is_active', true)->get(),
            'customers' => Customer::where('is_active', true)->get(),
            'reference' => StockMovement::generateReference('out')
        ]);
    }

    public function createTransfer()
    {
        return Inertia::render('StockMovements/Create/Transfer', [
            'products' => Product::with(['packagingType'])->where('is_active', true)->get(),
            'warehouses' => Warehouse::where('is_active', true)->get(),
            'reference' => StockMovement::generateReference('transfer')
        ]);
    }

    //------------------------------------------------------------------------

    public function storeIncoming(Request $request)
    {
        $validated = $request->validate([
            'to_warehouse_id' => 'required|exists:warehouses,id',
            'supplier_id' => 'nullable|exists:suppliers,id',
            'new_supplier_name' => 'nullable|string|max:255',
            'notes' => 'nullable|string',
            'movement_date' => 'required|date',
        ]);

        // Gérer la création d'un nouveau fournisseur si nécessaire
        $supplierId = $this->handleSupplierCreation($validated);

        // Créer le mouvement en statut "draft"
        $movement = StockMovement::create([
            'reference' => StockMovement::generateReference('in'),
            'type' => 'in',
            'to_warehouse_id' => $validated['to_warehouse_id'],
            'supplier_id' => $supplierId,
            'user_id' => Auth::id(),
            'notes' => $validated['notes'] ?? null,
            'movement_date' => $validated['movement_date'],
            'status' => 'draft'
        ]);

        return redirect()->route('operations.add-products', $movement)
            ->with('success', 'Approvisionnement créé. Ajoutez maintenant les produits.');
    }

    public function storeOutgoing(Request $request)
    {
        $validated = $request->validate([
            'from_warehouse_id' => 'required|exists:warehouses,id',
            'customer_id' => 'nullable|exists:customers,id',
            'new_customer_name' => 'nullable|string|max:255',
            'notes' => 'nullable|string',
            'movement_date' => 'required|date',
        ]);

        // Gérer la création d'un nouveau client si nécessaire
        $customerId = $this->handleCustomerCreation($validated);

        // Créer le mouvement en statut "draft"
        $movement = StockMovement::create([
            'reference' => StockMovement::generateReference('out'),
            'type' => 'out',
            'from_warehouse_id' => $validated['from_warehouse_id'],
            'customer_id' => $customerId,
            'user_id' => Auth::id(),
            'notes' => $validated['notes'] ?? null,
            'movement_date' => $validated['movement_date'],
            'status' => 'draft'
        ]);

        return redirect()->route('operations.add-products', $movement)
            ->with('success', 'Vente créée. Ajoutez maintenant les produits.');
    }

    public function storeTransfer(Request $request)
    {
        $validated = $request->validate([
            'from_warehouse_id' => 'required|exists:warehouses,id',
            'to_warehouse_id' => 'required|exists:warehouses,id',
            'notes' => 'nullable|string',
            'movement_date' => 'required|date',
        ]);

        // Vérifier que les dépôts sont différents
        if ($validated['from_warehouse_id'] === $validated['to_warehouse_id']) {
            return back()->withErrors([
                'to_warehouse_id' => 'Les dépôts source et destination doivent être différents.'
            ])->withInput();
        }

        // Créer le mouvement en statut "draft"
        $movement = StockMovement::create([
            'reference' => StockMovement::generateReference('transfer'),
            'type' => 'transfer',
            'from_warehouse_id' => $validated['from_warehouse_id'],
            'to_warehouse_id' => $validated['to_warehouse_id'],
            'user_id' => Auth::id(),
            'notes' => $validated['notes'] ?? null,
            'movement_date' => $validated['movement_date'],
            'status' => 'draft'
        ]);

        return redirect()->route('operations.add-products', $movement)
            ->with('success', 'Transfert créé. Ajoutez maintenant les produits.');
    }


    //------------------------------------------------------------------------


    public function addProducts(StockMovement $movement)
    {
        // Vérifier que le mouvement est en draft
        if ($movement->status !== 'draft') {
            return redirect()->route('operations.show', $movement)
                ->with('error', 'Ce mouvement est déjà complété.');
        }

        // Déterminer l'entrepôt pour la recherche
        $warehouseId = $this->getSearchWarehouseId($movement);

        return Inertia::render('StockMovements/AddProducts', [
            'movement' => $movement->load(['fromWarehouse', 'toWarehouse', 'supplier', 'customer']),
            'warehouseId' => $warehouseId,
            'existingItems' => $movement->items->map(function($item) use ($movement) {
                $warehouseId = $this->getSearchWarehouseId($movement);
                $stock = $item->product->stocks->where('warehouse_id', $warehouseId)->first();

                return [
                    'product_id' => $item->product_id,
                    'reference' => $item->product->reference,
                    'name' => $item->product->name,
                    'packaging_type' => $item->product->packagingType->name,
                    'image_url' => $item->product->image_url,
                    'quantity' => floatval($item->quantity),
                    'unit_price' => $item->unit_price,
                    'current_stock' => $stock ? floatval($stock->quantity) : 0,
                    'available' => $item->product->is_active,
                ];
            })
        ]);
    }

    public function completeMovement(Request $request, StockMovement $movement)
    {
        // Vérifier que le mouvement est en draft
        if ($movement->status !== 'draft') {
            return back()->withErrors(['error' => 'Ce mouvement est déjà complété.']);
        }

        $validated = $request->validate([
            'items' => 'required|array|min:1',
            'items.*.product_id' => 'required|exists:products,id',
            'items.*.quantity' => 'required|numeric|min:0.125',
            'items.*.unit_price' => 'required|integer|min:0',
        ]);

        // Pour les transferts, on vérifie que les dépôts sont toujours différents
        if ($movement->type === 'transfer' && $movement->from_warehouse_id === $movement->to_warehouse_id) {
            return back()->withErrors(['error' => 'Les dépôts source et destination doivent être différents.']);
        }

        try {
            // Vérifier la disponibilité des stocks pour les sorties et transferts
            if (in_array($movement->type, ['out', 'transfer'])) {
                $this->validateStockAvailability($movement, $validated['items']);
            }

            // Traiter les items et mettre à jour les stocks
            $this->processMovementItems($movement, $validated['items']);

            // Marquer le mouvement comme complété
            $movement->update(['status' => 'completed']);

            return redirect()->route('operations.show', $movement)
                ->with('success', $this->getSuccessMessage($movement->type));

        } catch (\Illuminate\Validation\ValidationException $e) {
            return back()->withErrors(['stock' => $e->getMessage()])->withInput();
        } catch (\Exception $e) {
            return back()->withErrors(['error' => $e->getMessage()])->withInput();
        }
    }

    /**
     * Détermine l'ID de l'entrepôt pour la recherche des produits
     */
    private function getSearchWarehouseId(StockMovement $movement)
    {
        switch ($movement->type) {
            case 'in':
                return null; // Pour les approvisionnements, on montre tous les produits
            case 'out':
                return $movement->from_warehouse_id; // Produits du dépôt source
            case 'transfer':
                return $movement->from_warehouse_id; // Produits du dépôt source
            default:
                return null;
        }
    }

    /**
     * Valide la disponibilité du stock pour un mouvement
     */
    private function validateStockAvailability(StockMovement $movement, array $items)
    {
        $errors = [];

        foreach ($items as $index => $item) {
            $productId = $item['product_id'];
            $quantity = floatval($item['quantity']);

            // Déterminer l'entrepôt source selon le type
            $warehouseId = $movement->type === 'transfer' ?
                $movement->from_warehouse_id : $movement->from_warehouse_id;

            $stock = Stock::where('product_id', $productId)
                        ->where('warehouse_id', $warehouseId)
                        ->first();

            $availableQuantity = $stock ? floatval($stock->quantity) : 0;
            $product = Product::find($productId);

            if ($availableQuantity < $quantity) {
                $errors[] = [
                    'product' => $product->name ?? "Produit ID: {$productId}",
                    'reference' => $product->reference ?? 'N/A',
                    'available' => $availableQuantity,
                    'requested' => $quantity,
                    'missing' => $quantity - $availableQuantity
                ];
            }
        }

        if (!empty($errors)) {
            $errorMessages = array_map(function($error) {
                return "{$error['reference']} - {$error['product']}: Stock disponible: {$error['available']}, Quantité demandée: {$error['requested']}";
            }, $errors);

            throw new \Exception("Stocks insuffisants:\n" . implode("\n", $errorMessages));
        }
    }

    /**
     * Traite les items et met à jour les stocks
     */
    private function processMovementItems(StockMovement $movement, array $items)
    {
        DB::transaction(function () use ($movement, $items) {
            foreach ($items as $item) {
                // Créer l'item du mouvement
                $movement->items()->create([
                    'product_id' => $item['product_id'],
                    'quantity' => $item['quantity'],
                    'unit_price' => $item['unit_price']
                ]);

                // Mettre à jour les stocks selon le type
                switch ($movement->type) {
                    case 'in':
                        $this->updateStock(
                            $item['product_id'],
                            $movement->to_warehouse_id,
                            $item['quantity'],
                            'in'
                        );
                        break;

                    case 'out':
                        $this->updateStock(
                            $item['product_id'],
                            $movement->from_warehouse_id,
                            $item['quantity'],
                            'out'
                        );
                        break;

                    case 'transfer':
                        // Diminuer le stock source
                        $this->updateStock(
                            $item['product_id'],
                            $movement->from_warehouse_id,
                            $item['quantity'],
                            'out'
                        );
                        // Augmenter le stock destination
                        $this->updateStock(
                            $item['product_id'],
                            $movement->to_warehouse_id,
                            $item['quantity'],
                            'in'
                        );
                        break;
                }
            }
        });
    }

    /**
     * Message de succès selon le type
     */
    private function getSuccessMessage($type)
    {
        $messages = [
            'in' => 'Approvisionnement complété avec succès.',
            'out' => 'Vente complétée avec succès.',
            'transfer' => 'Transfert complété avec succès.'
        ];

        return $messages[$type] ?? 'Mouvement complété avec succès.';
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
        $movement = $stockMovement->load(['items.product.packagingType']);

        return Inertia::render('StockMovements/Edit', [
            'movement' => $movement->load(['fromWarehouse', 'toWarehouse', 'supplier', 'customer']),
            'products' => Product::with(['packagingType'])->where('is_active', true)->get(),
            'warehouses' => Warehouse::where('is_active', true)->get(),
            'suppliers' => Supplier::where('is_active', true)->get(),
            'customers' => Customer::where('is_active', true)->get(),
            'existingItems' => $movement->items->map(function($item) use ($movement) {
                $warehouseId = $this->getSearchWarehouseId($movement);
                $stock = $item->product->stocks->where('warehouse_id', $warehouseId)->first();

                return [
                    'product_id' => $item->product_id,
                    'reference' => $item->product->reference,
                    'name' => $item->product->name,
                    'packaging_type' => $item->product->packagingType->name,
                    'image_url' => $item->product->image_url,
                    'quantity' => floatval($item->quantity),
                    'unit_price' => $item->unit_price,
                    'current_stock' => $stock ? floatval($stock->quantity) : 0,
                    'available' => $item->product->is_active,
                ];
            })
        ]);
    }

    public function update(Request $request, StockMovement $stockMovement)
    {
        $validated = $request->validate([
            'from_warehouse_id' => 'nullable|exists:warehouses,id',
            'to_warehouse_id' => 'nullable|exists:warehouses,id',
            'supplier_id' => 'nullable|exists:suppliers,id',
            'customer_id' => 'nullable|exists:customers,id',
            'notes' => 'nullable|string',
            'movement_date' => 'required|date',
            'items' => 'required|array|min:1',
            'items.*.product_id' => 'required|exists:products,id',
            'items.*.quantity' => 'required|numeric|min:0.25',
            'items.*.unit_price' => 'required|numeric|min:0',
        ]);

        // Mettre à jour le mouvement
        $stockMovement->update($validated);

        // Synchroniser les items
        $stockMovement->items()->delete();
        $this->processMovementItems($stockMovement, $validated['items'], $stockMovement->type);

        return redirect()->route('operations.show', $stockMovement)
            ->with('success', 'Mouvement de stock mis à jour avec succès.');
    }

    public function destroy(StockMovement $stockMovement)
    {
        // Annuler l'impact sur les stocks avant suppression
        $this->reverseStockImpact($stockMovement);

        $stockMovement->items()->delete();
        $stockMovement->delete();

        return redirect()->route('operations.index')
            ->with('success', 'Mouvement de stock supprimé avec succès.');
    }


    /**
     * Gère la création d'un nouveau fournisseur si nécessaire
     */
    private function handleSupplierCreation(array $validated)
    {
        if (!empty($validated['new_supplier_name']) && empty($validated['supplier_id'])) {
            $supplier = Supplier::create([
                'name' => $validated['new_supplier_name'],
                'is_active' => true
            ]);
            return $supplier->id;
        }

        return $validated['supplier_id'] ?? null;
    }

    /**
     * Gère la création d'un nouveau client si nécessaire
     */
    private function handleCustomerCreation(array $validated)
    {
        if (!empty($validated['new_customer_name']) && empty($validated['customer_id'])) {
            $customer = Customer::create([
                'name' => $validated['new_customer_name'],
                'is_active' => true
            ]);
            return $customer->id;
        }

        return $validated['customer_id'] ?? null;
    }


    /**
     * Met à jour le stock d'un produit dans un entrepôt
     */
    private function updateStock($productId, $warehouseId, $quantity, $operation)
    {
        $stock = Stock::firstOrCreate([
            'product_id' => $productId,
            'warehouse_id' => $warehouseId,
        ]);

        if ($operation === 'in') {
            $stock->quantity += $quantity;
        } else {
            $stock->quantity -= $quantity;
        }

        $stock->save();
    }

    /**
     * Annule l'impact d'un mouvement sur les stocks (pour suppression/annulation)
     */
    private function reverseStockImpact(StockMovement $movement)
    {
        foreach ($movement->items as $item) {
            switch ($movement->type) {
                case 'in':
                    $this->updateStock(
                        $item->product_id,
                        $movement->to_warehouse_id,
                        $item->quantity,
                        'out'
                    );
                    break;

                case 'out':
                    $this->updateStock(
                        $item->product_id,
                        $movement->from_warehouse_id,
                        $item->quantity,
                        'in'
                    );
                    break;

                case 'transfer':
                    // Re-transférer du destination vers source
                    $this->updateStock(
                        $item->product_id,
                        $movement->to_warehouse_id,
                        $item->quantity,
                        'out'
                    );
                    $this->updateStock(
                        $item->product_id,
                        $movement->from_warehouse_id,
                        $item->quantity,
                        'in'
                    );
                    break;
            }
        }
    }

    /**
     * Vérifie la disponibilité du stock avant une opération de sortie ou de transfert
     */
    private function checkStockAvailability($productId, $warehouseId, $quantity, $type)
    {
        if ($type === 'in') return true; // car les entrées sont toujours possibles

        $stock = Stock::where('product_id', $productId)
                    ->where('warehouse_id', $warehouseId)
                    ->first();

        if (!$stock) return false;

        return $stock->quantity >= $quantity;
    }
}
