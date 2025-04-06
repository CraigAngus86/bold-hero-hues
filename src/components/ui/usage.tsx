
import * as React from "react";
import { cn } from "@/lib/utils";

interface UsageProps {
  value: number;
  max?: number;
  gradient?: boolean;
  className?: string;
}

/**
 * Usage component for displaying usage progress bars
 * Used in system monitoring, disk space, CPU usage displays, etc.
 */
export function Usage({ value = 0, max = 100, gradient = true, className }: UsageProps) {
  // Ensure value is within bounds
  const safeValue = Math.max(0, Math.min(value, max));
  const percentage = Math.round((safeValue / max) * 100);
  
  // Determine color based on usage percentage
  const getColor = () => {
    if (percentage <= 50) return "bg-green-500";
    if (percentage <= 75) return "bg-yellow-500";
    return "bg-red-500";
  };

  // Generate gradient class if enabled
  const barClass = gradient 
    ? `bg-gradient-to-r from-blue-500 ${percentage > 50 ? 'via-yellow-500' : ''} ${percentage > 75 ? 'to-red-500' : 'to-green-500'}`
    : getColor();
  
  return (
    <div className={cn("h-2 w-24 bg-gray-200 rounded-full overflow-hidden", className)}>
      <div 
        className={cn("h-full rounded-full transition-all duration-300", barClass)}
        style={{ width: `${percentage}%` }}
        role="progressbar"
        aria-valuenow={percentage}
        aria-valuemin={0}
        aria-valuemax={100}
      />
    </div>
  );
}
