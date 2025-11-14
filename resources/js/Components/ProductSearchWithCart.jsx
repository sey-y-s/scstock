import React, { useState, useEffect } from 'react';
import ProductSearchGeneric from './ProductSearchGeneric';

export default function ProductSearchWithCart({
    onCartUpdate,
    warehouseId,
    movementType = 'out',
    initialItems = []
}) {
    const [cart, setCart] = useState(initialItems);

    // Synchroniser le panier avec le parent
    useEffect(() => {
        onCartUpdate(cart);
    }, [cart]);

    const addToCart = (product) => {
        if (!product.available && movementType !== 'in') {
            alert('❌ Ce produit n\'est pas disponible en stock');
            return;
        }

        const existingItem = cart.find(item => item.product_id === product.id);

        if (existingItem) {
            alert('⚠️ Ce produit est déjà dans le panier');
        } else {
            // Nouvel item dans le panier avec quantité par défaut = 1
            const newItem = {
                product_id: product.id,
                reference: product.reference,
                name: product.name,
                packaging_type: product.packaging_type,
                image_url: product.image_url,
                quantity: 1, // Quantité par défaut
                unit_price: product.purchase_price,
                current_stock: product.current_stock,
                available: product.available
            };
            setCart([...cart, newItem]);
        }
    };

    const updateQuantity = (productId, newQuantity) => {
        if (newQuantity < 0.25) {
            // Supprimer si quantité devient 0
            removeFromCart(productId);
            return;
        }

        setCart(cart.map(item => {
            if (item.product_id === productId) {
                // Vérifier le stock pour les sorties
                if (movementType !== 'in' && newQuantity > item.current_stock) {
                    alert(`⚠️ Stock insuffisant! Disponible: ${item.current_stock}`);
                    return { ...item, quantity: item.current_stock }; // Limiter au stock max
                }
                return { ...item, quantity: newQuantity };
            }
            return item;
        }));
    };

    const updateUnitPrice = (productId, newPrice) => {
        setCart(cart.map(item => {
            if (item.product_id === productId) {
                return { ...item, unit_price: Math.max(0, newPrice) };
            }
            return item;
        }));
    };

    const removeFromCart = (productId) => {
        setCart(cart.filter(item => item.product_id !== productId));
    };

    const getTotal = () => {
        return cart.reduce((sum, item) => sum + (item.quantity * item.unit_price), 0);
    };

    const getItemTotal = (item) => {
        return item.quantity * item.unit_price;
    };

    return (
        <div className="space-y-6">


            {/* Recherche */}
            <ProductSearchGeneric
                onProductSelect={addToCart}
                warehouseId={warehouseId}
                movementType={movementType}
                placeholder="Tapez le nom ou la référence du produit..."
            />

            <div className="bg-white rounded-lg shadow">
                <div className="p-6 border-b border-gray-200">
                    <div className="flex justify-between items-center">
                        <h2 className="text-xl font-bold text-gray-900">
                            🛒 Panier ({cart.length} article(s))
                        </h2>
                        {cart.length > 0 && (
                            <span className="bg-blue-100 text-blue-800 text-sm font-bold px-3 py-1 rounded-full">
                                Total: {getTotal().toLocaleString('fr-FR')} F
                            </span>
                        )}
                    </div>
                </div>

                {cart.length === 0 ? (
                    <div className="p-12 text-center text-gray-500">
                        <div className="text-6xl mb-4">🛒</div>
                        <p className="text-lg mb-2">Votre panier est vide</p>
                        <p className="text-sm">Utilisez la barre de recherche ci-dessus pour ajouter des produits</p>
                    </div>
                ) : (
                    <div className="divide-y divide-gray-100">
                        {cart.map(item => (
                            <div key={item.product_id} className="p-6 hover:bg-gray-50 transition-colors">
                                <div className="flex items-start justify-between">
                                    {/* Infos produit */}
                                    <div className="flex items-start space-x-4 flex-1">
                                        {item.image_url && (
                                            <img
                                                src={item.image_url}
                                                alt={item.name}
                                                className="h-16 w-16 rounded-lg object-cover border"
                                            />
                                        )}
                                        <div className="flex-1">
                                            <div className="font-semibold text-gray-900 text-lg">
                                                {item.reference} - {item.name}
                                            </div>
                                            <div className="text-sm text-gray-600 mt-1">
                                                {item.packaging_type}
                                            </div>
                                            {movementType !== 'in' && (
                                                <div className={`text-xs font-medium mt-2 ${
                                                    item.quantity > item.current_stock ?
                                                    'text-red-500' :
                                                    (item.current_stock - item.quantity) < (item.low_stock_alert || 5) ?
                                                    'text-orange-500' : 'text-green-600'
                                                }`}>
                                                    📦 Stock actuel: {item.current_stock} |
                                                    Après mouvement: {item.current_stock - item.quantity}
                                                </div>
                                            )}
                                        </div>
                                    </div>

                                    {/* Contrôles quantité, prix et actions */}
                                    <div className="flex items-start space-x-6">
                                        {/* Quantité - INPUT DIRECT */}
                                        <div className="text-center">
                                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                                Quantité
                                            </label>
                                            <input
                                                type="number"
                                                step="0.25"
                                                min="0.25"
                                                value={item.quantity}
                                                onChange={(e) => updateQuantity(item.product_id, parseFloat(e.target.value) || 0.25)}
                                                className="w-24 px-3 py-2 border border-gray-300 rounded-lg text-center focus:ring-2 focus:ring-blue-500 focus:border-blue-500 font-medium"
                                            />
                                            <div className="text-xs text-gray-500 mt-1">
                                                Supporte les fractions
                                            </div>
                                        </div>

                                        {/* Prix unitaire - INPUT DIRECT */}
                                        <div className="text-center">
                                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                                Prix unitaire
                                            </label>
                                            <input
                                                type="number"
                                                min="0"
                                                step="1"
                                                value={item.unit_price}
                                                onChange={(e) => updateUnitPrice(item.product_id, parseInt(e.target.value))}
                                                className="w-32 px-3 py-2 border border-gray-300 rounded-lg text-center focus:ring-2 focus:ring-blue-500 focus:border-blue-500 font-medium"
                                            />
                                            <div className="text-xs text-gray-500 mt-1">
                                                En francs
                                            </div>
                                        </div>

                                        {/* Total article */}
                                        <div className="text-right min-w-28">
                                            <div className="text-sm font-medium text-gray-700 mb-2">
                                                Total
                                            </div>
                                            <div className="font-bold text-green-600 text-lg">
                                                {getItemTotal(item).toLocaleString('fr-FR')} F
                                            </div>
                                        </div>

                                        {/* Bouton suppression */}
                                        <button
                                            onClick={() => removeFromCart(item.product_id)}
                                            className="text-red-500 hover:text-red-700 p-2 hover:bg-red-50 rounded-lg transition-colors mt-6"
                                            title="Supprimer du panier"
                                        >
                                            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                            </svg>
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))}

                        {/* SOUS-TOTAL */}
                        <div className="p-6 bg-gray-50 border-t border-gray-200">
                            <div className="flex justify-between items-center text-xl font-bold">
                                <span className="text-gray-900">Total général:</span>
                                <span className="text-green-600 text-2xl">
                                    {getTotal().toLocaleString('fr-FR')} F
                                </span>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
