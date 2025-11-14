import React from 'react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link } from '@inertiajs/react';

export default function Show({ auth, category, products }) {
    const getTotalStock = (product) => {
        return product.stocks.reduce((sum, stock) => sum + parseFloat(stock.quantity), 0);
    };

    return (
        <AuthenticatedLayout user={auth.user}>
            <Head title={`Catégorie - ${category.name}`} />

            <div className="py-12">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    {/* En-tête de la catégorie */}
                    <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg mb-6">
                        <div className="p-6">
                            <div className="flex justify-between items-start mb-6">
                                <div className="flex items-start space-x-4">
                                    <div className="p-3 rounded-lg bg-blue-100 text-blue-600">
                                        <span className="text-2xl">📁</span>
                                    </div>
                                    <div>
                                        <h1 className="text-2xl font-bold text-gray-900">{category.name}</h1>
                                        <div className="flex items-center space-x-4 mt-2">
                                            <span className="text-sm font-mono text-gray-600 bg-gray-100 px-2 py-1 rounded">
                                                {category.code}
                                            </span>
                                            <span className="text-sm text-gray-600">
                                                {category.products_count} produit(s)
                                            </span>
                                        </div>
                                    </div>
                                </div>

                                <div className="flex space-x-3">
                                    <Link
                                        href={route('product-categories.edit', category.id)}
                                        className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600"
                                    >
                                        ✏️ Modifier
                                    </Link>
                                    <Link
                                        href={route('product-categories.index')}
                                        className="bg-gray-500 text-white px-4 py-2 rounded-md hover:bg-gray-600"
                                    >
                                        ← Liste Catégories
                                    </Link>
                                </div>
                            </div>

                            {/* Description */}
                            {category.description && (
                                <div className="bg-gray-50 p-4 rounded-lg mb-6">
                                    <h3 className="text-sm font-medium text-gray-700 mb-2">Description</h3>
                                    <p className="text-gray-900">{category.description}</p>
                                </div>
                            )}

                            {/* Statistiques */}
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 text-center">
                                    <div className="text-2xl font-bold text-blue-600">
                                        {products.total}
                                    </div>
                                    <div className="text-sm text-blue-600">Produits total</div>
                                </div>
                                <div className="bg-green-50 border border-green-200 rounded-lg p-4 text-center">
                                    <div className="text-2xl font-bold text-green-600">
                                        {products.data.filter(product => getTotalStock(product) > 0).length}
                                    </div>
                                    <div className="text-sm text-green-600">Produits en stock</div>
                                </div>
                                <div className="bg-orange-50 border border-orange-200 rounded-lg p-4 text-center">
                                    <div className="text-2xl font-bold text-orange-600">
                                        {products.data.filter(product => getTotalStock(product) === 0).length}
                                    </div>
                                    <div className="text-sm text-orange-600">Produits en rupture</div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Produits de la catégorie */}
                    <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg">
                        <div className="p-6 border-b border-gray-200">
                            <div className="flex justify-between items-center">
                                <h2 className="text-xl font-bold text-gray-900">
                                    📦 Produits de cette catégorie
                                </h2>
                                <span className="bg-blue-100 text-blue-800 text-sm font-bold px-3 py-1 rounded-full">
                                    {products.total} produit(s)
                                </span>
                            </div>
                        </div>

                        {products.data.length === 0 ? (
                            <div className="p-12 text-center text-gray-500">
                                <div className="text-6xl mb-4">📭</div>
                                <p className="text-lg mb-2">Aucun produit dans cette catégorie</p>
                                <p className="text-sm">Les produits apparaîtront ici quand ils seront créés</p>
                            </div>
                        ) : (
                            <div className="overflow-x-auto">
                                <table className="min-w-full divide-y divide-gray-200">
                                    <thead className="bg-gray-50">
                                        <tr>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                Produit
                                            </th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                Référence
                                            </th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                Emballage
                                            </th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                Stock total
                                            </th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                Actions
                                            </th>
                                        </tr>
                                    </thead>
                                    <tbody className="bg-white divide-y divide-gray-200">
                                        {products.data.map((product) => (
                                            <tr key={product.id} className="hover:bg-gray-50">
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    <div className="flex items-center">
                                                        {product.image_url ? (
                                                            <img
                                                                src={product.image_url}
                                                                alt={product.name}
                                                                className="h-10 w-10 rounded-full object-cover mr-3"
                                                            />
                                                        ) : (
                                                            <div className="h-10 w-10 rounded-full bg-gray-200 flex items-center justify-center mr-3">
                                                                <span className="text-gray-500 text-sm md:text-xl">
                                                                    📦
                                                                </span>
                                                            </div>
                                                        )}
                                                        <div>
                                                            <div className="text-sm font-medium text-gray-900">
                                                                {product.name}
                                                            </div>
                                                        </div>
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    <div className="text-sm text-gray-900 font-mono">
                                                        {product.reference}
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    <div className="text-sm text-gray-900">
                                                        {product.packaging_type?.code || '—'}
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    <div className={`text-sm font-medium ${
                                                        getTotalStock(product) > 0
                                                            ? 'text-green-600'
                                                            : 'text-red-600'
                                                    }`}>
                                                        {getTotalStock(product)}
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                                    <Link
                                                        href={route('products.show', product.id)}
                                                        className="text-blue-600 hover:text-blue-900"
                                                    >
                                                        Voir
                                                    </Link>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        )}

                        {/* Pagination */}
                        {products.links && products.links.length > 3 && (
                            <div className="bg-white px-4 py-3 border-t border-gray-200 sm:px-6">
                                <div className="flex justify-between items-center">
                                    <div className="text-sm text-gray-700">
                                        Affichage de {products.from} à {products.to} sur {products.total} résultats
                                    </div>
                                    <div className="flex space-x-2">
                                        {products.links.map((link, index) => (
                                            <Link
                                                key={index}
                                                href={link.url || '#'}
                                                className={`px-3 py-1 rounded-md ${
                                                    link.active
                                                        ? 'bg-blue-500 text-white'
                                                        : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                                                } ${!link.url ? 'opacity-50 cursor-not-allowed' : ''}`}
                                                dangerouslySetInnerHTML={{ __html: link.label }}
                                            />
                                        ))}
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
