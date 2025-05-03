import React from "react";
import { Button } from "./Button";

export interface ModalProps {
  title: string;
  children: React.ReactNode;
  onClose: () => void;
  onConfirm: () => void;
  className?: string;
}

const Modal: React.FC<ModalProps> = ({
  title,
  children,
  onClose,
  onConfirm,
  className,
}) => {
  return (
    <div
      className={`fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 ${
        className || ""
      }`}
      role="dialog"
      aria-modal="true"
      aria-labelledby="modal-title"
    >
      <div className="bg-white rounded-lg shadow-xl max-w-md w-full p-6">
        <h2
          id="modal-title"
          className="text-lg font-semibold text-gray-900 mb-4"
        >
          {title}
        </h2>
        <div className="text-sm text-gray-600 mb-6">{children}</div>
        <div className="flex justify-end gap-4">
          <Button
            variant="secondary"
            onClick={onClose}
            className="bg-gray-100 text-gray-700 hover:bg-gray-200"
            aria-label="Annuler"
          >
            Annuler
          </Button>
          <Button
            variant="primary"
            onClick={onConfirm}
            className="bg-blue-600 text-white hover:bg-blue-700"
            aria-label="Confirmer"
          >
            Confirmer
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Modal;
