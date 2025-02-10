import React, { useState } from 'react';
import { X, Shield, AlertCircle } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { User } from '../../types/user';

interface RoleChangeModalProps {
  user: User;
  isOpen: boolean;
  onClose: () => void;
}

const RoleChangeModal: React.FC<RoleChangeModalProps> = ({ user, isOpen, onClose }) => {
  const [adminPassword, setAdminPassword] = useState('');
  const [error, setError] = useState('');
  const { updateUser } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    try {
      // Verify admin password (in real app, this would be an API call)
      if (adminPassword !== 'admin111995') {
        setError('Invalid admin password');
        return;
      }

      await updateUser(user.cardId, { role: user.role });
      onClose();
    } catch (err) {
      setError('Failed to update user role');
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg max-w-md w-full mx-4">
        <div className="flex justify-between items-center px-6 py-4 border-b">
          <h3 className="text-lg font-medium text-waladom-green flex items-center">
            <Shield className="w-6 h-6 mr-2" />
            Change User Role
          </h3>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-500">
            <X className="w-6 h-6" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6">
          {error && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-600 rounded-md flex items-center gap-2">
              <AlertCircle className="w-5 h-5" />
              <span>{error}</span>
            </div>
          )}

          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700">
              Admin Password
            </label>
            <input
              type="password"
              value={adminPassword}
              onChange={(e) => setAdminPassword(e.target.value)}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-waladom-green focus:ring-waladom-green"
              required
            />
          </div>

          <div className="flex justify-end space-x-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-waladom-green text-white rounded-md hover:bg-waladom-green-dark"
            >
              Confirm Change
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default RoleChangeModal;