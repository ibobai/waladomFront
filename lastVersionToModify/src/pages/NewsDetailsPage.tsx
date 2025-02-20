import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Calendar, ArrowLeft, Share2 } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import MainLayout from '../layouts/MainLayout';

const NewsDetailsPage: React.FC = () => {
  const { t } = useTranslation();
  const { id } = useParams();
  const navigate = useNavigate();

  // Get news data based on ID
  const getNewsData = () => {
    const newsMap = {
      'website-launch': {
        title: t('news.websiteLaunch.title'),
        description: t('news.websiteLaunch.description'),
        fullContent: t('news.websiteLaunch.fullContent'),
        date: '2024-05-03',
        image: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&q=80'
      },
      'partnerships': {
        title: t('news.partnerships.title'),
        description: t('news.partnerships.description'),
        fullContent: t('news.partnerships.fullContent'),
        date: '2024-04-20',
        image: 'https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?auto=format&fit=crop&q=80'
      },
      'general-assembly': {
        title: t('news.generalAssembly.title'),
        description: t('news.generalAssembly.description'),
        fullContent: t('news.generalAssembly.fullContent'),
        date: '2025-05-03',
        image: 'https://images.unsplash.com/photo-1511578314322-379afb476865?auto=format&fit=crop&q=80'
      }
    };

    return newsMap[id as keyof typeof newsMap];
  };

  const news = getNewsData();

  if (!news) {
    return (
      <MainLayout>
        <div className="min-h-screen bg-gray-50 flex items-center justify-center">
          <div className="text-center">
            <h2 className="text-2xl font-bold text-gray-900">News article not found</h2>
            <button
              onClick={() => navigate('/')}
              className="mt-4 inline-flex items-center px-4 py-2 bg-waladom-green text-white rounded-lg"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Home
            </button>
          </div>
        </div>
      </MainLayout>
    );
  }

  const handleShare = async () => {
    try {
      if (navigator.share) {
        await navigator.share({
          title: news.title,
          text: news.description,
          url: window.location.href
        });
      } else {
        await navigator.clipboard.writeText(window.location.href);
        alert('Link copied to clipboard!');
      }
    } catch (error) {
      console.error('Error sharing:', error);
    }
  };

  return (
    <MainLayout>
      <div className="min-h-screen bg-gray-50 py-12">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <button
            onClick={() => navigate('/')}
            className="mb-6 inline-flex items-center text-gray-600 hover:text-waladom-green"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            {t('common.back')}
            </button>

          <article className="bg-white rounded-lg shadow-lg overflow-hidden">
            <img
              src={news.image}
              alt={news.title}
              className="w-full h-96 object-cover"
            />

            <div className="p-8">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center text-gray-500 text-sm">
                  <Calendar className="w-4 h-4 mr-2" />
                  {new Date(news.date).toLocaleDateString()}
                </div>
                <button
                  onClick={handleShare}
                  className="inline-flex items-center text-gray-500 hover:text-waladom-green"
                >
                  <Share2 className="w-5 h-5 mr-2" />
                  {t('news.common.share')}
                </button>
              </div>

              <h1 className="text-3xl font-bold text-gray-900 mb-4">{news.title}</h1>
              <div className="prose max-w-none">
                <p className="text-lg text-gray-600 mb-8">{news.description}</p>
                <div className="text-gray-800 leading-relaxed">
                  {news.fullContent.split('\n').map((paragraph, index) => (
                    <p key={index} className="mb-4">{paragraph}</p>
                  ))}
                </div>
              </div>
            </div>
          </article>
        </div>
      </div>
    </MainLayout>
  );
};

export default NewsDetailsPage;