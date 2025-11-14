import React from 'react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link } from '@inertiajs/react';

export default function Index({ auth, packagingTypes }) {
    return (
        <AuthenticatedLayout user={auth.user}>
            <Head title="Types d'Emballage" />

            <div className="py-12">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    {/* En-tête */}
                    <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg mb-6">
                        <div className="p-6">
                            <div className="flex justify-between items-center mb-6">
                                <div>
                                    <h1 className="text-2xl font-bold text-gray-900">Types d'Emballage</h1>
                                    <p className="text-gray-600 mt-1">
                                        Gestion des unités d'emballage (PCS, DZ, FLS, etc.)
                                    </p>
                                </div>
                                <Link
                                    href={route('packaging-types.create')}
                                    className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600"
                                >
                                    + Nouveau Type
                                </Link>
                            </div>

                            {/* Statistiques */}
                            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
                                <div className="bg-white border border-gray-200 rounded-lg p-4 text-center">
                                    <div className="text-2xl font-bold text-gray-900">{packagingTypes.length}</div>
                                    <div className="text-sm text-gray-600">Total types</div>
                                </div>
                                <div className="bg-white border border-green-200 rounded-lg p-4 text-center">
                                    <div className="text-2xl font-bold text-green-600">
                                        {packagingTypes.reduce((sum, type) => sum + type.products_count, 0)}
                                    </div>
                                    <div className="text-sm text-green-600">Produits total</div>
                                </div>
                                <div className="bg-white border border-blue-200 rounded-lg p-4 text-center">
                                    <div className="text-2xl font-bold text-blue-600">
                                        {packagingTypes.filter(type => type.products_count > 0).length}
                                    </div>
                                    <div className="text-sm text-blue-600">Types utilisés</div>
                                </div>
                                <div className="bg-white border border-orange-200 rounded-lg p-4 text-center">
                                    <div className="text-2xl font-bold text-orange-600">
                                        {packagingTypes.filter(type => type.products_count === 0).length}
                                    </div>
                                    <div className="text-sm text-orange-600">Types inutilisés</div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Liste des types d'emballage */}
                    <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg">
                        <div className="overflow-x-auto">
                            <table className="min-w-full divide-y divide-gray-200">
                                <thead className="bg-gray-50">
                                    <tr>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Code
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Nom
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Description
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Produits
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Actions
                                        </th>
                                    </tr>
                                </thead>
                                <tbody className="bg-white divide-y divide-gray-200">
                                    {packagingTypes.map((packagingType) => (
                                        <tr key={packagingType.id} className="hover:bg-gray-50">
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <div className="text-sm font-medium text-gray-900 font-mono">
                                                    {packagingType.code}
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <div className="text-sm font-medium text-gray-900">
                                                    {packagingType.name}
                                                </div>
                                            </td>
                                            <td className="px-6 py-4">
                                                <div className="text-sm text-gray-500 max-w-xs truncate">
                                                    {packagingType.description || '—'}
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <div className="text-sm text-gray-900">
                                                    {packagingType.products_count} produit(s)
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                                <div className="flex space-x-2">
                                                    <Link
                                                        href={route('packaging-types.show', packagingType.id)}
                                                        className="text-blue-600 hover:text-blue-900"
                                                    >
                                                        Voir
                                                    </Link>
                                                    <Link
                                                        href={route('packaging-types.edit', packagingType.id)}
                                                        className="text-green-600 hover:text-green-900"
                                                    >
                                                        Modifier
                                                    </Link>
                                                    {packagingType.products_count === 0 && (
                                                        <Link
                                                            href={route('packaging-types.destroy', packagingType.id)}
                                                            method="delete"
                                                            as="button"
                                                            className="text-red-600 hover:text-red-900"
                                                            onClick={(e) => {
                                                                if (!confirm('Êtes-vous sûr de vouloir supprimer ce type d\'emballage ?')) {
                                                                    e.preventDefault();
                                                                }
                                                            }}
                                                        >
                                                            Supprimer
                                                        </Link>
                                                    )}
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>

                        {/* Message si aucun type */}
                        {packagingTypes.length === 0 && (
                            <div className="p-12 text-center text-gray-500">
                                <div className="text-6xl mb-4">📦</div>
                                <p className="text-lg mb-2">Aucun type d'emballage créé</p>
                                <p className="text-sm">Commencez par créer votre premier type d'emballage</p>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
