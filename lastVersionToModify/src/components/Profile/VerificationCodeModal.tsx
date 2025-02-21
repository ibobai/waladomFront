import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { X, Loader2, AlertCircle } from 'lucide-react';
import { cn } from '../../utils/cn';

interface VerificationCodeModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (code: string) => void;
  onResend: () => void;
  loading?: boolean;
  error?: string;
  timeLeft: number;
  method: 'email' | 'phone';
}

const VerificationCodeModal: React.FC<VerificationCodeModalProps> = ({
  isOpen,
  onClose,
  onConfirm,
  onResend,
  loading,
  error,
  timeLeft,
  method
}) => {
  const { t } = useTranslation();
  const [code, setCode] = useState('');

  useEffect(() => {
    if (!isOpen) {
      setCode('');
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onConfirm(code);
  };

  const getMethodText = () => {
    return method === 'email' ? t('profile.fields.email') : t('profile.fields.phone');
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-medium">{t('profile.validation.verificationCode')}</h3>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-500"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {error && (
          <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-600 rounded-md flex items-center gap-2">
            <AlertCircle className="w-5 h-5" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <p className="text-sm text-gray-600 mb-4">
            {t('profile.validation.enterCode', { method: getMethodText() })}
          </p>

          <input
            type="text"
            value={code}
            onChange={(e) => setCode(e.target.value.replace(/\D/g, ''))}
            maxLength={6}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg text-center text-2xl tracking-wider mb-4"
            placeholder="123456"
            required
          />

          <div className="text-center mb-4">
            <p className="text-sm text-gray-600">
              {t('profile.validation.timeRemaining', { time: formatTime(timeLeft) })}
            </p>
            {timeLeft === 0 && (
              <button
                type="button"
                onClick={onResend}
                className="text-waladom-green hover:text-waladom-green-dark text-sm mt-2"
              >
                {t('profile.validation.resendCode')}
              </button>
            )}
          </div>

          <div className="flex justify-end space-x-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 border border-gray-300 rounded-lg"
              disabled={loading}
            >
              {t('profile.buttons.cancel')}
            </button>
            <button
              type="submit"
              disabled={loading || code.length !== 6}
              className={cn(
                "px-4 py-2 bg-waladom-green text-white rounded-lg",
                "hover:bg-waladom-green-dark disabled:opacity-50",
                "flex items-center"
              )}
            >
              {loading && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
              {t('common.verify')}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default VerificationCodeModal;