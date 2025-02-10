import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Calendar, ArrowLeft, Share2 } from 'lucide-react';
import MainLayout from '../layouts/MainLayout';

// Sample news data - replace with your actual data source
const newsData = [
  {
    id: 'community-center-london',
    title: 'Community Center Opening in London',
    description: 'We are excited to announce the opening of our new community center in London, providing a space for cultural events, education, and community gatherings.',
    fullContent: `
      We are thrilled to announce the grand opening of our new Sudanese Community Center in London. This state-of-the-art facility represents a significant milestone in our mission to create a vibrant hub for the Sudanese community in the United Kingdom.

      The center will feature:
      - Multiple event spaces for cultural celebrations
      - Educational classrooms for language and cultural programs
      - Modern meeting rooms for community gatherings
      - A library with Sudanese literature and resources
      - A cafeteria serving traditional Sudanese cuisine

      This initiative has been made possible through the generous support of our community members and partners. The center will serve as a bridge between generations, helping to preserve and share our rich cultural heritage while fostering connections within our community.
    `,
    date: '2024-03-15',
    image: 'https://images.unsplash.com/photo-1577495508048-b635879837f1?auto=format&fit=crop&q=80',
    author: 'Ahmed Mohammed',
    category: 'Community Development'
  },
  {
    id: 'education-program',
    title: 'Educational Support Program Launch',
    description: 'Introducing our new educational support program aimed at helping Sudanese students access quality education and resources.',
    fullContent: `
      Today marks the launch of our comprehensive Educational Support Program, designed to empower Sudanese students with the tools and resources they need to succeed in their academic journey.

      The program includes:
      - Scholarship opportunities for higher education
      - Mentorship from successful professionals
      - Access to online learning resources
      - Regular workshops and study groups
      - Career guidance and counseling

      We believe that education is the key to building a stronger future for our community. Through this program, we aim to break down barriers to education and create opportunities for the next generation of leaders.
    `,
    date: '2024-03-10',
    image: 'https://images.unsplash.com/photo-1523240795612-9a054b0db644?auto=format&fit=crop&q=80',
    author: 'Sarah Ahmed',
    category: 'Education'
  },
  {
    id: 'cultural-festival',
    title: 'Cultural Festival Success',
    description: 'Thank you to everyone who participated in our annual cultural festival, celebrating Sudanese heritage and traditions.',
    fullContent: `
      The 2024 Sudanese Cultural Festival was a resounding success, bringing together over 1,000 community members for a day of celebration, learning, and cultural exchange.

      Festival Highlights:
      - Traditional music and dance performances
      - Art exhibitions featuring local artists
      - Cooking demonstrations of authentic Sudanese cuisine
      - Cultural workshops and activities for children
      - Fashion show showcasing traditional attire

      The festival served as a beautiful reminder of our rich cultural heritage and the importance of preserving these traditions for future generations. We are grateful to all the performers, volunteers, and attendees who made this event possible.
    `,
    date: '2024-03-05',
    image: 'https://images.unsplash.com/photo-1528605105345-5344ea20e269?auto=format&fit=crop&q=80',
    author: 'Ibrahim Hassan',
    category: 'Culture & Events'
  }
];

const NewsDetailsPage: React.FC = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const news = newsData.find(n => n.id === id);

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
            Back to News
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
                  Share
                </button>
              </div>

              <h1 className="text-3xl font-bold text-gray-900 mb-4">{news.title}</h1>

              <div className="flex items-center text-sm text-gray-500 mb-8">
                <span>By {news.author}</span>
                <span className="mx-2">•</span>
                <span>{news.category}</span>
              </div>

              <div className="prose max-w-none">
                {news.fullContent.split('\n\n').map((paragraph, index) => (
                  <p key={index} className="mb-4 text-gray-600">
                    {paragraph}
                  </p>
                ))}
              </div>
            </div>
          </article>
        </div>
      </div>
    </MainLayout>
  );
};

export default NewsDetailsPage;