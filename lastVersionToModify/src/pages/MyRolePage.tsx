import React from 'react';
import { useTranslation } from 'react-i18next';
import { Shield, Check, LayoutDashboard } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import MainLayout from '../layouts/MainLayout';
import { useAuth } from '../contexts/AuthContext';
import { roleColors, roleDescriptions } from '../types/user';
import ProtectedRoute from '../components/Auth/ProtectedRoute';

const MyRolePage: React.FC = () => {
  const { t } = useTranslation();
  const { user } = useAuth();
  const navigate = useNavigate();

  if (!user) return null;

  const roleInfo = roleDescriptions[user.role];
  if (!roleInfo) return null;

  const getDashboardPath = () => {
    switch (user.role) {
      case 'A':
        return '/admin/dashboard';
      case 'X':
        return '/content/dashboard';
      case 'Y':
        return '/moderator/dashboard';
      case 'Z':
        return '/reviewer/dashboard';
      default:
        return '/';
    }
  };

  return (
    <ProtectedRoute>
      <MainLayout>
        <div className="min-h-screen bg-gray-50">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
            <div className="bg-white shadow rounded-lg overflow-hidden">
              {/* Role Header */}
              <div className={`px-6 py-8 ${roleColors[user.role]} text-white`}>
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                  <div className="flex items-center space-x-3">
                    <Shield className="w-8 h-8" />
                    <div>
                      <h2 className="text-2xl font-bold">{t(`roles.${user.role}.title`, roleInfo.title)}</h2>
                      <p className="text-sm opacity-90">{t('roles.memberId')}: {user.cardId}</p>
                    </div>
                  </div>
                  {user.role !== 'F' && (
                    <button
                      onClick={() => navigate(getDashboardPath())}
                      className="px-4 py-2 bg-white text-gray-900 rounded-lg flex items-center gap-2 hover:bg-gray-100 transition-colors"
                    >
                      <LayoutDashboard className="w-5 h-5" />
                      {t('roles.accessDashboard')}
                    </button>
                  )}
                </div>
              </div>

              <div className="p-6 space-y-8">
                {/* Role Description */}
                <div>
                  <h3 className="text-lg font-semibold mb-2">{t('roles.description')}</h3>
                  <p className="text-gray-600">{t(`roles.${user.role}.description`, roleInfo.description)}</p>
                </div>

                {/* Responsibilities */}
                <div>
                  <h3 className="text-lg font-semibold mb-4">{t('roles.responsibilities')}</h3>
                  <ul className="space-y-3">
                    {roleInfo.responsibilities.map((responsibility, index) => (
                      <li key={index} className="flex items-start">
                        <Check className={`w-5 h-5 mr-2 mt-0.5 ${roleColors[user.role]} rounded-full p-1`} />
                        <span className="text-gray-700">
                          {t(`roles.${user.role}.responsibilities.${index}`, responsibility)}
                        </span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
      </MainLayout>
    </ProtectedRoute>
  );
};

export default MyRolePage;