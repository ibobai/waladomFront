import React from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { Users, Globe2, Heart, Calendar } from 'lucide-react';

const GuestHome: React.FC = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();

  const features = [
    {
      icon: <Globe2 className="w-12 h-12 text-waladom-green" />,
      title: t('home.features.community.title'),
      description: t('home.features.community.description')
    },
    {
      icon: <Heart className="w-12 h-12 text-waladom-green" />,
      title: t('home.features.support.title'),
      description: t('home.features.support.description')
    },
    {
      icon: <Calendar className="w-12 h-12 text-waladom-green" />,
      title: t('home.features.events.title'),
      description: t('home.features.events.description')
    }
  ];

  return (
    <>
      {/* Hero Section */}
      <div className="relative bg-gradient-to-b from-white to-gray-50">
        <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-16 text-center lg:pt-32">
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-gray-900 mb-6">
            <span className="text-waladom-green">Waladom</span>
          </h1>
          <p className="text-xl sm:text-2xl text-gray-600 mb-8 max-w-3xl mx-auto">
            {t('home.subtitle')}
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <button
              onClick={() => navigate('/register')}
              className="inline-flex items-center justify-center px-6 py-3 text-lg font-medium rounded-full shadow-lg text-white bg-waladom-green hover:bg-waladom-green-dark transition-all duration-200"
            >
              <Users className="w-5 h-5 mr-2" />
              {t('home.joinButton')}
            </button>
            <button
              onClick={() => navigate('/about')}
              className="inline-flex items-center justify-center px-6 py-3 text-lg font-medium rounded-full shadow-lg text-waladom-green bg-white hover:bg-gray-50 border-2 border-waladom-green transition-all duration-200"
            >
              {t('home.learnMore')}
            </button>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="bg-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-center mb-12">
            {t('home.featuresTitle')}
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <div
                key={index}
                className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow"
              >
                <div className="flex flex-col items-center text-center">
                  <div className="mb-4">{feature.icon}</div>
                  <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
                  <p className="text-gray-600">{feature.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="bg-gray-50 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold mb-8">{t('home.ctaTitle')}</h2>
          <button
            onClick={() => navigate('/register')}
            className="inline-flex items-center justify-center px-8 py-3 text-lg font-medium rounded-full shadow-lg text-white bg-waladom-green hover:bg-waladom-green-dark transition-all duration-200"
          >
            {t('home.getStarted')}
          </button>
        </div>
      </div>
    </>
  );
};

export default GuestHome;