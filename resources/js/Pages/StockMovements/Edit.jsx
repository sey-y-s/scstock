import React, { useState, useEffect } from 'react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, useForm, Link } from '@inertiajs/react';

export default function Edit({ auth, movement, products, warehouses, suppliers, customers }) {
    const [items, setItems] = useState([]);
    const [showNewSupplier, setShowNewSupplier] = useState(false);
    const [showNewCustomer, setShowNewCustomer] = useState(false);

    const { data, setData, errors, put, processing } = useForm({
        type: movement.type,
        from_warehouse_id: movement.from_warehouse_id || '',
        to_warehouse_id: movement.to_warehouse_id || '',
        supplier_id: movement.supplier_id || '',
        new_supplier_name: '',
        customer_id: movement.customer_id || '',
        new_customer_name: '',
        notes: movement.notes || '',
        movement_date: movement.movement_date.split('T')[0],
        items: movement.items.map(item => ({
            id: item.id,
            product_id: item.product_id,
            quantity: parseFloat(item.quantity),
            unit_price: item.unit_price
        }))
    });

    useEffect(() => {
        setItems(data.items);
    }, []);

    const submit = (e) => {
        e.preventDefault();
        put(route('stock-movements.update', movement.id));
    };

    const addItem = () => {
        const newItem = {
            product_id: '',
            quantity: 1,
            unit_price: 0
        };
        const updatedItems = [...items, newItem];
        setItems(updatedItems);
        setData('items', updatedItems);
    };

    const updateItem = (index, field, value) => {
        const updatedItems = [...items];
        updatedItems[index][field] = value;

        // Si le produit change, mettre à jour le prix par défaut
        if (field === 'product_id' && value) {
            const product = products.find(p => p.id == value);
            if (product) {
                if (movement.type === 'in') {
                    updatedItems[index].unit_price = product.purchase_price;
                } else if (movement.type === 'out') {
                    updatedItems[index].unit_price = product.priceB || product.purchase_price;
                } else {
                    updatedItems[index].unit_price = product.purchase_price;
                }
            }
        }

        setItems(updatedItems);
        setData('items', updatedItems);
    };

    const removeItem = (index) => {
        const updatedItems = items.filter((_, i) => i !== index);
        setItems(updatedItems);
        setData('items', updatedItems);
    };

    const handleSupplierChange = (e) => {
        const value = e.target.value;
        if (value === 'new') {
            setShowNewSupplier(true);
            setData('supplier_id', '');
        } else {
            setShowNewSupplier(false);
            setData('supplier_id', value);
            setData('new_supplier_name', '');
        }
    };

    const handleCustomerChange = (e) => {
        const value = e.target.value;
        if (value === 'new') {
            setShowNewCustomer(true);
            setData('customer_id', '');
        } else {
            setShowNewCustomer(false);
            setData('customer_id', value);
            setData('new_customer_name', '');
        }
    };

    // Vérifier si les dépôts source et destination sont différents pour les transferts
    const isValidTransfer = movement.type !== 'transfer' ||
                           (data.from_warehouse_id && data.to_warehouse_id &&
                            data.from_warehouse_id !== data.to_warehouse_id);

    // Calcul du total
    const getTotal = () => {
        return items.reduce((sum, item) => {
            return sum + (item.quantity * (item.unit_price || 0));
        }, 0);
    };

    const formatQuantity = (quantity) => {
        const whole = Math.floor(quantity);
        const fraction = quantity - whole;

        if (fraction === 0) return `${whole}`;

        let fractionText = '';
        if (Math.abs(fraction - 0.125) < 0.01) fractionText = '1/8';
        else if (Math.abs(fraction - 0.250) < 0.01) fractionText = '1/4';
        else if (Math.abs(fraction - 0.500) < 0.01) fractionText = '1/2';

        return fractionText ? `${whole} ${fractionText}` : quantity.toFixed(3);
    };

    const getTypeConfig = (type) => {
        const configs = {
            in: { label: 'Approvisionnement', color: 'green', icon: '📥' },
            out: { label: 'Vente Client', color: 'red', icon: '📤' },
            transfer: { label: 'Transfert Interne', color: 'blue', icon: '🔄' }
        };
        return configs[type] || configs.in;
    };

    const typeConfig = getTypeConfig(movement.type);

    return (
        <AuthenticatedLayout user={auth.user}>
            <Head title={`Modifier ${movement.reference}`} />

            <div className="py-12">
                <div className="max-w-6xl mx-auto sm:px-6 lg:px-8">
                    <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg">
                        <div className="p-6">
                            {/* En-tête */}
                            <div className="flex justify-between items-start mb-8">
                                <div>
                                    <h1 className="text-2xl font-bold text-gray-900">Modifier le mouvement</h1>
                                    <div className="flex items-center mt-2 space-x-4">
                                        <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-${typeConfig.color}-100 text-${typeConfig.color}-800`}>
                                            {typeConfig.icon} {typeConfig.label}
                                        </span>
                                        <span className="text-gray-600 font-mono">Réf: {movement.reference}</span>
                                    </div>
                                </div>
                                <Link
                                    href={route('stock-movements.show', movement.id)}
                                    className="text-gray-600 hover:text-gray-900"
                                >
                                    ← Retour au détail
                                </Link>
                            </div>

                            <form onSubmit={submit} className="space-y-8">
                                {/* Informations de base selon le type */}
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    {/* Approvisionnement */}
                                    {movement.type === 'in' && (
                                        <>
                                            <div>
                                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                                    Dépôt de réception *
                                                </label>
                                                <select
                                                    value={data.to_warehouse_id}
                                                    onChange={e => setData('to_warehouse_id', e.target.value)}
                                                    className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                                                >
                                                    <option value="">Sélectionner un dépôt...</option>
                                                    {warehouses.map(warehouse => (
                                                        <option key={warehouse.id} value={warehouse.id}>
                                                            {warehouse.name}
                                                            {warehouse.type === 'depot' ? ' (Dépôt)' : ' (Point de vente)'}
                                                        </option>
                                                    ))}
                                                </select>
                                                {errors.to_warehouse_id && (
                                                    <p className="text-red-500 text-sm mt-1">{errors.to_warehouse_id}</p>
                                                )}
                                            </div>

                                            <div>
                                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                                    Fournisseur *
                                                </label>
                                                {!showNewSupplier ? (
                                                    <div className="flex space-x-2">
                                                        <select
                                                            value={data.supplier_id}
                                                            onChange={handleSupplierChange}
                                                            className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                                                        >
                                                            <option value="">Sélectionner un fournisseur...</option>
                                                            {suppliers.map(supplier => (
                                                                <option key={supplier.id} value={supplier.id}>
                                                                    {supplier.name}
                                                                </option>
                                                            ))}
                                                            <option value="new">+ Créer un nouveau fournisseur</option>
                                                        </select>
                                                    </div>
                                                ) : (
                                                    <div className="flex space-x-2">
                                                        <input
                                                            type="text"
                                                            value={data.new_supplier_name}
                                                            onChange={e => setData('new_supplier_name', e.target.value)}
                                                            placeholder="Nom du nouveau fournisseur"
                                                            className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                                                        />
                                                        <button
                                                            type="button"
                                                            onClick={() => {
                                                                setShowNewSupplier(false);
                                                                setData('new_supplier_name', '');
                                                                setData('supplier_id', movement.supplier_id || '');
                                                            }}
                                                            className="px-3 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
                                                        >
                                                            ×
                                                        </button>
                                                    </div>
                                                )}
                                                {(errors.supplier_id || errors.new_supplier_name) && (
                                                    <p className="text-red-500 text-sm mt-1">
                                                        {errors.supplier_id || errors.new_supplier_name}
                                                    </p>
                                                )}
                                            </div>
                                        </>
                                    )}

                                    {/* Vente */}
                                    {movement.type === 'out' && (
                                        <>
                                            <div>
                                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                                    Dépôt de sortie *
                                                </label>
                                                <select
                                                    value={data.from_warehouse_id}
                                                    onChange={e => setData('from_warehouse_id', e.target.value)}
                                                    className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                                                >
                                                    <option value="">Sélectionner un dépôt...</option>
                                                    {warehouses.map(warehouse => (
                                                        <option key={warehouse.id} value={warehouse.id}>
                                                            {warehouse.name}
                                                            {warehouse.type === 'depot' ? ' (Dépôt)' : ' (Point de vente)'}
                                                        </option>
                                                    ))}
                                                </select>
                                                {errors.from_warehouse_id && (
                                                    <p className="text-red-500 text-sm mt-1">{errors.from_warehouse_id}</p>
                                                )}
                                            </div>

                                            <div>
                                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                                    Client *
                                                </label>
                                                {!showNewCustomer ? (
                                                    <div className="flex space-x-2">
                                                        <select
                                                            value={data.customer_id}
                                                            onChange={handleCustomerChange}
                                                            className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                                                        >
                                                            <option value="">Sélectionner un client...</option>
                                                            {customers.map(customer => (
                                                                <option key={customer.id} value={customer.id}>
                                                                    {customer.name}
                                                                </option>
                                                            ))}
                                                            <option value="new">+ Créer un nouveau client</option>
                                                        </select>
                                                    </div>
                                                ) : (
                                                    <div className="flex space-x-2">
                                                        <input
                                                            type="text"
                                                            value={data.new_customer_name}
                                                            onChange={e => setData('new_customer_name', e.target.value)}
                                                            placeholder="Nom du nouveau client"
                                                            className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                                                        />
                                                        <button
                                                            type="button"
                                                            onClick={() => {
                                                                setShowNewCustomer(false);
                                                                setData('new_customer_name', '');
                                                                setData('customer_id', movement.customer_id || '');
                                                            }}
                                                            className="px-3 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
                                                        >
                                                            ×
                                                        </button>
                                                    </div>
                                                )}
                                                {(errors.customer_id || errors.new_customer_name) && (
                                                    <p className="text-red-500 text-sm mt-1">
                                                        {errors.customer_id || errors.new_customer_name}
                                                    </p>
                                                )}
                                            </div>
                                        </>
                                    )}

                                    {/* Transfert */}
                                    {movement.type === 'transfer' && (
                                        <>
                                            <div>
                                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                                    Dépôt source *
                                                </label>
                                                <select
                                                    value={data.from_warehouse_id}
                                                    onChange={e => setData('from_warehouse_id', e.target.value)}
                                                    className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                                                >
                                                    <option value="">Sélectionner le dépôt source...</option>
                                                    {warehouses.map(warehouse => (
                                                        <option key={warehouse.id} value={warehouse.id}>
                                                            {warehouse.name}
                                                            {warehouse.type === 'depot' ? ' (Dépôt)' : ' (Point de vente)'}
                                                        </option>
                                                    ))}
                                                </select>
                                                {errors.from_warehouse_id && (
                                                    <p className="text-red-500 text-sm mt-1">{errors.from_warehouse_id}</p>
                                                )}
                                            </div>

                                            <div>
                                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                                    Dépôt destination *
                                                </label>
                                                <select
                                                    value={data.to_warehouse_id}
                                                    onChange={e => setData('to_warehouse_id', e.target.value)}
                                                    className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                                                >
                                                    <option value="">Sélectionner le dépôt destination...</option>
                                                    {warehouses.map(warehouse => (
                                                        <option key={warehouse.id} value={warehouse.id}>
                                                            {warehouse.name}
                                                            {warehouse.type === 'depot' ? ' (Dépôt)' : ' (Point de vente)'}
                                                        </option>
                                                    ))}
                                                </select>
                                                {errors.to_warehouse_id && (
                                                    <p className="text-red-500 text-sm mt-1">{errors.to_warehouse_id}</p>
                                                )}
                                            </div>

                                            {/* Validation des dépôts */}
                                            {data.from_warehouse_id && data.to_warehouse_id && (
                                                <div className={`md:col-span-2 p-3 rounded-md ${
                                                    isValidTransfer
                                                        ? 'bg-green-100 border border-green-200 text-green-700'
                                                        : 'bg-red-100 border border-red-200 text-red-700'
                                                }`}>
                                                    {isValidTransfer ? (
                                                        <div className="flex items-center">
                                                            <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                                            </svg>
                                                            Transfert valide : les dépôts sont différents
                                                        </div>
                                                    ) : (
                                                        <div className="flex items-center">
                                                            <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                                            </svg>
                                                            Les dépôts source et destination doivent être différents
                                                        </div>
                                                    )}
                                                </div>
                                            )}
                                        </>
                                    )}
                                </div>

                                {/* Date et notes */}
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">
                                            Date du mouvement *
                                        </label>
                                        <input
                                            type="date"
                                            value={data.movement_date}
                                            onChange={e => setData('movement_date', e.target.value)}
                                            className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                                        />
                                        {errors.movement_date && (
                                            <p className="text-red-500 text-sm mt-1">{errors.movement_date}</p>
                                        )}
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">
                                            Notes
                                        </label>
                                        <input
                                            type="text"
                                            value={data.notes}
                                            onChange={e => setData('notes', e.target.value)}
                                            placeholder="Notes supplémentaires..."
                                            className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                                        />
                                    </div>
                                </div>

                                {/* Articles */}
                                <div className="border-t pt-8">
                                    <div className="flex justify-between items-center mb-6">
                                        <div>
                                            <h3 className="text-lg font-medium text-gray-900">
                                                {movement.type === 'in' && 'Articles reçus'}
                                                {movement.type === 'out' && 'Articles vendus'}
                                                {movement.type === 'transfer' && 'Articles transférés'}
                                            </h3>
                                            <p className="text-sm text-gray-600">
                                                Modifiez les articles de ce mouvement
                                            </p>
                                        </div>
                                        <button
                                            type="button"
                                            onClick={addItem}
                                            className={`px-4 py-2 text-white rounded-md hover:opacity-90 flex items-center ${
                                                movement.type === 'in' ? 'bg-green-500' :
                                                movement.type === 'out' ? 'bg-red-500' : 'bg-blue-500'
                                            }`}
                                        >
                                            <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                                            </svg>
                                            Ajouter un article
                                        </button>
                                    </div>

                                    {items.length === 0 ? (
                                        <div className="text-center py-12 border-2 border-dashed border-gray-300 rounded-lg bg-gray-50">
                                            <p className="text-gray-500 mb-2">Aucun article dans ce mouvement</p>
                                            <button
                                                type="button"
                                                onClick={addItem}
                                                className="text-blue-500 hover:text-blue-700 font-medium"
                                            >
                                                Ajouter le premier article
                                            </button>
                                        </div>
                                    ) : (
                                        <div className="space-y-4">
                                            {items.map((item, index) => {
                                                const product = products.find(p => p.id == item.product_id);
                                                return (
                                                    <div key={index} className="border rounded-lg p-4 bg-white shadow-sm">
                                                        <div className="grid grid-cols-1 lg:grid-cols-5 gap-4">
                                                            {/* Produit */}
                                                            <div className="lg:col-span-2">
                                                                <label className="block text-xs font-medium text-gray-700 mb-1">
                                                                    Produit *
                                                                </label>
                                                                <select
                                                                    value={item.product_id}
                                                                    onChange={e => updateItem(index, 'product_id', e.target.value)}
                                                                    className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 text-sm"
                                                                >
                                                                    <option value="">Sélectionner un produit...</option>
                                                                    {products.map(product => (
                                                                        <option key={product.id} value={product.id}>
                                                                            {product.reference} - {product.name}
                                                                        </option>
                                                                    ))}
                                                                </select>
                                                                {product && (
                                                                    <div className="text-xs text-gray-500 mt-1">
                                                                        Emballage: {product.packaging_type?.name}
                                                                        {movement.type === 'in' && product.purchase_price && ` | Prix d'achat: ${product.purchase_price.toLocaleString()} F`}
                                                                        {movement.type === 'out' && product.priceB && ` | Prix B: ${product.priceB.toLocaleString()} F`}
                                                                    </div>
                                                                )}
                                                            </div>

                                                            {/* Quantité */}
                                                            <div>
                                                                <label className="block text-xs font-medium text-gray-700 mb-1">
                                                                    Quantité *
                                                                </label>
                                                                <input
                                                                    type="number"
                                                                    step="0.125"
                                                                    min="0.125"
                                                                    value={item.quantity}
                                                                    onChange={e => updateItem(index, 'quantity', parseFloat(e.target.value))}
                                                                    className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 text-sm"
                                                                />
                                                                <div className="text-xs text-gray-500 mt-1">
                                                                    {formatQuantity(item.quantity)}
                                                                </div>
                                                            </div>

                                                            {/* Prix unitaire */}
                                                            <div>
                                                                <label className="block text-xs font-medium text-gray-700 mb-1">
                                                                    {movement.type === 'in' ? "Prix d'achat" :
                                                                     movement.type === 'out' ? "Prix de vente" : "Prix d'achat (ref)"} *
                                                                </label>
                                                                <input
                                                                    type="number"
                                                                    min="0"
                                                                    step="1"
                                                                    value={item.unit_price}
                                                                    onChange={e => updateItem(index, 'unit_price', parseInt(e.target.value) || 0)}
                                                                    className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 text-sm"
                                                                />
                                                                <div className="text-xs text-gray-500 mt-1">
                                                                    {(item.unit_price || 0).toLocaleString()} F
                                                                </div>
                                                            </div>

                                                            {/* Total et actions */}
                                                            <div className="flex items-end justify-between">
                                                                <div>
                                                                    <div className="text-xs text-gray-700 font-medium">
                                                                        Total: {((item.quantity || 0) * (item.unit_price || 0)).toLocaleString()} F
                                                                    </div>
                                                                </div>
                                                                <button
                                                                    type="button"
                                                                    onClick={() => removeItem(index)}
                                                                    className="text-red-500 hover:text-red-700 p-1"
                                                                >
                                                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                                                    </svg>
                                                                </button>
                                                            </div>
                                                        </div>
                                                    </div>
                                                );
                                            })}

                                            {/* Total général */}
                                            <div className="border-t pt-4 mt-6">
                                                <div className="flex justify-between items-center text-lg font-semibold">
                                                    <span>Total du mouvement:</span>
                                                    <span className={
                                                        movement.type === 'in' ? 'text-green-600' :
                                                        movement.type === 'out' ? 'text-red-600' : 'text-blue-600'
                                                    }>
                                                        {getTotal().toLocaleString()} F
                                                    </span>
                                                </div>
                                            </div>
                                        </div>
                                    )}
                                    {errors.items && (
                                        <p className="text-red-500 text-sm mt-2">{errors.items}</p>
                                    )}
                                </div>

                                {/* Boutons d'action */}
                                <div className="flex justify-between items-center pt-8 border-t">
                                    <div className="flex space-x-4">
                                        <Link
                                            href={route('stock-movements.show', movement.id)}
                                            className="px-6 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
                                        >
                                            Annuler
                                        </Link>
                                        <button
                                            type="button"
                                            onClick={addItem}
                                            className="px-6 py-2 bg-gray-500 text-white rounded-md hover:bg-gray-600"
                                        >
                                            Ajouter un autre article
                                        </button>
                                    </div>
                                    <div className="flex space-x-4">
                                        <button
                                            type="submit"
                                            disabled={processing || items.length === 0 || !isValidTransfer}
                                            className={`px-8 py-2 text-white rounded-md hover:opacity-90 disabled:opacity-50 font-medium ${
                                                movement.type === 'in' ? 'bg-green-500' :
                                                movement.type === 'out' ? 'bg-red-500' : 'bg-blue-500'
                                            }`}
                                        >
                                            {processing ? 'Mise à jour...' : 'Mettre à jour'}
                                        </button>
                                    </div>
                                </div>
                            </form>

                            {/* Section suppression */}
                            {movement.status !== 'cancelled' && (
                                <div className="mt-12 pt-8 border-t border-gray-200">
                                    <div className="bg-red-50 border border-red-200 rounded-lg p-6">
                                        <h3 className="text-lg font-medium text-red-800 mb-2">Zone de danger</h3>
                                        <p className="text-red-700 text-sm mb-4">
                                            La suppression d'un mouvement est irréversible et annulera son impact sur les stocks.
                                        </p>
                                        <Link
                                            href={route('stock-movements.destroy', movement.id)}
                                            method="delete"
                                            as="button"
                                            className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition duration-150"
                                            onClick={(e) => {
                                                if (!confirm('Êtes-vous sûr de vouloir supprimer ce mouvement ? Cette action est irréversible.')) {
                                                    e.preventDefault();
                                                }
                                            }}
                                        >
                                            Supprimer ce mouvement
                                        </Link>
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
