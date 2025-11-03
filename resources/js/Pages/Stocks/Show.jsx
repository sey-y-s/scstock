import React from 'react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link } from '@inertiajs/react';

export default function Show({ auth, stock, recentMovements }) {
    const getStockStatus = () => {
        if (stock.quantity <= 0) {
            return { label: 'Rupture', color: 'red', bgColor: 'red-100', textColor: 'red-800' };
        } else if (stock.quantity <= stock.product.low_stock_alert) {
            return { label: 'Faible', color: 'orange', bgColor: 'orange-100', textColor: 'orange-800' };
        } else {
            return { label: 'Normal', color: 'green', bgColor: 'green-100', textColor: 'green-800' };
        }
    };


    const status = getStockStatus();

    return (
        <AuthenticatedLayout user={auth.user}>
            <Head title={`Stock - ${stock.product.reference}`} />

            <div className="py-12">
                <div className="max-w-6xl mx-auto sm:px-6 lg:px-8">
                    <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg">
                        <div className="p-6">
                            {/* En-tête */}
                            <div className="flex justify-between items-start mb-8">
                                <div>
                                    <div className="flex items-center space-x-4 mb-3">
                                        <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-${status.bgColor} text-${status.textColor}`}>
                                            Stock {status.label}
                                        </span>
                                        <span className="text-gray-600 font-mono">ID: {stock.id}</span>
                                    </div>
                                    <h1 className="text-2xl font-bold text-gray-900">
                                        {stock.product.reference} - {stock.product.name}
                                    </h1>
                                    <p className="text-gray-600 mt-1">
                                        {stock.warehouse.name} • {stock.warehouse.type === 'depot' ? 'Dépôt' : 'Point de vente'}
                                    </p>
                                </div>
                                <div className="flex space-x-3">
                                    <Link
                                        href={route('stocks.edit', stock.id)}
                                        className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
                                    >
                                        Modifier
                                    </Link>
                                    <Link
                                        href={route('stocks.index')}
                                        className="px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50"
                                    >
                                        Retour
                                    </Link>
                                </div>
                            </div>

                            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                                {/* Colonne principale - Informations */}
                                <div className="lg:col-span-2 space-y-6">
                                    {/* Informations générales */}
                                    <div className="bg-gray-50 rounded-lg p-6">
                                        <h2 className="text-lg font-semibold text-gray-900 mb-4">Informations du stock</h2>
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                            <div>
                                                <label className="block text-sm font-medium text-gray-700">Produit</label>
                                                <p className="mt-1 text-sm text-gray-900">
                                                    {stock.product.reference} - {stock.product.name}
                                                </p>
                                                {stock.product.category && (
                                                    <p className="text-xs text-gray-500 mt-1">
                                                        Catégorie: {stock.product.category.name}
                                                    </p>
                                                )}
                                            </div>
                                            <div>
                                                <label className="block text-sm font-medium text-gray-700">Emballage</label>
                                                <p className="mt-1 text-sm text-gray-900">
                                                    {stock.product.packaging_type?.name}
                                                </p>
                                            </div>
                                            <div>
                                                <label className="block text-sm font-medium text-gray-700">Entrepôt</label>
                                                <p className="mt-1 text-sm text-gray-900">
                                                    {stock.warehouse.name}
                                                </p>
                                                <p className="text-xs text-gray-500 mt-1 capitalize">
                                                    {stock.warehouse.type}
                                                </p>
                                            </div>
                                            <div>
                                                <label className="block text-sm font-medium text-gray-700">Type d'entrepôt</label>
                                                <p className="mt-1 text-sm text-gray-900 capitalize">
                                                    {stock.warehouse.type}
                                                </p>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Quantités et statut */}
                                    <div className="bg-white border border-gray-200 rounded-lg p-6">
                                        <h2 className="text-lg font-semibold text-gray-900 mb-4">État du stock</h2>
                                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                            <div className="text-center">
                                                <div className="text-3xl font-bold text-gray-900">
                                                    {stock.quantity}
                                                </div>
                                                <div className="text-sm text-gray-600 mt-1">Quantité actuelle</div>
                                            </div>
                                            <div className="text-center">
                                                <div className={`text-3xl font-bold ${
                                                    stock.quantity <= stock.product.low_stock_alert ? 'text-orange-500' : 'text-green-500'
                                                }`}>
                                                    {stock.product.low_stock_alert}
                                                </div>
                                                <div className="text-sm text-gray-600 mt-1">Seuil d'alerte</div>
                                            </div>
                                            <div className="text-center">
                                                <div className={`text-3xl font-bold ${
                                                    stock.quantity > stock.product.low_stock_alert ? 'text-green-500' :
                                                    stock.quantity > 0 ? 'text-orange-500' : 'text-red-500'
                                                }`}>
                                                    {stock.quantity > stock.product.low_stock_alert ? '✓' :
                                                     stock.quantity > 0 ? '⚠️' : '✗'}
                                                </div>
                                                <div className="text-sm text-gray-600 mt-1">Statut</div>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Image du produit */}
                                    {stock.product.image_url && (
                                        <div>
                                            <h3 className="text-lg font-semibold text-gray-900 mb-4">Image du produit</h3>
                                            <img
                                                src={stock.product.image_url}
                                                alt={stock.product.name}
                                                className="h-48 w-48 object-cover rounded-lg border"
                                            />
                                        </div>
                                    )}
                                </div>

                                {/* Colonne latérale - Actions et historique */}
                                <div className="space-y-6">
                                    {/* Actions rapides */}
                                    <div className="bg-white border border-gray-200 rounded-lg p-6">
                                        <h3 className="text-lg font-semibold text-gray-900 mb-4">Actions</h3>
                                        <div className="space-y-3">
                                            <Link
                                                href={route('stock-movements.create')}
                                                className="w-full flex justify-center items-center px-4 py-2 bg-green-500 text-white rounded-md hover:bg-green-600"
                                            >
                                                Créer un mouvement
                                            </Link>
                                            <Link
                                                href={route('products.show', stock.product.id)}
                                                className="w-full flex justify-center items-center px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50"
                                            >
                                                Voir le produit
                                            </Link>
                                            <button
                                                onClick={() => window.print()}
                                                className="w-full flex justify-center items-center px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50"
                                            >
                                                Imprimer
                                            </button>
                                        </div>
                                    </div>

                                    {/* Derniers mouvements */}
                                    <div className="bg-white border border-gray-200 rounded-lg p-6">
                                        <h3 className="text-lg font-semibold text-gray-900 mb-4">Derniers mouvements</h3>
                                        {recentMovements && recentMovements.length > 0 ? (
                                            <div className="space-y-3">
                                                {recentMovements.map((movementItem) => (
                                                    <div key={movementItem.id} className="flex justify-between items-center text-sm">
                                                        <div>
                                                            <div className="font-medium">
                                                                {new Date(movementItem.stock_movement.movement_date).toLocaleDateString()}
                                                            </div>
                                                            <div className="text-gray-500">
                                                                {movementItem.stock_movement.reference}
                                                            </div>
                                                        </div>
                                                        <div className={`font-medium ${
                                                            movementItem.stock_movement.type === 'in' ? 'text-green-600' : 'text-red-600'
                                                        }`}>
                                                            {movementItem.stock_movement.type === 'in' ? '+' : '-'}{movementItem.quantity}
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>
                                        ) : (
                                            <p className="text-gray-500 text-sm">Aucun mouvement récent</p>
                                        )}
                                        <Link
                                            href={route('stock-movements.index', { product_id: stock.product_id, warehouse_id: stock.warehouse_id })}
                                            className="block text-center text-blue-600 hover:text-blue-800 text-sm mt-3"
                                        >
                                            Voir tous les mouvements
                                        </Link>
                                    </div>

                                    {/* Métadonnées */}
                                    <div className="bg-gray-50 rounded-lg p-4">
                                        <h4 className="text-sm font-medium text-gray-700 mb-2">Métadonnées</h4>
                                        <div className="space-y-1 text-xs text-gray-600">
                                            <div>Créé le: {new Date(stock.created_at).toLocaleDateString()}</div>
                                            <div>Modifié le: {new Date(stock.updated_at).toLocaleDateString()}</div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
