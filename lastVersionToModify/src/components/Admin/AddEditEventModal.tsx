import React, { useState, useEffect } from 'react';
import { X } from 'lucide-react';

interface Event {
  id?: string;
  title: string;
  date: string;
  time: string;
  location: string;
  description: string;
  image: string;
  status: 'upcoming' | 'ongoing' | 'completed';
}

interface AddEditEventModalProps {
  event: Event | null;
  isOpen: boolean;
  onClose: () => void;
  onSave: (eventData: Omit<Event, 'id'>) => void;
}

const AddEditEventModal: React.FC<AddEditEventModalProps> = ({
  event,
  isOpen,
  onClose,
  onSave
}) => {
  const [formData, setFormData] = useState<Omit<Event, 'id'>>({
    title: '',
    date: '',
    time: '',
    location: '',
    description: '',
    image: '',
    status: 'upcoming'
  });

  useEffect(() => {
    if (event) {
      setFormData(event);
    } else {
      setFormData({
        title: '',
        date: '',
        time: '',
        location: '',
        description: '',
        image: '',
        status: 'upcoming'
      });
    }
  }, [event]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center px-6 py-4 border-b sticky top-0 bg-white">
          <h3 className="text-lg font-medium">
            {event ? 'Edit Event' : 'Create New Event'}
          </h3>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-500">
            <X className="w-6 h-6" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="px-6 py-4 space-y-6">
          <div className="grid grid-cols-1 gap-6">
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">Title</label>
              <input
                type="text"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                className="block w-full rounded-md border-gray-300 shadow-sm focus:border-waladom-green focus:ring-waladom-green"
                required
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">Date</label>
                <input
                  type="date"
                  value={formData.date}
                  onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                  className="block w-full rounded-md border-gray-300 shadow-sm focus:border-waladom-green focus:ring-waladom-green"
                  required
                />
              </div>
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">Time</label>
                <input
                  type="time"
                  value={formData.time}
                  onChange={(e) => setFormData({ ...formData, time: e.target.value })}
                  className="block w-full rounded-md border-gray-300 shadow-sm focus:border-waladom-green focus:ring-waladom-green"
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">Location</label>
              <input
                type="text"
                value={formData.location}
                onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                className="block w-full rounded-md border-gray-300 shadow-sm focus:border-waladom-green focus:ring-waladom-green"
                placeholder="Enter event location"
                required
              />
            </div>

            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">Description</label>
              <textarea
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                rows={4}
                className="block w-full rounded-md border-gray-300 shadow-sm focus:border-waladom-green focus:ring-waladom-green"
                placeholder="Enter event description"
                required
              />
            </div>

            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">Image URL</label>
              <input
                type="url"
                value={formData.image}
                onChange={(e) => setFormData({ ...formData, image: e.target.value })}
                className="block w-full rounded-md border-gray-300 shadow-sm focus:border-waladom-green focus:ring-waladom-green"
                placeholder="Enter image URL"
                required
              />
              {formData.image && (
                <img
                  src={formData.image}
                  alt="Event preview"
                  className="mt-2 h-32 w-full object-cover rounded-lg"
                />
              )}
            </div>

            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">Status</label>
              <select
                value={formData.status}
                onChange={(e) => setFormData({ ...formData, status: e.target.value as Event['status'] })}
                className="block w-full rounded-md border-gray-300 shadow-sm focus:border-waladom-green focus:ring-waladom-green"
              >
                <option value="upcoming">Upcoming</option>
                <option value="ongoing">Ongoing</option>
                <option value="completed">Completed</option>
              </select>
            </div>
          </div>

          <div className="flex justify-end space-x-3 pt-4 border-t">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-waladom-green"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-waladom-green text-white rounded-md hover:bg-waladom-green-dark focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-waladom-green"
            >
              {event ? 'Save Changes' : 'Create Event'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddEditEventModal;