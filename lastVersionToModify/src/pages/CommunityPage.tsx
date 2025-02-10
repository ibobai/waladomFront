import React from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import MainLayout from '../layouts/MainLayout';
import { Users, MessageCircle, Share2, Construction } from 'lucide-react';

const CommunityPage: React.FC = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();

  const features = [
    {
      icon: <Users className="w-12 h-12 text-waladom-green" />,
      title: 'Connect with Members',
      description: 'Find and connect with Sudanese community members worldwide.'
    },
    {
      icon: <MessageCircle className="w-12 h-12 text-waladom-green" />,
      title: 'Discussion Forums',
      description: 'Engage in meaningful discussions about culture, events, and shared experiences.'
    },
    {
      icon: <Share2 className="w-12 h-12 text-waladom-green" />,
      title: 'Resource Sharing',
      description: 'Share and access community resources, job opportunities, and more.'
    }
  ];

  return (
    <MainLayout>
      <div className="bg-gradient-to-b from-white to-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold text-gray-900 mb-6">Our Community</h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Join our vibrant community of Sudanese individuals and organizations worldwide.
              Connect, share, and grow together.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 mb-12">
            {features.map((feature, index) => (
              <div key={index} className="bg-white p-6 rounded-lg shadow-md text-center">
                <div className="flex justify-center mb-4">{feature.icon}</div>
                <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
                <p className="text-gray-600">{feature.description}</p>
              </div>
            ))}
          </div>

          {/* Coming Soon Section */}
          <div className="bg-white rounded-lg shadow-lg p-8 text-center">
            <Construction className="w-16 h-16 text-waladom-green mx-auto mb-4" />
            <h2 className="text-2xl font-bold mb-4">Community Features Coming Soon!</h2>
            <p className="text-gray-600 mb-6">
              We're working hard to bring these amazing features to life. Sign up to be notified when we launch!
            </p>
            <div className="max-w-md mx-auto">
              <div className="flex gap-2">
                <input
                  type="email"
                  placeholder="Enter your email"
                  className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-waladom-green focus:border-transparent"
                />
                <button className="px-6 py-2 bg-waladom-green text-white rounded-lg hover:bg-waladom-green-dark">
                  Notify Me
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