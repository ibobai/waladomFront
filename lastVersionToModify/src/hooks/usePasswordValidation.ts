import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useToast } from './useToast';

export const usePasswordValidation = () => {
  const { t } = useTranslation();
  const [error, setError] = useState('');
  const toast = useToast();

  const validatePassword = async (password: string, userId: string) => {
    try {
      const response = await fetch('https://www.waladom.club/api/user/validate/password', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('accessToken')}`
        },
        body: JSON.stringify({ 
          password,
          id: userId 
        })
      });

      const data = await response.json();

      if (!response.ok || !data.valid) {
        const errorMessage = t('profile.validation.invalidPassword');
        setError(errorMessage);
        toast.error(errorMessage);
        return false;
      }

      setError('');
      return true;
    } catch (err) {
      const errorMessage = t('profile.errors.verificationFailed');
      setError(errorMessage);
      toast.error(errorMessage);
      return false;
    }
  };

  return { validatePassword, error, setError };
};