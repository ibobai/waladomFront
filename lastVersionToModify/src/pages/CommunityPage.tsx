import React from 'react';
import { useTranslation } from 'react-i18next';
import { Users, MessageCircle, Share2, Construction, ChevronLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import MainLayout from '../layouts/MainLayout';

const CommunityPage: React.FC = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();

  const features = [
    {
      icon: <Users className="w-12 h-12 text-waladom-green" />,
      title: 'community.features.connect.title',
      description: 'community.features.connect.description'
    },
    {
      icon: <MessageCircle className="w-12 h-12 text-waladom-green" />,
      title: 'community.features.discuss.title',
      description: 'community.features.discuss.description'
    },
    {
      icon: <Share2 className="w-12 h-12 text-waladom-green" />,
      title: 'community.features.share.title',
      description: 'community.features.share.description'
    }
  ];

  return (
    <MainLayout>
      <div className="bg-gradient-to-b from-white to-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          {/* Back Button */}
          <button 
            onClick={() => navigate(-1)} 
            className="flex items-center text-waladom-green hover:text-waladom-green-dark mb-6"
          >
            <ChevronLeft className="w-5 h-5 mr-2" />
            {t('common.back')}
          </button>

          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold text-gray-900 mb-6">
              {t('community.title')}
            </h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              {t('community.description')}
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 mb-12">
            {features.map((feature, index) => (
              <div key={index} className="bg-white p-6 rounded-lg shadow-md text-center">
                <div className="flex justify-center mb-4">{feature.icon}</div>
                <h3 className="text-xl font-semibold mb-2">{t(feature.title)}</h3>
                <p className="text-gray-600">{t(feature.description)}</p>
              </div>
            ))}
          </div>

          {/* Coming Soon Section */}
          <div className="bg-white rounded-lg shadow-lg p-8 text-center">
            <Construction className="w-16 h-16 text-waladom-green mx-auto mb-4" />
            <h2 className="text-2xl font-bold mb-4">{t('community.comingSoon.title')}</h2>
            <p className="text-gray-600 mb-6">
              {t('community.comingSoon.description')}
            </p>
            <div className="max-w-md mx-auto">
              <div className="flex gap-2">
                <input
                  type="email"
                  placeholder="Enter your email"
                  className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-waladom-green focus:border-transparent"
                />
                <button className="px-6 py-2 bg-waladom-green text-white rounded-lg hover:bg-waladom-green-dark">
                  {t('community.comingSoon.notifyMe')}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </MainLayout>
  );
};

export default CommunityPage;
