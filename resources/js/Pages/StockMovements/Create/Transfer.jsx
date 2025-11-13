import React from 'react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, useForm, Link } from '@inertiajs/react';

export default function Transfer({ auth, warehouses, reference }) {
    const { data, setData, errors, post, processing } = useForm({
        from_warehouse_id: '',
        to_warehouse_id: '',
        notes: '',
        movement_date: new Date().toISOString().split('T')[0],
    });

    const submit = (e) => {
        e.preventDefault();
        post(route('stocks.transfer.store'));
    };

    // Vérifier si les dépôts sont différents
    const isValidTransfer = data.from_warehouse_id && data.to_warehouse_id &&
                           data.from_warehouse_id !== data.to_warehouse_id;

    return (
        <AuthenticatedLayout user={auth.user}>
            <Head title="Nouveau Transfert Interne" />

            <div className="py-12">
                <div className="max-w-3xl mx-auto sm:px-6 lg:px-8">
                    <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg">
                        <div className="p-6">
                            {/* En-tête */}
                            <div className="flex justify-between items-start mb-8">
                                <div>
                                    <h1 className="text-2xl font-bold text-gray-900">Nouveau Transfert Interne</h1>
                                    <div className="flex items-center mt-2 space-x-4">
                                        <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800">
                                            🔄 Transfert Interne
                                        </span>
                                        <span className="text-gray-600 font-mono">Réf: {reference}</span>
                                    </div>
                                    <p className="text-gray-600 mt-2">
                                        Étape 1/2 : Informations de base. Vous ajouterez les produits à l'étape suivante.
                                    </p>
                                </div>
                                <Link
                                    href={route('operations.create')}
                                    className="text-gray-600 hover:text-gray-900"
                                >
                                    ← Changer de type
                                </Link>
                            </div>

                            <form onSubmit={submit} className="space-y-6">
                                {/* Configuration du transfert */}
                                <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
                                    <h3 className="text-lg font-medium text-blue-900 mb-4">Configuration du transfert</h3>

                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        {/* Dépôt source */}
                                        <div>
                                            <label className="block text-sm font-medium text-blue-700 mb-1">
                                                Dépôt source *
                                            </label>
                                            <select
                                                value={data.from_warehouse_id}
                                                onChange={e => setData('from_warehouse_id', e.target.value)}
                                                className="block w-full rounded-md border-blue-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                                                required
                                            >
                                                <option value="">Sélectionner le dépôt source...</option>
                                                {warehouses.map(warehouse => (
                                                    <option key={warehouse.id} value={warehouse.id}>
                                                        {warehouse.name}
                                                        {warehouse.type === 'depot' ? ' (Dépôt)' : ' (Point de vente)'}
                                                    </option>
                                                ))}
                                            </select>
                                            {errors.from_warehouse_id && (
                                                <p className="text-red-500 text-sm mt-1">{errors.from_warehouse_id}</p>
                                            )}
                                        </div>

                                        {/* Dépôt destination */}
                                        <div>
                                            <label className="block text-sm font-medium text-blue-700 mb-1">
                                                Dépôt destination *
                                            </label>
                                            <select
                                                value={data.to_warehouse_id}
                                                onChange={e => setData('to_warehouse_id', e.target.value)}
                                                className="block w-full rounded-md border-blue-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                                                required
                                            >
                                                <option value="">Sélectionner le dépôt destination...</option>
                                                {warehouses.map(warehouse => (
                                                    <option key={warehouse.id} value={warehouse.id}>
                                                        {warehouse.name}
                                                        {warehouse.type === 'depot' ? ' (Dépôt)' : ' (Point de vente)'}
                                                    </option>
                                                ))}
                                            </select>
                                            {errors.to_warehouse_id && (
                                                <p className="text-red-500 text-sm mt-1">{errors.to_warehouse_id}</p>
                                            )}
                                        </div>
                                    </div>

                                    {/* Validation des dépôts */}
                                    {data.from_warehouse_id && data.to_warehouse_id && (
                                        <div className={`mt-4 p-3 rounded-md ${
                                            isValidTransfer
                                                ? 'bg-green-100 border border-green-200 text-green-700'
                                                : 'bg-red-100 border border-red-200 text-red-700'
                                        }`}>
                                            {isValidTransfer ? (
                                                <div className="flex items-center">
                                                    <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                                    </svg>
                                                    Transfert valide : les dépôts sont différents
                                                </div>
                                            ) : (
                                                <div className="flex items-center">
                                                    <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                                    </svg>
                                                    Les dépôts source et destination doivent être différents
                                                </div>
                                            )}
                                        </div>
                                    )}
                                </div>

                                {/* Date et notes */}
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">
                                            Date du transfert *
                                        </label>
                                        <input
                                            type="date"
                                            value={data.movement_date}
                                            onChange={e => setData('movement_date', e.target.value)}
                                            className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                                            required
                                        />
                                        {errors.movement_date && (
                                            <p className="text-red-500 text-sm mt-1">{errors.movement_date}</p>
                                        )}
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">
                                            Notes
                                        </label>
                                        <input
                                            type="text"
                                            value={data.notes}
                                            onChange={e => setData('notes', e.target.value)}
                                            placeholder="Raison du transfert, instructions spéciales..."
                                            className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                                        />
                                    </div>
                                </div>

                                {/* Informations étape suivante */}
                                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                                    <div className="flex items-center">
                                        <svg className="w-5 h-5 text-blue-600 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                        </svg>
                                        <div>
                                            <h4 className="text-sm font-medium text-blue-800">Étape suivante</h4>
                                            <p className="text-sm text-blue-600">
                                                Après validation, vous sélectionnerez les produits disponibles dans le dépôt source.
                                            </p>
                                        </div>
                                    </div>
                                </div>

                                {/* Boutons */}
                                <div className="flex justify-end space-x-4 pt-6 border-t">
                                    <Link
                                        href={route('operations.create')}
                                        className="px-6 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
                                    >
                                        Annuler
                                    </Link>
                                    <button
                                        type="submit"
                                        disabled={processing || !isValidTransfer}
                                        className="px-6 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 disabled:opacity-50"
                                    >
                                        {processing ? 'Création...' : 'Continuer vers les produits'}
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
