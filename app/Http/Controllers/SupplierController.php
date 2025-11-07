<?php

namespace App\Http\Controllers;

use Inertia\Inertia;
use App\Models\Supplier;
use Illuminate\Http\Request;

class SupplierController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        return Inertia::render('Suppliers/Index', [
            'suppliers' => Supplier::all(),
        ]);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        return Inertia::render('Suppliers/Create', [
            'suppliers'=> Supplier::all(),
        ]);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'contact_email' => 'nullable|email',
            'contact_phone' => 'nullable|string|max:20',
            'address' => 'nullable|string'
        ]);

        $supplier = Supplier::create($validated);

        if ($request->wantsJson()) {
            return response()->json($supplier);
        }

        return redirect()->route('suppliers.index')
            ->with('success', 'Fournisseur créé avec succès.');
    }

    /**
     * Display the specified resource.
     */
    // public function show(string $id)
    // {
    //     $supplier = Supplier::find($id);
    //     return Inertia::render('Suppliers/Show', [
    //         'supplier'=> $supplier,
    //     ]);
    // }
    public function show(Supplier $supplier)
    {
        return Inertia::render('Suppliers/Show', [
            'supplier' => $supplier,
            'recentMovements' => $supplier->recentMovements(10),
            'stats' => [
                'total_transactions' => $supplier->total_transactions,
                'last_transaction' => $supplier->movements()
                    ->where('status', 'completed')
                    ->orderBy('created_at', 'desc')
                    ->first()?->created_at,
            ]
        ]);
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(string $id)
    {
        $supplier = Supplier::find($id);
        return Inertia::render('Suppliers/Edit', [
            'supplier'=> $supplier,
        ]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, string $id)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'contact_email' => 'nullable|email',
            'contact_phone' => 'nullable|string|max:20',
            'address' => 'nullable|string'
        ]);
        $supplier = Supplier::find($id);
        $supplier->update($validated);

        return redirect()->route('suppliers.index')
            ->with('success', 'Fournisseur créé avec succès.');
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id)
    {
        $supplier = Supplier::find($id);
        $supplier->delete();
        return redirect()->route('suppliers.index')
        ->with('success','Fournisseur supprimé avec succès.');
    }
}
