import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Calendar, Edit2, Trash2, Plus, X } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import AddEditEventModal from './AddEditEventModal';

// Share events data between admin and home page
export const events = [
  {
    id: '1',
    title: 'events.generalAssembly.title',
    date: '2025-05-03',
    time: '14:00',
    location: 'Champs-Élysées, Paris, France',
    description: 'events.generalAssembly.description',
    image: 'https://images.unsplash.com/photo-1511578314322-379afb476865?auto=format&fit=crop&q=80',
    status: 'upcoming',
    goals: [
      'events.generalAssembly.goals.list.0',
      'events.generalAssembly.goals.list.1',
      'events.generalAssembly.goals.list.2',
      'events.generalAssembly.goals.list.3',
      'events.generalAssembly.goals.list.4'

    ],
    organizer: 'WALADOM',
    capacity: 500,
    registeredCount: 0,
    price: 'events.common.free',
    contactPerson: 'WALADOM',
    contactEmail: 'contact@waladom.org',
    contactPhone: '+111111111111'
  },
  {
    id: '2',
    title: 'events.officialLaunch.title',
    date: '2025-04-03',
    time: '14:00',
    location: 'Champs-Élysées, Paris, France',
    description: 'events.officialLaunch.description',
    image: 'https://images.unsplash.com/photo-1505236858219-8359eb29e329?auto=format&fit=crop&q=80',
    status: 'upcoming',
    goals: [
      'events.officialLaunch.goals.list.0',
      'events.officialLaunch.goals.list.1',
      'events.officialLaunch.goals.list.2',
      'events.officialLaunch.goals.list.3'
    ],
    organizer: 'WALADOM',
    capacity: 500,
    registeredCount: 0,
    price: 'events.common.free',
    contactPerson: 'WALADOM',
    contactEmail: 'contact@waladom.org',
    contactPhone: '+111111111111'
  }
];

export default events;