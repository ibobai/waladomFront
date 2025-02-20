import React from 'react';
import { useTranslation } from 'react-i18next';
import { useAuth } from '../../contexts/AuthContext';
import { NewsCard } from '../Home';
import { QuickAction } from '../Home';

const UserHome: React.FC = () => {
  const { t } = useTranslation();
  const { user } = useAuth();

  const news = [
    {
      id: 'website-launch',
      title: t('news.websiteLaunch.title'),
      description: t('news.websiteLaunch.description'),
      fullContent: t('news.websiteLaunch.fullContent'),
      date: '2024-05-03',
      image: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&q=80',
      link: '/news/website-launch'
    },
    {
      id: 'partnerships',
      title: t('news.partnerships.title'),
      description: t('news.partnerships.description'),
      fullContent: t('news.partnerships.fullContent'),
      date: '2024-04-20',
      image: 'https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?auto=format&fit=crop&q=80',
      link: '/news/partnerships'
    },
    {
      id: 'general-assembly',
      title: t('news.generalAssembly.title'),
      description: t('news.generalAssembly.description'),
      fullContent: t('news.generalAssembly.fullContent'),
      date: '2025-05-03',
      image: 'https://images.unsplash.com/photo-1511578314322-379afb476865?auto=format&fit=crop&q=80',
      link: '/news/general-assembly'
    }
  ];

  const quickActions = [
    {
      title: t('idCard.viewCard', "View ID Card"),
      description: t('idCard.description', "Access your digital membership card"),
      link: "/id-card"
    },
    {
      title: t('events.upcoming', "Upcoming Events"),
      description: t('events.description', "Check out our community events"),
      link: "/events"
    },
    {
      title: t('community.support1', "Community Support"),
      description: t('community.description1', "Connect with other members"),
      link: "/community"
    }
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      {/* Welcome Section */}
      <div className="bg-gradient-to-r from-waladom-green to-waladom-green-dark rounded-lg p-8 mb-12 text-white">
        <h1 className="text-3xl font-bold mb-2">
          {t('home.welcome', { name: user?.firstName })}
        </h1>
        <p className="text-lg opacity-90">
          {t('home.welcomeMessage')}
        </p>
      </div>

      {/* News Section */}
      <div className="mb-12">
        <h2 className="text-2xl font-bold mb-6">{t('home.latestNews')}</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {news.map((item) => (
            <NewsCard key={item.id} {...item} />
          ))}
        </div>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {quickActions.map((action, index) => (
          <QuickAction key={index} {...action} />
        ))}
      </div>
    </div>
  );
};

export default UserHome;