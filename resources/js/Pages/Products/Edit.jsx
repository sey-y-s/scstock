import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, useForm, Link } from '@inertiajs/react';

export default function Edit({ auth, product, categories, packagingTypes }) {
    const { data, setData, errors, put, processing } = useForm({
        reference: product.reference,
        name: product.name,
        description: product.description || '',
        category_id: product.category_id || '',
        packaging_type_id: product.packaging_type_id,
        purchase_price: product.purchase_price,
        low_stock_alert: product.low_stock_alert,
        image: null,
    });

    const submit = (e) => {
        e.preventDefault();
        put(route('products.update', product.id));
    };

    const handleImageChange = (e) => {
        setData('image', e.target.files[0]);
    };

    return (
        <AuthenticatedLayout user={auth.user}>
            <Head title={`Modifier ${product.name}`} />

            <div className="py-12">
                <div className="max-w-3xl mx-auto sm:px-6 lg:px-8">
                    <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg">
                        <div className="p-6">
                            <div className="flex justify-between items-center mb-6">
                                <div>
                                    <h1 className="text-2xl font-bold">Modifier le produit</h1>
                                    <p className="text-gray-600 mt-1">Réf: {product.reference}</p>
                                </div>
                                <Link 
                                    href={route('products.show', product.id)}
                                    className="text-gray-600 hover:text-gray-900"
                                >
                                    ← Retour au détail
                                </Link>
                            </div>

                            <form onSubmit={submit} className="space-y-6">
                                {/* Référence */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-700">
                                        Référence *
                                    </label>
                                    <input
                                        type="text"
                                        value={data.reference}
                                        onChange={e => setData('reference', e.target.value)}
                                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 bg-gray-50"
                                        disabled
                                    />
                                    <p className="text-xs text-gray-500 mt-1">
                                        La référence ne peut pas être modifiée
                                    </p>
                                    {errors.reference && (
                                        <p className="text-red-500 text-sm mt-1">{errors.reference}</p>
                                    )}
                                </div>

                                {/* Informations de base */}
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700">
                                            Nom du produit *
                                        </label>
                                        <input
                                            type="text"
                                            value={data.name}
                                            onChange={e => setData('name', e.target.value)}
                                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                                        />
                                        {errors.name && (
                                            <p className="text-red-500 text-sm mt-1">{errors.name}</p>
                                        )}
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700">
                                            Catégorie
                                        </label>
                                        <select
                                            value={data.category_id}
                                            onChange={e => setData('category_id', e.target.value)}
                                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                                        >
                                            <option value="">Sans catégorie</option>
                                            {categories.map(category => (
                                                <option key={category.id} value={category.id}>
                                                    {category.name} ({category.code})
                                                </option>
                                            ))}
                                        </select>
                                        {errors.category_id && (
                                            <p className="text-red-500 text-sm mt-1">{errors.category_id}</p>
                                        )}
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700">
                                        Description
                                    </label>
                                    <textarea
                                        value={data.description}
                                        onChange={e => setData('description', e.target.value)}
                                        rows={3}
                                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                                    />
                                    {errors.description && (
                                        <p className="text-red-500 text-sm mt-1">{errors.description}</p>
                                    )}
                                </div>

                                {/* Configuration emballage et prix */}
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700">
                                            Type d'emballage *
                                        </label>
                                        {console.log(data)}
                                        <select
                                            value={data.packaging_type_id}
                                            onChange={e => setData('packaging_type_id', e.target.value)}
                                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                                        >
                                            <option value="">Sélectionner un type</option>
                                            {packagingTypes.map(type => (
                                                <option key={type.id} value={type.id}>
                                                    {type.name}
                                                </option>
                                            ))}
                                        </select>
                                        {errors.packaging_type_id && (
                                            <p className="text-red-500 text-sm mt-1">{errors.packaging_type_id}</p>
                                        )}
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700">
                                            Prix d'achat *
                                        </label>
                                        <input
                                            type="number"
                                            min="0"
                                            value={data.purchase_price}
                                            onChange={e => setData('purchase_price', parseInt(e.target.value) || 0)}
                                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                                        />
                                        {errors.purchase_price && (
                                            <p className="text-red-500 text-sm mt-1">{errors.purchase_price}</p>
                                        )}
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700">
                                        Alerte stock faible *
                                    </label>
                                    <div className="mt-1">
                                        <input
                                            type="number"
                                            step="0.125"
                                            min="0.125"
                                            value={data.low_stock_alert}
                                            onChange={e => setData('low_stock_alert', parseFloat(e.target.value))}
                                            className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                                        />
                                        <p className="text-xs text-gray-500 mt-1">
                                            Supporte les fractions: 1, 1/2, 1/4, 1/8
                                        </p>
                                    </div>
                                    {errors.low_stock_alert && (
                                        <p className="text-red-500 text-sm mt-1">{errors.low_stock_alert}</p>
                                    )}
                                </div>

                                {/* Image */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-700">
                                        Image du produit
                                    </label>
                                    
                                    {/* Image actuelle */}
                                    {product.image_url && (
                                        <div className="mt-2 mb-4">
                                            <p className="text-sm text-gray-600 mb-2">Image actuelle:</p>
                                            <img 
                                                src={product.image_url} 
                                                alt={product.name}
                                                className="h-32 w-32 object-cover rounded border"
                                            />
                                        </div>
                                    )}

                                    {/* Nouvelle image */}
                                    <input
                                        type="file"
                                        accept="image/*"
                                        onChange={handleImageChange}
                                        className="mt-1 block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                                    />
                                    
                                    {/* Aperçu nouvelle image */}
                                    {data.image && (
                                        <div className="mt-2">
                                            <p className="text-sm text-gray-600 mb-2">Nouvelle image:</p>
                                            <img 
                                                src={URL.createObjectURL(data.image)} 
                                                alt="Aperçu" 
                                                className="h-32 w-32 object-cover rounded border"
                                            />
                                        </div>
                                    )}

                                    {errors.image && (
                                        <p className="text-red-500 text-sm mt-1">{errors.image}</p>
                                    )}
                                    
                                    {!data.image && !product.image_url && (
                                        <p className="text-xs text-gray-500 mt-1">
                                            Aucune image actuelle. Téléchargez une image pour ce produit.
                                        </p>
                                    )}
                                </div>

                                {/* Statut */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Statut du produit
                                    </label>
                                    <div className="flex items-center">
                                        <input
                                            type="checkbox"
                                            id="is_active"
                                            checked={product.is_active}
                                            onChange={e => setData('is_active', e.target.checked)}
                                            className="rounded border-gray-300 text-blue-600 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                                        />
                                        <label htmlFor="is_active" className="ml-2 text-sm text-gray-700">
                                            Produit actif
                                        </label>
                                    </div>
                                    <p className="text-xs text-gray-500 mt-1">
                                        Désactivez pour masquer ce produit des listes sans le supprimer
                                    </p>
                                </div>

                                {/* Boutons */}
                                <div className="flex justify-end space-x-4 pt-6 border-t">
                                    <Link
                                        href={route('products.show', product.id)}
                                        className="px-6 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 transition duration-150"
                                    >
                                        Annuler
                                    </Link>
                                    <button
                                        type="submit"
                                        disabled={processing}
                                        className="px-6 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 disabled:opacity-50 transition duration-150"
                                    >
                                        {processing ? 'Mise à jour...' : 'Mettre à jour'}
                                    </button>
                                </div>
                            </form>

                            {/* Section suppression */}
                            <div className="mt-8 pt-6 border-t border-gray-200">
                                <div className="bg-red-50 border border-red-200 rounded-md p-4">
                                    <h3 className="text-lg font-medium text-red-800 mb-2">Zone de danger</h3>
                                    <p className="text-red-700 text-sm mb-4">
                                        La suppression d'un produit est irréversible. Tous les stocks et historiques associés seront également supprimés.
                                    </p>
                                    <Link
                                        href={route('products.destroy', product.id)}
                                        method="delete"
                                        as="button"
                                        className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition duration-150"
                                        onClick={(e) => {
                                            if (!confirm('Êtes-vous sûr de vouloir supprimer ce produit ? Cette action est irréversible.')) {
                                                e.preventDefault();
                                            }
                                        }}
                                    >
                                        Supprimer ce produit
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