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
            'password' => bcrypt('12345432'),
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
            ['name' => 'Carton(s)', 'code' => 'carton'],
            ['name' => 'Sac 50kg', 'code' => 'sac50'],
            ['name' => 'Sac 100kg', 'code' => 'sac100'],
            ['name' => 'Pièces', 'code' => 'piece'],
        ]);

        DB::table('products')->insert([
            [
                'name' => 'Déo Fresh',
                'reference' => 'FR-001',
                'description' => 'Déodorant longue durée',
                'category_id' => 1,
                'packaging_type_id' => 1,
                'purchase_price' => 5000,
            ],
            [
                'name' => 'Parfum Floral',
                'reference' => 'FR-002',
                'description' => 'Parfum sans alcool aux notes florales',
                'category_id' => 2,
                'packaging_type_id' => 1,
                'purchase_price' => 15000,
            ],
            [
                'name' => 'Gel Douche Revitalisant',
                'reference' => 'FR-003',
                'description' => 'Gel douche pour une peau revitalisée',
                'category_id' => 3,
                'packaging_type_id' => 1,
                'purchase_price' => 8000,
            ],
            [
                'name' => 'Déo Sport',
                'reference' => 'FR-004',
                'description' => 'Déodorant pour sportifs',
                'category_id' => 1,
                'packaging_type_id' => 1,
                'purchase_price' => 6000,
            ],
            [
                'name' => 'Parfum Boisé',
                'reference' => 'FR-005',
                'description' => 'Parfum sans alcool aux notes boisées',
                'category_id' => 2,
                'packaging_type_id' => 1,
                'purchase_price' => 16000,
            ],
            [
                'name' => 'Gel Douche Hydratant',
                'reference' => 'FR-006',
                'description' => 'Gel douche pour une hydratation optimale',
                'category_id' => 3,
                'packaging_type_id' => 1,
                'purchase_price' => 9000,
            ],
        ]);

        DB::table('customers')->insert([
            ['name' => 'Client A'],
            ['name' => 'Client B'],
            ['name' => 'Client C'],
        ]);

        DB::table('suppliers')->insert([
            ['name' => 'Fournisseur X'],
            ['name' => 'Fournisseur Y'],
            ['name' => 'Fournisseur Z'],
        ]);
    }
}
