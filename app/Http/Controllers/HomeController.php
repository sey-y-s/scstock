<?php

namespace App\Http\Controllers;

use App\Models\Product;
use App\Models\Warehouse;
use Inertia\Inertia;
use Illuminate\Http\Request;

class HomeController extends Controller
{
    public function welcome(Request $request)
    {
        // Produits avec pagination et filtres
        $query = Product::with(['stocks.warehouse', 'category', 'packagingType'])
            ->whereHas('stocks', function($q) {
                $q->where('quantity', '>', 0);
            });

        // Filtre par recherche
        if ($request->has('search') && $request->search) {
            $query->where(function($q) use ($request) {
                $q->where('reference', 'LIKE', "%{$request->search}%")
                ->orWhere('name', 'LIKE', "%{$request->search}%");
            });
        }

        // Filtre par catégorie
        if ($request->has('category_id') && $request->category_id) {
            $query->where('category_id', $request->category_id);
        }

        $products = $query->paginate(12)->withQueryString();

        // Charger les données pour les filtres
        $categories = \App\Models\ProductCategory::all();
        $warehouses = \App\Models\Warehouse::where('type', 'depot')->get(); // Only depots for public view

        return Inertia::render('Welcome', [
            'products' => $products,
            'categories' => $categories,
            'warehouses' => $warehouses,
            'filters' => $request->only(['search', 'category_id', 'warehouse_id'])
        ]);
    }
}
