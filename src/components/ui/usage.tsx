
import React from 'react';

interface UsageProps {
  value: number;
  className?: string;
  warningThreshold?: number;
  errorThreshold?: number;
}

export const Usage: React.FC<UsageProps> = ({
  value,
  className = '',
  warningThreshold = 70,
  errorThreshold = 90
}) => {
  // Calculate color based on thresholds
  const getColor = () => {
    if (value >= errorThreshold) return 'bg-red-500';
    if (value >= warningThreshold) return 'bg-yellow-500';
    return 'bg-green-500';
  };

  return (
    <div className={`w-full h-2 bg-gray-200 rounded-full overflow-hidden ${className}`}>
      <div 
        className={`h-full ${getColor()}`} 
        style={{ width: `${Math.min(Math.max(value, 0), 100)}%` }}
        role="progressbar"
        aria-valuenow={value}
        aria-valuemin={0}
        aria-valuemax={100}
      />
    </div>
  );
};
