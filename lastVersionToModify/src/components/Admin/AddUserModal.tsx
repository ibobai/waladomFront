import React, { useState } from 'react';
import { X, AlertCircle } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { User, UserRole } from '../../types/user';

interface AddUserModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const AddUserModal: React.FC<AddUserModalProps> = ({ isOpen, onClose }) => {
  const { register } = useAuth();
  const [error, setError] = useState('');
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    country: '',
    currentCountry: '',
    currentCity: '',
    currentVillage: '',
    dateOfBirth: '',
    placeOfBirth: '',
    tribe: '',
    motherFirstName: '',
    motherLastName: '',
    nationalities: [] as string[],
    job: '',
    role: 'F' as UserRole
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await register(formData);
      onClose();
    } catch (error) {
      setError('Failed to add user');
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg max-w-4xl w-full mx-4 max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center px-6 py-4 border-b sticky top-0 bg-white">
          <h3 className="text-lg font-medium">Add New User</h3>
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

          <div className="grid grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">First Name</label>
              <input
                type="text"
                value={formData.firstName}
                onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-waladom-green focus:border-waladom-green"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Last Name</label>
              <input
                type="text"
                value={formData.lastName}
                onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-waladom-green focus:border-waladom-green"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
              <input
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-waladom-green focus:border-waladom-green"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Phone</label>
              <input
                type="tel"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-waladom-green focus:border-waladom-green"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Country</label>
              <input
                type="text"
                value={formData.country}
                onChange={(e) => setFormData({ ...formData, country: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-waladom-green focus:border-waladom-green"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Current Country</label>
              <input
                type="text"
                value={formData.currentCountry}
                onChange={(e) => setFormData({ ...formData, currentCountry: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-waladom-green focus:border-waladom-green"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Current City</label>
              <input
                type="text"
                value={formData.currentCity}
                onChange={(e) => setFormData({ ...formData, currentCity: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-waladom-green focus:border-waladom-green"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Current Village</label>
              <input
                type="text"
                value={formData.currentVillage}
                onChange={(e) => setFormData({ ...formData, currentVillage: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-waladom-green focus:border-waladom-green"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Date of Birth</label>
              <input
                type="date"
                value={formData.dateOfBirth}
                onChange={(e) => setFormData({ ...formData, dateOfBirth: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-waladom-green focus:border-waladom-green"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Place of Birth</label>
              <input
                type="text"
                value={formData.placeOfBirth}
                onChange={(e) => setFormData({ ...formData, placeOfBirth: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-waladom-green focus:border-waladom-green"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Tribe</label>
              <input
                type="text"
                value={formData.tribe}
                onChange={(e) => setFormData({ ...formData, tribe: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-waladom-green focus:border-waladom-green"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Mother's First Name</label>
              <input
                type="text"
                value={formData.motherFirstName}
                onChange={(e) => setFormData({ ...formData, motherFirstName: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-waladom-green focus:border-waladom-green"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Mother's Last Name</label>
              <input
                type="text"
                value={formData.motherLastName}
                onChange={(e) => setFormData({ ...formData, motherLastName: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-waladom-green focus:border-waladom-green"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Job</label>
              <input
                type="text"
                value={formData.job}
                onChange={(e) => setFormData({ ...formData, job: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-waladom-green focus:border-waladom-green"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Nationalities</label>
              <input
                type="text"
                value={formData.nationalities.join(', ')}
                onChange={(e) => setFormData({ ...formData, nationalities: e.target.value.split(',').map(s => s.trim()) })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-waladom-green focus:border-waladom-green"
                placeholder="Enter nationalities separated by commas"
                required
              />
            </div>
          </div>

          <div className="mt-6 flex justify-end space-x-3">
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
              Add User
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddUserModal;