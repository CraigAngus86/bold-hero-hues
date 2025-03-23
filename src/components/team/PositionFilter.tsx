
import { useState } from 'react';
import { cn } from '@/lib/utils';
import { PlayerPosition } from '@/services/teamService';

export interface PositionFilterProps {
  selectedPosition: string;
  onPositionChange: (position: string) => void;
  positions?: string[];
  positionCounts?: Record<string, number>;
}

const PositionFilter = ({ 
  positions = ['all', 'goalkeeper', 'defender', 'midfielder', 'forward'], 
  selectedPosition, 
  onPositionChange,
  positionCounts
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
            {positionCounts && positionCounts[position] !== undefined && (
              <span className="ml-1 text-xs opacity-80">
                ({positionCounts[position]})
              </span>
            )}
          </button>
        ))}
      </div>
    </div>
  );
};

export default PositionFilter;
