
import React from 'react';

const FixturesLoading: React.FC = () => {
  return (
    <div className="grid grid-cols-12 gap-6">
      <div className="col-span-12 lg:col-span-6">
        <div className="bg-white rounded-lg shadow h-72">
          <div className="h-10 bg-gray-100 rounded-t-lg animate-pulse" />
          <div className="p-4 space-y-4">
            <div className="h-4 bg-gray-200 rounded w-1/3 mx-auto animate-pulse" />
            <div className="h-6 bg-gray-200 rounded w-2/3 mx-auto animate-pulse" />
            
            <div className="flex justify-between items-center mt-4">
              <div className="h-6 bg-gray-200 rounded w-1/4 animate-pulse" />
              <div className="h-8 bg-gray-200 rounded w-16 animate-pulse" />
              <div className="h-6 bg-gray-200 rounded w-1/4 animate-pulse" />
            </div>
            
            <div className="flex justify-center gap-2 mt-4">
              <div className="h-16 bg-gray-200 rounded w-16 animate-pulse" />
              <div className="h-16 bg-gray-200 rounded w-16 animate-pulse" />
              <div className="h-16 bg-gray-200 rounded w-16 animate-pulse" />
            </div>
            
            <div className="h-10 bg-gray-200 rounded w-full mt-4 animate-pulse" />
          </div>
        </div>
      </div>
      
      <div className="col-span-12 lg:col-span-6">
        <div className="bg-white rounded-lg shadow h-72">
          <div className="h-10 bg-gray-100 rounded-t-lg animate-pulse" />
          <div className="p-4 space-y-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="p-3 bg-gray-50 rounded-md animate-pulse">
                <div className="flex justify-between items-center mb-2">
                  <div className="h-3 bg-gray-200 rounded w-20" />
                  <div className="h-3 bg-gray-200 rounded w-24" />
                </div>
                
                <div className="flex justify-between items-center">
                  <div className="h-4 bg-gray-200 rounded w-1/3" />
                  <div className="h-6 bg-gray-200 rounded w-12" />
                  <div className="h-4 bg-gray-200 rounded w-1/3" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default FixturesLoading;
