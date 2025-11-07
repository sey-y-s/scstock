<?php

namespace App\Http\Controllers;

use Inertia\Inertia;
use App\Models\Customer;
use Illuminate\Http\Request;

class CustomerController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        return Inertia::render('Customers/Index', [
            'customers' => Customer::all(),
        ]);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        return Inertia::render('Customers/Create', [
            'customers' => Customer::all(),
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

        $customer = Customer::create($validated);

        if ($request->wantsJson()) {
            return response()->json($customer);
        }

        return redirect()->route('customers.index')
            ->with('success', 'Client créé avec succès.');
    }

    /**
     * Display the specified resource.
     */
    // public function show(string $id)
    // {
    //     $customer = Customer::find($id);
    //     return Inertia::render('Customers/Show', [
    //         'customer'=> $customer,
    //     ]);
    // }
    public function show(Customer $customer)
    {
        return Inertia::render('Customers/Show', [
            'customer' => $customer,
            'recentMovements' => $customer->recentMovements(10),
            'stats' => [
                'total_transactions' => $customer->total_transactions,
                'last_transaction' => $customer->movements()
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
        $customer = Customer::find($id);
        return Inertia::render('Customers/Edit', [
            'customer'=> $customer,
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
        $customer = Customer::find($id);
        $customer->update($validated);

        return redirect()->route('customers.index')
            ->with('success', 'Client créé avec succès.');
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id)
    {
        $customer = Customer::find($id);
        $customer->delete();
        return redirect()->route('customers.index')
            ->with('success','Client supprimé avec succès.');
    }
}
