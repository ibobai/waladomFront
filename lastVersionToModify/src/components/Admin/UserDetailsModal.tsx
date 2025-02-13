import React, { useState, useEffect } from 'react';
import { X, Loader2 } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { cn } from '../../utils/cn';

interface UserDetailsModalProps {
  user: {
    id: string;
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
    status: string;
    tribe: string;
    currentCountry: string;
    currentCity: string;
    currentVillage: string;
    birthDate: string;
    birthCountry: string;
    birthCity: string;
    birthVillage: string;
    maritalStatus: string;
    numberOfKids: number;
    approverComment: string;
    recommendedBy: string;
    occupation: string;
    sex: string;
    mothersFirstName: string;
    mothersLastName: string;
    nationalities: string[];
    role: {
      id: string;
      name: string;
      color: string;
    };
    idProofPhotos?: {
      id: string;
      photoUrl: string;
      type: string;
    }[];
    waladomCardPhoto?: {
      id: string;
      photoUrl: string;
    };
  };
  isOpen: boolean;
  onClose: () => void;
}

const UserDetailsModal: React.FC<UserDetailsModalProps> = ({ user, isOpen, onClose }) => {

  const { t } = useTranslation();
  const [signedPhotos, setSignedPhotos] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const signPhotos = async () => {
      if (!user.idProofPhotos?.length && !user.waladomCardPhoto) {
        setLoading(false);
        return;
      }

      try {
        const photoUrls = [
          ...(user.idProofPhotos?.map(p => p.photoUrl) || []),
          user.waladomCardPhoto?.photoUrl
        ].filter(Boolean);

        const response = await fetch('https://www.waladom.club/api/upload/signephoto', {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('accessToken')}`,
            'Content-Type': 'application/json',
            'Accept': 'application/json'
          },
          body: JSON.stringify(photoUrls)
        });

        if (!response.ok) {
          throw new Error('Failed to sign photos');
        }

        const data = await response.json();
        setSignedPhotos(data);
      } catch (error) {
        console.error('Error signing photos:', error);
      } finally {
        setLoading(false);
      }
    };

    if (isOpen) {
      signPhotos();
    }
  }, [user, isOpen]);

  if (!isOpen) return null;

  const InfoSection: React.FC<{ title: string; children: React.ReactNode }> = ({ title, children }) => (
    <div className="mb-8">
      <h3 className="text-lg font-medium text-gray-900 mb-4 pb-2 border-b">
        {title}
      </h3>
      {children}
    </div>
  );

  const InfoRow: React.FC<{ label: string; value: string | number | undefined }> = ({ label, value }) => (
    <div className="mb-4">
      <dt className="text-sm font-medium text-gray-500">{label}</dt>
      <dd className="mt-1 text-sm text-gray-900">{value || t('common.notProvided')}</dd>
    </div>
  );

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg max-w-4xl w-full mx-4 max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-white px-6 py-4 border-b flex justify-between items-center">
          <div>
            <h2 className="text-xl font-medium text-gray-900">
              {t('userManagement.userDetails')}
            </h2>
            <p className="text-sm text-gray-500">ID: {user.id}</p>
          </div>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-500">
            <X className="w-6 h-6" />
          </button>
        </div>

        <div className="p-6">
          {/* Photos Section */}
          <InfoSection title={t('userManagement.photos')}>
            {loading ? (
              <div className="flex items-center justify-center h-48">
                <Loader2 className="w-8 h-8 text-waladom-green animate-spin" />
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {user.idProofPhotos?.map((photo, index) => (
                  <div key={photo.id}>
                    <p className="text-sm font-medium text-gray-500 mb-2">
                      {t(`userManagement.idProof${index === 0 ? 'Front' : 'Back'}`)}
                    </p>
                    <img
                      src={signedPhotos[photo.photoUrl] || photo.photoUrl}
                      alt={`ID Proof ${index === 0 ? 'Front' : 'Back'}`}
                      className="w-full h-48 object-cover rounded-lg"
                    />
                  </div>
                ))}
                {user.waladomCardPhoto && (
                  <div>
                    <p className="text-sm font-medium text-gray-500 mb-2">
                      {t('userManagement.profilePhoto')}
                    </p>
                    <img
                      src={signedPhotos[user.waladomCardPhoto.photoUrl] || user.waladomCardPhoto.photoUrl}
                      alt="Profile"
                      className="w-full h-48 object-cover rounded-lg"
                    />
                  </div>
                )}
              </div>
            )}
          </InfoSection>

          {/* Basic Information */}
          <InfoSection title={t('userManagement.basicInfo')}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <InfoRow label={t('userManagement.firstName')} value={user.firstName} />
              <InfoRow label={t('userManagement.lastName')} value={user.lastName} />
              <InfoRow label={t('userManagement.email')} value={user.email} />
              <InfoRow label={t('userManagement.phone')} value={user.phone} />
              <InfoRow label={t('userManagement.status2')} value={user.status} /> 
              <InfoRow label={t('userManagement.role')} value={user.role.name} />
            </div>
          </InfoSection>

          {/* Personal Information */}
          <InfoSection title={t('userManagement.personalInfo')}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <InfoRow label={t('userManagement.sex')} value={user.sex} />
              <InfoRow label={t('userManagement.tribe')} value={user.tribe} />
              <InfoRow label={t('userManagement.maritalStatus')} value={user.maritalStatus} />
              <InfoRow label={t('userManagement.numberOfKids')} value={user.numberOfKids} />
              <InfoRow label={t('userManagement.occupation')} value={user.occupation} />
              <InfoRow label={t('userManagement.approverComment')} value={user.approverComment} />
              <InfoRow label={t('userManagement.recommendedBy')} value={user.recommendedBy} />
              <InfoRow label={t('userManagement.nationalities')} value={user.nationalities.join(', ')} />
            </div>
          </InfoSection>

          {/* Birth Information */}
          <InfoSection title={t('userManagement.birthInfo')}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <InfoRow label={t('userManagement.birthDate')} value={user.birthDate} />
              <InfoRow label={t('userManagement.birthCountry')} value={user.birthCountry} />
              <InfoRow label={t('userManagement.birthCity')} value={user.birthCity} />
              <InfoRow label={t('userManagement.birthVillage')} value={user.birthVillage} />
            </div>
          </InfoSection>

          {/* Current Location */}
          <InfoSection title={t('userManagement.currentLocation')}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <InfoRow label={t('userManagement.currentCountry')} value={user.currentCountry} />
              <InfoRow label={t('userManagement.currentCity')} value={user.currentCity} />
              <InfoRow label={t('userManagement.currentVillage')} value={user.currentVillage} />
            </div>
          </InfoSection>

          {/* Mother's Information */}
          <InfoSection title={t('userManagement.motherInfo')}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <InfoRow label={t('userManagement.mothersFirstName')} value={user.mothersFirstName} />
              <InfoRow label={t('userManagement.mothersLastName')} value={user.mothersLastName} />
            </div>
          </InfoSection>
        </div>
      </div>
    </div>
  );
};

export default UserDetailsModal;