import React from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Menu, X } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import LanguageSelector from '../LanguageSelector';
import SearchBar from './SearchBar';
import NavLinks from './NavLinks';
import ProfileMenu from './ProfileMenu';
import Logo from '../Logo';
import { cn } from '../../utils/cn';

const Navbar: React.FC = () => {
  const { t } = useTranslation();
  const [isMenuOpen, setIsMenuOpen] = React.useState(false);
  const { isAuthenticated } = useAuth();

  return (
    <nav className="bg-white shadow-md">
      <div className="max-w-[1920px] mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          {/* Logo and brand name - extreme left */}
          <div className="flex items-center">
            <Link to="/" className="flex items-center space-x-2">
              <Logo className="h-8 w-8" />
              <span className="text-xl font-bold text-waladom-green">Waladom</span>
            </Link>
          </div>

          {/* Navigation Links - centered */}
          <div className="hidden lg:flex lg:items-center lg:justify-center lg:flex-1 lg:px-8">
            <div className="flex space-x-8">
              <NavLinks />
            </div>
          </div>

          {/* Right side items */}
          <div className="hidden lg:flex lg:items-center lg:space-x-6">
            <SearchBar />
            <LanguageSelector />
            <div className="ml-4">
              <ProfileMenu />
            </div>
          </div>

          {/* Mobile menu button and items */}
          <div className="lg:hidden flex items-center space-x-4">
            <LanguageSelector />
            <ProfileMenu />
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="inline-flex items-center justify-center p-2 rounded-md text-gray-700 hover:text-waladom-green focus:outline-none"
            >
              {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      <div className={cn("lg:hidden", isMenuOpen ? "block" : "hidden")}>
        <div className="px-2 pt-2 pb-3 space-y-1">
          <NavLinks mobile />
          <div className="px-3 py-2">
            <SearchBar />
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;