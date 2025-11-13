import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link } from '@inertiajs/react';

export default function Index({ auth, movements }) {

    const movementTypes = [
        {
            type: 'in',
            title: 'Approvisionnement',
            description: 'Entrée de stock',
            icon: '📥',
            color: 'green',
            route: 'stocks.incoming.create',
            details: [
                'Réception de marchandises',
                'Ajout au stock',
                'Facture fournisseur'
            ]
        },
        {
            type: 'out',
            title: 'Vente Client',
            description: 'Sortie de stock',
            icon: '📤',
            color: 'red',
            route: 'stocks.outgoing.create',
            details: [
                'Livraison client',
                'Diminution du stock',
                'Facture client'
            ]
        },
        {
            type: 'transfer',
            title: 'Transfert Interne',
            description: 'Transfert entre dépôts',
            icon: '🔄',
            color: 'blue',
            route: 'stocks.transfer.create',
            details: [
                'Mouvement interne',
                'Rééquilibrage des stocks',
                'Aucun impact financier'
            ]
        }
    ];

    const getColorClasses = (color) => {
        const classes = {
            green: {
                border: 'border-green-300',
                bg: 'bg-green-50',
                hover: 'hover:bg-green-50',
                text: 'text-green-700',
                icon: 'text-green-600'
            },
            red: {
                border: 'border-red-300',
                bg: 'bg-red-50',
                hover: 'hover:bg-red-50',
                text: 'text-red-700',
                icon: 'text-red-600'
            },
            blue: {
                border: 'border-blue-300',
                bg: 'bg-blue-50',
                hover: 'hover:bg-blue-50',
                text: 'text-blue-700',
                icon: 'text-blue-600'
            }
        };
        return classes[color] || classes.green;
    };

    const getTypeLabel = (type) => {
        const types = {
            'in': 'Entrée',
            'out': 'Sortie',
            'transfer': 'Transfert'
        };
        return types[type] || type;
    };

    const getTypeColor = (type) => {
        const colors = {
            'in': 'bg-green-100 text-green-800',
            'out': 'bg-red-100 text-red-800',
            'transfer': 'bg-blue-100 text-blue-800'
        };
        return colors[type] || 'bg-gray-100 text-gray-800';
    };

    const getStatusColor = (status) => {
        const colors = {
            'draft': 'bg-yellow-100 text-yellow-800',
            'completed': 'bg-green-100 text-green-800',
            'cancelled': 'bg-red-100 text-red-800'
        };
        return colors[status] || 'bg-gray-100 text-gray-800';
    };

    const translateLabel = (label) => {
        if (label === 'Next &raquo;') return ' »';
        if (label === '&laquo; Previous') return '« ';
        return label;
    };

    return (
        <AuthenticatedLayout user={auth.user}>
            <Head title="Mouvements de Stock" />

            <div className="py-12">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg">
                        <div className="p-6">
                            <div className="flex justify-between items-center mb-6">
                                <h1 className="text-2xl font-bold">Mouvements de Stock</h1>
                                {/* <Link
                                    href={route('stock-movements.create')}
                                    className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
                                >
                                    Nouveau Mouvement
                                </Link> */}
                            </div>


                            {/* Cartes des types de mouvement */}
                            <div className="grid grid-cols-1 lg:grid-cols-3 lg:max-w-4xl mx-auto gap-8 mb-12">
                                {movementTypes.map((movement) => {
                                    const color = getColorClasses(movement.color);

                                    return (
                                        <Link
                                            key={movement.type}
                                            href={route(movement.route)}
                                            className={`block border-2 rounded-xl p-8 transition-all duration-300 hover:scale-104 hover:shadow-xl ${color.border} ${color.hover} group`}
                                        >
                                            {/* Icône et titre */}
                                            <div className="text-center mb-6">
                                                <div className={`text-5xl mb-4 ${color.icon} group-hover:scale-110 transition-transform`}>
                                                    {movement.icon}
                                                </div>
                                                <h3 className={`text-xl font-bold mb-2 ${color.text}`}>
                                                    {movement.title}
                                                </h3>
                                                <p className="text-gray-600 text-sm leading-relaxed">
                                                    {movement.description}
                                                </p>
                                            </div>

                                            {/* Détails */}
                                            {/* <ul className="space-y-2">
                                                {movement.details.map((detail, index) => (
                                                    <li key={index} className="flex items-start text-sm text-gray-600">
                                                        <span className="text-green-500 mr-2 mt-0.5">✓</span>
                                                        {detail}
                                                    </li>
                                                ))}
                                            </ul> */}

                                            {/* Bouton d'action */}
                                            <div className="mt-6 text-center">
                                                <span className={`inline-flex items-center px-4 py-2 rounded-full text-sm font-medium ${color.bg} ${color.text} border ${color.border} group-hover:shadow-md transition-shadow`}>
                                                    Créer ce mouvement
                                                    <svg className="ml-2 w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                                                    </svg>
                                                </span>
                                            </div>
                                        </Link>
                                    );
                                })}
                            </div>

                            {/* Tableau des mouvements */}
                            {movements.data.length === 0 ? (
                                <div className="text-center text-gray-500">
                                    Aucun mouvement de stock trouvé.
                                </div>
                            ) : (
                            <div className="overflow-x-auto">
                                <table className="min-w-full divide-y divide-gray-200">
                                    <thead className="bg-gray-50">
                                        <tr>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                Référence
                                            </th>
                                            <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                Type
                                            </th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                Source → Destination
                                            </th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                Produits
                                            </th>
                                            <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                Statut
                                            </th>
                                            <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                Date
                                            </th>
                                            <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                Actions
                                            </th>
                                        </tr>
                                    </thead>
                                    <tbody className="bg-white divide-y divide-gray-200">
                                        {movements.data.map((movement) => (
                                            <tr key={movement.id}>
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    <div className="text-sm font-medium text-gray-900">
                                                        {movement.reference}
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4 text-center whitespace-nowrap">
                                                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getTypeColor(movement.type)}`}>
                                                        {getTypeLabel(movement.type)}
                                                    </span>
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    <div className="text-sm text-gray-900">
                                                        {movement.from_warehouse?.name || 'Fournisseur'}
                                                        {' → '}
                                                        {movement.to_warehouse?.name || 'Client'}
                                                    </div>
                                                    <div className="text-sm text-gray-500">
                                                        {movement.supplier?.name || movement.customer?.name || '-'}
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    <div className="text-sm text-gray-900">
                                                        {movement.items?.length || 0} produit(s)
                                                    </div>
                                                    <div className="text-sm text-gray-500">
                                                        Qté totale: {movement.total_quantity}
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4 text-center whitespace-nowrap">
                                                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(movement.status)}`}>
                                                        {movement.status === 'completed' ? 'Terminé' :
                                                         movement.status === 'draft' ? 'Brouillon' : 'Annulé'}
                                                    </span>
                                                </td>
                                                <td className="px-6 py-4 text-center whitespace-nowrap text-sm text-gray-500">
                                                    {new Date(movement.movement_date).toLocaleDateString('fr-FR')}
                                                </td>
                                                <td className="px-6 py-4 text-center whitespace-nowrap text-sm font-medium">
                                                    {movement.status === 'draft' ? (
                                                        <Link
                                                            href={route('stock-movements.add-products', movement.id)}
                                                            className="text-blue-600 hover:text-blue-900 mr-3"
                                                        >
                                                            Compléter
                                                        </Link>
                                                    ) : (
                                                        <Link
                                                            href={route('stock-movements.show', movement.id)}
                                                            className="text-blue-600 hover:text-blue-900 mr-3"
                                                        >
                                                            Voir
                                                        </Link>
                                                    )}

                                                    {/* <Link
                                                        href={route('stock-movements.edit', movement.id)}
                                                        className="text-green-600 hover:text-green-900"
                                                    >
                                                        Modifier
                                                    </Link> */}
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                            )}

                            {/* Pagination */}
                            {movements.links && (movements.data.length > 3) && (
                                <div className="bg-white px-4 py-3 border-t border-gray-200 sm:px-6">
                                    <div className="flex justify-between items-center">
                                        <div className="text-sm text-gray-700">
                                            Affichage de {movements.from} à {movements.to} sur {movements.total} résultats
                                        </div>
                                        <div className="flex space-x-2">
                                            {movements.links.map((link, index) => (
                                                <Link
                                                    key={index}
                                                    href={link.url || '#'}
                                                    className={`px-3 py-1 rounded-md ${
                                                        link.active
                                                            ? 'bg-blue-500 text-white'
                                                            : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                                                    } ${!link.url ? 'opacity-50 cursor-not-allowed' : ''}`}
                                                    dangerouslySetInnerHTML={{ __html: translateLabel(link.label) }}
                                                />
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
