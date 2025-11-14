import React from 'react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link } from '@inertiajs/react';

export default function Show({ auth, customer, recentMovements, stats }) {
    const getMovementTypeLabel = (type) => {
        const types = {
            'in': 'Entrée',
            'out': 'Sortie',
            'transfer': 'Transfert'
        };
        return types[type] || type;
    };

    const getMovementTypeColor = (type) => {
        const colors = {
            'in': 'bg-green-100 text-green-800',
            'out': 'bg-red-100 text-red-800',
            'transfer': 'bg-blue-100 text-blue-800'
        };
        return colors[type] || 'bg-gray-100 text-gray-800';
    };

    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleDateString('fr-FR', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric'
        });
    };

    return (
        <AuthenticatedLayout user={auth.user}>
            <Head title={`Client - ${customer.name}`} />

            <div className="py-12">
                <div className="max-w-4xl mx-auto sm:px-6 lg:px-8">
                    {/* En-tête du client */}
                    <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg mb-6">
                        <div className="p-6">
                            <div className="flex justify-between items-start mb-6">
                                <div className="flex items-start space-x-4">
                                    <div className="p-3 rounded-lg bg-blue-100 text-blue-600">
                                        <span className="text-2xl">👤</span>
                                    </div>
                                    <div>
                                        <h1 className="text-2xl font-bold text-gray-900">{customer.name}</h1>
                                        <p className="text-gray-600">{customer.contact_email}</p>
                                        <div className="flex items-center space-x-4 mt-2">
                                            <span className={`inline-flex px-3 py-1 text-sm font-semibold rounded-full ${
                                                customer.is_active
                                                    ? 'bg-green-100 text-green-800'
                                                    : 'bg-red-100 text-red-800'
                                            }`}>
                                                {customer.is_active ? 'Actif' : 'Inactif'}
                                            </span>
                                            {customer.contact_phone && (
                                                <span className="text-sm text-gray-600">
                                                    📞 {customer.contact_phone}
                                                </span>
                                            )}
                                        </div>
                                    </div>
                                </div>

                                <div className="flex space-x-3">
                                    <Link
                                        href={route('customers.edit', customer.id)}
                                        className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600"
                                    >
                                        ✏️ Modifier
                                    </Link>
                                    <Link
                                        href={route('customers.index')}
                                        className="bg-gray-500 text-white px-4 py-2 rounded-md hover:bg-gray-600"
                                    >
                                        ← Liste Clients
                                    </Link>
                                </div>
                            </div>

                            {/* Informations de contact */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                                <div>
                                    <h3 className="text-sm font-medium text-gray-700 mb-2">Coordonnées</h3>
                                    <div className="space-y-2">
                                        {customer.contact_email && (
                                            <p className="text-gray-900 flex items-center">
                                                <span className="mr-2">📧</span>
                                                {customer.contact_email}
                                            </p>
                                        )}
                                        {customer.contact_phone && (
                                            <p className="text-gray-900 flex items-center">
                                                <span className="mr-2">📞</span>
                                                {customer.contact_phone}
                                            </p>
                                        )}
                                    </div>
                                </div>
                                {customer.address && (
                                    <div>
                                        <h3 className="text-sm font-medium text-gray-700 mb-2">Adresse</h3>
                                        <p className="text-gray-900">{customer.address}</p>
                                    </div>
                                )}
                            </div>

                            {/* Statistiques simples */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 text-center">
                                    <div className="text-2xl font-bold text-blue-600">
                                        {stats.total_transactions}
                                    </div>
                                    <div className="text-sm text-blue-600">Commandes totales</div>
                                </div>
                                <div className="bg-purple-50 border border-purple-200 rounded-lg p-4 text-center">
                                    <div className="text-sm font-bold text-purple-600">
                                        {stats.last_transaction ? formatDate(stats.last_transaction) : 'Aucune'}
                                    </div>
                                    <div className="text-sm text-purple-600">Dernière commande</div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Opérations récentes */}
                    <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg">
                        <div className="p-6 border-b border-gray-200">
                            <div className="flex justify-between items-center">
                                <h2 className="text-xl font-bold text-gray-900">
                                    📋 Dernières opérations
                                </h2>
                                <span className="bg-blue-100 text-blue-800 text-sm font-bold px-3 py-1 rounded-full">
                                    {recentMovements.length} opération(s)
                                </span>
                            </div>
                        </div>

                        {recentMovements.length === 0 ? (
                            <div className="p-12 text-center text-gray-500">
                                <div className="text-6xl mb-4">📭</div>
                                <p className="text-lg mb-2">Aucune opération pour ce client</p>
                                <p className="text-sm">Les ventes apparaîtront ici après validation</p>
                            </div>
                        ) : (
                            <div className="divide-y divide-gray-200">
                                {recentMovements.map((movement) => (
                                    <div key={movement.id} className="p-6 hover:bg-gray-50">
                                        <div className="flex items-center justify-between">
                                            <div className="flex items-center space-x-4">
                                                <span className={`inline-flex px-3 py-1 text-xs font-semibold rounded-full ${getMovementTypeColor(movement.type)}`}>
                                                    {getMovementTypeLabel(movement.type)}
                                                </span>
                                                <div>
                                                    <div className="font-medium text-gray-900">
                                                        {movement.reference}
                                                    </div>
                                                    <div className="text-sm text-gray-500">
                                                        Depuis: {movement.from_warehouse?.name}
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="text-right">
                                                <div className="text-sm text-gray-900">
                                                    {formatDate(movement.created_at)}
                                                </div>
                                                <div className="text-xs text-gray-500">
                                                    Par: {movement.user.name}
                                                </div>
                                            </div>
                                        </div>
                                        {movement.notes && (
                                            <div className="mt-2 text-sm text-gray-600">
                                                <strong>Notes:</strong> {movement.notes}
                                            </div>
                                        )}
                                        <div className="mt-3 flex justify-end">
                                            <Link
                                                href={route('stock-movements.show', movement.id)}
                                                className="text-blue-600 hover:text-blue-800 text-sm font-medium"
                                            >
                                                Voir les détails →
                                            </Link>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}

                        {/* Voir toutes les opérations */}
                        {stats.total_transactions > 10 && (
                            <div className="p-4 border-t border-gray-200 text-center">
                                <Link
                                    href={route('stock-movements.index', { customer_id: customer.id })}
                                    className="text-blue-600 hover:text-blue-800 font-medium"
                                >
                                    Voir toutes les {stats.total_transactions} opérations →
                                </Link>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
