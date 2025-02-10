import React, { useState } from 'react';
import { AlertCircle, Mail, Phone } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { cn } from '../../utils/cn';

interface Step1Props {
  handleNext: (contactType: 'email' | 'phone', contact: string) => void;
}

const Step1: React.FC<Step1Props> = ({ handleNext }) => {
  const { t } = useTranslation();
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [registrationType] = useState<'email' | 'phone'>('email');
  const [email, setEmail] = useState('');

  const validateEmail = async (email: string) => {
    try {
      const response = await fetch('https://www.waladom.club/api/user/email/validate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify({ email })
      });

      const data = await response.json();
      return data.valid;
    } catch (error) {
      console.error('Error validating email:', error);
      throw new Error(t('registration.emailValidationError'));
    }
  };

  const sendVerificationEmail = async (email: string) => {
    try {
      const response = await fetch('https://www.waladom.club/api/verification/email/send', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify({ email })
      });

      const data = await response.json();
      return data.send;
    } catch (error) {
      console.error('Error sending verification email:', error);
      throw new Error(t('registration.verificationEmailError'));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      // Validate email
      const isValid = await validateEmail(email);
      if (!isValid) {
        setError(t('registration.invalidEmail'));
        return;
      }

      // Send verification email
      const isSent = await sendVerificationEmail(email);
      if (!isSent) {
        setError(t('registration.verificationEmailFailed'));
        return;
      }

      // Proceed to next step
      handleNext('email', email);
    } catch (err) {
      setError(err instanceof Error ? err.message : t('registration.generalError'));
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto w-full">
      <form onSubmit={handleSubmit} className="bg-white p-6 rounded-lg shadow-md">
        <div className="text-center mb-6">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            {t('registration.createAccount')}
          </h2>
          <p className="text-gray-600">
            {t('registration.stepOneDescription')}
          </p>
        </div>

        {error && (
          <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-600 rounded-md flex items-center gap-2">
            <AlertCircle className="w-5 h-5" />
            <span>{error}</span>
          </div>
        )}

        <div className="text-center mb-4 bg-yellow-50 border border-yellow-200 text-yellow-700 p-3 rounded-lg">
          {t('registration.phoneRegistrationSoon')}
        </div>

        <div className="flex gap-4 mb-6">
          <button
            type="button"
            className={cn(
              "flex-1 p-4 rounded-lg border-2 flex flex-col items-center gap-2 transition-colors",
              "border-waladom-green bg-waladom-green/5"
            )}
          >
            <Mail className="w-8 h-8 text-waladom-green" />
            <span className="font-medium">{t('registration.email')}</span>
          </button>

          <button
            type="button"
            className="flex-1 p-4 rounded-lg border-2 border-gray-200 flex flex-col items-center gap-2 opacity-50 cursor-not-allowed"
          >
            <Phone className="w-8 h-8 text-gray-400" />
            <span className="font-medium">{t('registration.phone')}</span>
            <span className="text-xs text-gray-500">{t('common.comingSoon')}</span>
          </button>
        </div>

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              {t('registration.emailAddress')}
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="block w-full px-4 py-3 rounded-lg border border-gray-300 shadow-sm focus:ring-2 focus:ring-waladom-green focus:border-transparent"
              placeholder={t('registration.emailPlaceholder')}
              required
            />
          </div>

          <button
            type="submit"
            disabled={isLoading || !email}
            className="w-full px-4 py-3 bg-waladom-green text-white rounded-lg hover:bg-waladom-green-dark transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
          >
            {isLoading ? (
              <>
                <span className="animate-spin mr-2">⌛</span>
                {t('common.loading')}
              </>
            ) : (
              t('common.continue')
            )}
          </button>
        </div>
      </form>
    </div>
  );
};

export default Step1;