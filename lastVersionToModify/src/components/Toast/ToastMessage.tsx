import React from 'react';
import toast from 'react-hot-toast';
import { CheckCircle2, XCircle } from 'lucide-react';

interface ToastProps {
  message: string;
  type: 'success' | 'error';
}

export const showToast = ({ message, type }: ToastProps) => {
  const Icon = type === 'success' ? CheckCircle2 : XCircle;
  
  toast(
    (t) => (
      <div className="flex items-center space-x-2">
        <Icon className="w-5 h-5" />
        <span>{message}</span>
      </div>
    ),
    {
      duration: 3000,
      style: {
        background: type === 'success' ? '#4CAF50' : '#ef4444',
        color: '#fff',
        padding: '12px',
        borderRadius: '8px',
      },
    }
  );
};