import React from 'react';
import { useTranslation } from 'react-i18next';
import { Globe2, Heart, Users, Target, Shield, Lightbulb } from 'lucide-react';
import MainLayout from '../layouts/MainLayout';

const AboutPage: React.FC = () => {
  const { t } = useTranslation();

  const values = [
    {
      icon: <Globe2 className="w-12 h-12 text-waladom-green" />,
      title: 'Global Connection',
      description: 'Connecting Sudanese communities worldwide through a digital platform.'
    },
    {
      icon: <Heart className="w-12 h-12 text-waladom-green" />,
      title: 'Community Support',
      description: 'Fostering mutual support and collaboration among community members.'
    },
    {
      icon: <Users className="w-12 h-12 text-waladom-green" />,
      title: 'Cultural Preservation',
      description: 'Preserving and celebrating Sudanese culture and heritage.'
    }
  ];

  const mission = [
    {
      icon: <Target className="w-8 h-8 text-waladom-green" />,
      title: 'Our Mission',
      description: 'To create a unified platform that connects and empowers Sudanese communities globally.'
    },
    {
      icon: <Shield className="w-8 h-8 text-waladom-green" />,
      title: 'Our Values',
      description: 'Integrity, community support, and cultural preservation guide everything we do.'
    },
    {
      icon: <Lightbulb className="w-8 h-8 text-waladom-green" />,
      title: 'Our Vision',
      description: 'A world where every Sudanese person feels connected to their community and culture.'
    }
  ];

  return (
    <MainLayout>
      {/* Hero Section */}
      <div className="bg-gradient-to-b from-white to-gray-50 py-12 sm:py-16 lg:py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl font-bold text-gray-900 sm:text-5xl lg:text-6xl mb-6">
            About <span className="text-waladom-green">Waladom</span>
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Waladom is dedicated to connecting and empowering Sudanese communities worldwide,
            creating a bridge between culture, heritage, and modern connectivity.
          </p>
        </div>
      </div>

      {/* Mission Section */}
      <div className="bg-white py-12 sm:py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
            {mission.map((item, index) => (
              <div key={index} className="text-center p-6">
                <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-waladom-green bg-opacity-10 mb-4">
                  {item.icon}
                </div>
                <h3 className="text-xl font-semibold mb-2">{item.title}</h3>
                <p className="text-gray-600">{item.description}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Values Section */}
      <div className="bg-gray-50 py-12 sm:py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900">Our Core Values</h2>
          </div>
          <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
            {values.map((value, index) => (
              <div
                key={index}
                className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow"
              >
                <div className="flex flex-col items-center text-center">
                  <div className="mb-4">{value.icon}</div>
                  <h3 className="text-xl font-semibold mb-2">{value.title}</h3>
                  <p className="text-gray-600">{value.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </MainLayout>
  );
};

export default AboutPage;