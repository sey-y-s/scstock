import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link } from '@inertiajs/react';

export default function Show({ auth, product }) {

    const totalStock = product.stocks?.reduce((sum, stock) => sum + parseFloat(stock.quantity), 0) || 0;

    return (
        <AuthenticatedLayout user={auth.user}>
            <Head title={product.name} />

            <div className="py-12">
                <div className="max-w-4xl mx-auto sm:px-6 lg:px-8">
                    <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg">
                        <div className="p-6">
                            {/* En-tête avec actions */}
                            <div className="flex justify-between items-start mb-8">
                                <div>
                                    <h1 className="text-2xl font-bold text-gray-900">{product.category?.code || '-'} {product.name}</h1>
                                    <p className="text-gray-600 mt-1">Référence: {product.reference}</p>
                                </div>
                                <div className="flex space-x-3">
                                    <Link
                                        href={route('products.edit', product.id)}
                                        className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition duration-150"
                                    >
                                        Modifier
                                    </Link>
                                    <Link
                                        href={route('products.index')}
                                        className="px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 transition duration-150"
                                    >
                                        Retour
                                    </Link>
                                </div>
                            </div>

                            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                                {/* Colonne gauche - Image et infos principales */}
                                <div className="lg:col-span-1">
                                    {product.image_url ? (
                                        <img
                                            src={product.image_url}
                                            alt={product.name}
                                            className="w-full h-64 object-contain rounded-lg shadow-md"
                                        />
                                    ) : (
                                        <div className="w-full h-64 bg-gray-200 rounded-lg flex items-center justify-center">
                                            <span className="text-gray-500">Aucune image</span>
                                        </div>
                                    )}

                                    {/* Statut stock */}
                                    <div className={`mt-4 p-4 rounded-lg ${
                                        product.is_low_stock ? 'bg-red-50 border border-red-200' : 'bg-green-50 border border-green-200'
                                    }`}>
                                        <div className="flex justify-between items-center">
                                            <span className={`font-semibold ${
                                                product.is_low_stock ? 'text-red-800' : 'text-green-800'
                                            }`}>
                                                Stock {product.is_low_stock ? 'Faible' : 'Normal'}
                                            </span>
                                            <span className={`text-lg font-bold ${
                                                product.is_low_stock ? 'text-red-600' : 'text-green-600'
                                            }`}>
                                                {totalStock}
                                            </span>
                                        </div>
                                        <div className="text-sm text-gray-600 mt-1">
                                            Alerte: {product.low_stock_alert} {product.packaging_type?.name.toLowerCase()}
                                        </div>
                                    </div>
                                </div>

                                {/* Colonne droite - Détails */}
                                <div className="lg:col-span-2 space-y-6">
                                    {/* Informations générales */}
                                    <div>
                                        <h2 className="text-lg font-semibold text-gray-900 mb-4">Informations du produit</h2>
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                            <div>
                                                <label className="block text-sm font-medium text-gray-700">Catégorie</label>
                                                <p className="mt-1 text-sm text-gray-900">
                                                    {product.category ? `${product.category.name} (${product.category.code})` : 'Aucune'}
                                                </p>
                                            </div>
                                            <div>
                                                <label className="block text-sm font-medium text-gray-700">Type d'emballage</label>
                                                <p className="mt-1 text-sm text-gray-900">{product.packaging_type?.name}</p>
                                            </div>
                                            <div>
                                                <label className="block text-sm font-medium text-gray-700">Prix d'achat</label>
                                                <p className="mt-1 text-sm text-gray-900">{product.purchase_price?.toLocaleString()} F</p>
                                            </div>
                                            <div>
                                                <label className="block text-sm font-medium text-gray-700">Statut</label>
                                                <p className="mt-1">
                                                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                                                        product.is_active
                                                            ? 'bg-green-100 text-green-800'
                                                            : 'bg-red-100 text-red-800'
                                                    }`}>
                                                        {product.is_active ? 'Actif' : 'Inactif'}
                                                    </span>
                                                </p>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Description */}
                                    {product.description && (
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
                                            <p className="text-sm text-gray-900 bg-gray-50 p-3 rounded-md">
                                                {product.description}
                                            </p>
                                        </div>
                                    )}

                                    {/* Stocks par emplacement */}
                                    <div>
                                        <h2 className="text-lg font-semibold text-gray-900 mb-4">Stocks par emplacement</h2>
                                        {product.stocks && product.stocks.length > 0 ? (
                                            <div className="space-y-3">
                                                {product.stocks.map(stock => (
                                                    <div key={stock.id} className="flex justify-between items-center p-3 border rounded-lg">
                                                        <div>
                                                            <div className="font-medium text-gray-900">{stock.warehouse.name}</div>
                                                            <div className="text-sm text-gray-600 capitalize">
                                                                {stock.warehouse.type === 'depot' ? 'Dépôt' : 'Point de vente'}
                                                            </div>
                                                        </div>
                                                        <div className={`text-lg font-semibold ${
                                                            parseFloat(stock.quantity) <= product.low_stock_alert
                                                                ? 'text-red-600'
                                                                : 'text-green-600'
                                                        }`}>
                                                            {stock.quantity} {product.packaging_type?.name.toLowerCase()}
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>
                                        ) : (
                                            <div className="text-center py-8 text-gray-500 bg-gray-50 rounded-lg">
                                                Aucun stock enregistré pour ce produit
                                            </div>
                                        )}
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
