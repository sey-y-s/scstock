<?php

namespace App\Http\Controllers;

use App\Models\PackagingType;
use Inertia\Inertia;
use Illuminate\Http\Request;

class PackagingTypeController extends Controller
{
    public function index()
    {
        $packagingTypes = PackagingType::withCount('products')
            ->orderBy('name')
            ->get();

        return Inertia::render('PackagingTypes/Index', [
            'packagingTypes' => $packagingTypes,
        ]);
    }

    public function create()
    {
        return Inertia::render('PackagingTypes/Create');
    }

    public function store(Request $request)
    {
        $request->validate([
            'code' => 'required|string|max:10|unique:packaging_types',
            'name' => 'required|string|max:255',
            'description' => 'nullable|string',
        ]);

        PackagingType::create($request->all());

        return redirect()->route('packaging-types.index')
            ->with('success', 'Type d\'emballage créé avec succès');
    }

    public function show(PackagingType $packagingType)
    {
        $packagingType->loadCount('products');

        $products = $packagingType->products()
            ->with(['stocks.warehouse', 'category'])
            ->withCount('stocks')
            ->orderBy('reference')
            ->paginate(10);

        return Inertia::render('PackagingTypes/Show', [
            'packagingType' => $packagingType,
            'products' => $products,
        ]);
    }

    public function edit(PackagingType $packagingType)
    {
        return Inertia::render('PackagingTypes/Edit', [
            'packagingType' => $packagingType,
        ]);
    }

    public function update(Request $request, PackagingType $packagingType)
    {
        $request->validate([
            'code' => 'required|string|max:10|unique:packaging_types,code,' . $packagingType->id,
            'name' => 'required|string|max:255',
            'description' => 'nullable|string',
        ]);

        $packagingType->update($request->all());

        return redirect()->route('packaging-types.index')
            ->with('success', 'Type d\'emballage modifié avec succès');
    }

    public function destroy(PackagingType $packagingType)
    {
        // Vérifier s'il y a des produits associés
        if ($packagingType->products()->count() > 0) {
            return redirect()->back()
                ->with('error', 'Impossible de supprimer ce type d\'emballage car il est utilisé par des produits.');
        }

        $packagingType->delete();

        return redirect()->route('packaging-types.index')
            ->with('success', 'Type d\'emballage supprimé avec succès');
    }
}
