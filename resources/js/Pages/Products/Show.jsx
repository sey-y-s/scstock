import ProductStockTable from '@/Components/ProductStockTable';
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


                            {/* TABLEAU DES STOCKS */}
                            <ProductStockTable product={product} />
                        </div>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
