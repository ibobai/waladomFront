import React from 'react';
import { useTranslation } from 'react-i18next';
import { Wallet, UserCircle2, CreditCard, LayoutDashboard } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { cn } from '../../utils/cn';

interface NavLinksProps {
  mobile?: boolean;
}

const NavLinks: React.FC<NavLinksProps> = ({ mobile }) => {
  const { t } = useTranslation();
  const location = useLocation();
  const { isAuthenticated, user } = useAuth();
  const isInDashboard = location.pathname.includes('/dashboard');
  
  // Public links that are always shown
  const publicLinks = [
    { href: '/', label: t('nav.home') },
    { href: '/about', label: t('nav.about') },
    { href: '/events', label: t('nav.events') },
    { href: '/reports', label: t('nav.reports') },
    { href: '/contact', label: t('nav.contact') },
    { 
      href: '/donate', 
      label: t('nav.donate'),
      icon: <Wallet className="w-4 h-4" />,
      highlight: true 
    }
  ];

  // Links shown only when authenticated
  const authLinks = isAuthenticated ? [
    { 
      href: '/my-role', 
      label: t('nav.myRole'),
      icon: <UserCircle2 className="w-4 h-4" />
    },
    {
      href: '/id-card',
      label: t('nav.idCard'),
      icon: <CreditCard className="w-4 h-4" />
    }
  ] : [];

  // Dashboard link based on role
  const getDashboardLink = () => {
    if (!user || !isInDashboard) return null;
    
    const dashboardPaths = {
      'A': '/admin/dashboard',
      'X': '/content/dashboard',
      'Y': '/moderator/dashboard',
      'Z': '/reviewer/dashboard'
    };

    const path = dashboardPaths[user.role as keyof typeof dashboardPaths];
    return path ? {
      href: path,
      label: t('nav.dashboard'),
      icon: <LayoutDashboard className="w-4 h-4" />
    } : null;
  };

  const dashboardLink = getDashboardLink();
  const allLinks = [
    ...publicLinks,
    ...authLinks,
    ...(dashboardLink ? [dashboardLink] : [])
  ];

  if (mobile) {
    return (
      <div className="flex flex-col space-y-2">
        {allLinks.map((link) => (
          <Link
            key={link.href}
            to={link.href}
            className={cn(
              "px-3 py-2 text-gray-800 hover:text-waladom-green flex items-center gap-2",
              link.highlight && "bg-waladom-green text-white rounded-lg hover:bg-waladom-green-dark hover:text-white",
              location.pathname === link.href && "text-waladom-green"
            )}
          >
            {link.icon}
            {link.label}
          </Link>
        ))}
      </div>
    );
  }

  return (
    <div className="hidden lg:flex items-center space-x-1 xl:space-x-4">
      {allLinks.map((link) => (
        <Link
          key={link.href}
          to={link.href}
          className={cn(
            "px-3 py-2 text-sm text-gray-800 hover:text-waladom-green whitespace-nowrap flex items-center gap-2",
            link.highlight && "bg-waladom-green text-white rounded-full hover:bg-waladom-green-dark hover:text-white",
            location.pathname === link.href && "text-waladom-green"
          )}
        >
          {link.icon}
          {link.label}
        </Link>
      ))}
    </div>
  );
};

export default NavLinks;