import React from 'react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, useForm, Link } from '@inertiajs/react';

export default function Outgoing({ auth, warehouses, customers, reference }) {
    const { data, setData, errors, post, processing } = useForm({
        from_warehouse_id: '',
        customer_id: '',
        new_customer_name: '',
        notes: '',
        movement_date: new Date().toISOString().split('T')[0],
    });

    const [showNewCustomer, setShowNewCustomer] = React.useState(false);

    const submit = (e) => {
        e.preventDefault();
        post(route('stocks.outgoing.store'));
    };

    const handleCustomerChange = (e) => {
        const value = e.target.value;
        if (value === 'new') {
            setShowNewCustomer(true);
            setData('customer_id', '');
        } else {
            setShowNewCustomer(false);
            setData('customer_id', value);
            setData('new_customer_name', '');
        }
    };

    return (
        <AuthenticatedLayout user={auth.user}>
            <Head title="Nouvelle Vente Client" />

            <div className="py-12">
                <div className="max-w-3xl mx-auto sm:px-6 lg:px-8">
                    <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg">
                        <div className="p-6">
                            {/* En-tête */}
                            <div className="flex justify-between items-start mb-8">
                                <div>
                                    <h1 className="text-2xl font-bold text-gray-900">Nouvelle Vente Client</h1>
                                    <div className="flex items-center mt-2 space-x-4">
                                        <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-red-100 text-red-800">
                                            📤 Vente Client
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
                                {/* Dépôt de sortie */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Dépôt de sortie *
                                    </label>
                                    <select
                                        value={data.from_warehouse_id}
                                        onChange={e => setData('from_warehouse_id', e.target.value)}
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
                                    {errors.from_warehouse_id && (
                                        <p className="text-red-500 text-sm mt-1">{errors.from_warehouse_id}</p>
                                    )}
                                </div>

                                {/* Client */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Client *
                                    </label>
                                    {!showNewCustomer ? (
                                        <div className="flex space-x-2">
                                            <select
                                                value={data.customer_id}
                                                onChange={handleCustomerChange}
                                                className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                                                required
                                            >
                                                <option value="">Sélectionner un client...</option>
                                                {customers.map(customer => (
                                                    <option key={customer.id} value={customer.id}>
                                                        {customer.name}
                                                    </option>
                                                ))}
                                                <option value="new">+ Créer un nouveau client</option>
                                            </select>
                                        </div>
                                    ) : (
                                        <div className="flex space-x-2">
                                            <input
                                                type="text"
                                                value={data.new_customer_name}
                                                onChange={e => setData('new_customer_name', e.target.value)}
                                                placeholder="Nom du nouveau client"
                                                className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                                                required
                                            />
                                            <button
                                                type="button"
                                                onClick={() => {
                                                    setShowNewCustomer(false);
                                                    setData('new_customer_name', '');
                                                    setData('customer_id', '');
                                                }}
                                                className="px-3 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
                                            >
                                                ×
                                            </button>
                                        </div>
                                    )}
                                    {(errors.customer_id || errors.new_customer_name) && (
                                        <p className="text-red-500 text-sm mt-1">
                                            {errors.customer_id || errors.new_customer_name}
                                        </p>
                                    )}
                                </div>

                                {/* Date et notes */}
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">
                                            Date de vente *
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
                                            placeholder="Référence commande, conditions de paiement..."
                                            className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                                        />
                                    </div>
                                </div>

                                {/* Informations étape suivante */}
                                <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                                    <div className="flex items-center">
                                        <svg className="w-5 h-5 text-red-600 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                        </svg>
                                        <div>
                                            <h4 className="text-sm font-medium text-red-800">Étape suivante</h4>
                                            <p className="text-sm text-red-600">
                                                Après validation, vous sélectionnerez les produits en stock dans le dépôt choisi.
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
                                        className="px-6 py-2 bg-red-500 text-white rounded-md hover:bg-red-600 disabled:opacity-50"
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
