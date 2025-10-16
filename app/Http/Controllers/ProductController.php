<?php

namespace App\Http\Controllers;

use App\Models\Product;
use App\Models\ProductCategory;
use App\Models\PackagingType;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Inertia\Inertia;

class ProductController extends Controller
{
    public function index()
    {
        return Inertia::render('Products/Index', [
            'products' => Product::with(['category', 'packagingType'])
                ->latest()
                ->get()
        ]);
    }

    public function create()
    {
        return Inertia::render('Products/Create', [
            'categories' => ProductCategory::all(),
            'packagingTypes' => PackagingType::where('is_active', true)->get()
        ]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'description' => 'nullable|string',
            'category_id' => 'nullable|exists:product_categories,id',
            'packaging_type_id' => 'required|exists:packaging_types,id',
            'purchase_price' => 'required|integer|min:0',
            'low_stock_alert' => 'required|numeric|min:0.125',
            'image' => 'nullable|image|max:2048',
        ]);

        // Génération automatique de la référence
        if ($request->category_id) {
            $category = ProductCategory::find($request->category_id);
            $reference = Product::generateReference($category->code);
        } else {
            $validated['reference'] = $request->validate([
                'reference' => 'required|unique:products'
            ])['reference'];
        }

        // Gestion de l'image
        $imageUrl = null;
        if ($request->hasFile('image')) {
            $imagePath = $request->file('image')->store('products', 'public');
            $imageUrl = Storage::url($imagePath);
        }

        $productData = array_merge($validated, [
            'reference' => $reference ?? $validated['reference'],
            'image_url' => $imageUrl
        ]);

        Product::create($productData);

        return redirect()->route('products.index')
            ->with('success', 'Produit créé avec succès.');
    }

    public function show(Product $product)
    {
        return Inertia::render('Products/Show', [
            'product' => $product->load(['category', 'packagingType', 'stocks.warehouse'])
        ]);
    }

    public function edit(Product $product)
    {
        return Inertia::render('Products/Edit', [
            'product' => $product,
            'categories' => ProductCategory::all(),
            'packagingTypes' => PackagingType::where('is_active', true)->get()
        ]);
    }

    public function update(Request $request, Product $product)
    {
        $validated = $request->validate([
            'reference' => 'required|unique:products,reference,' . $product->id,
            'name' => 'required|string|max:255',
            'description' => 'nullable|string',
            'category_id' => 'nullable|exists:product_categories,id',
            'packaging_type_id' => 'required|exists:packaging_types,id',
            'purchase_price' => 'required|integer|min:0',
            'low_stock_alert' => 'required|numeric|min:0.125',
            'image' => 'nullable|image|max:2048',
        ]);

        // Gestion de l'image
        if ($request->hasFile('image')) {
            // Supprimer l'ancienne image
            if ($product->image_url) {
                $oldPath = str_replace('/storage/', '', $product->image_url);
                Storage::disk('public')->delete($oldPath);
            }

            $imagePath = $request->file('image')->store('products', 'public');
            $validated['image_url'] = Storage::url($imagePath);
        }

        $product->update($validated);

        return redirect()->route('products.show', $product)
            ->with('success', 'Produit mis à jour avec succès.');
    }

    public function destroy(Product $product)
    {
        // Supprimer l'image si elle existe
        if ($product->image_url) {
            $imagePath = str_replace('/storage/', '', $product->image_url);
            Storage::disk('public')->delete($imagePath);
        }

        $product->delete();

        return redirect()->route('products.index')
            ->with('success', 'Produit supprimé avec succès.');
    }
}