import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export type UserRole = 'A' | 'X' | 'Y' | 'Z' | 'F';

export interface User {
  email: string;
  name: string;
  firstName: string;
  lastName: string;
  phone: string;
  cardId: string;
  role: UserRole;
  country: string;
  currentCountry: string;
  currentCity: string;
  currentVillage: string;
  job: string;
  dateOfBirth: string;
  placeOfBirth: string;
  villageOfBirth?: string;
  gender: string;
  tribe: string;
  motherFirstName: string;
  motherLastName: string;
  nationalities: string[];
  joinedDate: string;
  isAdmin?: boolean;
  photoUrl?: string;
  password?: string;
}

export const roleColors: Record<UserRole, string> = {
  'A': 'bg-black', // Admin - Black
  'X': 'bg-green-600', // Content Manager - Green
  'Y': 'bg-yellow-500', // Moderator - Yellow
  'Z': 'bg-blue-600', // Membership Reviewer - Blue
  'F': 'bg-red-600' // User - Red
};

interface RoleDescription {
  title: string;
  description: string;
  responsibilities: string[];
}

export const roleDescriptions: Record<UserRole, RoleDescription> = {
  'A': {
    title: 'Administrator',
    description: 'Full access and control over the organization\'s digital platform.',
    responsibilities: [
      'Full access to all website features and functionalities',
      'Manage users, including creating, editing, or deleting user accounts',
      'Assign and change roles for other users',
      'Oversee content creation, modification, and deletion',
      'Review all membership requests and moderate decisions',
      'Monitor activity logs and maintain site security'
    ]
  },
  'X': {
    title: 'Content Manager',
    description: 'Responsible for managing and maintaining organization content.',
    responsibilities: [
      'Create, edit, and manage events, news, and announcements',
      'Oversee the content calendar for timely updates',
      'Moderate user-submitted content',
      'Collaborate on campaigns and promotional activities',
      'Limited user management capabilities'
    ]
  },
  'Y': {
    title: 'Moderator',
    description: 'Manages social media groups and maintains community standards.',
    responsibilities: [
      'Manage Facebook and WhatsApp groups',
      'Verify membership requests against database',
      'Approve or deny group entry requests',
      'Act as community liaison',
      'Maintain positive group environment'
    ]
  },
  'Z': {
    title: 'Membership Reviewer',
    description: 'Evaluates and processes new membership applications.',
    responsibilities: [
      'Review and process new membership requests',
      'Approve or reject requests with clear reasoning',
      'Verify user authenticity',
      'Respond to membership inquiries',
      'Maintain decision logs'
    ]
  },
  'F': {
    title: 'User',
    description: 'Standard member with basic access to organization features.',
    responsibilities: [
      'Access basic features and view content',
      'Participate in organization activities',
      'Request group memberships',
      'Engage with organization content',
      'Spread awareness of organization goals'
    ]
  }
};