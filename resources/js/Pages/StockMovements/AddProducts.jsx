import React, { useEffect, useState } from 'react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, useForm, Link } from '@inertiajs/react';
import ProductSearch from '@/Components/ProductSearch';

export default function AddProducts({ auth, movement, warehouseId, existingItems }) {
    const [cart, setCart] = useState(existingItems);
    const [readyToSubmit, setReadyToSubmit] = useState(false);


    const { data, setData, post, processing, errors } = useForm({
        items: existingItems
    });

    const completeMovement = () => {
        if (cart.length === 0) {
            alert('🛒 Veuillez ajouter au moins un produit au panier');
            return;
        }

        // Vérifier les stocks une dernière fois côté client
        const hasStockIssues = cart.some(item =>
            movement.type !== 'in' && item.quantity > item.current_stock
        );

        if (hasStockIssues) {
            alert('⚠️ Certains produits ont des quantités supérieures au stock disponible. Veuillez ajuster les quantités.');
            return;
        }
        const payload = cart.map(item => ({
            product_id: item.product_id,
            quantity: parseFloat(item.quantity),
            unit_price: parseInt(item.unit_price)
        }));
        setData('items', payload);
        setReadyToSubmit(true);
    };

    useEffect(() => {
        if (readyToSubmit) {
            post(route('stock-movements.complete', movement.id), {
                onFinish: () => setReadyToSubmit(false)
            });
        }
    }, [readyToSubmit]);


    const getMovementInfo = () => {
        const types = {
            in: {
                label: 'Approvisionnement',
                color: 'green',
                icon: '📥',
                action: 'Valider l\'approvisionnement'
            },
            out: {
                label: 'Vente',
                color: 'red',
                icon: '📤',
                action: 'Valider la vente'
            },
            transfer: {
                label: 'Transfert',
                color: 'blue',
                icon: '🔄',
                action: 'Valider le transfert'
            }
        };

        return types[movement.type] || types.out;
    };

    const movementInfo = getMovementInfo();

    const getTotal = () => {
        return cart.reduce((sum, item) => sum + (parseFloat(item.quantity) * parseInt(item.unit_price)), 0);
    };

    return (
        <AuthenticatedLayout user={auth.user}>
            <Head title={`Ajouter des produits - ${movement.reference}`} />

            <div className="min-h-screen bg-gray-50 py-8">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    {/* EN-TÊTE */}
                    <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-8 mb-8">
                        <div className="flex items-center justify-between mb-6">
                            <div className="flex items-center space-x-4">
                                <div className={`p-3 rounded-2xl bg-${movementInfo.color}-100`}>
                                    <span className="text-2xl">{movementInfo.icon}</span>
                                </div>
                                <div>
                                    <h1 className="text-3xl font-bold text-gray-900">
                                        {movementInfo.label} - {movement.reference}
                                    </h1>
                                    <p className="text-gray-600 mt-1">
                                        Étape finale : Ajoutez les produits via la recherche
                                    </p>
                                </div>
                            </div>

                            <div className="text-right">
                                <div className="text-sm text-gray-500">Statut</div>
                                <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-yellow-100 text-yellow-800">
                                    ⏳ En cours de finalisation
                                </span>
                            </div>
                        </div>

                        {/* INFORMATIONS RAPIDES */}
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 p-6 bg-gray-50 rounded-xl">
                            <div>
                                <div className="text-sm font-medium text-gray-500">Source</div>
                                <div className="font-semibold text-gray-900 mt-1">
                                    {movement.type === 'in' ?
                                        (movement.supplier?.name || 'Non spécifié') :
                                        movement.from_warehouse?.name
                                    }
                                </div>
                            </div>
                            <div>
                                <div className="text-sm font-medium text-gray-500">Destination</div>
                                <div className="font-semibold text-gray-900 mt-1">
                                    {movement.type === 'out' ?
                                        (movement.customer?.name || 'Non spécifié') :
                                        movement.to_warehouse?.name
                                    }
                                </div>
                            </div>
                            <div>
                                <div className="text-sm font-medium text-gray-500">Date</div>
                                <div className="font-semibold text-gray-900 mt-1">
                                    {new Date(movement.movement_date).toLocaleDateString('fr-FR')}
                                </div>
                            </div>
                            <div>
                                <div className="text-sm font-medium text-gray-500">Total panier</div>
                                <div className="font-bold text-green-600 text-xl mt-1">
                                    {getTotal().toLocaleString('fr-FR')} F
                                </div>
                            </div>
                        </div>

                        {movement.notes && (
                            <div className="mt-6 p-4 bg-blue-50 rounded-lg border border-blue-200">
                                <div className="flex items-center">
                                    <span className="text-blue-600 mr-2">📝</span>
                                    <span className="font-medium text-blue-800">Notes :</span>
                                </div>
                                <p className="text-blue-700 mt-1">{movement.notes}</p>
                            </div>
                        )}
                    </div>

                    {/* COMPOSANT RECHERCHE + PANIER */}
                    <ProductSearch
                        onCartUpdate={setCart}
                        warehouseId={warehouseId}
                        movementType={movement.type}
                        initialItems={existingItems}
                    />

                    {/* ACTIONS FINALES */}
                    <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-8 mt-8">
                        <div className="flex justify-between items-center">
                            <div className="flex-1">
                                <div className="flex items-center space-x-4">
                                    <div className="flex items-center space-x-2">
                                        <div className={`w-3 h-3 rounded-full bg-${movementInfo.color}-500`}></div>
                                        <span className="font-medium text-gray-900">
                                            {cart.length} produit(s) dans le panier
                                        </span>
                                    </div>
                                    <div className="text-2xl font-bold text-green-600">
                                        {getTotal().toLocaleString('fr-FR')} F
                                    </div>
                                </div>

                                {(errors.stock || errors.error) && (
                                    <div className="mt-3 p-3 bg-red-50 border border-red-200 rounded-lg">
                                        <p className="text-red-700 font-medium">{errors.stock || errors.error}</p>
                                    </div>
                                )}
                            </div>

                            <div className="flex space-x-4">
                                <Link
                                    href={route('stock-movements.show', movement.id)}
                                    className="px-8 py-3 border-2 border-gray-300 rounded-xl text-gray-700 hover:bg-gray-50 font-medium transition-colors"
                                >
                                    Annuler
                                </Link>
                                <button
                                    onClick={completeMovement}
                                    disabled={processing || cart.length === 0}
                                    className={`px-8 py-3 bg-${movementInfo.color}-500 text-white rounded-xl hover:bg-${movementInfo.color}-600 disabled:opacity-50 font-bold text-lg transition-colors min-w-48`}
                                >
                                    {processing ? (
                                        <div className="flex items-center space-x-2">
                                            <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                                            <span>Validation...</span>
                                        </div>
                                    ) : (
                                        movementInfo.action
                                    )}
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
