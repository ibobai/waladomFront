import React from 'react';
import { useTranslation } from 'react-i18next';
import { Settings, Globe, Bell, Shield, Moon } from 'lucide-react';
import MainLayout from '../layouts/MainLayout';

const SettingsPage: React.FC = () => {
  const { t, i18n } = useTranslation();

  const languages = [
    { code: 'en', name: 'English' },
    { code: 'ar', name: 'العربية' },
    { code: 'fr', name: 'Français' }
  ];

  const handleLanguageChange = (code: string) => {
    i18n.changeLanguage(code);
  };

  return (
    <MainLayout>
      <div className="min-h-screen bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="bg-white shadow rounded-lg">
            <div className="px-4 py-5 sm:px-6 border-b border-gray-200">
              <h3 className="text-lg leading-6 font-medium text-gray-900 flex items-center gap-2">
                <Settings className="w-5 h-5 text-waladom-green" />
                {t('settings.title')}
              </h3>
            </div>

            <div className="divide-y divide-gray-200">
              {/* Language Settings */}
              <div className="px-4 py-5 sm:p-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Globe className="w-5 h-5 text-waladom-green" />
                    <h4 className="text-base font-medium text-gray-900">{t('settings.language')}</h4>
                  </div>
                  <select
                    value={i18n.language}
                    onChange={(e) => handleLanguageChange(e.target.value)}
                    className="mt-1 block w-48 pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-waladom-green focus:border-waladom-green sm:text-sm rounded-md"
                  >
                    {languages.map((lang) => (
                      <option key={lang.code} value={lang.code}>
                        {lang.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Notifications Settings */}
              <div className="px-4 py-5 sm:p-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Bell className="w-5 h-5 text-waladom-green" />
                    <h4 className="text-base font-medium text-gray-900">{t('settings.notifications')}</h4>
                  </div>
                  <label className="flex items-center cursor-pointer">
                    <div className="relative">
                      <input type="checkbox" className="sr-only" />
                      <div className="w-10 h-6 bg-gray-200 rounded-full shadow-inner"></div>
                      <div className="dot absolute w-4 h-4 bg-white rounded-full shadow -left-1 -top-1 transition"></div>
                    </div>
                  </label>
                </div>
              </div>

              {/* Theme Settings */}
              <div className="px-4 py-5 sm:p-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Moon className="w-5 h-5 text-waladom-green" />
                    <h4 className="text-base font-medium text-gray-900">{t('settings.theme')}</h4>
                  </div>
                  <select
                    className="mt-1 block w-48 pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-waladom-green focus:border-waladom-green sm:text-sm rounded-md"
                  >
                    <option value="light">{t('settings.lightTheme')}</option>
                    <option value="dark">{t('settings.darkTheme')}</option>
                    <option value="system">{t('settings.systemTheme')}</option>
                  </select>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </MainLayout>
  );
};

export default SettingsPage;