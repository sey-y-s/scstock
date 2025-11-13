import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link } from '@inertiajs/react';

export default function Create({ auth }) {
    const movementTypes = [
        {
            type: 'in',
            title: 'Approvisionnement',
            description: 'Entrée de stock depuis un fournisseur',
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
            description: 'Sortie de stock vers un client',
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
                hover: 'hover:bg-green-100',
                text: 'text-green-700',
                icon: 'text-green-600'
            },
            red: {
                border: 'border-red-300',
                bg: 'bg-red-50',
                hover: 'hover:bg-red-100',
                text: 'text-red-700',
                icon: 'text-red-600'
            },
            blue: {
                border: 'border-blue-300',
                bg: 'bg-blue-50',
                hover: 'hover:bg-blue-100',
                text: 'text-blue-700',
                icon: 'text-blue-600'
            }
        };
        return classes[color] || classes.green;
    };

    return (
        <AuthenticatedLayout user={auth.user}>
            <Head title="Nouveau Mouvement de Stock" />

            <div className="py-12">
                <div className="max-w-6xl mx-auto sm:px-6 lg:px-8">
                    <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg">
                        <div className="p-8">
                            {/* En-tête */}
                            <div className="text-center mb-12">
                                <h1 className="text-3xl font-bold text-gray-900 mb-3">
                                    Nouveau Mouvement de Stock
                                </h1>
                                <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                                    Sélectionnez le type de mouvement que vous souhaitez créer.
                                </p>
                            </div>

                            {/* Cartes des types de mouvement */}
                            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-12">
                                {movementTypes.map((movement) => {
                                    const color = getColorClasses(movement.color);

                                    return (
                                        <Link
                                            key={movement.type}
                                            href={route(movement.route)}
                                            className={`block border-2 rounded-xl p-8 transition-all duration-300 hover:scale-105 hover:shadow-xl ${color.border} ${color.bg} ${color.hover} group`}
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

                            {/* design pour plus tard */}
                            {/* <div class="relative min-h-screen bg-gradient-to-br from-cyan-500 to-blue-500 flex items-center justify-center p-8">
                                <a href="#" class="group block w-full max-w-sm p-6 bg-white/20 backdrop-blur-lg rounded-xl shadow-2xl border border-white/30 transition-all duration-300 ease-in-out hover:bg-white/30">
                                    <div class="text-center">
                                    <h3 class="text-2xl font-bold text-white mb-3 group-hover:text-gray-100 transition-colors">Interactive Glass Card</h3>
                                    <p class="text-sm text-white/80 mb-6 group-hover:text-white/90 transition-colors">
                                        This is a more complex card with interactive elements, all within the clickable card wrapper.
                                    </p>
                                    <div class="flex justify-center mt-4">
                                        <span class="inline-block px-4 py-2 bg-white/40 backdrop-blur-sm rounded-full text-white font-medium text-xs border border-white/50 transition-colors duration-300 group-hover:bg-white/50">
                                        Clickable Tag
                                        </span>
                                    </div>
                                    </div>
                                </a>
                            </div> */}


                            {/* Statistiques rapides */}
                            <div className="bg-gray-50 rounded-lg p-6 mb-8">
                                <h3 className="text-lg font-semibold text-gray-900 mb-4">
                                    📊 Aperçu des mouvements récents
                                </h3>
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-center">
                                    <div className="bg-white rounded-lg p-4 shadow-sm">
                                        <div className="text-2xl font-bold text-green-600">12</div>
                                        <div className="text-sm text-gray-600">Approvisionnements ce mois</div>
                                    </div>
                                    <div className="bg-white rounded-lg p-4 shadow-sm">
                                        <div className="text-2xl font-bold text-red-600">8</div>
                                        <div className="text-sm text-gray-600">Ventes cette semaine</div>
                                    </div>
                                    <div className="bg-white rounded-lg p-4 shadow-sm">
                                        <div className="text-2xl font-bold text-blue-600">5</div>
                                        <div className="text-sm text-gray-600">Transferts en attente</div>
                                    </div>
                                </div>
                            </div>

                            {/* Navigation */}
                            <div className="flex justify-between items-center pt-6 border-t border-gray-200">
                                <Link
                                    href={route('operations.index')}
                                    className="inline-flex items-center text-gray-600 hover:text-gray-900 transition-colors"
                                >
                                    <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                                    </svg>
                                    Retour <span className='hidden md:block'> à la liste des mouvements</span>
                                </Link>

                                <div className="text-sm text-gray-500">
                                    Besoin d'aide ?{' '}
                                    <Link
                                        href="#"
                                        className="text-blue-600 hover:text-blue-800 underline"
                                    >
                                        Consulter le guide
                                    </Link>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
