import React from 'react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, useForm, Link } from '@inertiajs/react';

export default function Edit({ auth, stock, products, warehouses }) {
    const { data, setData, errors, put, processing } = useForm({
        product_id: stock.product_id,
        warehouse_id: stock.warehouse_id,
        quantity: stock.quantity,
    });

    const submit = (e) => {
        e.preventDefault();
        put(route('stocks.update', stock.id));
    };

    return (
        <AuthenticatedLayout user={auth.user}>
            <Head title={`Modifier Stock - ${stock.product.reference}`} />

            <div className="py-12">
                <div className="max-w-3xl mx-auto sm:px-6 lg:px-8">
                    <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg">
                        <div className="p-6">
                            {/* En-tête */}
                            <div className="flex justify-between items-start mb-8">
                                <div>
                                    <h1 className="text-2xl font-bold text-gray-900">Modifier le Stock</h1>
                                    <p className="text-gray-600 mt-1">
                                        {stock.product.reference} - {stock.product.name}
                                    </p>
                                    <p className="text-gray-600">
                                        {stock.warehouse.name}
                                    </p>
                                </div>
                                <Link
                                    href={route('stocks.show', stock.id)}
                                    className="text-gray-600 hover:text-gray-900"
                                >
                                    ← Retour au détail
                                </Link>
                            </div>

                            <form onSubmit={submit} className="space-y-6">
                                {/* Produit */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Produit *
                                    </label>
                                    <select
                                        value={data.product_id}
                                        onChange={e => setData('product_id', e.target.value)}
                                        className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                                        required
                                    >
                                        <option value="">Sélectionner un produit...</option>
                                        {products.map(product => (
                                            <option key={product.id} value={product.id}>
                                                {product.reference} - {product.name}
                                                {product.packaging_type && ` (${product.packaging_type.name})`}
                                            </option>
                                        ))}
                                    </select>
                                    {errors.product_id && (
                                        <p className="text-red-500 text-sm mt-1">{errors.product_id}</p>
                                    )}
                                </div>

                                {/* Entrepôt */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Entrepôt *
                                    </label>
                                    <select
                                        value={data.warehouse_id}
                                        onChange={e => setData('warehouse_id', e.target.value)}
                                        className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                                        required
                                    >
                                        <option value="">Sélectionner un entrepôt...</option>
                                        {warehouses.map(warehouse => (
                                            <option key={warehouse.id} value={warehouse.id}>
                                                {warehouse.name}
                                                {warehouse.type === 'depot' ? ' (Dépôt)' : ' (Point de vente)'}
                                            </option>
                                        ))}
                                    </select>
                                    {errors.warehouse_id && (
                                        <p className="text-red-500 text-sm mt-1">{errors.warehouse_id}</p>
                                    )}
                                </div>

                                {/* Quantité */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Quantité *
                                    </label>
                                    <input
                                        type="number"
                                        step="0.125"
                                        min="0"
                                        value={data.quantity}
                                        onChange={e => setData('quantity', parseFloat(e.target.value) || 0)}
                                        className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                                        required
                                    />
                                    <p className="text-xs text-gray-500 mt-1">
                                        Supporte les fractions: 1, 1/2, 1/4, 1/8
                                    </p>
                                    {errors.quantity && (
                                        <p className="text-red-500 text-sm mt-1">{errors.quantity}</p>
                                    )}
                                </div>

                                {/* Informations */}
                                <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                                    <div className="flex items-center">
                                        <svg className="w-5 h-5 text-yellow-600 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.35 16.5c-.77.833.192 2.5 1.732 2.5z" />
                                        </svg>
                                        <div>
                                            <h4 className="text-sm font-medium text-yellow-800">Attention</h4>
                                            <p className="text-sm text-yellow-700">
                                                La modification manuelle du stock peut créer des incohérences avec l'historique des mouvements.
                                                Utilisez de préférence les mouvements de stock pour ajuster les quantités.
                                            </p>
                                        </div>
                                    </div>
                                </div>

                                {/* Boutons */}
                                <div className="flex justify-between items-center pt-6 border-t">
                                    <div className="flex space-x-4">
                                        <Link
                                            href={route('stocks.show', stock.id)}
                                            className="px-6 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
                                        >
                                            Annuler
                                        </Link>
                                    </div>
                                    <div className="flex space-x-4">
                                        <button
                                            type="submit"
                                            disabled={processing}
                                            className="px-6 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 disabled:opacity-50"
                                        >
                                            {processing ? 'Mise à jour...' : 'Mettre à jour'}
                                        </button>
                                    </div>
                                </div>
                            </form>

                            {/* Section suppression */}
                            <div className="mt-12 pt-8 border-t border-gray-200">
                                <div className="bg-red-50 border border-red-200 rounded-lg p-6">
                                    <h3 className="text-lg font-medium text-red-800 mb-2">Zone de danger</h3>
                                    <p className="text-red-700 text-sm mb-4">
                                        La suppression de ce stock est irréversible. Tous les historiques associés seront conservés.
                                    </p>
                                    <Link
                                        href={route('stocks.destroy', stock.id)}
                                        method="delete"
                                        as="button"
                                        className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition duration-150"
                                        onClick={(e) => {
                                            if (!confirm('Êtes-vous sûr de vouloir supprimer ce stock ? Cette action est irréversible.')) {
                                                e.preventDefault();
                                            }
                                        }}
                                    >
                                        Supprimer ce stock
                                    </Link>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
