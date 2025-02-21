import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { X, Eye, EyeOff, AlertCircle, Check } from 'lucide-react';
import { cn } from '../../utils/cn';

interface NewPasswordModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (newPassword: string, confirmPassword: string) => void;
  loading?: boolean;
  error?: string;
}

const NewPasswordModal: React.FC<NewPasswordModalProps> = ({
  isOpen,
  onClose,
  onConfirm,
  loading,
  error
}) => {
  const { t } = useTranslation();
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [passwordStrength, setPasswordStrength] = useState(0);
  const [requirements, setRequirements] = useState({
    length: false,
    uppercase: false,
    lowercase: false,
    number: false,
    special: false
  });

  useEffect(() => {
    if (!isOpen) {
      setNewPassword('');
      setConfirmPassword('');
      setPasswordStrength(0);
      setRequirements({
        length: false,
        uppercase: false,
        lowercase: false,
        number: false,
        special: false
      });
    }
  }, [isOpen]);

  const checkPasswordStrength = (password: string) => {
    const newRequirements = {
      length: password.length >= 8,
      uppercase: /[A-Z]/.test(password),
      lowercase: /[a-z]/.test(password),
      number: /[0-9]/.test(password),
      special: /[^A-Za-z0-9]/.test(password)
    };

    setRequirements(newRequirements);

    const strength = Object.values(newRequirements).filter(Boolean).length;
    setPasswordStrength(strength);
    return strength;
  };

  const getStrengthColor = () => {
    if (passwordStrength <= 2) return "bg-red-500";
    if (passwordStrength <= 3) return "bg-yellow-500";
    return "bg-green-500";
  };

  const getStrengthText = () => {
    if (passwordStrength <= 2) return t('auth.passwordStrength.weak');
    if (passwordStrength <= 3) return t('auth.passwordStrength.medium');
    return t('auth.passwordStrength.strong');
  };

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;
    setNewPassword(newValue);
    checkPasswordStrength(newValue);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (passwordStrength < 4) {
      return; // Don't submit if password isn't strong enough
    }
    onConfirm(newPassword, confirmPassword);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-medium">{t('newPassword.title')}</h3>
          <button
            onClick={() => {
              setNewPassword('');
              setConfirmPassword('');
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
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                {t('newPassword.title')}
              </label>
              <div className="relative">
                <input
                  type={showNewPassword ? "text" : "password"}
                  value={newPassword}
                  onChange={handlePasswordChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg pr-10"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowNewPassword(!showNewPassword)}
                  className="absolute right-2 top-1/2 -translate-y-1/2"
                >
                  {showNewPassword ? (
                    <EyeOff className="w-5 h-5 text-gray-400" />
                  ) : (
                    <Eye className="w-5 h-5 text-gray-400" />
                  )}
                </button>
              </div>
  
              {/* Password Strength Indicator */}
              {newPassword && (
                <div className="mt-2">
                  <div className="flex justify-between items-center mb-1">
                    <span className="text-sm text-gray-500">{t('newPassword.passwordStrength')}:</span>
                    <span className={cn(
                      "text-sm font-medium",
                      passwordStrength <= 2 ? "text-red-500" : 
                      passwordStrength <= 3 ? "text-yellow-500" : 
                      "text-green-500"
                    )}>
                      {getStrengthText()}
                    </span>
                  </div>
                  <div className="h-2 bg-gray-200 rounded-full">
                    <div
                      className={`h-full rounded-full transition-all ${getStrengthColor()}`}
                      style={{ width: `${(passwordStrength / 5) * 100}%` }}
                    />
                  </div>
  
                  {/* Password Requirements */}
                  <div className="mt-3 space-y-2">
                    <p className="text-sm text-gray-500 font-medium">{t('newPassword.passwordMustHave')}:</p>
                    <ul className="space-y-1">
                      <li className="text-sm flex items-center">
                        <Check className={cn(
                          "w-4 h-4 mr-2",
                          requirements.length ? "text-green-500" : "text-gray-300"
                        )} />
                        {t('newPassword.atLeast8Characters')}
                      </li>
                      <li className="text-sm flex items-center">
                        <Check className={cn(
                          "w-4 h-4 mr-2",
                          requirements.uppercase ? "text-green-500" : "text-gray-300"
                        )} />
                        {t('newPassword.oneUppercaseLetter')}
                      </li>
                      <li className="text-sm flex items-center">
                        <Check className={cn(
                          "w-4 h-4 mr-2",
                          requirements.lowercase ? "text-green-500" : "text-gray-300"
                        )} />
                        {t('newPassword.oneLowercaseLetter')}
                      </li>
                      <li className="text-sm flex items-center">
                        <Check className={cn(
                          "w-4 h-4 mr-2",
                          requirements.number ? "text-green-500" : "text-gray-300"
                        )} />
                        {t('newPassword.oneNumber')}
                      </li>
                      <li className="text-sm flex items-center">
                        <Check className={cn(
                          "w-4 h-4 mr-2",
                          requirements.special ? "text-green-500" : "text-gray-300"
                        )} />
                        {t('newPassword.oneSpecialCharacter')}
                      </li>
                    </ul>
                  </div>
                </div>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                {t('profile.validation.confirmPassword')}
              </label>
              <div className="relative">
                <input
                  type={showConfirmPassword ? "text" : "password"}
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg pr-10"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-2 top-1/2 -translate-y-1/2"
                >
                  {showConfirmPassword ? (
                    <EyeOff className="w-5 h-5 text-gray-400" />
                  ) : (
                    <Eye className="w-5 h-5 text-gray-400" />
                  )}
                </button>
              </div>
            </div>
          </div>

          <div className="flex justify-end space-x-3 mt-6">
            <button
              type="button"
              onClick={() => {
                setNewPassword('');
                setConfirmPassword('');
                onClose();
              }}
              className="px-4 py-2 border border-gray-300 rounded-lg"
              disabled={loading}
            >
              {t('profile.buttons.cancel')}
            </button>
            <button
              type="submit"
              disabled={loading || !newPassword || !confirmPassword || passwordStrength < 4}
              className={cn(
                "px-4 py-2 bg-waladom-green text-white rounded-lg",
                "hover:bg-waladom-green-dark disabled:opacity-50"
              )}
            >
              {t('profile.buttons.save')}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default NewPasswordModal;