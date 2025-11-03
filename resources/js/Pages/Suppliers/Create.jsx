import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, useForm, Link } from '@inertiajs/react';

export default function Create({ auth, suppliers }) {
    const { data, setData, errors, put, processing } = useForm({
        name: '',
        contact_phone: '223 ',
        contact_email: '',
        address: '',
    });

    const submit = (e) => {
        e.preventDefault();
        put(route('suppliers.store'));
    };

    return (
        <AuthenticatedLayout user={auth.user}>
            <Head title="Nouveau Fournisseur" />

            <div className="py-12">
                <div className="max-w-3xl mx-auto sm:px-6 lg:px-8">
                    <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg">
                        <div className="p-6">
                            {/* En-tête */}
                            <div className="flex justify-between items-start mb-8">
                                <div>
                                    <h1 className="text-2xl font-bold text-gray-900">Nouveau Fournisseur</h1>
                                    <p className="text-gray-600 mt-2">
                                        Ajouter un nouveau fournisseur à la liste
                                    </p>
                                </div>
                                <Link
                                    href={route('suppliers.index')}
                                    className="text-gray-600 hover:text-gray-900"
                                >
                                    ← Retour aux fournisseurs
                                </Link>
                            </div>

                            <form onSubmit={submit} className="space-y-6">
                                {/* Nom */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Nom *
                                    </label>
                                    <input
                                        type="text"
                                        value={data.name}
                                        onChange={e => setData('name', e.target.value)}
                                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                                        placeholder='Nom du fournisseur'
                                        required
                                    />
                                    {errors.name && (
                                        <p className="text-red-500 text-sm mt-1">{errors.name}</p>
                                    )}
                                </div>

                                {/* Contact Téléphonique */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Contact Téléphonique
                                    </label>
                                    <input
                                        type="text"
                                        value={data.contact_phone}
                                        onChange={e => setData('contact_phone', e.target.value)}
                                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                                        placeholder='223 00 00 00 00'
                                    />
                                    {errors.contact_phone && (
                                        <p className="text-red-500 text-sm mt-1">{errors.contact_phone}</p>
                                    )}
                                </div>

                                {/* Contact Email */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Contact Email
                                    </label>
                                    <input
                                        type="email"
                                        value={data.contact_email}
                                        onChange={e => setData('contact_email', e.target.value)}
                                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                                        placeholder='abc@exemple.com'
                                    />
                                    {errors.contact_email && (
                                        <p className="text-red-500 text-sm mt-1">{errors.contact_email}</p>
                                    )}
                                </div>

                                {/* Adresse */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Adresse
                                    </label>
                                    <textarea
                                        value={data.address}
                                        onChange={e => setData('address', e.target.value)}
                                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                                        rows="3"
                                        placeholder='Adresse du fournisseur'
                                    ></textarea>
                                    {errors.address && (
                                        <p className="text-red-500 text-sm mt-1">{errors.address}</p>
                                    )}
                                </div>

                                {/* Boutons */}
                                <div className="flex justify-end space-x-4 pt-6 border-t">
                                    <Link
                                        href={route('suppliers.index')}
                                        className="px-6 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 transition duration-150"
                                    >
                                        Annuler
                                    </Link>
                                    <button
                                        type="submit"
                                        disabled={processing}
                                        className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 disabled:opacity-50"
                                    >
                                        {processing ? 'Enregistrement...' : 'Enregistrer le Fournisseur'}
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
