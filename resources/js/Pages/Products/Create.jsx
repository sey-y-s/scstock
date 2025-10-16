import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, useForm, Link } from '@inertiajs/react';

export default function Create({ auth, categories, packagingTypes }) {
    const { data, setData, errors, post, processing } = useForm({
        name: '',
        description: '',
        category_id: '',
        packaging_type_id: '',
        purchase_price: 0,
        low_stock_alert: 5,
        image: null,
    });

    const submit = (e) => {
        e.preventDefault();
        post(route('products.store'));
    };

    const handleImageChange = (e) => {
        setData('image', e.target.files[0]);
    };

    return (
        <AuthenticatedLayout user={auth.user}>
            <Head title="Nouveau Produit" />

            <div className="py-12">
                <div className="max-w-3xl mx-auto sm:px-6 lg:px-8">
                    <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg">
                        <div className="p-6">
                            <div className="flex justify-between items-center mb-6">
                                <h1 className="text-2xl font-bold">Nouveau Produit</h1>
                                <Link 
                                    href={route('products.index')}
                                    className="text-gray-600 hover:text-gray-900"
                                >
                                    ← Retour
                                </Link>
                            </div>

                            <form onSubmit={submit} className="space-y-6">
                                {/* Informations de base */}
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700">
                                            Nom du produit *
                                        </label>
                                        <input
                                            type="text"
                                            value={data.name}
                                            onChange={e => setData('name', e.target.value)}
                                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                                            placeholder="Ex: Déodorant Fraîcheur 50ml"
                                        />
                                        {errors.name && (
                                            <p className="text-red-500 text-sm mt-1">{errors.name}</p>
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
                                        placeholder="Description du produit..."
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
                                            placeholder="Prix pour un carton/sac/pièce"
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
                                            placeholder="Ex: 5.125 pour 5 et 1/8"
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
                                    <input
                                        type="file"
                                        accept="image/*"
                                        onChange={handleImageChange}
                                        className="mt-1 block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                                    />
                                    {data.image && (
                                        <div className="mt-2">
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
                                </div>

                                {/* Boutons */}
                                <div className="flex justify-end space-x-4 pt-6 border-t">
                                    <Link
                                        href={route('products.index')}
                                        className="px-6 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 transition duration-150"
                                    >
                                        Annuler
                                    </Link>
                                    <button
                                        type="submit"
                                        disabled={processing}
                                        className="px-6 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 disabled:opacity-50 transition duration-150"
                                    >
                                        {processing ? 'Création...' : 'Créer le produit'}
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