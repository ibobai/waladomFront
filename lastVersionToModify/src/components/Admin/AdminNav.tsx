import React, { useState } from 'react';
import { Users, AlertCircle, Calendar, MessageSquare, Search, Menu, X } from 'lucide-react';
import { cn } from '../../utils/cn';
import { useAuth } from '../../contexts/AuthContext';
import { useTranslation } from 'react-i18next';

type TabType = 'users' | 'requests' | 'claims' | 'events' | 'verification';

interface AdminNavProps {
  activeTab: TabType;
  onTabChange: (tab: TabType) => void;
}

const AdminNav: React.FC<AdminNavProps> = ({ activeTab, onTabChange }) => {
  const { t } = useTranslation();
  const { user } = useAuth();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const getTabs = () => {
    // Base tabs for reviewer
    const baseTabs = [
      { id: 'requests', label: t('adminNav.registrationRequests'), icon: AlertCircle },
      { id: 'claims', label: t('adminNav.claims'), icon: MessageSquare },
      //{ id: 'events', label: t('adminNav.events'), icon: Calendar },
      { id: 'verification', label: t('adminNav.userVerification'), icon: Search }
    ];

    // Add Users Management for Admin and Content Manager
    if (user?.role === 'A' || user?.role === 'X') {
      return [
        { id: 'users', label: t('adminNav.usersManagement'), icon: Users },
        ...baseTabs
      ];
    }

    return baseTabs;
  };

  const tabs = getTabs();

  const handleTabClick = (tabId: TabType) => {
    onTabChange(tabId);
    setIsMobileMenuOpen(false);
  };

  return (
    <nav className="bg-white shadow">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Mobile menu button */}
        <div className="flex items-center justify-between lg:hidden h-16">
          <h1 className="text-lg font-medium text-gray-900">{t('adminNav.title')}</h1>
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100"
          >
            {isMobileMenuOpen ? (
              <X className="block h-6 w-6" />
            ) : (
              <Menu className="block h-6 w-6" />
            )}
          </button>
        </div>

        {/* Mobile menu */}
        <div className={cn(
          "lg:hidden",
          isMobileMenuOpen ? "block" : "hidden"
        )}>
          <div className="pt-2 pb-3 space-y-1">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => handleTabClick(tab.id as TabType)}
                  className={cn(
                    "w-full flex items-center px-3 py-2 text-base font-medium rounded-md",
                    activeTab === tab.id
                      ? "bg-waladom-green text-white"
                      : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                  )}
                >
                  <Icon className="w-5 h-5 mr-3" />
                  {tab.label}
                </button>
              );
            })}
          </div>
        </div>

        {/* Desktop menu */}
        <div className="hidden lg:flex lg:space-x-8">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => onTabChange(tab.id as TabType)}
                className={cn(
                  "flex items-center px-3 py-4 text-sm font-medium border-b-2 transition-colors",
                  activeTab === tab.id
                    ? "border-waladom-green text-waladom-green"
                    : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                )}
              >
                <Icon className="w-5 h-5 mr-2" />
                {tab.label}
              </button>
            );
          })}
        </div>
      </div>
    </nav>
  );
};

export default AdminNav;