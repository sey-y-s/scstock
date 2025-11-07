import React, { useState, useEffect } from 'react';

export default function ProductSearchGeneric({
    onProductSelect, // REQUIS: callback quand on clique sur un produit
    searchParams = {}, // Paramètres supplémentaires de recherche
    placeholder = "Rechercher un produit...",
    showStockInfo = true,
    movementType = 'out', // Pour le contexte stock
    warehouseId = null,
    customResultRender = null // Optionnel: personnalisation de l'affichage
}) {
    const [searchTerm, setSearchTerm] = useState('');
    const [searchResults, setSearchResults] = useState([]);
    const [isSearching, setIsSearching] = useState(false);

    // Recherche des produits
    useEffect(() => {
        if (searchTerm.length > 2) {
            searchProducts(searchTerm);
        } else {
            setSearchResults([]);
        }
    }, [searchTerm, warehouseId]);

    const searchProducts = async (term) => {
        setIsSearching(true);
        try {
            const params = new URLSearchParams({
                q: term,
                movement_type: movementType,
                ...(warehouseId && { warehouse_id: warehouseId }),
                ...searchParams
            });

            const response = await fetch(`/product-search?${params}`);
            const data = await response.json();
            setSearchResults(data);
        } catch (error) {
            console.error('Erreur de recherche:', error);
        } finally {
            setIsSearching(false);
        }
    };

    const handleProductClick = (product) => {
        onProductSelect(product);
        setSearchTerm('');
        setSearchResults([]);
    };

    // Render personnalisé par défaut
    const defaultResultRender = (product) => (
        <div className={`p-4 border-b border-gray-100 hover:bg-blue-50 cursor-pointer transition-colors ${
            !product.available && movementType !== 'in' ? 'opacity-60' : ''
        }`}>
            <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4 flex-1">
                    {product.image_url && (
                        <img
                            src={product.image_url}
                            alt={product.name}
                            className="h-12 w-12 rounded-lg object-cover border"
                        />
                    )}
                    <div className="flex-1">
                        <div className="font-semibold text-gray-900">
                            {product.reference} - {product.name}
                        </div>
                        <div className="text-sm text-gray-600 mt-1">
                            {product.packaging_type}
                            {showStockInfo && movementType !== 'in' && (
                                <span className={`ml-3 font-medium ${
                                    parseFloat(product.current_stock) > (parseFloat(product.low_stock_alert) || 5) ?
                                    'text-green-600' : 'text-orange-500'
                                }`}>
                                    📦 Stock: {product.current_stock}
                                </span>
                            )}
                        </div>
                    </div>
                </div>

                <div className="text-right">
                    <div className="font-bold text-green-600 text-lg">
                        {product.purchase_price?.toLocaleString('fr-FR')} F
                    </div>
                    {!product.available && movementType !== 'in' && (
                        <div className="text-xs text-red-500 font-medium">RUPTURE</div>
                    )}
                </div>
            </div>
        </div>
    );

    return (
        <div className="">
            {/* <h2 className="text-lg font-semibold text-gray-900 mb-4">
                🔍 Rechercher des produits
            </h2> */}

            <div className="relative">
                <input
                    type="text"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    placeholder={placeholder}
                    className="w-full px-4 border border-gray-300 rounded-lg focus:ring focus:ring-blue-500 focus:border-blue-500 text-lg"
                />

                {isSearching && (
                    <div className="absolute right-3 top-3">
                        <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600"></div>
                    </div>
                )}
            </div>

            {/* RÉSULTATS DE RECHERCHE */}
            {searchResults.length > 0 && (
                <div className="mt-4 border border-gray-200 rounded-lg bg-white shadow-lg max-h-80 overflow-y-auto">
                    <div className="p-2 bg-gray-50 border-b border-gray-200">
                        <span className="text-sm font-medium text-gray-700">
                            {searchResults.length} produit(s) trouvé(s) - Cliquez pour sélectionner
                        </span>
                    </div>

                    {searchResults.map(product => (
                        <div
                            key={product.id}
                            onClick={() => handleProductClick(product)}
                        >
                            {customResultRender ? customResultRender(product) : defaultResultRender(product)}
                        </div>
                    ))}
                </div>
            )}

            {searchTerm.length > 0 && searchResults.length === 0 && !isSearching && (
                <div className="mt-4 text-center py-8 text-gray-500 bg-gray-50 rounded-lg">
                    <div className="text-4xl mb-2">🔍</div>
                    <p>Aucun produit trouvé pour "{searchTerm}"</p>
                    <p className="text-sm">Vérifiez l'orthographe ou essayez d'autres termes</p>
                </div>
            )}
        </div>
    );
}
