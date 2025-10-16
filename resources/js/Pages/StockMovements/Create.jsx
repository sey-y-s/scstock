import { useState } from 'react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, useForm, Link } from '@inertiajs/react';

export default function Create({ auth, products, warehouses, suppliers, customers, reference }) {
    const [movementType, setMovementType] = useState('in');
    const [items, setItems] = useState([]);
    const [quickCreate, setQuickCreate] = useState({ type: null, isOpen: false });

    const { props } = usePage();

    const { data, setData, errors, post, processing } = useForm({
        type: 'in',
        from_warehouse_id: '',
        to_warehouse_id: '',
        supplier_id: '',
        customer_id: '',
        notes: '',
        movement_date: new Date().toISOString().split('T')[0],
        items: []
    });

    const submit = (e) => {
        e.preventDefault();
        post(route('stock-movements.store'));
    };

    const handleTypeChange = (type) => {
        setMovementType(type);
        setData({
            ...data,
            type,
            from_warehouse_id: '',
            to_warehouse_id: '',
            supplier_id: '',
            customer_id: ''
        });
    };

    const addItem = () => {
        const newItem = {
            product_id: '',
            quantity: 1,
            unit_price: 0
        };
        setItems([...items, newItem]);
        setData('items', [...data.items, newItem]);
    };

    const updateItem = (index, field, value) => {
        const updatedItems = [...items];
        updatedItems[index][field] = value;
        
        // Si le produit change, mettre à jour le prix d'achat par défaut
        if (field === 'product_id') {
            const product = products.find(p => p.id == value);
            if (product) {
                updatedItems[index].unit_price = product.purchase_price;
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

    const getMovementConfig = () => {
        const configs = {
            in: {
                title: 'Approvisionnement',
                fromLabel: 'Fournisseur',
                toLabel: 'Dépôt de réception',
                showFrom: false,
                showTo: true,
                showSupplier: true,
                showCustomer: false
            },
            out: {
                title: 'Vente',
                fromLabel: 'Dépôt de sortie', 
                toLabel: 'Client',
                showFrom: true,
                showTo: false,
                showSupplier: false,
                showCustomer: true
            },
            transfer: {
                title: 'Transfert',
                fromLabel: 'Dépôt source',
                toLabel: 'Dépôt destination',
                showFrom: true,
                showTo: true,
                showSupplier: false,
                showCustomer: false
            }
        };
        return configs[movementType] || configs.in;
    };

    const config = getMovementConfig();

    return (
        <AuthenticatedLayout user={auth.user}>
            <Head title="Nouveau Mouvement de Stock" />

            <div className="py-12">
                <div className="max-w-4xl mx-auto sm:px-6 lg:px-8">
                    <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg">
                        <div className="p-6">
                            <div className="flex justify-between items-center mb-6">
                                <div>
                                    <h1 className="text-2xl font-bold">Nouveau Mouvement</h1>
                                    <p className="text-gray-600">Réf: </p>  {/*  {reference} */}
                                </div>
                                <Link 
                                    href={route('stock-movements.index')}
                                    className="text-gray-600 hover:text-gray-900"
                                >
                                    ← Retour
                                </Link>
                            </div>

                            <form onSubmit={submit} className="space-y-6">
                                {/* Type de mouvement */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-3">
                                        Type de mouvement *
                                    </label>
                                    <div className="grid grid-cols-3 gap-4">
                                        {[
                                            { value: 'in', label: 'Approvisionnement', color: 'green' },
                                            { value: 'out', label: 'Vente', color: 'red' },
                                            { value: 'transfer', label: 'Transfert', color: 'blue' }
                                        ].map((type) => (
                                            <button
                                                key={type.value}
                                                type="button"
                                                onClick={() => handleTypeChange(type.value)}
                                                className={`p-4 border rounded-lg text-center transition-colors ${
                                                    movementType === type.value
                                                        ? `border-${type.color}-500 bg-${type.color}-50 text-${type.color}-700`
                                                        : 'border-gray-300 text-gray-700 hover:bg-gray-50'
                                                }`}
                                            >
                                                <div className="font-medium">{type.label}</div>
                                                <div className="text-sm text-gray-500 mt-1">
                                                    {type.value === 'in' && 'Entrée de stock'}
                                                    {type.value === 'out' && 'Sortie de stock'}
                                                    {type.value === 'transfer' && 'Transfert interne'}
                                                </div>
                                            </button>
                                        ))}
                                    </div>
                                    {errors.type && <p className="text-red-500 text-sm mt-1">{errors.type}</p>}
                                </div>

                                {/* Source et destination */}
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    {config.showFrom && (
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700">
                                                {config.fromLabel} *
                                            </label>
                                            <select
                                                value={data.from_warehouse_id}
                                                onChange={e => setData('from_warehouse_id', e.target.value)}
                                                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                                            >
                                                <option value="">Sélectionner...</option>
                                                {warehouses.map(warehouse => (
                                                    <option key={warehouse.id} value={warehouse.id}>
                                                        {warehouse.name} ({warehouse.type === 'depot' ? 'Dépôt' : 'Point de vente'})
                                                    </option>
                                                ))}
                                            </select>
                                            {errors.from_warehouse_id && (
                                                <p className="text-red-500 text-sm mt-1">{errors.from_warehouse_id}</p>
                                            )}
                                        </div>
                                    )}

                                    {config.showTo && (
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700">
                                                {config.toLabel} *
                                            </label>
                                            <select
                                                value={data.to_warehouse_id}
                                                onChange={e => setData('to_warehouse_id', e.target.value)}
                                                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                                            >
                                                <option value="">Sélectionner...</option>
                                                {warehouses.map(warehouse => (
                                                    <option key={warehouse.id} value={warehouse.id}>
                                                        {warehouse.name} ({warehouse.type === 'depot' ? 'Dépôt' : 'Point de vente'})
                                                    </option>
                                                ))}
                                            </select>
                                            {errors.to_warehouse_id && (
                                                <p className="text-red-500 text-sm mt-1">{errors.to_warehouse_id}</p>
                                            )}
                                        </div>
                                    )}

                                    {config.showSupplier && (
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700">
                                                Fournisseur *
                                            </label>
                                            <select
                                                value={data.supplier_id}
                                                onChange={e => setData('supplier_id', e.target.value)}
                                                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                                            >
                                                <option value="">Sélectionner un fournisseur</option>
                                                {suppliers.map(supplier => (
                                                    <option key={supplier.id} value={supplier.id}>
                                                        {supplier.name}
                                                    </option>
                                                ))}
                                            </select>
                                            {errors.supplier_id && (
                                                <p className="text-red-500 text-sm mt-1">{errors.supplier_id}</p>
                                            )}
                                        </div>
                                    )}

                                    {config.showCustomer && (
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700">
                                                Client *
                                            </label>
                                            <select
                                                value={data.customer_id}
                                                onChange={e => setData('customer_id', e.target.value)}
                                                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                                            >
                                                <option value="">Sélectionner un client</option>
                                                {customers.map(customer => (
                                                    <option key={customer.id} value={customer.id}>
                                                        {customer.name}
                                                    </option>
                                                ))}
                                            </select>
                                            {errors.customer_id && (
                                                <p className="text-red-500 text-sm mt-1">{errors.customer_id}</p>
                                            )}
                                        </div>
                                    )}
                                </div>

                                {/* Date et notes */}
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700">
                                            Date du mouvement *
                                        </label>
                                        <input
                                            type="date"
                                            value={data.movement_date}
                                            onChange={e => setData('movement_date', e.target.value)}
                                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                                        />
                                        {errors.movement_date && (
                                            <p className="text-red-500 text-sm mt-1">{errors.movement_date}</p>
                                        )}
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700">
                                        Notes
                                    </label>
                                    <textarea
                                        value={data.notes}
                                        onChange={e => setData('notes', e.target.value)}
                                        rows={3}
                                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                                        placeholder="Notes supplémentaires..."
                                    />
                                </div>

                                {/* Articles */}
                                <div>
                                    <div className="flex justify-between items-center mb-4">
                                        <label className="block text-sm font-medium text-gray-700">
                                            Articles *
                                        </label>
                                        <button
                                            type="button"
                                            onClick={addItem}
                                            className="bg-green-500 text-white px-3 py-1 rounded text-sm hover:bg-green-600"
                                        >
                                            + Ajouter un article
                                        </button>
                                    </div>

                                    {items.length === 0 ? (
                                        <div className="text-center py-8 border-2 border-dashed border-gray-300 rounded-lg">
                                            <p className="text-gray-500">Aucun article ajouté</p>
                                            <button
                                                type="button"
                                                onClick={addItem}
                                                className="mt-2 text-blue-500 hover:text-blue-700"
                                            >
                                                Cliquez ici pour ajouter le premier article
                                            </button>
                                        </div>
                                    ) : (
                                        <div className="space-y-4">
                                            {items.map((item, index) => (
                                                <div key={index} className="border rounded-lg p-4 bg-gray-50">
                                                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                                                        <div>
                                                            <label className="block text-xs font-medium text-gray-700">
                                                                Produit *
                                                            </label>
                                                            <select
                                                                value={item.product_id}
                                                                onChange={e => updateItem(index, 'product_id', e.target.value)}
                                                                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 text-sm"
                                                            >
                                                                <option value="">Sélectionner...</option>
                                                                {products.map(product => (
                                                                    <option key={product.id} value={product.id}>
                                                                        {product.k} - {product.name}
                                                                    </option>
                                                                ))}
                                                            </select>
                                                        </div>

                                                        <div>
                                                            <label className="block text-xs font-medium text-gray-700">
                                                                Quantité *
                                                            </label>
                                                            <input
                                                                type="number"
                                                                step="0.25"
                                                                min="0.25"
                                                                value={item.quantity}
                                                                onChange={e => updateItem(index, 'quantity', parseFloat(e.target.value))}
                                                                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 text-sm"
                                                            />
                                                        </div>

                                                        <div>
                                                            <label className="block text-xs font-medium text-gray-700">
                                                                Prix unitaire *
                                                            </label>
                                                            <input
                                                                type="number"
                                                                min="0"
                                                                step="1"
                                                                value={item.unit_price}
                                                                onChange={e => updateItem(index, 'unit_price', parseInt(e.target.value))}
                                                                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 text-sm"
                                                            />
                                                        </div>

                                                        <div className="flex items-end">
                                                            <button
                                                                type="button"
                                                                onClick={() => removeItem(index)}
                                                                className="text-red-500 hover:text-red-700 text-sm"
                                                            >
                                                                Supprimer
                                                            </button>
                                                        </div>
                                                    </div>

                                                    {item.product_id && (
                                                        <div className="mt-2 text-xs text-gray-500">
                                                            {(() => {
                                                                const product = products.find(p => p.id == item.product_id);
                                                                return product ? `Emballage: ${product.packaging_type?.name}, Prix d'achat: ${product.purchase_price?.toLocaleString()} F` : '';
                                                            })()}
                                                        </div>
                                                    )}
                                                </div>
                                            ))}
                                        </div>
                                    )}
                                    {errors.items && <p className="text-red-500 text-sm mt-1">{errors.items}</p>}
                                </div>

                                {/* Boutons */}
                                <div className="flex justify-end space-x-4 pt-6 border-t">
                                    <Link
                                        href={route('stock-movements.index')}
                                        className="px-6 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
                                    >
                                        Annuler
                                    </Link>
                                    <button
                                        type="submit"
                                        disabled={processing || items.length === 0}
                                        className="px-6 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 disabled:opacity-50"
                                    >
                                        {processing ? 'Création...' : 'Créer le mouvement'}
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}