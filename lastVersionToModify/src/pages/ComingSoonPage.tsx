import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Construction } from 'lucide-react';
import MainLayout from '../layouts/MainLayout';

const ComingSoonPage: React.FC = () => {
  const navigate = useNavigate();

  return (
    <MainLayout>
      <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center px-4">
        <div className="max-w-lg w-full text-center">
          <button
            onClick={() => navigate(-1)}
            className="mb-8 inline-flex items-center text-gray-600 hover:text-waladom-green"
          >
            <ArrowLeft className="w-5 h-5 mr-2" />
            Go Back
          </button>

          <Construction className="w-24 h-24 text-waladom-green mx-auto mb-6" />
          
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Coming Soon!
          </h1>
          
          <p className="text-xl text-gray-600 mb-8">
            We're working hard to bring you something amazing. Stay tuned!
          </p>

          <div className="bg-white p-6 rounded-lg shadow-md">
            <p className="text-gray-600 mb-4">
              Want to be notified when we launch?
            </p>
            
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
    </MainLayout>
  );
};

export default ComingSoonPage;