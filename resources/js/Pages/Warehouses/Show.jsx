import React, { useState } from 'react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link, router } from '@inertiajs/react';
import ProductSearchGeneric from '@/Components/ProductSearchGeneric';

export default function Show({ auth, warehouse, stocks, filters }) {
    const [localFilters, setLocalFilters] = useState({
        stock_level: filters.stock_level || ''
    });

    const [selectedProduct, setSelectedProduct] = useState(null);

    const applyFilters = () => {
        router.get(route('warehouses.show', warehouse.id), localFilters, {
            preserveState: true,
            replace: true
        });
    };

    const clearFilters = () => {
        setLocalFilters({ stock_level: '' });
        setSelectedProduct(null);
        router.get(route('warehouses.show', warehouse.id));
    };

    const handleProductSelect = (product) => {
        setSelectedProduct(product);
        // Redirection vers la page du produit pour voir son stock dans cet entrepôt
        router.visit(route('products.show', product.id));
    };

    const getStockStatus = (stock) => {
        const quantity = parseFloat(stock.quantity);
        const lowStockAlert = parseFloat(stock.product.low_stock_alert);

        if (quantity <= 0) {
            return { label: 'Rupture', color: 'red', bgColor: 'red-100', textColor: 'red-800' };
        } else if (quantity <= lowStockAlert) {
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

    // Calcul des statistiques pour cet entrepôt
    const totalProducts = stocks.data.length;
    const totalStock = stocks.data.reduce((sum, stock) => sum + parseFloat(stock.quantity), 0);
    const lowStockCount = stocks.data.filter(stock => {
        const quantity = parseFloat(stock.quantity);
        const lowStockAlert = parseFloat(stock.product.low_stock_alert);
        return quantity > 0 && quantity <= lowStockAlert;
    }).length;
    const outOfStockCount = stocks.data.filter(stock => parseFloat(stock.quantity) <= 0).length;

    return (
        <AuthenticatedLayout user={auth.user}>
            <Head title={`Stock - ${warehouse.name}`} />

            <div className="py-12">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    {/* En-tête de l'entrepôt */}
                    <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg mb-6">
                        <div className="p-6">
                            <div className="flex justify-between items-start mb-6">
                                <div className="flex items-start space-x-4">
                                    <div className={`p-3 rounded-lg ${
                                        warehouse.type === 'depot'
                                            ? 'bg-blue-100 text-blue-600'
                                            : 'bg-green-100 text-green-600'
                                    }`}>
                                        {warehouse.type === 'depot' ? '🏭' : '🏪'}
                                    </div>
                                    <div>
                                        <h1 className="text-2xl font-bold text-gray-900">{warehouse.name}</h1>
                                        <p className="text-gray-600">{warehouse.code}</p>
                                        <div className="flex items-center space-x-4 mt-2">
                                            <span className={`inline-flex px-3 py-1 text-sm font-semibold rounded-full ${
                                                warehouse.type === 'depot'
                                                    ? 'bg-blue-100 text-blue-800'
                                                    : 'bg-green-100 text-green-800'
                                            }`}>
                                                {warehouse.type === 'depot' ? 'Dépôt' : 'Point de vente'}
                                            </span>
                                            {warehouse.address && (
                                                <span className="text-sm text-gray-600 flex items-center">
                                                    📍 {warehouse.address}
                                                </span>
                                            )}
                                        </div>
                                    </div>
                                </div>

                                <div className="flex space-x-3">
                                    <Link
                                        href={route('stocks.index')}
                                        className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600"
                                    >
                                        📊 Vue par Produit
                                    </Link>
                                    <Link
                                        href={route('warehouses.index')}
                                        className="bg-gray-500 text-white px-4 py-2 rounded-md hover:bg-gray-600"
                                    >
                                        ← Liste Entrepôts
                                    </Link>
                                </div>
                            </div>

                            {/* Statistiques de l'entrepôt */}
                            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
                                <div className="bg-white border border-gray-200 rounded-lg p-4 text-center">
                                    <div className="text-2xl font-bold text-gray-900">{totalProducts}</div>
                                    <div className="text-sm text-gray-600">Produits différents</div>
                                </div>
                                <div className="bg-white border border-green-200 rounded-lg p-4 text-center">
                                    <div className="text-2xl font-bold text-green-600">
                                        {stocks.data.filter(stock => {
                                            const quantity = parseFloat(stock.quantity);
                                            const lowStockAlert = parseFloat(stock.product.low_stock_alert);
                                            return quantity > lowStockAlert;
                                        }).length}
                                    </div>
                                    <div className="text-sm text-green-600">Stocks normaux</div>
                                </div>
                                <div className="bg-white border border-orange-200 rounded-lg p-4 text-center">
                                    <div className="text-2xl font-bold text-orange-600">{lowStockCount}</div>
                                    <div className="text-sm text-orange-600">Stocks faibles</div>
                                </div>
                                <div className="bg-white border border-red-200 rounded-lg p-4 text-center">
                                    <div className="text-2xl font-bold text-red-600">{outOfStockCount}</div>
                                    <div className="text-sm text-red-600">Ruptures</div>
                                </div>
                            </div>

                            {/* Filtres */}
                            <div className="bg-gray-50 p-4 rounded-lg">
                                <h3 className="text-lg font-medium text-gray-900 mb-4">Filtres du stock</h3>
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                    {/* Recherche produit */}
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">
                                            Rechercher un produit
                                        </label>
                                        <ProductSearchGeneric
                                            onProductSelect={handleProductSelect}
                                            placeholder="Rechercher un produit..."
                                            showStockInfo={false}
                                            searchParams={{
                                                for_filters: true,
                                                warehouse_id: warehouse.id
                                            }}
                                        />
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
                        </div>
                    </div>

                    {/* Tableau des stocks */}
                    <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg">
                        <div className="p-6 border-b border-gray-200">
                            <div className="flex justify-between items-center">
                                <h2 className="text-xl font-bold text-gray-900">
                                    📦 Stock de l'entrepôt
                                </h2>
                                <div>
                                    <span className="bg-blue-100 text-blue-800 text-sm font-bold px-3 py-1 rounded-full">
                                        {stocks.total} produit(s)
                                    </span>
                                    <Link
                                        href={route('stocks.create', {warehouse_id: warehouse.id})}
                                        className="bg-blue-500 text-white px-4 py-2 ml-4 rounded-md hover:bg-blue-600"
                                    >
                                        + Ajouter un stock
                                    </Link>
                                </div>
                            </div>
                        </div>

                        {stocks.data.length === 0 ? (
                            <div className="p-12 text-center text-gray-500">
                                <div className="text-6xl mb-4">📭</div>
                                <p className="text-lg mb-2">Aucun stock dans cet entrepôt</p>
                                <p className="text-sm">Les produits apparaîtront après des mouvements de stock</p>
                            </div>
                        ) : (
                            <div className="overflow-x-auto">
                                <table className="min-w-full divide-y divide-gray-200">
                                    <thead className="bg-gray-50">
                                        <tr>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                Produit
                                            </th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                Référence
                                            </th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                Quantité en stock
                                            </th>
                                            <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                Alerte
                                            </th>
                                            <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                Statut
                                            </th>
                                            <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                Dernière mise à jour
                                            </th>
                                            <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                Actions
                                            </th>
                                        </tr>
                                    </thead>
                                    <tbody className="bg-white divide-y divide-gray-200">
                                        {stocks.data.map((stock) => {
                                            const status = getStockStatus(stock);
                                            const quantity = parseFloat(stock.quantity);
                                            const lowStockAlert = parseFloat(stock.product.low_stock_alert);

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
                                                                <div className="text-sm font-medium text-gray-900">
                                                                    {stock.product.name}
                                                                </div>
                                                                <div className="text-xs text-gray-500">
                                                                    {stock.product.packaging_type?.code}
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </td>
                                                    <td className="px-6 py-4 whitespace-nowrap">
                                                        <div className="text-sm text-gray-900 font-mono">
                                                            {stock.product.reference}
                                                        </div>
                                                    </td>
                                                    <td className="px-6 py-4 whitespace-nowrap">
                                                        <div className="text-lg font-semibold text-gray-900">
                                                            {quantity}
                                                        </div>
                                                        <div className="text-xs text-gray-500">
                                                            Unité: {stock.product.packaging_type?.code}
                                                        </div>
                                                    </td>
                                                    <td className="px-6 py-4 text-center whitespace-nowrap text-sm text-gray-500">
                                                        {lowStockAlert}
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
                                                                👁️
                                                            </Link>
                                                            <Link
                                                                href={route('stocks.edit', stock.id)}
                                                                className="text-green-600 hover:text-green-900"
                                                                title="Ajuster le stock"
                                                            >
                                                                ✏️
                                                            </Link>
                                                        </div>
                                                    </td>
                                                </tr>
                                            );
                                        })}
                                    </tbody>
                                </table>
                            </div>
                        )}

                        {/* Pagination */}
                        {stocks.links && stocks.links.length > 3 && (
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
