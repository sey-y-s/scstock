import React, { useState } from 'react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link, router } from '@inertiajs/react';
import ProductSearchGeneric from '@/Components/ProductSearchGeneric';

export default function Index({ auth, stocks, warehouses, products, filters }) {
    const [localFilters, setLocalFilters] = useState({
        warehouse_id: filters.warehouse_id || '',
        product_id: filters.product_id || '',
        stock_level: filters.stock_level || ''
    });

    const [selectedProduct, setSelectedProduct] = useState(
        filters.product_id && products.find(p => p.id == filters.product_id)
            ? products.find(p => p.id == filters.product_id)
            : null
    );

    const applyFilters = () => {
        router.get(route('stocks.index'), localFilters, {
            preserveState: true,
            replace: true
        });
    };

    const clearFilters = () => {
        setLocalFilters({ warehouse_id: '', product_id: '', stock_level: '' });
        setSelectedProduct(null);
        router.get(route('stocks.index'));
    };

    const handleProductSelect = (product) => {
        setSelectedProduct(product);
        setLocalFilters(prev => ({ ...prev, product_id: product.id }));

        // Appliquer automatiquement le filtre après sélection
        setTimeout(() => {
            router.get(route('stocks.index'), { ...localFilters, product_id: product.id }, {
                preserveState: true,
                replace: true
            });
        }, 100);
    };

    const clearProductFilter = () => {
        setSelectedProduct(null);
        setLocalFilters(prev => ({ ...prev, product_id: '' }));

        // Réappliquer les filtres sans le produit
        router.get(route('stocks.index'), { ...localFilters, product_id: '' }, {
            preserveState: true,
            replace: true
        });
    };

    const getStockStatus = (stock) => {
        if (parseFloat(stock.quantity) <= 0) {
            return { label: 'Rupture', color: 'red', bgColor: 'red-100', textColor: 'red-800' };
        } else if (parseFloat(stock.quantity) <= parseFloat(stock.product.low_stock_alert)) {
            return { label: 'Faible', color: 'orange', bgColor: 'orange-100', textColor: 'orange-800' };
        } else {
            return { label: 'Normal', color: 'green', bgColor: 'green-100', textColor: 'green-800' };
        }
    };


    const translateLabel = (label) => {
        if (label === 'Next &raquo;') return ' »';
        if (label === '&laquo; Previous') return '« ';
        return label;
    };

    return (
        <AuthenticatedLayout user={auth.user}>
            <Head title="Gestion des Stocks" />

            <div className="py-12">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    {/* En-tête avec actions */}
                    <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg mb-6">
                        <div className="p-6">
                            <div className="flex justify-between items-center mb-6">
                                <div>
                                    <h1 className="text-2xl font-bold text-gray-900">Gestion des Stocks</h1>
                                    <p className="text-gray-600 mt-1">
                                        Vue d'ensemble des stocks par produit et par entrepôt
                                    </p>
                                </div>
                                <div className="flex space-x-3">
                                    <Link
                                        href={route('warehouses.index')}
                                        className="bg-green-500 text-white px-4 py-2 rounded-md hover:bg-green-600"
                                    >
                                        📦 Vue par Entrepôt
                                    </Link>
                                    <Link
                                        href={route('stocks.create')}
                                        className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600"
                                    >
                                        + Ajouter un stock
                                    </Link>
                                </div>
                            </div>

                            {/* Filtres */}
                            <div className="bg-gray-50 p-4 rounded-lg mb-6">
                                <h3 className="text-lg font-medium text-gray-900 mb-4">Filtres</h3>
                                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                                    {/* Filtre entrepôt */}
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">
                                            Entrepôt
                                        </label>
                                        <select
                                            value={localFilters.warehouse_id}
                                            onChange={(e) => setLocalFilters({...localFilters, warehouse_id: e.target.value})}
                                            className="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                                        >
                                            <option value="">Tous les entrepôts</option>
                                            {warehouses.map(warehouse => (
                                                <option key={warehouse.id} value={warehouse.id}>
                                                    {warehouse.name}
                                                </option>
                                            ))}
                                        </select>
                                    </div>

                                    {/* Filtre produit - AVEC AFFICHAGE CONDITIONNEL */}
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">
                                            Produit
                                        </label>

                                        {selectedProduct ? (
                                            // AFFICHAGE DU PRODUIT SÉLECTIONNÉ
                                            <div className="border border-green-300 bg-green-50 rounded-md p-3">
                                                <div className="flex justify-between items-start">
                                                    <div className="flex-1">
                                                        <div className="font-medium text-green-800 text-sm">
                                                            {selectedProduct.reference}
                                                        </div>
                                                        <div className="text-green-600 text-xs mt-1">
                                                            {selectedProduct.name}
                                                        </div>
                                                        {selectedProduct.packaging_type && (
                                                            <div className="text-green-500 text-xs mt-1">
                                                                {selectedProduct.packaging_type.code}
                                                            </div>
                                                        )}
                                                    </div>
                                                    <button
                                                        onClick={clearProductFilter}
                                                        className="text-green-600 hover:text-green-800 ml-2 flex-shrink-0"
                                                        title="Supprimer la sélection"
                                                    >
                                                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                                        </svg>
                                                    </button>
                                                </div>
                                            </div>
                                        ) : (
                                            // CHAMP DE RECHERCHE (quand aucun produit sélectionné)
                                            <ProductSearchGeneric
                                                onProductSelect={handleProductSelect}
                                                placeholder="Rechercher un produit..."
                                                showStockInfo={false}
                                                searchParams={{ for_filters: true }}
                                                movementType="out"
                                            />
                                        )}
                                    </div>

                                    {/* Filtre niveau stock */}
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">
                                            Niveau de stock
                                        </label>
                                        <select
                                            value={localFilters.stock_level}
                                            onChange={(e) => setLocalFilters({...localFilters, stock_level: e.target.value})}
                                            className="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                                        >
                                            <option value="">Tous les niveaux</option>
                                            <option value="low">Stock faible</option>
                                            <option value="out">Rupture</option>
                                            <option value="normal">Stock normal</option>
                                        </select>
                                    </div>

                                    {/* Boutons filtres */}
                                    <div className="flex items-end space-x-2">
                                        <button
                                            onClick={applyFilters}
                                            className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 flex items-center"
                                        >
                                            <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
                                            </svg>
                                            Appliquer
                                        </button>
                                        <button
                                            onClick={clearFilters}
                                            className="border border-gray-300 text-gray-700 px-4 py-2 rounded-md hover:bg-gray-50 flex items-center"
                                        >
                                            <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                                            </svg>
                                            Réinitialiser
                                        </button>
                                    </div>
                                </div>
                            </div>

                            {/* Statistiques rapides */}
                            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
                                <div className="bg-white border border-gray-200 rounded-lg p-4 text-center">
                                    <div className="text-2xl font-bold text-gray-900">{stocks.total}</div>
                                    <div className="text-sm text-gray-600">Total stocks</div>
                                </div>
                                <div className="bg-white border border-green-200 rounded-lg p-4 text-center">
                                    <div className="text-2xl font-bold text-green-600">
                                        {stocks.data.filter(s => parseFloat(s.quantity) > parseFloat(s.product.low_stock_alert)).length}
                                    </div>
                                    <div className="text-sm text-green-600">Stocks normaux</div>
                                </div>
                                <div className="bg-white border border-orange-200 rounded-lg p-4 text-center">
                                    <div className="text-2xl font-bold text-orange-600">
                                        {stocks.data.filter(s => parseFloat(s.quantity) > 0 && parseFloat(s.quantity) <= parseFloat(s.product.low_stock_alert)).length}
                                    </div>
                                    <div className="text-sm text-orange-600">Stocks faibles</div>
                                </div>
                                <div className="bg-white border border-red-200 rounded-lg p-4 text-center">
                                    <div className="text-2xl font-bold text-red-600">
                                        {stocks.data.filter(s => parseFloat(s.quantity) <= 0).length}
                                    </div>
                                    <div className="text-sm text-red-600">Ruptures</div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Tableau des stocks */}
                    <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg">
                        <div className="overflow-x-auto">
                            <table className="min-w-full divide-y divide-gray-200">
                                <thead className="bg-gray-50">
                                    <tr>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Produit
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Entrepôt
                                        </th>
                                        <th className="px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Quantité
                                        </th>
                                        <th className="px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Statut
                                        </th>
                                        <th className="px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Dernière mise à jour
                                        </th>
                                        <th className="px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Actions
                                        </th>
                                    </tr>
                                </thead>
                                <tbody className="bg-white divide-y divide-gray-200">
                                    {stocks.data.map((stock) => {
                                        const status = getStockStatus(stock);
                                        return (
                                            <tr key={stock.id} className="hover:bg-gray-50">
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    <div className="flex items-center">
                                                        {stock.product.image_url && (
                                                            <img
                                                                src={stock.product.image_url}
                                                                alt={stock.product.name}
                                                                className="h-10 w-10 rounded-lg object-cover mr-3"
                                                            />
                                                        )}
                                                        <div>
                                                            <Link
                                                                href={route('products.show', stock.product.id)}
                                                                className="text-sm font-medium text-gray-900 hover:text-blue-600 block"
                                                            >
                                                                {stock.product.reference}
                                                            </Link>
                                                            <div className="text-sm text-gray-500">
                                                                {stock.product.name}
                                                            </div>
                                                            <div className="text-xs text-gray-400">
                                                                {stock.product.packaging_type?.code || 'N/A'}
                                                            </div>
                                                        </div>
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    <div className="text-sm text-gray-900">{stock.warehouse.name}</div>
                                                    <div className="text-sm text-gray-500 capitalize">
                                                        {stock.warehouse.type}
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4 text-center whitespace-nowrap">
                                                    <div className="text-sm font-medium text-gray-900">
                                                        {stock.quantity}
                                                    </div>
                                                    <div className="text-xs text-gray-500">
                                                        Alerte: {stock.product.low_stock_alert}
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4 text-center whitespace-nowrap">
                                                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-${status.bgColor} text-${status.textColor}`}>
                                                        {status.label}
                                                    </span>
                                                </td>
                                                <td className="px-6 py-4 text-center whitespace-nowrap text-sm text-gray-500">
                                                    {new Date(stock.updated_at).toLocaleDateString('fr-FR', {
                                                        day: '2-digit',
                                                        month: '2-digit',
                                                        year: 'numeric',
                                                        hour: '2-digit',
                                                        minute: '2-digit'
                                                    })}
                                                </td>
                                                <td className="px-6 py-4 text-center whitespace-nowrap text-sm font-medium">
                                                    <div className="flex justify-center space-x-2">
                                                        <Link
                                                            href={route('products.show', stock.product.id)}
                                                            className="text-blue-600 hover:text-blue-900"
                                                            title="Voir le détail du produit"
                                                        >
                                                            {/* 👁️ Produit */} 👁️
                                                        </Link>
                                                        <Link
                                                            href={route('stocks.edit', stock.id)}
                                                            className="text-green-600 hover:text-green-900"
                                                            title="Ajuster le stock"
                                                        >
                                                            {/* ✏️ Ajuster */} ✏️
                                                        </Link>
                                                    </div>
                                                </td>
                                            </tr>
                                        );
                                    })}
                                </tbody>
                            </table>
                        </div>

                        {/* Pagination */}
                        {stocks.links && (
                            <div className="bg-white px-4 py-3 border-t border-gray-200 sm:px-6">
                                <div className="flex justify-between items-center">
                                    <div className="text-sm text-gray-700">
                                        Affichage de {stocks.from} à {stocks.to} sur {stocks.total} résultats
                                    </div>
                                    <div className="flex space-x-2">
                                        {stocks.links.map((link, index) => (
                                            <Link
                                                key={index}
                                                href={link.url || '#'}
                                                className={`px-3 py-1 rounded-md ${
                                                    link.active
                                                        ? 'bg-blue-500 text-white'
                                                        : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                                                } ${!link.url ? 'opacity-50 cursor-not-allowed' : ''}`}
                                                dangerouslySetInnerHTML={{ __html: translateLabel(link.label) }}
                                            />
                                        ))}
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
