import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { Mail, Phone, AlertCircle, Eye, EyeOff, Loader2 } from 'lucide-react';
import MainLayout from '../layouts/MainLayout';
import { cn } from '../utils/cn';

type ConnectionMethod = 'email' | 'phone';
type ResetStep = 'identifier' | 'verification' | 'newPassword';

const ResetPasswordPage: React.FC = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [step, setStep] = useState<ResetStep>('identifier');
  const [connectionMethod, setConnectionMethod] = useState<ConnectionMethod>('email');
  const [identifier, setIdentifier] = useState('');
  const [verificationCode, setVerificationCode] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [timeLeft, setTimeLeft] = useState(0);
  const [userId, setUserId] = useState('');

  // Password strength check
  const checkPasswordStrength = (password: string) => {
    let strength = 0;
    if (password.length >= 8) strength++;
    if (/[A-Z]/.test(password)) strength++;
    if (/[a-z]/.test(password)) strength++;
    if (/[0-9]/.test(password)) strength++;
    if (/[^A-Za-z0-9]/.test(password)) strength++;
    return strength;
  };

  const getStrengthColor = (password: string) => {
    const strength = checkPasswordStrength(password);
    if (strength <= 2) return "bg-red-500";
    if (strength <= 3) return "bg-yellow-500";
    return "bg-green-500";
  };

  const isPasswordStrong = (password: string) => checkPasswordStrength(password) >= 4;

  React.useEffect(() => {
    let timer: NodeJS.Timeout;
    if (timeLeft > 0) {
      timer = setInterval(() => {
        setTimeLeft(prev => prev - 1);
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [timeLeft]);

  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  const handleSendCode = async () => {
    setError('');
    setLoading(true);

    try {
      const response = await fetch('https://www.waladom.club/api/user/password/reset', {
        method: 'GET',
        headers: {
          'Accept': 'application/json',
          'identifier': identifier,
          'Connection-Method': connectionMethod
        }
      });

      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.message || 'Failed to send verification code');
      }

      if (!data.send) {
        throw new Error(data.message || 'Failed to send verification code');
      }

      setTimeLeft(300); // 5 minutes
      setStep('verification');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to send verification code');
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyCode = async () => {
    setError('');
    setLoading(true);

    try {
      const response = await fetch('https://www.waladom.club/api/user/password/validate', {
        method: 'GET',
        headers: {
          'Accept': 'application/json',
          'identifier': identifier,
          'Connection-Method': connectionMethod,
          'code': verificationCode
        }
      });

      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.message || 'Invalid verification code');
      }

      if (!data.verified) {
        throw new Error('Code verification failed');
      }

      setUserId(data.userId);
      setStep('newPassword');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to verify code');
    } finally {
      setLoading(false);
    }
  };

  const handleUpdatePassword = async () => {
    if (!isPasswordStrong(newPassword)) {
      setError('Password is not strong enough');
      return;
    }

    if (newPassword !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    setError('');
    setLoading(true);

    try {
      const response = await fetch(`https://www.waladom.club/api/user/update/${userId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify({ password: newPassword })
      });

      if (!response.ok) {
        throw new Error('Failed to update password');
      }

      // Success - redirect to login
      navigate('/login');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update password');
    } finally {
      setLoading(false);
    }
  };

  return (
    <MainLayout>
      <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
        <div className="sm:mx-auto sm:w-full sm:max-w-md">
          <h2 className="text-center text-3xl font-bold text-gray-900">
            {t('auth.resetPassword')}
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            {t('auth.resetInstructions')}
          </p>
        </div>

        <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
          <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
            {error && (
              <div className="mb-4 p-4 bg-red-50 border border-red-200 text-red-600 rounded-md flex items-center gap-2">
                <AlertCircle className="w-5 h-5" />
                <span>{error}</span>
              </div>
            )}

            {step === 'identifier' && (
              <>
                <div className="flex gap-4 mb-6">
                  <button
                    type="button"
                    onClick={() => setConnectionMethod('email')}
                    className={cn(
                      "flex-1 p-4 rounded-lg border-2 flex flex-col items-center gap-2 transition-colors",
                      connectionMethod === 'email'
                        ? "border-waladom-green bg-waladom-green/5"
                        : "border-gray-200 hover:border-gray-300"
                    )}
                  >
                    <Mail className={cn(
                      "w-6 h-6",
                      connectionMethod === 'email' ? "text-waladom-green" : "text-gray-400"
                    )} />
                    <span>{t('registration.connectionMethod.email')}</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setConnectionMethod('phone')}
                    className={cn(
                      "flex-1 p-4 rounded-lg border-2 flex flex-col items-center gap-2 transition-colors",
                      connectionMethod === 'phone'
                        ? "border-waladom-green bg-waladom-green/5"
                        : "border-gray-200 hover:border-gray-300"
                    )}
                  >
                    <Phone className={cn(
                      "w-6 h-6",
                      connectionMethod === 'phone' ? "text-waladom-green" : "text-gray-400"
                    )} />
                    <span>{t('registration.connectionMethod.phone')}</span>
                  </button>
                </div>

                <div className="space-y-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      {connectionMethod === 'email' ? t('auth.email') : t('auth.phone')}
                    </label>
                    <input
                      type={connectionMethod === 'email' ? 'email' : 'tel'}
                      value={identifier}
                      onChange={(e) => setIdentifier(e.target.value)}
                      className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-waladom-green focus:border-waladom-green"
                      required
                    />
                  </div>

                  <button
                    onClick={handleSendCode}
                    disabled={loading || !identifier}
                    className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-waladom-green hover:bg-waladom-green-dark focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-waladom-green disabled:opacity-50"
                  >
                    {loading ? (
                      <Loader2 className="w-5 h-5 animate-spin" />
                    ) : (
                      t('common.sendCode')
                    )}
                  </button>
                </div>
              </>
            )}

            {step === 'verification' && (
              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    {t('registration.enterCode')}
                  </label>
                  <input
                    type="text"
                    value={verificationCode}
                    onChange={(e) => setVerificationCode(e.target.value.replace(/\D/g, ''))}
                    maxLength={6}
                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-waladom-green focus:border-waladom-green text-center text-2xl tracking-wider"
                    required
                  />
                  {timeLeft > 0 && (
                    <p className="mt-2 text-sm text-gray-500 text-center">
                      {t('registration.timeRemaining')}: {formatTime(timeLeft)}
                    </p>
                  )}
                </div>

                <button
                  onClick={handleVerifyCode}
                  disabled={loading || verificationCode.length !== 6}
                  className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-waladom-green hover:bg-waladom-green-dark focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-waladom-green disabled:opacity-50"
                >
                  {loading ? (
                    <Loader2 className="w-5 h-5 animate-spin" />
                  ) : (
                    t('common.verify')
                  )}
                </button>
              </div>
            )}

            {step === 'newPassword' && (
              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    {t('auth.newPassword')}
                  </label>
                  <div className="mt-1 relative">
                    <input
                      type={showPassword ? "text" : "password"}
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-waladom-green focus:border-waladom-green"
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute inset-y-0 right-0 pr-3 flex items-center"
                    >
                      {showPassword ? (
                        <EyeOff className="h-5 w-5 text-gray-400" />
                      ) : (
                        <Eye className="h-5 w-5 text-gray-400" />
                      )}
                    </button>
                  </div>
                  <div className="mt-2">
                    <div className="h-2 bg-gray-200 rounded-full">
                      <div
                        className={`h-full rounded-full transition-all ${getStrengthColor(newPassword)}`}
                        style={{ width: `${(checkPasswordStrength(newPassword) / 5) * 100}%` }}
                      />
                    </div>
                    <p className="mt-1 text-sm text-gray-500">
                      {t('registration.passwordRequirements')}
                    </p>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    {t('auth.confirmNewPassword')}
                  </label>
                  <div className="mt-1 relative">
                    <input
                      type={showConfirmPassword ? "text" : "password"}
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-waladom-green focus:border-waladom-green"
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      className="absolute inset-y-0 right-0 pr-3 flex items-center"
                    >
                      {showConfirmPassword ? (
                        <EyeOff className="h-5 w-5 text-gray-400" />
                      ) : (
                        <Eye className="h-5 w-5 text-gray-400" />
                      )}
                    </button>
                  </div>
                </div>

                <button
                  onClick={handleUpdatePassword}
                  disabled={loading || !isPasswordStrong(newPassword) || newPassword !== confirmPassword}
                  className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-waladom-green hover:bg-waladom-green-dark focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-waladom-green disabled:opacity-50"
                >
                  {loading ? (
                    <Loader2 className="w-5 h-5 animate-spin" />
                  ) : (
                    t('auth.updatePassword')
                  )}
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </MainLayout>
  );
};

export default ResetPasswordPage;