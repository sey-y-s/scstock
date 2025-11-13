import React from 'react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, useForm, Link } from '@inertiajs/react';

export default function Incoming({ auth, warehouses, suppliers, reference }) {
    const { data, setData, errors, post, processing } = useForm({
        to_warehouse_id: '',
        supplier_id: '',
        new_supplier_name: '',
        notes: '',
        movement_date: new Date().toISOString().split('T')[0],
    });

    const [showNewSupplier, setShowNewSupplier] = React.useState(false);

    const submit = (e) => {
        e.preventDefault();
        post(route('stocks.incoming.store'));
    };

    const handleSupplierChange = (e) => {
        const value = e.target.value;
        if (value === 'new') {
            setShowNewSupplier(true);
            setData('supplier_id', '');
        } else {
            setShowNewSupplier(false);
            setData('supplier_id', value);
            setData('new_supplier_name', '');
        }
    };

    return (
        <AuthenticatedLayout user={auth.user}>
            <Head title="Nouvel Approvisionnement" />

            <div className="py-12">
                <div className="max-w-3xl mx-auto sm:px-6 lg:px-8">
                    <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg">
                        <div className="p-6">
                            {/* En-tête */}
                            <div className="flex justify-between items-start mb-8">
                                <div>
                                    <h1 className="text-2xl font-bold text-gray-900">Nouvel Approvisionnement</h1>
                                    <div className="flex items-center mt-2 space-x-4">
                                        <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-green-100 text-green-800">
                                            📥 Approvisionnement
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
                                {/* Dépôt de réception */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Dépôt de réception *
                                    </label>
                                    <select
                                        value={data.to_warehouse_id}
                                        onChange={e => setData('to_warehouse_id', e.target.value)}
                                        className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                                        required
                                    >
                                        <option value="">Sélectionner un dépôt...</option>
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

                                {/* Fournisseur */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Fournisseur *
                                    </label>
                                    {!showNewSupplier ? (
                                        <div className="flex space-x-2">
                                            <select
                                                value={data.supplier_id}
                                                onChange={handleSupplierChange}
                                                className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                                                required
                                            >
                                                <option value="">Sélectionner un fournisseur...</option>
                                                {suppliers.map(supplier => (
                                                    <option key={supplier.id} value={supplier.id}>
                                                        {supplier.name}
                                                    </option>
                                                ))}
                                                <option value="new">+ Créer un nouveau fournisseur</option>
                                            </select>
                                        </div>
                                    ) : (
                                        <div className="flex space-x-2">
                                            <input
                                                type="text"
                                                value={data.new_supplier_name}
                                                onChange={e => setData('new_supplier_name', e.target.value)}
                                                placeholder="Nom du nouveau fournisseur"
                                                className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                                                required
                                            />
                                            <button
                                                type="button"
                                                onClick={() => {
                                                    setShowNewSupplier(false);
                                                    setData('new_supplier_name', '');
                                                    setData('supplier_id', '');
                                                }}
                                                className="px-3 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
                                            >
                                                ×
                                            </button>
                                        </div>
                                    )}
                                    {(errors.supplier_id || errors.new_supplier_name) && (
                                        <p className="text-red-500 text-sm mt-1">
                                            {errors.supplier_id || errors.new_supplier_name}
                                        </p>
                                    )}
                                </div>

                                {/* Date et notes */}
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">
                                            Date de réception *
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
                                            placeholder="Référence facture, observations..."
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
                                                Après validation, vous serez redirigé vers la page d'ajout des produits reçus.
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
                                        disabled={processing}
                                        className="px-6 py-2 bg-green-500 text-white rounded-md hover:bg-green-600 disabled:opacity-50"
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
