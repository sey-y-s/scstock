<?php

namespace Database\Seeders;

use App\Models\User;
// use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        User::factory()->create([
            'name' => 'Admin',
            'email' => 'admin@gmail.com',
            'role' => 'admin',
            'password' => bcrypt('00000000'),
        ]);

        DB::table('product_categories')->insert([
            ['code' => 'DEO', 'name' => 'Déodorants', 'description' => 'Produits déodorants'],
            ['code' => 'PSA', 'name' => 'Parfums Sans Alcool', 'description' => 'Parfums sans alcool'],
            ['code' => 'GEL', 'name' => 'Gels Douche', 'description' => 'Gels douche et savons'],
        ]);

        DB::table('warehouses')->insert([
            ['name' => 'Entrepôt Principal', 'code' => 'DEP001', 'type' => 'depot', 'address' => 'Grand Marché'],
            ['name' => 'Entrepôt Secondaire', 'code' => 'DEP002', 'type' => 'depot', 'address' => 'Badalabougou'],
            ['name' => 'PDV Ousmane', 'code' => 'PV001', 'type' => 'pos', 'address' => 'Grand Marché'],
            ['name' => 'Boutique principale', 'code' => 'PV002', 'type' => 'pos', 'address' => 'Grand Marché'],
        ]);

        DB::table('packaging_types')->insert([
            ['name' => 'Carton', 'code' => 'carton'],
            ['name' => 'Sac 50kg', 'code' => 'sac50'],
            ['name' => 'Sac 100kg', 'code' => 'sac100'],
            ['name' => 'Pièces', 'code' => 'piece'],
        ]);
    }
}
