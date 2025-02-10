import React from 'react';
import { X } from 'lucide-react';
import { User } from '../../types/user';

interface UserDetailsModalProps {
  user: User;
  isOpen: boolean;
  onClose: () => void;
}

const UserDetailsModal: React.FC<UserDetailsModalProps> = ({ user, isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center px-6 py-4 border-b sticky top-0 bg-white">
          <h3 className="text-lg font-medium">User Details</h3>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-500">
            <X className="w-6 h-6" />
          </button>
        </div>
        
        <div className="px-6 py-4">
          <dl className="grid grid-cols-2 gap-4">
            {[
              { label: 'Card ID', value: user.cardId },
              { label: 'Full Name', value: `${user.firstName} ${user.lastName}` },
              { label: 'Email', value: user.email },
              { label: 'Phone', value: user.phone },
              { label: 'Country', value: user.country },
              { label: 'Current Country', value: user.currentCountry },
              { label: 'Current City', value: user.currentCity },
              { label: 'Current Village', value: user.currentVillage },
              { label: 'Date of Birth', value: user.dateOfBirth },
              { label: 'Place of Birth', value: user.placeOfBirth },
              { label: 'Tribe', value: user.tribe },
              { label: "Mother's First Name", value: user.motherFirstName },
              { label: "Mother's Last Name", value: user.motherLastName },
              { label: 'Nationalities', value: user.nationalities?.join(', ') || 'N/A' },
              { label: 'Job', value: user.job },
              { label: 'Role', value: user.role },
              { label: 'Joined Date', value: new Date(user.joinedDate).toLocaleDateString() }
            ].map((field, index) => (
              <div key={field.label}>
                <dt className="text-sm font-medium text-gray-500">{field.label}</dt>
                <dd className="mt-1 text-sm text-gray-900">{field.value}</dd>
              </div>
            ))}
          </dl>
        </div>
      </div>
    </div>
  );
};

export default UserDetailsModal;