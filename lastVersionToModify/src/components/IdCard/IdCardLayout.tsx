import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { User } from 'lucide-react';
import { cn } from '../../utils/cn';
import QRCode from '../common/QRCode';
import Logo from '../Logo';
import { roleColors, type User as UserType } from '../../types/user';

interface IdCardLayoutProps {
  user: UserType;
  className?: string;
}

const IdCardLayout: React.FC<IdCardLayoutProps> = ({ user, className }) => {
  const { t } = useTranslation();
  const [signedPhotoUrl, setSignedPhotoUrl] = useState<string | null>(null);
  const issueDate = new Date().toLocaleDateString();
  
  // Remove WLD_ prefix from cardId
  const cleanCardId = user.cardId.replace(/WLD_/g, '');

  // Create QR code data with minimal essential info for better scanning
  const qrData = `${cleanCardId}|${user.name}|${user.dateOfBirth}`;

  useEffect(() => {
    const signPhoto = async () => {
      if (!user.photoUrl) return;

      try {
        const response = await fetch('https://www.waladom.club/api/upload/signephoto', {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('accessToken')}`,
            'Content-Type': 'application/json'
          },
          body: JSON.stringify([user.photoUrl])
        });

        if (!response.ok) throw new Error('Failed to sign photo');

        const data = await response.json();
        setSignedPhotoUrl(data[user.photoUrl]);
      } catch (error) {
        console.error('Error signing photo:', error);
      }
    };

    signPhoto();

    // Refresh signed URL every 15 minutes
    const interval = setInterval(signPhoto, 15 * 60 * 1000);
    return () => clearInterval(interval);
  }, [user.photoUrl]);

  // Sample profile photo - replace with actual user photo in production
  const samplePhoto = "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=200&h=200";

  const InfoRow = ({ label, value, labelAr }: { label: string; value: string; labelAr: string }) => (
    <div className="flex justify-between text-[8px]">
      <div className="flex-1">
        <span className="font-semibold">{label}:</span> {value}
      </div>
      <div className="flex-1 text-right mr-2">
        {labelAr}: {value}
      </div>
    </div>
  );

  return (
    <div 
      id="waladom-id-card"
      className={cn(
        "bg-white rounded-xl shadow-lg p-4",
        "border-2 border-waladom-green relative overflow-hidden",
        "w-[400px] h-[250px]",
        className
      )}
    >
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute inset-0 bg-gradient-to-r from-waladom-green to-waladom-green-light" />
      </div>

      {/* Header with Logo and Organization Name */}
      <div className="flex justify-between items-start mb-2">
        <Logo className="h-8 w-8" />
        <div className="text-center flex-1">
          <h1 className="text-base font-bold text-waladom-green">Waladom - ولاضم</h1>
        </div>
        <QRCode value={qrData} size={32} />
      </div>

      {/* Main Content */}
      <div className="flex">
        {/* Left Column - Photo and ID */}
        <div className="w-1/3 pr-2">
          <div className="w-20 h-20 rounded-lg overflow-hidden mb-1">
            <img
              src={signedPhotoUrl || user.photoUrl || samplePhoto}
              alt={user.name}
              className="w-full h-full object-cover"
            />
          </div>
          <div>
            <div className="flex justify-between text-[8px]">
              <div>
                <span className="font-semibold">ID:</span> {cleanCardId}
              </div>
              <div className="text-right">
                <span className="font-semibold mr-1">رقم العضوية:</span> {cleanCardId}
              </div>
            </div>
          </div>
          <div className={cn(
            "mt-1 px-2 py-0.5 rounded-full text-[8px] font-medium text-white text-center",
            roleColors[user.role]
          )}>
            Role {user.role}
          </div>
        </div>

        {/* Right Column - Information */}
        <div className="flex-1 space-y-1 pl-2">
          <InfoRow 
            label="Name"
            labelAr="الاسم"
            value={user.name}
          />

          <InfoRow 
            label="Birth Date"
            labelAr="تاريخ الميلاد"
            value={user.dateOfBirth}
          />

          <InfoRow 
            label="Birth Place"
            labelAr="مكان الميلاد"
            value={`${user.placeOfBirth}, ${user.country}`}
          />

          <InfoRow 
            label="Nationalities"
            labelAr="الجنسيات"
            value={user.nationalities.join(', ')}
          />

          <InfoRow 
            label="Current Country"
            labelAr="البلد الحالي"
            value={user.currentCountry}
          />

          <InfoRow 
            label="Profession"
            labelAr="المهنة"
            value={user.job}
          />

          <div className="grid grid-cols-2 gap-1">
            <InfoRow 
              label="Issue Date"
              labelAr="تاريخ الإصدار"
              value={issueDate}
            />
            <InfoRow 
              label="Member Since"
              labelAr="عضو منذ"
              value={new Date(user.joinedDate).toLocaleDateString()}
            />
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="absolute bottom-1 left-4 right-4 text-center text-[8px] text-gray-500">
        Scan QR code to verify / امسح رمز QR للتحقق
      </div>
    </div>
  );
};

export default IdCardLayout;