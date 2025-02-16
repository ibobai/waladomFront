import React from 'react';
import { AlertTriangle, X } from 'lucide-react';
import { User } from '../../types/user';
import { useTranslation } from "react-i18next";


interface DeleteConfirmationModalProps {
  user: User;
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
}

const DeleteConfirmationModal: React.FC<DeleteConfirmationModalProps> = ({
  user,
  isOpen,
  onClose,
  onConfirm
}) => {

  const { t } = useTranslation(); // ✅ Initialize translation

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg max-w-md w-full mx-4">
        <div className="flex justify-between items-center px-6 py-4 border-b">
          <h3 className="text-lg font-medium text-red-600 flex items-center">
            <AlertTriangle className="w-6 h-6 mr-2" />
            {t("userManagement.deleteUser")}
          </h3>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-500">
            <X className="w-6 h-6" />
          </button>
        </div>
        
        <div className="px-6 py-4">
          <p className="text-gray-600">
            {t("userManagement.confirmDelete")}{" "}
            <span className="font-medium">{user.name}</span>?{" "}
            {t("userManagement.actionCannotBeUndone")}
          </p>
        </div>
  
        <div className="px-6 py-4 bg-gray-50 flex justify-end space-x-3 rounded-b-lg">
          <button
            onClick={onClose}
            className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-100"
          >
            {t("userManagement.cancel")}
          </button>
          <button
            onClick={onConfirm}
            className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700"
          >
            {t("userManagement.deleteUser")}
          </button>
        </div>
      </div>
    </div>
  );
  
};

export default DeleteConfirmationModal;