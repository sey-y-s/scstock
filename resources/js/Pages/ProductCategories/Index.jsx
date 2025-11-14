import React from 'react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link } from '@inertiajs/react';

export default function Index({ auth, categories }) {
    return (
        <AuthenticatedLayout user={auth.user}>
            <Head title="Catégories de Produits" />

            <div className="py-12">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    {/* En-tête */}
                    <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg mb-6">
                        <div className="p-6">
                            <div className="flex justify-between items-center mb-6">
                                <div>
                                    <h1 className="text-2xl font-bold text-gray-900">Catégories de Produits</h1>
                                    <p className="text-gray-600 mt-1">
                                        Gestion des familles de produits (DEO, PSA, etc.)
                                    </p>
                                </div>
                                <Link
                                    href={route('product-categories.create')}
                                    className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600"
                                >
                                    + Nouvelle Catégorie
                                </Link>
                            </div>

                            {/* Statistiques */}
                            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
                                <div className="bg-white border border-gray-200 rounded-lg p-4 text-center">
                                    <div className="text-2xl font-bold text-gray-900">{categories.length}</div>
                                    <div className="text-sm text-gray-600">Total catégories</div>
                                </div>
                                <div className="bg-white border border-green-200 rounded-lg p-4 text-center">
                                    <div className="text-2xl font-bold text-green-600">
                                        {categories.reduce((sum, cat) => sum + cat.products_count, 0)}
                                    </div>
                                    <div className="text-sm text-green-600">Produits total</div>
                                </div>
                                <div className="bg-white border border-blue-200 rounded-lg p-4 text-center">
                                    <div className="text-2xl font-bold text-blue-600">
                                        {categories.filter(cat => cat.products_count > 0).length}
                                    </div>
                                    <div className="text-sm text-blue-600">Catégories utilisées</div>
                                </div>
                                <div className="bg-white border border-orange-200 rounded-lg p-4 text-center">
                                    <div className="text-2xl font-bold text-orange-600">
                                        {categories.filter(cat => cat.products_count === 0).length}
                                    </div>
                                    <div className="text-sm text-orange-600">Catégories vides</div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Liste des catégories */}
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
                                    {categories.map((category) => (
                                        <tr key={category.id} className="hover:bg-gray-50">
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <div className="text-sm font-medium text-gray-900 font-mono">
                                                    {category.code}
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <div className="text-sm font-medium text-gray-900">
                                                    {category.name}
                                                </div>
                                            </td>
                                            <td className="px-6 py-4">
                                                <div className="text-sm text-gray-500 max-w-xs truncate">
                                                    {category.description || '—'}
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <div className="text-sm text-gray-900">
                                                    {category.products_count} produit(s)
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                                <div className="flex space-x-2">
                                                    <Link
                                                        href={route('product-categories.show', category.id)}
                                                        className="text-blue-600 hover:text-blue-900"
                                                    >
                                                        Voir
                                                    </Link>
                                                    <Link
                                                        href={route('product-categories.edit', category.id)}
                                                        className="text-green-600 hover:text-green-900"
                                                    >
                                                        Modifier
                                                    </Link>
                                                    {category.products_count === 0 && (
                                                        <Link
                                                            href={route('product-categories.destroy', category.id)}
                                                            method="delete"
                                                            as="button"
                                                            className="text-red-600 hover:text-red-900"
                                                            onClick={(e) => {
                                                                if (!confirm('Êtes-vous sûr de vouloir supprimer cette catégorie ?')) {
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

                        {/* Message si aucune catégorie */}
                        {categories.length === 0 && (
                            <div className="p-12 text-center text-gray-500">
                                <div className="text-6xl mb-4">📁</div>
                                <p className="text-lg mb-2">Aucune catégorie créée</p>
                                <p className="text-sm">Commencez par créer votre première catégorie de produits</p>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
