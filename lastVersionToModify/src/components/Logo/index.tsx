import React from 'react';

interface LogoProps {
  className?: string;
}

const Logo: React.FC<LogoProps> = ({ className = "h-8 w-8" }) => {
  return (
    <svg 
      viewBox="0 0 400 400" 
      className={className}
      aria-label="Waladom Logo"
    >
      <path
        fill="currentColor"
        d="M200 50 C 150 100, 100 150, 100 200 C 100 250, 150 300, 200 300 C 250 300, 300 250, 300 200 C 300 150, 250 100, 200 50"
        className="text-waladom-green"
      />
      <circle cx="200" cy="200" r="20" fill="currentColor" className="text-black" />
      <circle cx="140" cy="140" r="15" fill="currentColor" className="text-waladom-green-light" />
      <circle cx="260" cy="140" r="15" fill="currentColor" className="text-waladom-green-light" />
      <circle cx="140" cy="260" r="15" fill="currentColor" className="text-waladom-green-light" />
      <circle cx="260" cy="260" r="15" fill="currentColor" className="text-waladom-green-light" />
    </svg>
  );
};

export default Logo;