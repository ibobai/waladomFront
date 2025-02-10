import React, { useState, useEffect } from 'react';
import { AlertCircle } from 'lucide-react';
import { useTranslation } from 'react-i18next';

interface Step2Props {
  contactType: 'email' | 'phone';
  contact: string;
  handleNext: () => void;
  handleBack: () => void;
}

const Step2: React.FC<Step2Props> = ({ contactType, contact, handleNext, handleBack }) => {
  const { t } = useTranslation();
  const [error, setError] = useState('');
  const [verificationCode, setVerificationCode] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [timeLeft, setTimeLeft] = useState(300); // 5 minutes in seconds
  const [canResend, setCanResend] = useState(false);

  useEffect(() => {
    if (timeLeft > 0) {
      const timer = setInterval(() => {
        setTimeLeft(prev => prev - 1);
      }, 1000);
      return () => clearInterval(timer);
    } else {
      setCanResend(true);
    }
  }, [timeLeft]);

  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  const verifyCode = async () => {
    try {
      const response = await fetch('https://www.waladom.club/api/verification/email/verify', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify({
          email: contact,
          code: verificationCode
        })
      });

      const data = await response.json();
      return data.verified;
    } catch (error) {
      console.error('Error verifying code:', error);
      throw new Error(t('registration.verificationError'));
    }
  };

  const handleResendCode = async () => {
    if (!canResend) return;
    
    setIsLoading(true);
    try {
      const response = await fetch('https://www.waladom.club/api/verification/email/send', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify({ email: contact })
      });

      const data = await response.json();
      if (data.send) {
        setTimeLeft(300);
        setCanResend(false);
        setError('');
      } else {
        throw new Error(t('registration.resendCodeError'));
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : t('registration.generalError'));
    } finally {
      setIsLoading(false);
    }
  };

  const handleVerifyCode = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      const isVerified = await verifyCode();
      if (isVerified) {
        handleNext();
      } else {
        setError(t('registration.invalidCode'));
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : t('registration.generalError'));
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto w-full">
      <form onSubmit={handleVerifyCode} className="bg-white p-6 rounded-lg shadow-md">
        {error && (
          <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-600 rounded-md flex items-center gap-2">
            <AlertCircle className="w-5 h-5" />
            <span>{error}</span>
          </div>
        )}

        <div className="mb-6">
          <p className="text-sm text-gray-600 mb-4">
            {t('registration.verificationSent', { contact })}
          </p>

          <label className="block text-sm font-medium text-gray-700 mb-2">
            {t('registration.enterCode')}
          </label>
          <input
            type="text"
            value={verificationCode}
            onChange={(e) => setVerificationCode(e.target.value.replace(/\D/g, ''))}
            maxLength={6}
            className="block w-full px-4 py-3 rounded-lg border border-gray-300 shadow-sm focus:ring-2 focus:ring-waladom-green focus:border-transparent text-center text-2xl tracking-widest"
            placeholder="123456"
            required
          />

          <div className="mt-4 text-center text-sm">
            <p className="text-gray-600 mb-2">
              {t('registration.timeRemaining')}: {formatTime(timeLeft)}
            </p>
            <button
              type="button"
              onClick={handleResendCode}
              disabled={!canResend || isLoading}
              className="text-waladom-green hover:text-waladom-green-dark disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {t('registration.resendCode')}
            </button>
          </div>
        </div>

        <div className="flex gap-3">
          <button
            type="button"
            onClick={handleBack}
            className="flex-1 px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
          >
            {t('common.back')}
          </button>
          <button
            type="submit"
            disabled={isLoading || verificationCode.length !== 6}
            className="flex-1 px-4 py-2 bg-waladom-green text-white rounded-lg hover:bg-waladom-green-dark disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading ? t('common.verifying') : t('common.verify')}
          </button>
        </div>
      </form>
    </div>
  );
};

export default Step2;