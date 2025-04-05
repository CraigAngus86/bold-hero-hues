
import React from 'react';
import { Skeleton } from '@/components/ui/skeleton';

const HeroSkeleton: React.FC = () => {
  return (
    <div className="w-full h-[40vh] sm:h-[50vh] md:h-[60vh] relative bg-gray-100">
      <div className="absolute inset-0 flex flex-col justify-end p-8">
        <div className="mb-2">
          <Skeleton className="h-6 w-20 rounded" />
        </div>
        <Skeleton className="h-8 sm:h-10 md:h-12 w-3/4 mb-3" />
        <Skeleton className="h-4 sm:h-5 w-2/3 mb-2" />
        <Skeleton className="h-4 sm:h-5 w-1/2 mb-6" />
        <Skeleton className="h-8 sm:h-10 w-36" />
      </div>
      
      {/* Dots */}
      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex space-x-2">
        {[1, 2, 3, 4].map((i) => (
          <Skeleton key={i} className="w-2 h-2 rounded-full" />
        ))}
      </div>
    </div>
  );
};

export default HeroSkeleton;
