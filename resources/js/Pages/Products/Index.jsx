import ProductSearchGeneric from '@/Components/ProductSearchGeneric';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link, router } from '@inertiajs/react';

export default function ProductsIndex({ auth, products }) {

    // Redirection vers la page Show du produit
    const handleProductSelect = (product) => {
        router.visit(`/products/${product.id}`);
    };
    return (
        <AuthenticatedLayout user={auth.user}>
            <Head title="Produits" />

            <div className="py-12">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg">
                        <div className="p-6">
                            <div className="flex justify-between items-center mb-6">
                                <h1 className="text-2xl font-bold">Gestion des Produits</h1>

                                <Link
                                    href={route('products.create')}
                                    className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
                                >
                                    Nouveau Produit
                                </Link>
                            </div>


                            <ProductSearchGeneric
                                onProductSelect={handleProductSelect}
                                placeholder="Rechercher un produit pour voir ses détails..."
                                showStockInfo={true}
                            />

                            <div className="overflow-x-auto mt-8">
                                <table className="min-w-full divide-y divide-gray-200">
                                    <thead className="bg-gray-50">
                                        <tr>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                Référence
                                            </th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                Produit
                                            </th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                Emballage
                                            </th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                Prix d'achat
                                            </th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                Stock
                                            </th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                Actions
                                            </th>
                                        </tr>
                                    </thead>
                                    <tbody className="bg-white divide-y divide-gray-200">
                                        {products.map((product) => (
                                            <tr key={product.id} className={product.is_low_stock ? 'bg-red-50' : ''}>
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    <div className="text-sm font-medium text-gray-900">
                                                        {product.reference}
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    <div className="flex items-center">
                                                        {product.image_url && (
                                                            <img
                                                                src={product.image_url}
                                                                alt={product.name}
                                                                className="h-10 w-10 rounded-full object-cover mr-3"
                                                            />
                                                        )}
                                                        <div>
                                                            <div className="text-sm font-medium text-gray-900">
                                                                {product.category?.code || '-'} {product.name}
                                                            </div>
                                                            {product.description && (
                                                                <div className="text-sm text-gray-500 truncate max-w-xs">
                                                                    {product.description}
                                                                </div>
                                                            )}
                                                        </div>
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    <div className="text-sm text-gray-900">
                                                        {product.packaging_type?.name}
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    <div className="text-sm text-gray-900">
                                                        {product.purchase_price.toLocaleString()} F
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    <div className={`text-sm font-medium ${
                                                        product.is_low_stock ? 'text-red-600' : 'text-green-600'
                                                    }`}>
                                                        {product.stocks?.reduce((sum, stock) => sum + parseFloat(stock.quantity), 0) || 0}
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                                    <div className="flex space-x-2">
                                                        <Link
                                                            href={route('products.show', product.id)}
                                                            className="text-blue-600 hover:text-blue-900"
                                                        >
                                                            Voir
                                                        </Link>
                                                        <Link
                                                            href={route('products.edit', product.id)}
                                                            className="text-green-600 hover:text-green-900"
                                                        >
                                                            Modifier
                                                        </Link>
                                                    </div>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
