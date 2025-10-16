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
        Schema::create('stock_movements', function (Blueprint $table) {
            $table->id();
            $table->string('reference')->unique(); // MV-2024-001
            $table->enum('type', ['in', 'out', 'transfer']);
            $table->enum('status', ['draft', 'completed', 'cancelled'])->default('draft');
            
            // Source et destination selon le type
            $table->foreignId('from_warehouse_id')->nullable()->constrained('warehouses');
            $table->foreignId('to_warehouse_id')->nullable()->constrained('warehouses');
            $table->foreignId('supplier_id')->nullable()->constrained(); // Pour les entrées
            $table->string('customer_id')->nullable()->constrained(); // Pour les ventes
            
            $table->foreignId('user_id')->constrained(); // Qui a créé le mouvement
            $table->text('notes')->nullable();
            $table->timestamp('movement_date')->useCurrent();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('stock_movements');
    }
};
