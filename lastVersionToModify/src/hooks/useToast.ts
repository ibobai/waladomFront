import { useCallback } from 'react';
import { showToast } from '../components/Toast/ToastMessage';

export const useToast = () => {
  const success = useCallback((message: string) => {
    showToast({ message, type: 'success' });
  }, []);

  const error = useCallback((message: string) => {
    showToast({ message, type: 'error' });
  }, []);

  return { success, error };
};