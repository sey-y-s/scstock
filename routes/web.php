<?php

use Inertia\Inertia;
use Illuminate\Support\Facades\Route;
use Illuminate\Foundation\Application;
use App\Http\Controllers\HomeController;
use App\Http\Controllers\StockController;
use App\Http\Controllers\ProductController;
use App\Http\Controllers\ProfileController;
use App\Http\Controllers\CustomerController;
use App\Http\Controllers\SupplierController;
use App\Http\Controllers\DashboardController;
use App\Http\Controllers\PdfExportController;
use App\Http\Controllers\WarehouseController;
use App\Http\Controllers\StockMovementController;

Route::get('/', function () {
    return Inertia::render('Welcome', [
        'canLogin' => Route::has('login'),
        'canRegister' => Route::has('register'),
        'laravelVersion' => Application::VERSION,
        'phpVersion' => PHP_VERSION,
    ]);
});

Route::get('/', [HomeController::class, 'welcome'])->name('welcome');

Route::middleware('auth')->group(function () {

    Route::get('/dashboard', [DashboardController::class, 'index'])->name('dashboard');
    Route::get('/profile', [ProfileController::class, 'edit'])->name('profile.edit');
    Route::patch('/profile', [ProfileController::class, 'update'])->name('profile.update');
    Route::delete('/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');


    Route::resource('products', ProductController::class);
    Route::resource('warehouses', WarehouseController::class);
    Route::resource('customers', CustomerController::class);
    Route::resource('suppliers', SupplierController::class);
    Route::resource('stocks', StockController::class);

    Route::resource('operations', StockMovementController::class);

    Route::get('/product-search', [ProductController::class, 'searchProducts'])->name('products.search');

    Route::prefix('operation')->group(function () {
        Route::get('/achat', [StockMovementController::class, 'createIncoming'])->name('stocks.incoming.create');
        Route::get('/vente', [StockMovementController::class, 'createOutgoing'])->name('stocks.outgoing.create');
        Route::get('/trans', [StockMovementController::class, 'createTransfer'])->name('stocks.transfer.create');

        // Routes pour l'ajout des produits aux mouvements
        Route::get('/{movement}/add-products', [StockMovementController::class, 'addProducts'])->name('operations.add-products');
        Route::post('/{movement}/complete', [StockMovementController::class, 'completeMovement'])->name('operations.complete');
        // Routes pour stocker les mouvements
        Route::post('/incoming', [StockMovementController::class, 'storeIncoming'])->name('stocks.incoming.store');
        Route::post('/outgoing', [StockMovementController::class, 'storeOutgoing'])->name('stocks.outgoing.store');
        Route::post('/transfer', [StockMovementController::class, 'storeTransfer'])->name('stocks.transfer.store');
    });

    Route::prefix('pdf')->group(function () {
        Route::get('/operation/{stockMovement}/invoice', [PdfExportController::class, 'stockMovementInvoice'])
            ->name('pdf.operation.invoice');

        Route::get('/operation/{stockMovement}/preview', [PdfExportController::class, 'stockMovementPreview'])
            ->name('pdf.operation.preview');
    });
});

require __DIR__.'/auth.php';
