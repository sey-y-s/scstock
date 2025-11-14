import React, { useState } from 'react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link, router } from '@inertiajs/react';

export default function Edit({ auth, packagingType }) {
    const [formData, setFormData] = useState({
        code: packagingType.code,
        name: packagingType.name,
        description: packagingType.description || '',
    });

    const [errors, setErrors] = useState({});
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
        if (errors[name]) {
            setErrors(prev => ({
                ...prev,
                [name]: ''
            }));
        }
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        setIsSubmitting(true);

        router.put(route('packaging-types.update', packagingType.id), formData, {
            onSuccess: () => {
                // Redirection gérée par le controller
            },
            onError: (errors) => {
                setErrors(errors);
                setIsSubmitting(false);
            },
            preserveScroll: true
        });
    };

    return (
        <AuthenticatedLayout user={auth.user}>
            <Head title={`Modifier ${packagingType.name}`} />

            <div className="py-12">
                <div className="max-w-3xl mx-auto sm:px-6 lg:px-8">
                    <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg">
                        <div className="p-6">
                            <div className="flex justify-between items-center mb-6">
                                <div>
                                    <h1 className="text-2xl font-bold text-gray-900">Modifier le type d'emballage</h1>
                                    <p className="text-gray-600 mt-1">
                                        Mettre à jour {packagingType.name}
                                    </p>
                                </div>
                                <div className="flex space-x-3">
                                    <Link
                                        href={route('packaging-types.show', packagingType.id)}
                                        className="bg-gray-500 text-white px-4 py-2 rounded-md hover:bg-gray-600"
                                    >
                                        👁️ Voir
                                    </Link>
                                    <Link
                                        href={route('packaging-types.index')}
                                        className="bg-gray-500 text-white px-4 py-2 rounded-md hover:bg-gray-600"
                                    >
                                        ← Retour
                                    </Link>
                                </div>
                            </div>

                            <form onSubmit={handleSubmit} className="space-y-6">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    {/* Code */}
                                    <div>
                                        <label htmlFor="code" className="block text-sm font-medium text-gray-700 mb-1">
                                            Code *
                                        </label>
                                        <input
                                            type="text"
                                            id="code"
                                            name="code"
                                            value={formData.code}
                                            onChange={handleChange}
                                            className={`w-full rounded-md border-gray-300 shadow-sm focus:border-orange-500 focus:ring-orange-500 ${
                                                errors.code ? 'border-red-500' : ''
                                            }`}
                                            maxLength={10}
                                        />
                                        {errors.code && (
                                            <p className="mt-1 text-sm text-red-600">{errors.code}</p>
                                        )}
                                    </div>

                                    {/* Nom */}
                                    <div>
                                        <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                                            Nom *
                                        </label>
                                        <input
                                            type="text"
                                            id="name"
                                            name="name"
                                            value={formData.name}
                                            onChange={handleChange}
                                            className={`w-full rounded-md border-gray-300 shadow-sm focus:border-orange-500 focus:ring-orange-500 ${
                                                errors.name ? 'border-red-500' : ''
                                            }`}
                                        />
                                        {errors.name && (
                                            <p className="mt-1 text-sm text-red-600">{errors.name}</p>
                                        )}
                                    </div>
                                </div>

                                {/* Description */}
                                <div>
                                    <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
                                        Description
                                    </label>
                                    <textarea
                                        id="description"
                                        name="description"
                                        value={formData.description}
                                        onChange={handleChange}
                                        rows={4}
                                        className={`w-full rounded-md border-gray-300 shadow-sm focus:border-orange-500 focus:ring-orange-500 ${
                                            errors.description ? 'border-red-500' : ''
                                        }`}
                                    />
                                    {errors.description && (
                                        <p className="mt-1 text-sm text-red-600">{errors.description}</p>
                                    )}
                                </div>

                                {/* Boutons */}
                                <div className="flex justify-end space-x-4 pt-6 border-t border-gray-200">
                                    <Link
                                        href={route('packaging-types.show', packagingType.id)}
                                        className="bg-gray-500 text-white px-6 py-2 rounded-md hover:bg-gray-600"
                                    >
                                        Annuler
                                    </Link>
                                    <button
                                        type="submit"
                                        disabled={isSubmitting}
                                        className="bg-orange-500 text-white px-6 py-2 rounded-md hover:bg-orange-600 disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
                                    >
                                        {isSubmitting ? (
                                            <>
                                                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                                </svg>
                                                Modification...
                                            </>
                                        ) : (
                                            'Mettre à jour'
                                        )}
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>

                    {/* Section danger */}
                    {packagingType.products_count === 0 && (
                        <div className="bg-red-50 border border-red-200 rounded-lg p-6 mt-6">
                            <h3 className="text-lg font-medium text-red-900 mb-4">🗑️ Zone dangereuse</h3>
                            <div className="flex justify-between items-center">
                                <div>
                                    <p className="text-sm text-red-800 mb-2">
                                        <strong>Supprimer définitivement ce type d'emballage</strong>
                                    </p>
                                    <p className="text-xs text-red-600">
                                        Cette action est irréversible. Le type d'emballage ne pourra être supprimé que s'il n'est utilisé par aucun produit.
                                    </p>
                                </div>
                                <Link
                                    href={route('packaging-types.destroy', packagingType.id)}
                                    method="delete"
                                    as="button"
                                    className="bg-red-500 text-white px-4 py-2 rounded-md hover:bg-red-600 text-sm"
                                    onClick={(e) => {
                                        if (!confirm('Êtes-vous sûr de vouloir supprimer ce type d\'emballage ? Cette action est irréversible.')) {
                                            e.preventDefault();
                                        }
                                    }}
                                >
                                    Supprimer
                                </Link>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
