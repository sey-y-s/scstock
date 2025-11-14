import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, useForm, Link } from '@inertiajs/react';

export default function Edit({ auth, supplier }) {
    const { data, setData, errors, put, processing } = useForm({
        name: supplier.name,
        contact_phone: supplier.contact_phone || '223 ',
        contact_email: supplier.contact_email || '',
        address: supplier.address || '',
    });

    const submit = (e) => {
        e.preventDefault();
        put(route('suppliers.update', supplier.id));
    };

    return (
        <AuthenticatedLayout user={auth.user}>
            <Head title={`Modifier ${supplier.name}`} />

            <div className="py-12">
                <div className="max-w-3xl mx-auto sm:px-6 lg:px-8">
                    <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg">
                        <div className="p-6">
                            <div className="flex justify-between items-center mb-6">
                                <div>
                                    <h1 className="text-2xl font-bold">Modifier le fournisseur</h1>
                                    <p className="text-gray-600 mt-1">Nom: {supplier.name}</p>
                                </div>
                            </div>

                            <form onSubmit={submit} className="space-y-6">

                                {/* Informations de base */}
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700">
                                            Nom du fournisseur *
                                        </label>
                                        <input
                                            type="text"
                                            value={data.name}
                                            onChange={e => setData('name', e.target.value)}
                                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                                            placeholder='Nom du fournisseur'
                                        />
                                        {errors.name && (
                                            <p className="text-red-500 text-sm mt-1">{errors.name}</p>
                                        )}
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700">
                                            Adresse
                                        </label>
                                        <input
                                            type="text"
                                            value={data.address}
                                            onChange={e => setData('address', e.target.value)}
                                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                                            placeholder='Adresse du fournisseur'
                                        />
                                        {errors.address && (
                                            <p className="text-red-500 text-sm mt-1">{errors.address}</p>
                                        )}
                                    </div>
                                </div>


                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700">
                                            Contact
                                        </label>
                                        <input
                                            type="text"
                                            value={data.contact_phone}
                                            onChange={e => setData('contact_phone', e.target.value)}
                                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                                            placeholder='Numéro de téléphone'
                                        />
                                        {errors.contact_phone && (
                                            <p className="text-red-500 text-sm mt-1">{errors.contact_phone}</p>
                                        )}
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700">
                                            Mail
                                        </label>
                                        <input
                                            type="email"
                                            value={data.contact_email}
                                            onChange={e => setData('contact_email', e.target.value)}
                                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                                            placeholder='nom@example.com'
                                        />
                                        {errors.contact_email && (
                                            <p className="text-red-500 text-sm mt-1">{errors.contact_email}</p>
                                        )}
                                    </div>

                                </div>


                                {/* Statut */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Statut du fournisseur
                                    </label>
                                    <div className="flex items-center">
                                        <input
                                            type="checkbox"
                                            id="is_active"
                                            checked={supplier.is_active}
                                            onChange={e => setData('is_active', e.target.checked)}
                                            className="rounded border-gray-300 text-blue-600 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                                        />
                                        <label htmlFor="is_active" className="ml-2 text-sm text-gray-700">
                                            Fournisseur actif
                                        </label>
                                    </div>
                                    <p className="text-xs text-gray-500 mt-1">
                                        Désactivez pour masquer ce fournisseur des listes sans le supprimer
                                    </p>
                                </div>

                                {/* Boutons */}
                                <div className="flex justify-end space-x-4 pt-6 border-t">
                                    <Link
                                        href={route('suppliers.index', supplier.id)}
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
                                        La suppression d'un fournisseur est irréversible.
                                    </p>
                                    <Link
                                        href={route('suppliers.destroy', supplier.id)}
                                        method="delete"
                                        as="button"
                                        className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition duration-150"
                                        onClick={(e) => {
                                            if (!confirm('Êtes-vous sûr de vouloir supprimer ce fournisseur ? Cette action est irréversible.')) {
                                                e.preventDefault();
                                            }
                                        }}
                                    >
                                        Supprimer ce fournisseur
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
