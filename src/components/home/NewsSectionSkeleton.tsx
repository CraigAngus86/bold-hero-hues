
import React from 'react';
import { Skeleton } from '@/components/ui/skeleton';

interface NewsSectionSkeletonProps {
  count?: number;
}

const NewsSectionSkeleton: React.FC<NewsSectionSkeletonProps> = ({ count = 3 }) => {
  return (
    <section className="py-16 bg-white">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center mb-6">
          <Skeleton className="h-8 w-40" />
          <Skeleton className="h-10 w-36" />
        </div>
        
        <div className="grid grid-cols-12 gap-6">
          {Array.from({ length: count }).map((_, index) => (
            <div key={index} className="col-span-12 sm:col-span-6 lg:col-span-4">
              <div className="rounded-lg overflow-hidden shadow-md bg-white h-full">
                <Skeleton className="w-full h-48" />
                <div className="p-4">
                  <Skeleton className="h-4 w-20 mb-2" />
                  <Skeleton className="h-6 w-full mb-3" />
                  <Skeleton className="h-4 w-3/4 mb-1" />
                  <Skeleton className="h-4 w-2/3 mb-4" />
                  <Skeleton className="h-4 w-24" />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default NewsSectionSkeleton;
