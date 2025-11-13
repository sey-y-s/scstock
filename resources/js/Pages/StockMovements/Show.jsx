import React from 'react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link } from '@inertiajs/react';

export default function Show({ auth, movement }) {
    const getTypeConfig = (type) => {
        const configs = {
            in: { label: 'Approvisionnement', color: 'green', icon: '📥' },
            out: { label: 'Vente Client', color: 'red', icon: '📤' },
            transfer: { label: 'Transfert Interne', color: 'blue', icon: '🔄' }
        };
        return configs[type] || configs.in;
    };

    const getStatusConfig = (status) => {
        const configs = {
            draft: { label: 'Brouillon', color: 'yellow' },
            completed: { label: 'Terminé', color: 'green' },
            cancelled: { label: 'Annulé', color: 'red' }
        };
        return configs[status] || configs.draft;
    };

    const calculateTotal = () => {
        return movement.items.reduce((total, item) => {
            return total + (parseFloat(item.quantity) * item.unit_price);
        }, 0);
    };

    const typeConfig = getTypeConfig(movement.type);
    const statusConfig = getStatusConfig(movement.status);
    const totalAmount = calculateTotal();

    return (
        <AuthenticatedLayout user={auth.user}>
            <Head title={`Mouvement`} />

            <div className="py-12">
                <div className="max-w-6xl mx-auto sm:px-6 lg:px-8">
                    <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg">
                        <div className="p-6">
                            {/* En-tête */}
                            <div className="flex justify-between items-start mb-8">
                                <div>
                                    <div className="flex items-center space-x-4 mb-3">
                                        <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-${typeConfig.color}-100 text-${typeConfig.color}-800`}>
                                            {typeConfig.icon} {typeConfig.label}
                                        </span>
                                        <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-${statusConfig.color}-100 text-${statusConfig.color}-800`}>
                                            {statusConfig.label}
                                        </span>
                                        {movement.status === 'draft' && (
                                            <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-yellow-100 text-yellow-800">
                                                📝 En attente de produits
                                            </span>
                                        )}
                                    </div>
                                    <h1 className="text-2xl font-bold text-gray-900">Mouvement {movement.reference}</h1>
                                    <p className="text-gray-600 mt-1">
                                        Créé le {new Date(movement.created_at).toLocaleDateString('fr-FR')} par {movement.user?.name}
                                    </p>
                                </div>
                                <div className="flex space-x-3">
                                    {movement.status === 'draft' && (
                                        <Link
                                            href={route('operations.add-products', movement.id)}
                                            className="px-4 py-2 bg-green-500 text-white rounded-md hover:bg-green-600"
                                        >
                                            Ajouter les produits
                                        </Link>
                                    )}

                                    <Link
                                        href={route('operations.edit', movement.id)}
                                        className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
                                    >
                                        Modifier
                                    </Link>
                                    <Link
                                        href={route('operations.index')}
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
                                        <h2 className="text-lg font-semibold text-gray-900 mb-4">Informations du mouvement</h2>
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                            <div>
                                                <label className="block text-sm font-medium text-gray-700">Référence</label>
                                                <p className="mt-1 text-sm text-gray-900 font-mono">{movement.reference}</p>
                                            </div>
                                            <div>
                                                <label className="block text-sm font-medium text-gray-700">Date</label>
                                                <p className="mt-1 text-sm text-gray-900">
                                                    {new Date(movement.movement_date).toLocaleDateString('fr-FR')}
                                                </p>
                                            </div>
                                            {movement.type === 'in' && (
                                                <>
                                                    <div>
                                                        <label className="block text-sm font-medium text-gray-700">Dépôt de réception</label>
                                                        <p className="mt-1 text-sm text-gray-900">{movement.to_warehouse?.name}</p>
                                                    </div>
                                                    <div>
                                                        <label className="block text-sm font-medium text-gray-700">Fournisseur</label>
                                                        <p className="mt-1 text-sm text-gray-900">{movement.supplier?.name || 'Non spécifié'}</p>
                                                    </div>
                                                </>
                                            )}
                                            {movement.type === 'out' && (
                                                <>
                                                    <div>
                                                        <label className="block text-sm font-medium text-gray-700">Dépôt de sortie</label>
                                                        <p className="mt-1 text-sm text-gray-900">{movement.from_warehouse?.name}</p>
                                                    </div>
                                                    <div>
                                                        <label className="block text-sm font-medium text-gray-700">Client</label>
                                                        <p className="mt-1 text-sm text-gray-900">{movement.customer?.name || 'Non spécifié'}</p>
                                                    </div>
                                                </>
                                            )}
                                            {movement.type === 'transfer' && (
                                                <>
                                                    <div>
                                                        <label className="block text-sm font-medium text-gray-700">Dépôt source</label>
                                                        <p className="mt-1 text-sm text-gray-900">{movement.from_warehouse?.name}</p>
                                                    </div>
                                                    <div>
                                                        <label className="block text-sm font-medium text-gray-700">Dépôt destination</label>
                                                        <p className="mt-1 text-sm text-gray-900">{movement.to_warehouse?.name}</p>
                                                    </div>
                                                </>
                                            )}
                                        </div>
                                        {movement.notes && (
                                            <div className="mt-4">
                                                <label className="block text-sm font-medium text-gray-700">Notes</label>
                                                <p className="mt-1 text-sm text-gray-900 bg-white p-3 rounded border">
                                                    {movement.notes}
                                                </p>
                                            </div>
                                        )}
                                    </div>

                                    {/* Articles */}
                                    <div>
                                        <h2 className="text-lg font-semibold text-gray-900 mb-4">Articles</h2>
                                        <div className="overflow-hidden shadow ring-1 ring-black ring-opacity-5 rounded-lg">
                                            <table className="min-w-full divide-y divide-gray-300">
                                                <thead className="bg-gray-50">
                                                    <tr>
                                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                            Produit
                                                        </th>
                                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                            Quantité
                                                        </th>
                                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                            Prix unitaire
                                                        </th>
                                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                            Total
                                                        </th>
                                                    </tr>
                                                </thead>
                                                <tbody className="bg-white divide-y divide-gray-200">
                                                    {movement.items.map((item) => (
                                                        <tr key={item.id}>
                                                            <td className="px-6 py-4 whitespace-nowrap">
                                                                <div className="flex items-center">
                                                                    {item.product.image_url && (
                                                                        <img
                                                                            src={item.product.image_url}
                                                                            alt={item.product.name}
                                                                            className="h-10 w-10 rounded-full object-cover mr-3"
                                                                        />
                                                                    )}
                                                                    <div>
                                                                        <div className="text-sm font-medium text-gray-900">
                                                                            {item.product.name}
                                                                        </div>
                                                                        <div className="text-sm text-gray-500">
                                                                            Réf: {item.product.reference}
                                                                        </div>
                                                                        <div className="text-xs text-gray-400">
                                                                            {item.product.packaging_type?.name}
                                                                        </div>
                                                                    </div>
                                                                </div>
                                                            </td>
                                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                                                {item.quantity}
                                                            </td>
                                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                                                {item.unit_price.toLocaleString()} F
                                                            </td>
                                                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                                                                {(item.quantity * item.unit_price).toLocaleString()} F
                                                            </td>
                                                        </tr>
                                                    ))}
                                                </tbody>
                                                <tfoot className="bg-gray-50">
                                                    <tr>
                                                        <td colSpan="3" className="px-6 py-4 text-sm font-medium text-gray-900 text-right">
                                                            Total général:
                                                        </td>
                                                        <td className="px-6 py-4 whitespace-nowrap text-sm font-bold text-gray-900">
                                                            {totalAmount.toLocaleString()} F
                                                        </td>
                                                    </tr>
                                                </tfoot>
                                            </table>
                                        </div>
                                    </div>
                                </div>

                                {/* Colonne latérale - Résumé et actions */}
                                <div className="space-y-6">
                                    {/* Résumé financier */}
                                    <div className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm">
                                        <h3 className="text-lg font-semibold text-gray-900 mb-4">Résumé</h3>
                                        <div className="space-y-3">
                                            <div className="flex justify-between">
                                                <span className="text-sm text-gray-600">Nombre d'articles:</span>
                                                <span className="text-sm font-medium">{movement.items.length}</span>
                                            </div>
                                            <div className="flex justify-between">
                                                <span className="text-sm text-gray-600">Quantité totale:</span>
                                                <span className="text-sm font-medium">
                                                    {movement.items.reduce((sum, item) => sum + parseFloat(item.quantity), 0)}
                                                </span>
                                            </div>
                                            <div className="border-t pt-3">
                                                <div className="flex justify-between text-base font-semibold">
                                                    <span>Montant total:</span>
                                                    <span className="text-green-600">{totalAmount.toLocaleString()} F</span>
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Impact sur le stock */}
                                    {/* <div className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm">
                                        <h3 className="text-lg font-semibold text-gray-900 mb-4">Impact sur le stock</h3>
                                        <div className="space-y-3 text-sm">
                                            {movement.type === 'in' && (
                                                <div className="flex items-center text-green-600">
                                                    <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 10l7-7m0 0l7 7m-7-7v18" />
                                                    </svg>
                                                    Augmentation du stock au dépôt {movement.to_warehouse?.name}
                                                </div>
                                            )}
                                            {movement.type === 'out' && (
                                                <div className="flex items-center text-red-600">
                                                    <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
                                                    </svg>
                                                    Diminution du stock de {movement.from_warehouse?.name}
                                                </div>
                                            )}
                                            {movement.type === 'transfer' && (
                                                <div className="space-y-2">
                                                    <div className="flex items-center text-red-600">
                                                        <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
                                                        </svg>
                                                        Diminution du stock au dépôt {movement.from_warehouse?.name}
                                                    </div>
                                                    <div className="flex items-center text-green-600">
                                                        <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 10l7-7m0 0l7 7m-7-7v18" />
                                                        </svg>
                                                        Augmentation du stock au dépôt {movement.to_warehouse?.name}
                                                    </div>
                                                </div>
                                            )}
                                        </div>
                                    </div> */}

                                    {/* Actions rapides */}
                                    <div className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm">
                                        <h3 className="text-lg font-semibold text-gray-900 mb-4">Actions</h3>
                                        <div className="space-y-3">
                                            <Link
                                                href={route('operations.edit', movement.id)}
                                                className="w-full flex justify-center items-center px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
                                            >
                                                <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                                                </svg>
                                                Modifier ce mouvement
                                            </Link>
                                            <Link
                                                href={route('pdf.operation.preview', movement)}
                                                className="w-full flex justify-center items-center px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
                                            >
                                                <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z" />
                                                </svg>
                                                PDF Facture
                                            </Link>
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
