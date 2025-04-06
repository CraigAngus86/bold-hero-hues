
import React from 'react';

interface FixturesLoadingProps {
  message?: string;
  className?: string;
}

const FixturesLoading: React.FC<FixturesLoadingProps> = ({ 
  message = "Loading matches data...",
  className = "h-96"
}) => {
  return (
    <div className={`${className} flex items-center justify-center`}>
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-team-lightBlue"></div>
      <p className="ml-4 text-white text-lg">{message}</p>
    </div>
  );
};

export default FixturesLoading;
