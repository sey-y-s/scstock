import React, { useState } from 'react';
import { useForm } from '@inertiajs/react';

export default function QuickCreateModal({ type, isOpen, onClose, onSuccess }) {
    const { data, setData, post, processing, errors, reset } = useForm({
        name: '',
        contact_email: '',
        contact_phone: '',
        address: ''
    });

    const submit = (e) => {
        e.preventDefault();
        
        const routes = {
            customer: route('customers.store'),
            supplier: route('suppliers.store')
        };

        post(routes[type], {
            onSuccess: () => {
                reset();
                onSuccess();
                onClose();
            }
        });
    };

    if (!isOpen) return null;

    const titles = {
        customer: 'Nouveau Client',
        supplier: 'Nouveau Fournisseur'
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-lg max-w-md w-full p-6">
                <h3 className="text-lg font-medium mb-4">{titles[type]}</h3>
                
                <form onSubmit={submit} className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700">
                            Nom *
                        </label>
                        <input
                            type="text"
                            value={data.name}
                            onChange={e => setData('name', e.target.value)}
                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                        />
                        {errors.name && <p className="text-red-500 text-sm mt-1">{errors.name}</p>}
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700">
                                Téléphone
                            </label>
                            <input
                                type="text"
                                value={data.contact_phone}
                                onChange={e => setData('contact_phone', e.target.value)}
                                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700">
                                Email
                            </label>
                            <input
                                type="email"
                                value={data.contact_email}
                                onChange={e => setData('contact_email', e.target.value)}
                                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                            />
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700">
                            Adresse
                        </label>
                        <textarea
                            value={data.address}
                            onChange={e => setData('address', e.target.value)}
                            rows={2}
                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                        />
                    </div>

                    <div className="flex justify-end space-x-3 pt-4">
                        <button
                            type="button"
                            onClick={onClose}
                            className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
                        >
                            Annuler
                        </button>
                        <button
                            type="submit"
                            disabled={processing}
                            className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 disabled:opacity-50"
                        >
                            {processing ? 'Création...' : 'Créer'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}