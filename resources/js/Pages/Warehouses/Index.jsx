import React from 'react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link } from '@inertiajs/react';

export default function Index({ auth, warehouses }) {
    const getWarehouseStats = (warehouse) => {
        const totalStock = warehouse.stocks?.reduce((sum, stock) => sum + stock.quantity, 0) || 0;
        const lowStockCount = warehouse.stocks?.filter(stock =>
            stock.quantity > 0 && stock.quantity <= stock.product.low_stock_alert
        ).length || 0;
        const outOfStockCount = warehouse.stocks?.filter(stock =>
            stock.quantity <= 0
        ).length || 0;

        return { totalStock, lowStockCount, outOfStockCount };
    };

    const getWarehouseTypeColor = (type) => {
        return type === 'depot'
            ? 'bg-blue-100 text-blue-800 border-blue-300'
            : 'bg-green-100 text-green-800 border-green-300';
    };

    return (
        <AuthenticatedLayout user={auth.user}>
            <Head title="Gestion des Entrepôts" />

            <div className="py-12">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    {/* En-tête */}
                    <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg mb-6">
                        <div className="p-6">
                            <div className="flex justify-between items-center mb-6">
                                <div>
                                    <h1 className="text-2xl font-bold text-gray-900">Gestion des Entrepôts</h1>
                                    <p className="text-gray-600 mt-1">
                                        Vue d'ensemble de tous vos dépôts
                                    </p>
                                </div>
                                <div className="flex space-x-3">
                                    <Link
                                        href={route('stocks.index')}
                                        className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600"
                                    >
                                        📊 Vue par Produit
                                    </Link>
                                    <Link
                                        href={route('warehouses.create')}
                                        className="bg-green-500 text-white px-4 py-2 rounded-md hover:bg-green-600"
                                    >
                                        + Nouvel Entrepôt
                                    </Link>
                                </div>
                            </div>

                            {/* Statistiques globales */}
                            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
                                <div className="bg-white border border-gray-200 rounded-lg p-4 text-center">
                                    <div className="text-2xl font-bold text-gray-900">{warehouses.length}</div>
                                    <div className="text-sm text-gray-600">Total entrepôts</div>
                                </div>
                                <div className="bg-white border border-blue-200 rounded-lg p-4 text-center">
                                    <div className="text-2xl font-bold text-blue-600">
                                        {warehouses.filter(w => w.type === 'depot').length}
                                    </div>
                                    <div className="text-sm text-blue-600">Dépôts</div>
                                </div>
                                <div className="bg-white border border-green-200 rounded-lg p-4 text-center">
                                    <div className="text-2xl font-bold text-green-600">
                                        {warehouses.filter(w => w.type === 'pos').length}
                                    </div>
                                    <div className="text-sm text-green-600">Points de vente</div>
                                </div>
                                <div className="bg-white border border-purple-200 rounded-lg p-4 text-center">
                                    <div className="text-2xl font-bold text-purple-600">
                                        {warehouses.reduce((sum, w) => sum + w.total_products, 0)}
                                    </div>
                                    <div className="text-sm text-purple-600">Produits en stock</div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Liste des entrepôts */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {warehouses.map(warehouse => {
                            const stats = getWarehouseStats(warehouse);

                            return (
                                <div key={warehouse.id} className="bg-white rounded-lg shadow-sm border border-gray-200 hover:shadow-md transition-shadow">
                                    <div className="p-6">
                                        {/* En-tête de la carte */}
                                        <div className="flex justify-between items-start mb-4">
                                            <div>
                                                <h3 className="text-lg font-semibold text-gray-900">
                                                    {warehouse.name}
                                                </h3>
                                                <p className="text-sm text-gray-500">{warehouse.code}</p>
                                            </div>
                                            <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full border ${getWarehouseTypeColor(warehouse.type)}`}>
                                                {warehouse.type === 'depot' ? 'Dépôt' : 'Point de vente'}
                                            </span>
                                        </div>

                                        {/* Informations de contact */}
                                        {(warehouse.address) && (
                                            <div className="mb-4 space-y-1">
                                                {warehouse.address && (
                                                    <div className="text-sm text-gray-600 flex items-center">
                                                        <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                                                        </svg>
                                                        {warehouse.address}
                                                    </div>
                                                )}
                                            </div>
                                        )}

                                        {/* Statistiques du stock */}
                                        <div className="grid grid-cols-3 gap-2 mb-4">
                                            <div className="text-center p-2 bg-gray-50 rounded">
                                                <div className="font-bold text-gray-900">{warehouse.total_products}</div>
                                                <div className="text-xs text-gray-600">Produits</div>
                                            </div>
                                            <div className="text-center p-2 bg-orange-50 rounded">
                                                <div className="font-bold text-orange-600">{stats.lowStockCount}</div>
                                                <div className="text-xs text-orange-600">Faible</div>
                                            </div>
                                            <div className="text-center p-2 bg-red-50 rounded">
                                                <div className="font-bold text-red-600">{stats.outOfStockCount}</div>
                                                <div className="text-xs text-red-600">Rupture</div>
                                            </div>
                                        </div>

                                        {/* Actions */}
                                        <div className="flex justify-between items-center">
                                            <Link
                                                href={route('warehouses.show', warehouse.id)}
                                                className="text-blue-600 hover:text-blue-800 text-sm font-medium"
                                            >
                                                📦 Voir le stock
                                            </Link>
                                            <div className="flex space-x-2">
                                                <Link
                                                    href={route('warehouses.edit', warehouse.id)}
                                                    className="text-gray-600 hover:text-gray-800"
                                                    title="Modifier"
                                                >
                                                    ✏️
                                                </Link>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>

                    {/* Message si aucun entrepôt */}
                    {warehouses.length === 0 && (
                        <div className="bg-white rounded-lg shadow-sm p-12 text-center">
                            <div className="text-6xl mb-4">🏭</div>
                            <h3 className="text-lg font-medium text-gray-900 mb-2">Aucun entrepôt créé</h3>
                            <p className="text-gray-600 mb-4">Commencez par créer votre premier entrepôt ou point de vente</p>
                            <Link
                                href={route('warehouses.create')}
                                className="bg-green-500 text-white px-6 py-3 rounded-md hover:bg-green-600 inline-flex items-center"
                            >
                                + Créer un entrepôt
                            </Link>
                        </div>
                    )}
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
