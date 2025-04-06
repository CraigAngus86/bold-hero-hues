
import React from 'react';

const FixturesLoading: React.FC = () => {
  return (
    <div className="h-96 flex items-center justify-center">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-team-lightBlue"></div>
      <p className="ml-4 text-white text-lg">Loading matches data...</p>
    </div>
  );
};

export default FixturesLoading;
