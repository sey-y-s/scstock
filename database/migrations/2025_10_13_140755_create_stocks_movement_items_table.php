<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('stock_movement_items', function (Blueprint $table) {
            $table->id();
            // Clé étrangère vers le mouvement de stock
            $table->foreignId('stock_movement_id')->constrained()->onDelete('cascade');
            $table->foreignId('product_id')->constrained();
            
            // Quantité dans l'unité de base
            $table->integer('quantity_in_base_unit');
            
            // Quantité et unité saisies par l'utilisateur
            $table->integer('entered_quantity');
            $table->string('entered_unit');

            $table->integer('price')->nullable();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('stock_movement_items');
    }
};
