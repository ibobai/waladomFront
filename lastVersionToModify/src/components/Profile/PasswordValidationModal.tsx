import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { X, Eye, EyeOff, Loader2, AlertCircle } from 'lucide-react';
import { cn } from '../../utils/cn';

interface PasswordValidationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (password: string) => void;
  loading?: boolean;
  error?: string;
}

const PasswordValidationModal: React.FC<PasswordValidationModalProps> = ({
  isOpen,
  onClose,
  onConfirm,
  loading,
  error
}) => {
  const { t } = useTranslation();
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  // Reset password when modal closes
  useEffect(() => {
    if (!isOpen) {
      setPassword('');
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onConfirm(password);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-medium">{t('profile.validation.currentPassword')}</h3>
          <button
            onClick={() => {
              setPassword('');
              onClose();
            }}
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
            {t('profile.validation.enterPassword')}
          </p>

          <div className="relative mb-4">
            <input
              type={showPassword ? "text" : "password"}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg pr-10"
              required
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-2 top-1/2 -translate-y-1/2"
            >
              {showPassword ? (
                <EyeOff className="w-5 h-5 text-gray-400" />
              ) : (
                <Eye className="w-5 h-5 text-gray-400" />
              )}
            </button>
          </div>

          <div className="flex justify-end space-x-3">
            <button
              type="button"
              onClick={() => {
                setPassword('');
                onClose();
              }}
              className="px-4 py-2 border border-gray-300 rounded-lg"
              disabled={loading}
            >
              {t('profile.buttons.cancel')}
            </button>
            <button
              type="submit"
              disabled={loading || !password}
              className={cn(
                "px-4 py-2 bg-waladom-green text-white rounded-lg",
                "hover:bg-waladom-green-dark disabled:opacity-50",
                "flex items-center"
              )}
            >
              {loading && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
              {t('common.confirm')}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default PasswordValidationModal;