import { useState } from 'react';
import { useTranslation } from 'react-i18next';

export const useVerificationCode = () => {
  const { t } = useTranslation();
  const [error, setError] = useState('');
  const [timeLeft, setTimeLeft] = useState(0);

  const sendVerificationCode = async (email: string) => {
    try {
      const response = await fetch('https://www.waladom.club/api/verification/email/send', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify({ email })
      });

      if (!response.ok) {
        throw new Error(t('profile.errors.verificationFailed'));
      }

      setTimeLeft(300); // 5 minutes
      return true;
    } catch (err) {
      setError(err instanceof Error ? err.message : t('profile.errors.verificationFailed'));
      return false;
    }
  };

  const verifyCode = async (email: string, code: string) => {
    try {
      const response = await fetch('https://www.waladom.club/api/verification/email/verify', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify({ email, code })
      });

      if (!response.ok) {
        throw new Error(t('profile.validation.codeInvalid'));
      }

      const data = await response.json();
      
      if (!data.verified) {
        throw new Error(t('profile.validation.codeInvalid'));
      }

      return true;
    } catch (err) {
      setError(err instanceof Error ? err.message : t('profile.errors.verificationFailed'));
      return false;
    }
  };

  return {
    sendVerificationCode,
    verifyCode,
    error,
    setError,
    timeLeft,
    setTimeLeft
  };
};