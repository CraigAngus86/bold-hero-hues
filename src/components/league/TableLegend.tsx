
import React from 'react';

const TableLegend = () => {
  return (
    <div className="mb-6 flex flex-wrap gap-3 justify-center">
      <div className="flex items-center bg-white px-3 py-1 rounded-full shadow-sm text-xs">
        <div className="w-3 h-3 bg-team-blue rounded-full mr-1"></div>
        <span>Title Contenders</span>
      </div>
      <div className="flex items-center bg-white px-3 py-1 rounded-full shadow-sm text-xs">
        <div className="w-3 h-3 bg-green-500 rounded-full mr-1"></div>
        <span>Win</span>
      </div>
      <div className="flex items-center bg-white px-3 py-1 rounded-full shadow-sm text-xs">
        <div className="w-3 h-3 bg-yellow-500 rounded-full mr-1"></div>
        <span>Draw</span>
      </div>
      <div className="flex items-center bg-white px-3 py-1 rounded-full shadow-sm text-xs">
        <div className="w-3 h-3 bg-red-500 rounded-full mr-1"></div>
        <span>Loss</span>
      </div>
    </div>
  );
};

export default TableLegend;
