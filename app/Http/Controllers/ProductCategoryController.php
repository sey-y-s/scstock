<?php

namespace App\Http\Controllers;

use App\Models\ProductCategory;
use Inertia\Inertia;
use Illuminate\Http\Request;

class ProductCategoryController extends Controller
{
    public function index()
    {
        $categories = ProductCategory::withCount('products')
            ->orderBy('name')
            ->get();

        return Inertia::render('ProductCategories/Index', [
            'categories' => $categories,
        ]);
    }

    public function create()
    {
        return Inertia::render('ProductCategories/Create');
    }

    public function store(Request $request)
    {
        $request->validate([
            'code' => 'required|string|max:10|unique:product_categories',
            'name' => 'required|string|max:255',
            'description' => 'nullable|string',
        ]);

        ProductCategory::create($request->all());

        return redirect()->route('product-categories.index')
            ->with('success', 'Catégorie créée avec succès');
    }

    public function show(ProductCategory $productCategory)
    {
        $productCategory->load(['products' => function($query) {
            $query->with(['stocks.warehouse', 'packagingType'])
                  ->withCount('stocks')
                  ->orderBy('reference');
        }]);

        return Inertia::render('ProductCategories/Show', [
            'category' => $productCategory,
            'products' => $productCategory->products()->paginate(5),
        ]);
    }

    public function edit(ProductCategory $productCategory)
    {
        return Inertia::render('ProductCategories/Edit', [
            'category' => $productCategory,
        ]);
    }

    public function update(Request $request, ProductCategory $productCategory)
    {
        $request->validate([
            'code' => 'required|string|max:10|unique:product_categories,code,' . $productCategory->id,
            'name' => 'required|string|max:255',
            'description' => 'nullable|string',
        ]);

        $productCategory->update($request->all());

        return redirect()->route('product-categories.index')
            ->with('success', 'Catégorie modifiée avec succès');
    }

    public function destroy(ProductCategory $productCategory)
    {
        // Vérifier s'il y a des produits associés
        if ($productCategory->products()->count() > 0) {
            return redirect()->back()
                ->with('error', 'Impossible de supprimer cette catégorie car elle contient des produits.');
        }

        $productCategory->delete();

        return redirect()->route('product-categories.index')
            ->with('success', 'Catégorie supprimée avec succès');
    }
}
