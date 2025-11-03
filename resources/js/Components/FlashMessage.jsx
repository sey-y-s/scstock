import { useEffect, useState } from 'react';

export default function FlashMessage({ flash }) {
    const [showFlash, setShowFlash] = useState(true);

    useEffect(() => {
        if (flash.success || flash.error) {
            setShowFlash(true);

            const timer = setTimeout(() => {
                setShowFlash(false);
            }, 3000);

            return () => clearTimeout(timer); // nettoie le timer
        }
    }, [flash.success, flash.error]);

    return (
        <div className='px-4 mt-3 max-w-7xl mx-auto'>
            {flash.success && showFlash && (
                <div className="mb-4 p-3 bg-green-100 text-green-800 rounded-lg shadow-sm transition-opacity duration-300">
                    {flash.success}
                </div>
            )}
            {flash.error && showFlash && (
                <div className="mb-4 p-3 bg-red-100 text-red-800 rounded-lg shadow-sm transition-opacity duration-300">
                    {flash.error}
                </div>
            )}
        </div>
    );
}
