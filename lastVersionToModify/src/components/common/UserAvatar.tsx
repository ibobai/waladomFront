import React from 'react';
import { User } from 'lucide-react';

interface UserAvatarProps {
  imageUrl?: string;
  size?: 'small' | 'medium' | 'large';
}

const UserAvatar: React.FC<UserAvatarProps> = ({ imageUrl, size = 'medium' }) => {
  const sizeClasses = {
    small: 'w-8 h-8',
    medium: 'w-12 h-12',
    large: 'w-24 h-24'
  };

  if (!imageUrl) {
    return (
      <div className={`${sizeClasses[size]} rounded-full bg-gray-200 flex items-center justify-center`}>
        <User className={`${size === 'large' ? 'w-12 h-12' : 'w-6 h-6'} text-gray-500`} />
      </div>
    );
  }

  return (
    <img
      src={imageUrl}
      alt="User avatar"
      className={`${sizeClasses[size]} rounded-full object-cover`}
    />
  );
};

export default UserAvatar;