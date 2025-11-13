import React from 'react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link } from '@inertiajs/react';
import { Line, Doughnut } from 'react-chartjs-2';
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    ArcElement,
    Title,
    Tooltip,
    Legend,
} from 'chart.js';

// Enregistrer les composants Chart.js
ChartJS.register(
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    ArcElement,
    Title,
    Tooltip,
    Legend
);

export default function Dashboard({ auth, stats, recentMovements, movementsChart, topProducts, stockAlerts }) {
    // Options pour le graphique en ligne
    const lineChartOptions = {
        responsive: true,
        plugins: {
            legend: {
                position: 'top',
            },
            title: {
                display: true,
                text: 'Mouvements des 30 derniers jours',
            },
        },
        scales: {
            y: {
                beginAtZero: true,
                ticks: {
                    stepSize: 1,
                },
            },
        },
    };

    // Données pour le graphique
    const movementTypesData = {
        labels: ['Entrées', 'Sorties', 'Transferts'],
        datasets: [
            {
                data: [
                    movementsChart.datasets[0].data.reduce((a, b) => a + b, 0),
                    movementsChart.datasets[1].data.reduce((a, b) => a + b, 0),
                    movementsChart.datasets[2].data.reduce((a, b) => a + b, 0),
                ],
                backgroundColor: [
                    'rgba(16, 185, 129, 0.8)',
                    'rgba(239, 68, 68, 0.8)',
                    'rgba(59, 130, 246, 0.8)',
                ],
                borderColor: [
                    '#10B981',
                    '#EF4444',
                    '#3B82F6',
                ],
                borderWidth: 2,
            },
        ],
    };

    const doughnutOptions = {
        responsive: true,
        plugins: {
            legend: {
                position: 'bottom',
            },
        },
    };

    const getMovementTypeColor = (type) => {
        switch (type) {
            case 'in': return 'text-green-600 bg-green-100';
            case 'out': return 'text-red-600 bg-red-100';
            case 'transfer': return 'text-blue-600 bg-blue-100';
            default: return 'text-gray-600 bg-gray-100';
        }
    };

    const getMovementTypeIcon = (type) => {
        switch (type) {
            case 'in': return '📥';
            case 'out': return '📤';
            case 'transfer': return '🔄';
            default: return '📦';
        }
    };

    return (
        <AuthenticatedLayout user={auth.user}>
            <Head title="Dashboard" />

            <div className="py-8">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    {/* En-tête */}
                    <div className="mb-8">
                        <h1 className="text-3xl font-bold text-gray-900">Tableau de Bord</h1>
                        <p className="text-gray-600 mt-2">
                            Vue d'ensemble de votre activité et de vos stocks
                        </p>
                    </div>

                    {/* Cartes de statistiques */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
                        {/* Produits */}
                        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                            <div className="flex items-center">
                                <div className="p-3 rounded-lg bg-blue-100 text-blue-600 mr-4">
                                    <span className="text-2xl">📦</span>
                                </div>
                                <div>
                                    <p className="text-sm font-medium text-gray-600">Produits</p>
                                    <p className="text-2xl font-bold text-gray-900">{stats.totalProducts}</p>
                                </div>
                            </div>
                            <div className="mt-4">
                                <Link
                                    href={route('products.index')}
                                    className="text-blue-600 hover:text-blue-800 text-sm font-medium"
                                >
                                    Voir tous les produits →
                                </Link>
                            </div>
                        </div>

                        {/* Entrepôts */}
                        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                            <div className="flex items-center">
                                <div className="p-3 rounded-lg bg-green-100 text-green-600 mr-4">
                                    <span className="text-2xl">🏭</span>
                                </div>
                                <div>
                                    <p className="text-sm font-medium text-gray-600">Entrepôts</p>
                                    <p className="text-2xl font-bold text-gray-900">{stats.totalWarehouses}</p>
                                </div>
                            </div>
                            <div className="mt-4">
                                <Link
                                    href={route('warehouses.index')}
                                    className="text-green-600 hover:text-green-800 text-sm font-medium"
                                >
                                    Gérer les entrepôts →
                                </Link>
                            </div>
                        </div>

                        {/* Valeur stock */}
                        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                            <div className="flex items-center">
                                <div className="p-3 rounded-lg bg-purple-100 text-purple-600 mr-4">
                                    <span className="text-2xl">💰</span>
                                </div>
                                <div>
                                    <p className="text-sm font-medium text-gray-600">Valeur du stock</p>
                                    <p className="text-2xl font-bold text-gray-900">
                                        {stats.totalStockValue} F
                                    </p>
                                </div>
                            </div>
                            <div className="mt-4">
                                <Link
                                    href={route('stocks.index')}
                                    className="text-purple-600 hover:text-purple-800 text-sm font-medium"
                                >
                                    Voir les stocks →
                                </Link>
                            </div>
                        </div>

                        {/* Alertes stock */}
                        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                            <div className="flex items-center">
                                <div className="p-3 rounded-lg bg-orange-100 text-orange-600 mr-4">
                                    <span className="text-2xl">⚠️</span>
                                </div>
                                <div>
                                    <p className="text-sm font-medium text-gray-600">Stocks faibles</p>
                                    <p className="text-2xl font-bold text-gray-900">{stats.lowStockProducts}</p>
                                </div>
                            </div>
                            <div className="mt-4">
                                <Link
                                    href={route('stocks.index', { stock_level: 'low' })}
                                    className="text-orange-600 hover:text-orange-800 text-sm font-medium"
                                >
                                    Voir les alertes →
                                </Link>
                            </div>
                        </div>

                        {/* Fournisseurs */}
                        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                            <div className="flex items-center">
                                <div className="p-3 rounded-lg bg-teal-100 text-teal-600 mr-4">
                                    <span className="text-2xl">🏢</span>
                                </div>
                                <div>
                                    <p className="text-sm font-medium text-gray-600">Fournisseurs</p>
                                    <p className="text-2xl font-bold text-gray-900">{stats.totalSuppliers}</p>
                                </div>
                            </div>
                            <div className="mt-4">
                                <Link
                                    href={route('suppliers.index')}
                                    className="text-teal-600 hover:text-teal-800 text-sm font-medium"
                                >
                                    Gérer les fournisseurs →
                                </Link>
                            </div>
                        </div>

                        {/* Clients */}
                        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                            <div className="flex items-center">
                                <div className="p-3 rounded-lg bg-yellow-100 text-yellow-600 mr-4">
                                    <span className="text-2xl">👥</span>
                                </div>
                                <div>
                                    <p className="text-sm font-medium text-gray-600">Clients</p>
                                    <p className="text-2xl font-bold text-gray-900">{stats.totalCustomers}</p>
                                </div>
                            </div>
                            <div className="mt-4">
                                <Link
                                    href={route('customers.index')}
                                    className="text-yellow-600 hover:text-yellow-800 text-sm font-medium"
                                >
                                    Gérer les clients →
                                </Link>
                            </div>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
                        {/* Graphique des mouvements */}
                        <div className="lg:col-span-2 bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                            <Line data={movementsChart} options={lineChartOptions} />
                        </div>

                        {/* Répartition des mouvements */}
                        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                            <h3 className="text-lg font-semibold text-gray-900 mb-4">
                                Répartition des mouvements
                            </h3>
                            <div className="h-64">
                                <Doughnut data={movementTypesData} options={doughnutOptions} />
                            </div>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                        {/* Mouvements récents */}
                        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                            <div className="flex justify-between items-center mb-6">
                                <h3 className="text-lg font-semibold text-gray-900">Mouvements récents</h3>
                                <Link
                                    href={route('operations.index')}
                                    className="text-blue-600 hover:text-blue-800 text-sm font-medium"
                                >
                                    Voir tout →
                                </Link>
                            </div>
                            <div className="space-y-4">
                                {recentMovements.length === 0 ? (
                                    <p className="text-gray-500 text-center py-4">Aucun mouvement récent</p>
                                ) : (
                                    recentMovements.map(movement => (
                                        <div key={movement.id} className="flex items-center justify-between p-3 border border-gray-100 rounded-lg hover:bg-gray-50">
                                            <div className="flex items-center space-x-3">
                                                <span className="text-xl">{getMovementTypeIcon(movement.type)}</span>
                                                <div>
                                                    <p className="text-sm font-medium text-gray-900">
                                                        {movement.reference}
                                                    </p>
                                                    <p className="text-xs text-gray-500">
                                                        {movement.source && `${movement.source} → `}{movement.destination}
                                                    </p>
                                                </div>
                                            </div>
                                            <div className="text-right">
                                                <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${getMovementTypeColor(movement.type)}`}>
                                                    {movement.type}
                                                </span>
                                                <p className="text-xs text-gray-500 mt-1">
                                                    {movement.created_at}
                                                </p>
                                            </div>
                                        </div>
                                    ))
                                )}
                            </div>
                        </div>

                        {/* Produits les plus mouvementés */}
                        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                            <h3 className="text-lg font-semibold text-gray-900 mb-6">
                                Produits les plus mouvementés
                            </h3>
                            <div className="space-y-4">
                                {topProducts.length === 0 ? (
                                    <p className="text-gray-500 text-center py-4">Aucune donnée</p>
                                ) : (
                                    topProducts.map((product, index) => (
                                        <div key={product.id} className="flex items-center justify-between p-3 border border-gray-100 rounded-lg hover:bg-gray-50">
                                            <div className="flex items-center space-x-3">
                                                <span className="text-sm font-medium text-gray-500 w-6">
                                                    #{index + 1}
                                                </span>
                                                {product.image_url ? (
                                                    <img
                                                        src={product.image_url}
                                                        alt={product.name}
                                                        className="h-8 w-8 rounded-lg object-cover"
                                                    />
                                                ) : (
                                                    <div className="h-8 w-8 bg-gray-200 rounded-lg flex items-center justify-center text-gray-400">
                                                        📦
                                                    </div>
                                                )}
                                                <div>
                                                    <p className="text-sm font-medium text-gray-900">
                                                        {product.reference}
                                                    </p>
                                                    <p className="text-xs text-gray-500 truncate max-w-[120px]">
                                                        {product.name}
                                                    </p>
                                                </div>
                                            </div>
                                            <div className="text-right">
                                                <span className="text-sm font-bold text-blue-600">
                                                    {product.movement_count.toLocaleString('fr-FR')}
                                                </span>
                                                <p className="text-xs text-gray-500">unités</p>
                                            </div>
                                        </div>
                                    ))
                                )}
                            </div>
                        </div>

                        {/* Alertes stock faible */}
                        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                            <div className="flex justify-between items-center mb-6">
                                <h3 className="text-lg font-semibold text-gray-900">Alertes stock faible</h3>
                                <Link
                                    href={route('stocks.index', { stock_level: 'low' })}
                                    className="text-orange-600 hover:text-orange-800 text-sm font-medium"
                                >
                                    Voir tout →
                                </Link>
                            </div>
                            <div className="space-y-4">
                                {stockAlerts.length === 0 ? (
                                    <p className="text-green-500 text-center py-4">✅ Aucune alerte</p>
                                ) : (
                                    stockAlerts.map(alert => (
                                        <div key={alert.id} className="p-3 border border-orange-200 bg-orange-50 rounded-lg">
                                            <div className="flex items-center space-x-3">
                                                {alert.image_url && (
                                                    <img
                                                        src={alert.image_url}
                                                        alt={alert.product_name}
                                                        className="h-8 w-8 rounded-lg object-cover"
                                                    />
                                                )}
                                                <div className="flex-1">
                                                    <p className="text-sm font-medium text-gray-900">
                                                        {alert.product_reference}
                                                    </p>
                                                    <p className="text-xs text-gray-600">
                                                        {alert.warehouse_name}
                                                    </p>
                                                </div>
                                            </div>
                                            <div className="mt-2 flex justify-between items-center">
                                                <span className="text-xs text-orange-600 font-medium">
                                                    Stock: {alert.current_stock}
                                                </span>
                                                <span className="text-xs text-gray-500">
                                                    Alerte: {alert.alert_threshold}
                                                </span>
                                            </div>
                                            <div className="mt-2 w-full bg-orange-200 rounded-full h-1">
                                                <div
                                                    className="bg-orange-500 h-1 rounded-full"
                                                    style={{
                                                        width: `${Math.min(100, (alert.current_stock / alert.alert_threshold) * 100)}%`
                                                    }}
                                                ></div>
                                            </div>
                                        </div>
                                    ))
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}




// import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
// import { Head } from '@inertiajs/react';

// export default function Dashboard() {
//     return (
//         <AuthenticatedLayout
//             header={
//                 <h2 className="text-xl font-semibold leading-tight text-gray-800">
//                     Dashboard
//                 </h2>
//             }
//         >
//             <Head title="Dashboard" />

//             <div className="py-12">
//                 <div className="mx-auto max-w-7xl sm:px-6 lg:px-8">
//                     <div className="overflow-hidden bg-white shadow-sm sm:rounded-lg">
//                         <div className="p-6 text-gray-900">
//                             You're logged in!
//                         </div>
//                     </div>
//                 </div>
//             </div>
//         </AuthenticatedLayout>
//     );
// }
