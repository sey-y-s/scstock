import React from 'react';

export default function ProductStockTable({ product }) {
    // Calculer les totaux et indicateurs
    const totalStock = product.stocks?.reduce((sum, stock) => sum + parseFloat(stock.quantity), 0) || 0;
    const lowStockCount = product.stocks?.filter(stock =>
        parseFloat(stock.quantity) <= (parseFloat(product.low_stock_alert) || 5)
    ).length || 0;

    // Trier les stocks par quantité (décroissant)
    const sortedStocks = product.stocks?.sort((a, b) => parseFloat(b.quantity) - parseFloat(a.quantity)) || [];

    return (
        <div className="space-y-6">
            {/* EN-TÊTE DU PRODUIT */}
            <div className="bg-white rounded-lg shadow p-6">
                <div className="flex items-start justify-between">
                    <div className="flex items-center space-x-4">
                        {product.image_url && (
                            <img
                                src={product.image_url}
                                alt={product.name}
                                className="h-16 w-16 rounded-lg object-cover border"
                            />
                        )}
                        <div>
                            <h1 className="text-2xl font-bold text-gray-900">
                                {product.reference} - {product.name}
                            </h1>
                            {/* <p className="text-gray-600"></p> */}
                            <div className="flex items-center space-x-4 mt-2">
                                <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                                    totalStock > (parseFloat(product.low_stock_alert) || 5)
                                        ? 'bg-green-100 text-green-800'
                                        : 'bg-red-100 text-red-800'
                                }`}>
                                    📦 Stock total: {totalStock} {product.packaging_type.code}
                                </span>
                                {lowStockCount > 0 && (
                                    <span className="bg-orange-100 text-orange-800 px-3 py-1 rounded-full text-sm font-medium">
                                        ⚠️ {lowStockCount} dépôt(s) en stock faible
                                    </span>
                                )}
                                {product.category && (
                                    <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-medium">
                                        {product.category.name}
                                    </span>
                                )}
                            </div>
                        </div>
                    </div>

                    <div className="text-right">
                        <div className="text-lg font-semibold text-gray-900">
                            Prix d'achat: {product.purchase_price?.toLocaleString('fr-FR')} F
                        </div>
                        {/* {product.priceB && (
                            <div className="text-lg font-semibold text-blue-600">
                                Prix de vente: {product.priceB.toLocaleString('fr-FR')} F
                            </div>
                        )} */}
                    </div>
                </div>
            </div>

            {/* TABLEAU DES STOCKS PAR WAREHOUSE */}
            <div className="bg-white rounded-lg shadow">
                <div className="p-6 border-b border-gray-200">
                    <div className="flex justify-between items-center">
                        <h2 className="text-xl font-bold text-gray-900">
                            📊 Répartition du stock par dépôt/point de vente
                        </h2>
                        <span className="bg-blue-100 text-blue-800 text-sm font-bold px-3 py-1 rounded-full">
                            {sortedStocks.length} emplacement(s)
                        </span>
                    </div>
                </div>

                {sortedStocks.length === 0 ? (
                    <div className="p-12 text-center text-gray-500">
                        <div className="text-6xl mb-4">📭</div>
                        <p className="text-lg mb-2">Aucun stock disponible</p>
                        <p className="text-sm">Ce produit n'est présent dans aucun dépôt pour le moment</p>
                    </div>
                ) : (
                    <div className="overflow-hidden">
                        <table className="min-w-full divide-y divide-gray-200">
                            <thead className="bg-gray-50">
                                <tr>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Dépôt
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Type
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Quantité
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Statut
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Dernière màj
                                    </th>
                                </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-200">
                                {sortedStocks.map((stock) => (
                                    <tr
                                        key={stock.id}
                                        className="hover:bg-gray-50 transition-colors cursor-pointer"
                                    >
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="flex items-center">
                                                <div className={`w-3 h-3 rounded-full mr-3 ${
                                                    stock.warehouse?.type === 'depot'
                                                        ? 'bg-blue-500'
                                                        : 'bg-green-500'
                                                }`}></div>
                                                <div>
                                                    <div className="font-medium text-gray-900">
                                                        {stock.warehouse?.name}
                                                    </div>
                                                    <div className="text-sm text-gray-500">
                                                        {stock.warehouse?.code}
                                                    </div>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                                                stock.warehouse?.type === 'depot'
                                                    ? 'bg-blue-100 text-blue-800'
                                                    : 'bg-green-100 text-green-800'
                                            }`}>
                                                {stock.warehouse?.type === 'depot' ? 'Dépôt' : 'Point de vente'}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="text-lg font-semibold text-gray-900">
                                                {parseFloat(stock.quantity)}
                                            </div>
                                            <div className="text-sm text-gray-500">
                                                {product.packaging_type.code}
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <span className={`inline-flex px-3 py-1 text-sm font-semibold rounded-full ${
                                                parseFloat(stock.quantity) === 0
                                                    ? 'bg-red-100 text-red-800'
                                                    : parseFloat(stock.quantity) <= (product.low_stock_alert || 5)
                                                    ? 'bg-orange-100 text-orange-800'
                                                    : 'bg-green-100 text-green-800'
                                            }`}>
                                                {parseFloat(stock.quantity) === 0
                                                    ? '📭 Rupture'
                                                    : parseFloat(stock.quantity) <= (product.low_stock_alert || 5)
                                                    ? '⚠️ Stock faible'
                                                    : '✅ Bon niveau'}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                            {stock.updated_at
                                                ? new Date(stock.updated_at).toLocaleDateString('fr-FR', {
                                                    day: '2-digit',
                                                    month: '2-digit',
                                                    year: 'numeric',
                                                    hour: '2-digit',
                                                    minute: '2-digit'
                                                })
                                                : 'N/A'
                                            }
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>

            {/* GRAPHIQUE DE RÉPARTITION */}
            {sortedStocks.length > 0 && (
                <div className="bg-white rounded-lg shadow p-6">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">
                        📈 Répartition visuelle des stocks
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {sortedStocks.map((stock) => {
                            const maxQuantity = Math.max(...sortedStocks.map(s => s.quantity));
                            const percentage = maxQuantity > 0 ? (parseFloat(stock.quantity) / maxQuantity) * 100 : 0;

                            return (
                                <div key={stock.id} className="border rounded-lg p-4">
                                    <div className="flex justify-between items-center mb-2">
                                        <span className="font-medium text-gray-900">
                                            {stock.warehouse?.name}
                                        </span>
                                        <span className="text-sm text-gray-500">
                                            {parseFloat(stock.quantity)} {product.packaging_type.code}
                                        </span>
                                    </div>
                                    <div className="w-full bg-gray-200 rounded-full h-2">
                                        <div
                                            className={`h-2 rounded-full ${
                                                parseFloat(stock.quantity) === 0
                                                    ? 'bg-red-500'
                                                    : parseFloat(stock.quantity) <= (product.low_stock_alert || 5)
                                                    ? 'bg-orange-500'
                                                    : 'bg-green-500'
                                            }`}
                                            style={{ width: `${percentage}%` }}
                                        ></div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>
            )}
        </div>
    );
}
