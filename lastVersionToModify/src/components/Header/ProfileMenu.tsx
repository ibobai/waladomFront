import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { UserCircle, Briefcase, Settings, LogOut, User } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';

const ProfileMenu: React.FC = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { logout, isAuthenticated } = useAuth();
  const [isOpen, setIsOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/login');
    setIsOpen(false);
  };

  const handleProfileClick = () => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }
    setIsOpen(!isOpen);
  };

  return (
    <div className="relative">
      <button
        onClick={handleProfileClick}
        className="p-2 rounded-full hover:bg-gray-100"
      >
        <User className="w-6 h-6 text-gray-700" />
      </button>

      {isOpen && isAuthenticated && (
        <>
          <div className="fixed inset-0 z-10" onClick={() => setIsOpen(false)} />
          <div className="absolute right-0 mt-2 w-48 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 z-20">
            <div className="py-1">
              {/* My Profile */}
              <button
                onClick={() => {
                  navigate('/profile');
                  setIsOpen(false);
                }}
                className="flex w-full items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
              >
                <UserCircle className="w-4 h-4 mr-2" />
                {t('nav.myProfile')}
              </button>

              {/* My Role */}
              <button
                onClick={() => {
                  navigate('/my-role');
                  setIsOpen(false);
                }}
                className="flex w-full items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
              >
                <Briefcase className="w-4 h-4 mr-2" />
                {t('nav.myRole')}
              </button>

              {/* Settings */}
              <button
                onClick={() => {
                  navigate('/settings');
                  setIsOpen(false);
                }}
                className="flex w-full items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
              >
                <Settings className="w-4 h-4 mr-2" />
                {t('nav.settings')}
              </button>

              {/* Logout */}
              <button
                onClick={handleLogout}
                className="flex w-full items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
              >
                <LogOut className="w-4 h-4 mr-2" />
                {t('nav.logout')}
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default ProfileMenu;
