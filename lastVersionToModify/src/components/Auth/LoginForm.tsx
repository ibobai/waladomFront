import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Link, useNavigate } from 'react-router-dom';
import { Mail, Lock, AlertCircle, Phone } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { cn } from '../../utils/cn';

const LoginForm: React.FC = () => {
  const { t } = useTranslation();
  const { login } = useAuth();
  const navigate = useNavigate();
  const [loginMethod, setLoginMethod] = useState<'email' | 'phone'>('email');
  const [emailOrPhone, setEmailOrPhone] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      await login(emailOrPhone, password);
      navigate('/'); // Changed from '/my-role' to '/'
    } catch (err) {
      setError(t('auth.invalidCredentials'));
    } finally {
      setIsLoading(false);
    }
  };

return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-md flex items-center gap-2">
          <AlertCircle className="w-5 h-5" />
          <span>{error}</span>
        </div>
      )}

      {/* Login Method Toggle */}
      <div className="flex gap-4 mb-6">
        <button
          type="button"
          onClick={() => setLoginMethod('email')}
          className={cn(
            "flex-1 p-4 rounded-lg border-2 flex flex-col items-center gap-2 transition-colors",
            loginMethod === 'email'
              ? "border-waladom-green bg-waladom-green/5"
              : "border-gray-200 hover:border-gray-300"
          )}
        >
          <Mail className={cn(
            "w-6 h-6",
            loginMethod === 'email' ? "text-waladom-green" : "text-gray-400"
          )} />
          <span>Email</span>
        </button>

        <button
          type="button"
          onClick={() => setLoginMethod('phone')}
          className={cn(
            "flex-1 p-4 rounded-lg border-2 flex flex-col items-center gap-2 transition-colors",
            loginMethod === 'phone'
              ? "border-waladom-green bg-waladom-green/5"
              : "border-gray-200 hover:border-gray-300"
          )}
        >
          <Phone className={cn(
            "w-6 h-6",
            loginMethod === 'phone' ? "text-waladom-green" : "text-gray-400"
          )} />
          <span>Phone</span>
        </button>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">
          {loginMethod === 'email' ? t('auth.email') : t('auth.phone')}
        </label>
        <div className="mt-1 relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            {loginMethod === 'email' ? (
              <Mail className="h-5 w-5 text-gray-400" />
            ) : (
              <Phone className="h-5 w-5 text-gray-400" />
            )}
          </div>
          <input
            type={loginMethod === 'email' ? 'email' : 'tel'}
            value={emailOrPhone}
            onChange={(e) => setEmailOrPhone(e.target.value)}
            className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md focus:ring-waladom-green focus:border-waladom-green"
            placeholder={loginMethod === 'email' ? 'example@email.com' : '+1234567890'}
            required
          />
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">
          {t('auth.password')}
        </label>
        <div className="mt-1 relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Lock className="h-5 w-5 text-gray-400" />
          </div>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md focus:ring-waladom-green focus:border-waladom-green"
            placeholder="password"
            required
          />
        </div>
      </div>

      <div className="flex items-center justify-between">
        <Link
          to="/forgot-password"
          className="text-sm text-waladom-green hover:text-waladom-green-dark"
        >
          {t('auth.forgotPassword')}
        </Link>
      </div>

      <button
        type="submit"
        disabled={isLoading}
        className={cn(
          "w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-waladom-green hover:bg-waladom-green-dark",
          "disabled:opacity-50 disabled:cursor-not-allowed"
        )}
      >
        {isLoading ? t('auth.loggingIn') : t('auth.login')}
      </button>

      <div className="text-sm text-center">
        <span className="text-gray-600">{t('auth.noAccount')} </span>
        <Link to="/register" className="text-waladom-green hover:text-waladom-green-dark font-medium">
          {t('auth.registerNow')}
        </Link>
      </div>
    </form>
  );
};

export default LoginForm;