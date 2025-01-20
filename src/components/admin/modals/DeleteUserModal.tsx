import React from 'react';
import { AlertTriangle, X } from 'lucide-react';
import { Button } from '../../common/Button';

interface DeleteUserModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => Promise<void>;
  userName: string;
}

export const DeleteUserModal: React.FC<DeleteUserModalProps> = ({
  isOpen,
  onClose,
  onConfirm,
  userName
}) => {
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);

  if (!isOpen) return null;

  const handleConfirm = async () => {
    setLoading(true);
    setError(null);
    try {
      await onConfirm();
      onClose();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Une erreur est survenue');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex min-h-screen items-center justify-center p-4">
        <div className="fixed inset-0 bg-black opacity-30"></div>
        
        <div className="relative w-full max-w-md rounded-lg bg-white p-6 shadow-xl">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <AlertTriangle className="h-6 w-6 text-red-600" />
              </div>
              <h2 className="ml-3 text-xl font-semibold text-gray-900">
                Supprimer l'utilisateur
              </h2>
            </div>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-500"
            >
              <X className="h-6 w-6" />
            </button>
          </div>

          <div className="mt-3">
            <p className="text-sm text-gray-500">
              Êtes-vous sûr de vouloir supprimer l'utilisateur {userName} ? Cette action est irréversible.
            </p>
          </div>

          {error && (
            <p className="mt-3 text-sm text-red-600">{error}</p>
          )}

          <div className="mt-6 flex justify-end space-x-3">
            <Button
              variant="secondary"
              onClick={onClose}
            >
              Annuler
            </Button>
            <Button
              variant="danger"
              onClick={handleConfirm}
              loading={loading}
            >
              Supprimer
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};