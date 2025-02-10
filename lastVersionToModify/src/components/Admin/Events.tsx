import React, { useState } from 'react';
import { Calendar, Edit2, Trash2, Plus, X } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import AddEditEventModal from './AddEditEventModal';

interface Event {
  id: string;
  title: string;
  date: string;
  time: string;
  location: string;
  description: string;
  image: string;
  status: 'upcoming' | 'ongoing' | 'completed';
  goals?: string[];
  organizer?: string;
  capacity?: number;
  registeredCount?: number;
  price?: string;
  contactPerson?: string;
  contactEmail?: string;
  contactPhone?: string;
}

interface EventDetailsModalProps {
  event: Event;
  isOpen: boolean;
  onClose: () => void;
}

const EventDetailsModal: React.FC<EventDetailsModalProps> = ({ event, isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg max-w-4xl w-full mx-4 max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center px-6 py-4 border-b sticky top-0 bg-white">
          <h3 className="text-xl font-semibold">{event.title}</h3>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-500">
            <X className="w-6 h-6" />
          </button>
        </div>

        <div className="p-6">
          <img
            src={event.image}
            alt={event.title}
            className="w-full h-64 object-cover rounded-lg mb-6"
          />

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div>
              <h4 className="text-lg font-semibold mb-4">Event Details</h4>
              <dl className="space-y-4">
                <div>
                  <dt className="text-sm font-medium text-gray-500">Date & Time</dt>
                  <dd className="mt-1">
                    {new Date(event.date).toLocaleDateString()} at {event.time}
                  </dd>
                </div>
                <div>
                  <dt className="text-sm font-medium text-gray-500">Location</dt>
                  <dd className="mt-1">{event.location}</dd>
                </div>
                <div>
                  <dt className="text-sm font-medium text-gray-500">Status</dt>
                  <dd className="mt-1 capitalize">{event.status}</dd>
                </div>
                <div>
                  <dt className="text-sm font-medium text-gray-500">Organizer</dt>
                  <dd className="mt-1">{event.organizer || 'Waladom Organization'}</dd>
                </div>
                <div>
                  <dt className="text-sm font-medium text-gray-500">Capacity</dt>
                  <dd className="mt-1">
                    {event.registeredCount || 0} / {event.capacity || 'Unlimited'} registered
                  </dd>
                </div>
                <div>
                  <dt className="text-sm font-medium text-gray-500">Price</dt>
                  <dd className="mt-1">{event.price || 'Free'}</dd>
                </div>
              </dl>
            </div>

            <div>
              <h4 className="text-lg font-semibold mb-4">Description</h4>
              <p className="text-gray-600 mb-6">{event.description}</p>

              <h4 className="text-lg font-semibold mb-4">Goals</h4>
              <ul className="list-disc list-inside space-y-2 text-gray-600">
                {(event.goals || [
                  'Celebrate Sudanese culture and traditions',
                  'Foster community connections',
                  'Share knowledge and experiences',
                  'Promote cultural understanding'
                ]).map((goal, index) => (
                  <li key={index}>{goal}</li>
                ))}
              </ul>

              <h4 className="text-lg font-semibold mt-6 mb-4">Contact Information</h4>
              <dl className="space-y-2">
                <div>
                  <dt className="text-sm font-medium text-gray-500">Contact Person</dt>
                  <dd>{event.contactPerson || 'Event Coordinator'}</dd>
                </div>
                <div>
                  <dt className="text-sm font-medium text-gray-500">Email</dt>
                  <dd>{event.contactEmail || 'events@waladom.org'}</dd>
                </div>
                <div>
                  <dt className="text-sm font-medium text-gray-500">Phone</dt>
                  <dd>{event.contactPhone || '+1 (555) 123-4567'}</dd>
                </div>
              </dl>
            </div>
          </div>

          <div className="mt-8 flex justify-end">
            <button
              onClick={onClose}
              className="px-4 py-2 bg-waladom-green text-white rounded-lg hover:bg-waladom-green-dark"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

// Share events data between admin and home page
export const events: Event[] = [
  {
    id: '1',
    title: 'Sudanese Cultural Festival',
    date: '2024-04-15',
    time: '14:00',
    location: 'Central Park, New York',
    description: 'Annual celebration of Sudanese culture featuring traditional music, dance, and cuisine.',
    image: 'https://images.unsplash.com/photo-1528605105345-5344ea20e269?auto=format&fit=crop&q=80',
    status: 'upcoming',
    goals: [
      'Showcase traditional Sudanese music and dance',
      'Offer authentic Sudanese cuisine',
      'Display traditional crafts and artwork',
      'Create networking opportunities'
    ],
    organizer: 'Waladom Cultural Committee',
    capacity: 500,
    registeredCount: 275,
    price: 'Free',
    contactPerson: 'Ahmed Mohammed',
    contactEmail: 'festival@waladom.org',
    contactPhone: '+1 (555) 123-4567'
  },
  {
    id: '2',
    title: 'Community Workshop',
    date: '2024-04-22',
    time: '10:00',
    location: 'Community Center, London',
    description: 'Educational workshop focusing on preserving Sudanese traditions in the diaspora.',
    image: 'https://images.unsplash.com/photo-1517457373958-b7bdd4587205?auto=format&fit=crop&q=80',
    status: 'upcoming',
    goals: [
      'Share traditional practices and customs',
      'Discuss preservation strategies',
      'Connect generations through culture',
      'Document oral histories'
    ],
    organizer: 'Waladom Education Team',
    capacity: 100,
    registeredCount: 45,
    price: '£10',
    contactPerson: 'Sarah Ahmed',
    contactEmail: 'workshop@waladom.org',
    contactPhone: '+44 20 7123 4567'
  }
];

const Events: React.FC = () => {
  const [localEvents, setLocalEvents] = useState<Event[]>(events);
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);

  const handleAddEvent = () => {
    setSelectedEvent(null);
    setIsModalOpen(true);
  };

  const handleEditEvent = (event: Event) => {
    setSelectedEvent(event);
    setIsModalOpen(true);
  };

  const handleViewDetails = (event: Event) => {
    setSelectedEvent(event);
    setIsDetailsModalOpen(true);
  };

  const handleDeleteEvent = (id: string) => {
    const updatedEvents = localEvents.filter(event => event.id !== id);
    setLocalEvents(updatedEvents);
    // Update the shared events array
    events.length = 0;
    events.push(...updatedEvents);
  };

  const handleSaveEvent = (eventData: Omit<Event, 'id'>) => {
    const updatedEvents = selectedEvent
      ? localEvents.map(event =>
          event.id === selectedEvent.id
            ? { ...event, ...eventData }
            : event
        )
      : [
          ...localEvents,
          {
            ...eventData,
            id: Math.random().toString(36).substr(2, 9)
          }
        ];

    setLocalEvents(updatedEvents);
    // Update the shared events array
    events.length = 0;
    events.push(...updatedEvents);
    setIsModalOpen(false);
  };

  return (
    <div className="bg-white shadow-md rounded-lg overflow-hidden">
      <div className="px-4 py-5 border-b border-gray-200 sm:px-6 flex justify-between items-center">
        <h3 className="text-lg leading-6 font-medium text-gray-900">Events Management</h3>
        <button
          onClick={handleAddEvent}
          className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-waladom-green hover:bg-waladom-green-dark"
        >
          <Plus className="w-5 h-5 mr-2" />
          Add Event
        </button>
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Event</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date & Time</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Location</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {localEvents.map((event) => (
              <tr key={event.id} className="hover:bg-gray-50 cursor-pointer" onClick={() => handleViewDetails(event)}>
                <td className="px-6 py-4">
                  <div className="flex items-center">
                    <div className="flex-shrink-0 h-20 w-20">
                      <img
                        src={event.image}
                        alt={event.title}
                        className="h-20 w-20 rounded-lg object-cover"
                      />
                    </div>
                    <div className="ml-4">
                      <div className="text-sm font-medium text-gray-900">{event.title}</div>
                      <div className="text-sm text-gray-500">{event.description}</div>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4">
                  <div className="text-sm text-gray-900">
                    {new Date(event.date).toLocaleDateString()}
                  </div>
                  <div className="text-sm text-gray-500">{event.time}</div>
                </td>
                <td className="px-6 py-4">
                  <div className="text-sm text-gray-900">{event.location}</div>
                </td>
                <td className="px-6 py-4">
                  <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                    {event.status}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleEditEvent(event);
                    }}
                    className="text-waladom-green hover:text-waladom-green-dark mr-4"
                  >
                    <Edit2 className="w-5 h-5" />
                  </button>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleDeleteEvent(event.id);
                    }}
                    className="text-red-600 hover:text-red-900"
                  >
                    <Trash2 className="w-5 h-5" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <AddEditEventModal
        event={selectedEvent}
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSave={handleSaveEvent}
      />

      {selectedEvent && (
        <EventDetailsModal
          event={selectedEvent}
          isOpen={isDetailsModalOpen}
          onClose={() => setIsDetailsModalOpen(false)}
        />
      )}
    </div>
  );
};

export default Events;