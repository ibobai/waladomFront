import React from 'react';
import { useNavigate } from 'react-router-dom';
import { CheckCircle } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import MainLayout from '../layouts/MainLayout';

const RegistrationSuccessPage: React.FC = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();

  return (
    <MainLayout>
      <div className="min-h-screen bg-gray-50 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-md w-full space-y-8 text-center">
          <div>
            <CheckCircle className="mx-auto h-16 w-16 text-waladom-green" />
            <h2 className="mt-6 text-3xl font-extrabold text-gray-900">
              {t('registration.requestSent')}
            </h2>
            <p className="mt-2 text-sm text-gray-600">
              {t('registration.requestSentDescription')}
            </p>
          </div>
          <div>
            <button
              onClick={() => navigate('/login', { replace: true })}
              className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-waladom-green hover:bg-waladom-green-dark"
            >
              {t('registration.returnToLogin')}
            </button>
          </div>
        </div>
      </div>
    </MainLayout>
  );
};

export default RegistrationSuccessPage;