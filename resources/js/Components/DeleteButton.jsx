import { useState } from 'react';
import { router } from '@inertiajs/react';

const DeleteButton = ({ deleteUrl, itemName = "this item" }) => {
  const [showModal, setShowModal] = useState(false);

  const confirmDelete = () => {
    router.delete(deleteUrl, {
      onFinish: () => setShowModal(false),
    });
  };

  return (
    <>
      <button
        onClick={() => setShowModal(true)}
        className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700"
      >
        Supprimer
      </button>

      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white text-center p-6 rounded shadow-lg w-full max-w-md">
            <h2 className="text-lg font-bold mb-4">Confirmer la Suppression</h2>
            <p className="mb-6">Êtes-vous sûr de vouloir supprimer <strong>{itemName}</strong>?</p>
            <div className="flex justify-center gap-3">
              <button
                onClick={() => setShowModal(false)}
                className="bg-gray-300 px-4 py-2 rounded hover:bg-gray-400"
              >
                Annuler
              </button>
              <button
                onClick={confirmDelete}
                className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700"
              >
                Confirmer
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default DeleteButton;
