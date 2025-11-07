import React from 'react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, useForm, Link } from '@inertiajs/react';

export default function Create({ auth, products, warehouses, id }) {
    const { data, setData, errors, post, processing } = useForm({
        product_id: '',
        warehouse_id: id ? id : '',
        quantity: 0,
    });

    const submit = (e) => {
        e.preventDefault();
        post(route('stocks.store'));
    };

    return (
        <AuthenticatedLayout user={auth.user}>
            <Head title="Nouveau Stock" />

            <div className="py-12">
                <div className="max-w-3xl mx-auto sm:px-6 lg:px-8">
                    <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg">
                        <div className="p-6">
                            {/* En-tête */}
                            <div className="flex justify-between items-start mb-8">
                                <div>
                                    <h1 className="text-2xl font-bold text-gray-900">Nouveau Stock</h1>
                                    <p className="text-gray-600 mt-2">
                                        Ajouter un produit en stock dans un entrepôt
                                    </p>
                                </div>
                                <Link
                                    href={route('stocks.index')}
                                    className="text-gray-600 hover:text-gray-900"
                                >
                                    ← Retour aux stocks
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
                                        Quantité initiale *
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
                                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                                    <div className="flex items-center">
                                        <svg className="w-5 h-5 text-blue-600 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                        </svg>
                                        <div>
                                            <h4 className="text-sm font-medium text-blue-800">Information</h4>
                                            <p className="text-sm text-blue-600">
                                                Cette fonction est utile pour initialiser un stock. Les mouvements ultérieurs mettront à jour automatiquement cette quantité.
                                            </p>
                                        </div>
                                    </div>
                                </div>

                                {/* Boutons */}
                                <div className="flex justify-end space-x-4 pt-6 border-t">
                                    <Link
                                        href={route('stocks.index')}
                                        className="px-6 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
                                    >
                                        Annuler
                                    </Link>
                                    <button
                                        type="submit"
                                        disabled={processing}
                                        className="px-6 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 disabled:opacity-50"
                                    >
                                        {processing ? 'Création...' : 'Créer le stock'}
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
