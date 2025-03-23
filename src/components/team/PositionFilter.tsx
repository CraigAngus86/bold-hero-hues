
import { useState } from 'react';
import { cn } from '@/lib/utils';

interface PositionFilterProps {
  positions: string[];
  selectedPosition: string;
  onPositionChange: (position: string) => void;
}

const PositionFilter = ({ 
  positions, 
  selectedPosition, 
  onPositionChange 
}: PositionFilterProps) => {
  return (
    <div className="mb-10 flex justify-center">
      <div className="inline-flex flex-wrap gap-2 bg-team-gray p-1 rounded-lg">
        {positions.map((position) => (
          <button
            key={position}
            onClick={() => onPositionChange(position)}
            className={cn(
              "px-4 py-2 text-sm font-medium rounded-md transition-colors",
              selectedPosition === position
                ? "bg-[#00105a] text-white"
                : "text-gray-700 hover:bg-[#00105a]/10"
            )}
          >
            {position}
          </button>
        ))}
      </div>
    </div>
  );
};

export default PositionFilter;
