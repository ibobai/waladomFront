import React from 'react';

interface LogoProps {
  className?: string;
}

const Logo: React.FC<LogoProps> = ({ className = "h-8 w-8" }) => {
  return (
    <img 
      src="https://waladom.s3.amazonaws.com/media/report/proofs/9ad1febRO/report1-9ad1febRO.png" 
      alt="Waladom Logo" 
      className={className} 
    />
  );
};

export default Logo;
