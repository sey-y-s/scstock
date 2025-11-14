import React, { useState } from 'react';
import { Head, Link, router } from '@inertiajs/react';
import ApplicationLogo from '@/Components/ApplicationLogo';

export default function Welcome({ products, categories, warehouses, filters }) {
    const [localFilters, setLocalFilters] = useState({
        search: filters.search || '',
        category_id: filters.category_id || '',
        warehouse_id: filters.warehouse_id || ''
    });

    const applyFilters = () => {
        router.get(route('welcome'), localFilters, {
            preserveState: true,
            replace: true
        });
    };

    const clearFilters = () => {
        setLocalFilters({ search: '', category_id: '', warehouse_id: '' });
        router.get(route('welcome'));
    };

    const getTotalStock = (product) => {
        return product.stocks.reduce((sum, stock) => sum + parseFloat(stock.quantity), 0);
    };

    const getWarehouseStock = (product, warehouseId) => {
        if (!warehouseId) return null;

        const stock = product.stocks.find(stock =>
            stock.warehouse_id === parseInt(warehouseId) && stock.quantity > 0
        );

        return stock ? parseFloat(stock.quantity) : 0;
    };

    const getSelectedWarehouseName = () => {
        if (!localFilters.warehouse_id) return null;
        return warehouses.find(w => w.id == localFilters.warehouse_id)?.name;
    };


    const translateLabel = (label) => {
        if (label.toLowerCase().includes('next')) return ' »';
        if (label.toLowerCase().includes('previous')) return '« ';
        return label;
    };

    return (
        <>
            <Head title="Accueil" />

            {/* Conteneur principal avec flex et min-h-screen */}
            <div className="flex flex-col min-h-screen">

                {/* Header Public */}
                <header className="bg-white shadow-md md:fixed top-0 left-0 w-full z-50">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                        <div className="md:flex md:justify-between md:items-center py-4">
                            <div className="flex justify-around md:items-center">
                                <ApplicationLogo className="h-32 md:h-14 md:mr-3" />
                                <div className="hidden md:block text-2xl font-bold text-gray-900">Samadiare Cosmetics</div>
                            </div>
                            <div className="hidden md:flex">
                                <Link
                                    href={route('login')}
                                    className="bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700 transition-all"
                                >
                                    Connexion
                                </Link>
                            </div>
                        </div>
                    </div>
                </header>

                {/* Hero Section */}
                <section className="hidden md:block bg-gradient-to-r from-blue-600 to-purple-700 text-white py-16 pt-28">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                        <h1 className="text-4xl font-bold mb-4">Bienvenue dans notre boutique</h1>
                        <p className="text-xl mb-8 opacity-90">Découvrez nos produits cosmétiques de qualité</p>

                        {/* Barre de recherche principale */}
                        <div className="max-w-2xl mx-auto">
                            <div className="flex space-x-3 flex-col sm:flex-row">
                                <input
                                    type="text"
                                    value={localFilters.search}
                                    onChange={(e) => setLocalFilters({...localFilters, search: e.target.value})}
                                    placeholder="Rechercher un produit..."
                                    className="flex-1 px-6 py-3 rounded-lg text-gray-900 focus:ring-2 focus:ring-blue-500 transition"
                                />
                                <button
                                    onClick={applyFilters}
                                    className="bg-white text-blue-600 px-6 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-all mt-3 sm:mt-0"
                                >
                                    🔍 Rechercher
                                </button>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Filtres */}
                <section className="bg-gray-50 py-6">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                        {/* ... contenu des filtres */}
                    </div>
                </section>

            {/* Liste des produits */}
            <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 mb-6">
                {products.data.length === 0 ? (
                    <div className="text-center py-12">
                        <div className="text-6xl mb-4">🔍</div>
                        <h3 className="text-lg font-medium text-gray-900 mb-2">Aucun produit trouvé</h3>
                        {/* <p className="text-gray-600">Essayez de modifier vos critères de recherche</p> */}
                    </div>
                ) : (
                    <>
                        {/* Grille des produits */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                            {products.data.map(product => {
                                const totalStock = getTotalStock(product);
                                const warehouseStock = localFilters.warehouse_id
                                    ? getWarehouseStock(product, localFilters.warehouse_id)
                                    : null;

                                return (
                                    <div key={product.id} className="bg-white rounded-lg shadow-md border border-gray-200 hover:shadow-lg transition-all">
                                        {/* Image du produit */}
                                        <div className="aspect-w-16 aspect-h-12 bg-gray-100 rounded-t-lg overflow-hidden">
                                            {product.image_url ? (
                                                <img
                                                    src={product.image_url}
                                                    alt={product.name}
                                                    className="w-full h-32 md:h-48 object-contain"
                                                />
                                            ) : (
                                                <div className="w-full h-32 md:h-48 flex items-center justify-center text-gray-400">
                                                    <span className="text-3xl md:text-6xl">📦</span>
                                                </div>
                                            )}
                                        </div>

                                        {/* Infos produit */}
                                        <div className="p-4">
                                            <div className="mb-2">
                                                <div className="inline-block bg-gray-100 text-gray-700 text-xs px-2 py-1 rounded">
                                                    {product.reference}
                                                </div>
                                                <h3 className="font-semibold text-gray-900 line-clamp-2">{product.name}</h3>
                                            </div>

                                            {/* Stock */}
                                            <div className="my-3 space-y-2">
                                                {/* Stock total */}
                                                <div className={`text-sm font-medium ${totalStock > 0 ? 'text-green-600' : 'text-red-600'}`}>
                                                    📦 Stock total : {totalStock} {product.packaging_type.code}
                                                </div>
                                                {/* Stock dépôt spécifique */}
                                                {warehouseStock !== null && (
                                                    <div className={`text-xs font-medium ${totalStock > 0 ? 'text-blue-600' : 'text-red-600'}`}>
                                                        avec <span className="font-bold">{warehouseStock}</span> dans <span className="text-blue-500 font-semibold">{getSelectedWarehouseName()}</span>
                                                    </div>
                                                )}

                                                {/* Disponibilité */}
                                                {totalStock > 0 && !localFilters.warehouse_id && (
                                                    <div className="text-xs text-gray-500">
                                                        Disponible dans {product.stocks.filter(s => s.quantity > 0).length} entrepôt(s)
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>

                            {/* Pagination */}
                            {products.links && products.links.length > 3 && (
                                <div className="mt-8 flex justify-center">
                                    <nav className="flex space-x-2">
                                        {products.links.map((link, index) => (
                                            <Link
                                                key={index}
                                                href={link.url || '#'}
                                                className={`px-4 py-2 rounded-md ${link.active ? 'bg-blue-500 text-white' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'} ${!link.url ? 'opacity-50 cursor-not-allowed' : ''}`}
                                                dangerouslySetInnerHTML={{ __html: translateLabel(link.label) }}
                                            />
                                        ))}
                                    </nav>
                                </div>
                            )}
                        </>
                    )}
                </main>

                {/* Footer Public */}
                <footer className="bg-gray-800 text-white py-8">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                        <p>&copy; 2025 Samadiare Cosmetics.</p>
                    </div>
                </footer>
            </div>
        </>
    );
}
