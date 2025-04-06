
import React from 'react';

const FixturesLoading: React.FC = () => {
  return (
    <div className="grid grid-cols-12 gap-6">
      <div className="col-span-12 lg:col-span-6 flex items-center justify-center h-64 bg-white rounded-lg shadow-sm animate-pulse">
        <p className="text-gray-400">Loading next match...</p>
      </div>
      <div className="col-span-12 lg:col-span-6 flex items-center justify-center h-64 bg-white rounded-lg shadow-sm animate-pulse">
        <p className="text-gray-400">Loading fixtures and results...</p>
      </div>
    </div>
  );
};

export default FixturesLoading;
