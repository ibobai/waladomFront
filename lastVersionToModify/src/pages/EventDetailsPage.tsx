import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Calendar, MapPin, Users, Clock, ArrowLeft } from 'lucide-react';
import MainLayout from '../layouts/MainLayout';
import { events } from '../components/Admin/Events';

const EventDetailsPage: React.FC = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const event = events.find(e => e.id === id);

  if (!event) {
    return (
      <MainLayout>
        <div className="min-h-screen bg-gray-50 flex items-center justify-center">
          <div className="text-center">
            <h2 className="text-2xl font-bold text-gray-900">Event not found</h2>
            <button
              onClick={() => navigate('/events')}
              className="mt-4 inline-flex items-center px-4 py-2 bg-waladom-green text-white rounded-lg"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Events
            </button>
          </div>
        </div>
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      <div className="min-h-screen bg-gray-50 py-12">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <button
            onClick={() => navigate('/events')}
            className="mb-6 inline-flex items-center text-gray-600 hover:text-waladom-green"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Events
          </button>

          <div className="bg-white rounded-lg shadow-lg overflow-hidden">
            <img
              src={event.image}
              alt={event.title}
              className="w-full h-96 object-cover"
            />

            <div className="p-8">
              <h1 className="text-3xl font-bold text-gray-900 mb-4">{event.title}</h1>

              <div className="grid grid-cols-2 gap-6 mb-8">
                <div className="flex items-center text-gray-600">
                  <Calendar className="w-5 h-5 mr-2 text-waladom-green" />
                  <span>{new Date(event.date).toLocaleDateString()}</span>
                </div>
                <div className="flex items-center text-gray-600">
                  <Clock className="w-5 h-5 mr-2 text-waladom-green" />
                  <span>{event.time}</span>
                </div>
                <div className="flex items-center text-gray-600">
                  <MapPin className="w-5 h-5 mr-2 text-waladom-green" />
                  <span>{event.location}</span>
                </div>
                <div className="flex items-center text-gray-600">
                  <Users className="w-5 h-5 mr-2 text-waladom-green" />
                  <span>{event.registeredCount} / {event.capacity || 'Unlimited'} registered</span>
                </div>
              </div>

              <div className="prose max-w-none">
                <h2 className="text-xl font-semibold mb-4">About this Event</h2>
                <p className="text-gray-600 mb-8">{event.description}</p>

                <h2 className="text-xl font-semibold mb-4">Event Goals</h2>
                <ul className="list-disc list-inside space-y-2 text-gray-600 mb-8">
                  {event.goals?.map((goal, index) => (
                    <li key={index}>{goal}</li>
                  ))}
                </ul>

                <h2 className="text-xl font-semibold mb-4">Contact Information</h2>
                <div className="bg-gray-50 rounded-lg p-6">
                  <dl className="grid grid-cols-2 gap-4">
                    <div>
                      <dt className="text-sm font-medium text-gray-500">Organizer</dt>
                      <dd className="mt-1">{event.organizer}</dd>
                    </div>
                    <div>
                      <dt className="text-sm font-medium text-gray-500">Contact Person</dt>
                      <dd className="mt-1">{event.contactPerson}</dd>
                    </div>
                    <div>
                      <dt className="text-sm font-medium text-gray-500">Email</dt>
                      <dd className="mt-1">{event.contactEmail}</dd>
                    </div>
                    <div>
                      <dt className="text-sm font-medium text-gray-500">Phone</dt>
                      <dd className="mt-1">{event.contactPhone}</dd>
                    </div>
                  </dl>
                </div>
              </div>

              <div className="mt-8 flex justify-center">
                <button className="px-8 py-3 bg-waladom-green text-white rounded-lg hover:bg-waladom-green-dark">
                  Register for Event
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </MainLayout>
  );
};

export default EventDetailsPage;