import React from 'react';
import { useTranslation } from 'react-i18next';
import MainLayout from '../layouts/MainLayout';
import IdCardContainer from '../components/IdCard/IdCardContainer';
import ProtectedRoute from '../components/Auth/ProtectedRoute';

const IdCardPage: React.FC = () => {
  const { t } = useTranslation();

  return (
    <ProtectedRoute>
      <MainLayout>
        <div className="min-h-screen bg-gray-50 py-12">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-8">
              <h1 className="text-3xl font-bold text-gray-900">
                {t('idCard.title')}
              </h1>
              <p className="mt-2 text-gray-600">
                {t('idCard.description')}
              </p>
            </div>

            <div className="flex justify-center items-center">
              <div className="max-w-full overflow-auto p-4">
                <IdCardContainer />
              </div>
            </div>
          </div>
        </div>
      </MainLayout>
    </ProtectedRoute>
  );
};

export default IdCardPage;