import React from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate, useLocation } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import MainLayout from '../layouts/MainLayout';

const TermsPage: React.FC = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const location = useLocation();
  const fromRegistration = location.state?.fromRegistration;

  return (
    <MainLayout>
      <div className="min-h-screen bg-gray-50 py-12">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          {fromRegistration && (
            <button
              onClick={() => navigate(-1)}
              className="mb-6 inline-flex items-center text-gray-600 hover:text-waladom-green"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Registration
            </button>
          )}

          <div className="bg-white rounded-lg shadow-lg p-8">
            <h1 className="text-3xl font-bold mb-8">{t('terms.title')}</h1>
            
            <div className="prose max-w-none">
              <section className="mb-8">
                <h2 className="text-xl font-semibold mb-4">{t('terms.section1.title')}</h2>
                <p className="mb-4">{t('terms.section1.content')}</p>
              </section>

              <section className="mb-8">
                <h2 className="text-xl font-semibold mb-4">{t('terms.section2.title')}</h2>
                <p className="mb-4">{t('terms.section2.content')}</p>
                <ul className="list-disc pl-6 mb-4">
                  {[1, 2, 3, 4].map((item) => (
                    <li key={item} className="mb-2">
                      {t(`terms.section2.list.item${item}`)}
                    </li>
                  ))}
                </ul>
              </section>

              <section className="mb-8">
                <h2 className="text-xl font-semibold mb-4">{t('terms.section3.title')}</h2>
                <p className="mb-4">{t('terms.section3.content')}</p>
                <ul className="list-disc pl-6 mb-4">
                  {[1, 2, 3, 4].map((item) => (
                    <li key={item} className="mb-2">
                      {t(`terms.section3.list.item${item}`)}
                    </li>
                  ))}
                </ul>
              </section>

              <section className="mb-8">
                <h2 className="text-xl font-semibold mb-4">{t('terms.section4.title')}</h2>
                <p className="mb-4">{t('terms.section4.content')}</p>
              </section>
            </div>
          </div>
        </div>
      </div>
    </MainLayout>
  );
};

export default TermsPage;