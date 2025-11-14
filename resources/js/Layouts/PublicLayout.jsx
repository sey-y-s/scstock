import ApplicationLogo from '@/Components/ApplicationLogo';
import { Link } from '@inertiajs/react';
import { useState } from 'react';

export default function PublicLayout({
    children,
    filtersComponent,
    showHero = true
}) {
    const [showMobileFilters, setShowMobileFilters] = useState(false);

    return (
        <>
            {/* Header Public */}
            <header className="bg-white shadow-md md:fixed top-0 left-0 w-full z-50">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="md:flex md:justify-between md:items-center py-4">
                        <div className="flex justify-between items-center w-full md:w-auto">
                            <div className="flex items-center">
                                <ApplicationLogo className="h-32 md:h-14 md:mr-3" />
                                <div className="hidden md:block text-2xl font-bold text-gray-900">
                                    Samadiare Cosmetics
                                </div>
                            </div>

                            {/* Menu hamburger mobile */}
                            <div className="flex md:hidden items-center space-x-3">
                                {/* Bouton filtre mobile */}
                                <button
                                    onClick={() => setShowMobileFilters(!showMobileFilters)}
                                    className="p-2 rounded-md text-gray-600 transition-all"
                                    title="Filtres"
                                >
                                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
                                    </svg>
                                </button>
                            </div>
                        </div>

                        {/* Connexion desktop */}
                        <div className="hidden md:flex">
                            <Link
                                href={route('login')}
                                className="bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700 transition-all"
                            >
                                Connexion
                            </Link>
                        </div>
                    </div>
                </div>

                {/* Filtres mobiles (toggle) */}
                <div className={`${showMobileFilters ? 'block' : 'hidden'} md:hidden border-t border-gray-200 bg-white`}>
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
                        {filtersComponent}
                    </div>
                </div>
            </header>

            {/* Hero Section */}
            {showHero && (
                <section className="hidden md:block bg-gradient-to-r from-blue-600 to-purple-700 text-white py-16 pt-28">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                        <h1 className="text-4xl font-bold mb-4">Bienvenue dans notre boutique</h1>
                        <p className="text-xl mb-8 opacity-90">Découvrez nos produits cosmétiques de qualité</p>

                        {/* Barre de recherche principale */}
                        {/* <div className="max-w-2xl mx-auto">
                            <div className="flex space-x-3 flex-col sm:flex-row">
                                <input
                                    type="text"
                                    placeholder="Rechercher un produit..."
                                    className="flex-1 px-6 py-3 rounded-lg text-gray-900 focus:ring-2 focus:ring-blue-500 transition"
                                    id="hero-search"
                                />
                                <button
                                    onClick={() => {
                                        const searchInput = document.getElementById('hero-search');
                                        if (searchInput.value) {
                                            setLocalFilters(prev => ({...prev, search: searchInput.value}));
                                            setTimeout(applyFilters, 100);
                                        }
                                    }}
                                    className="bg-white text-blue-600 px-6 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-all mt-3 sm:mt-0"
                                >
                                    🔍 Rechercher
                                </button>
                            </div>
                        </div> */}
                    </div>
                </section>
            )}

            {/* Contenu principal */}
            <main className={showHero ? '' : 'pt-20'}>
                {children}
            </main>

            {/* Footer Public */}
            <footer className="bg-gray-800 text-white py-8">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                    <p>&copy; 2025 Samadiare Cosmetics.</p>
                </div>
            </footer>
        </>
    );
}
