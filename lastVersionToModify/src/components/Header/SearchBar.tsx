import React, { useState } from 'react';
import { Search } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { cn } from '../../utils/cn';

const SearchBar: React.FC = () => {
  const { t } = useTranslation();
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <div className="relative">
      <div className={cn(
        "flex items-center transition-all duration-300",
        isExpanded ? "w-64" : "w-10"
      )}>
        <div className="relative flex-1">
          <input
            type="text"
            placeholder={t('nav.search')}
            className={cn(
              "w-full bg-gray-100 rounded-full pl-10 pr-4 py-2 focus:outline-none focus:ring-2 focus:ring-waladom-green",
              !isExpanded && "opacity-0"
            )}
            onFocus={() => setIsExpanded(true)}
            onBlur={(e) => {
              if (!e.target.value) {
                setIsExpanded(false);
              }
            }}
          />
          <button 
            className="absolute left-3 top-1/2 -translate-y-1/2"
            onClick={() => setIsExpanded(!isExpanded)}
          >
            <Search className="w-5 h-5 text-gray-500" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default SearchBar;