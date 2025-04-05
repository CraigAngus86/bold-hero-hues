
import React from 'react';
import { Skeleton } from '@/components/ui/skeleton';

interface NewsSectionSkeletonProps {
  count?: number;
  featured?: boolean;
}

const NewsSectionSkeleton: React.FC<NewsSectionSkeletonProps> = ({ 
  count = 3,
  featured = false 
}) => {
  return (
    <section className="py-16 bg-white">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center mb-8">
          <Skeleton className="h-8 w-40" />
          <Skeleton className="h-10 w-36" />
        </div>
        
        <div className="grid grid-cols-12 gap-6">
          {/* Featured Article Skeleton - 6 columns on desktop */}
          {featured && (
            <div className="col-span-12 md:col-span-6">
              <div className="rounded-lg overflow-hidden shadow-md bg-white h-full">
                <Skeleton className="w-full h-72" />
                <div className="p-6">
                  <Skeleton className="h-4 w-24 mb-3" />
                  <Skeleton className="h-8 w-full mb-3" />
                  <Skeleton className="h-4 w-5/6 mb-1" />
                  <Skeleton className="h-4 w-4/5 mb-1" />
                  <Skeleton className="h-4 w-3/4 mb-1" />
                  <Skeleton className="h-4 w-2/3 mb-4" />
                  <Skeleton className="h-4 w-28 mt-4" />
                </div>
              </div>
            </div>
          )}
          
          {/* Right side stacked skeletons */}
          <div className="col-span-12 md:col-span-6">
            <div className="grid grid-cols-12 gap-6 h-full">
              {/* Top right article skeleton */}
              <div className="col-span-12 sm:col-span-6 md:col-span-12 lg:col-span-6 xl:col-span-6 h-[calc(50%-0.75rem)]">
                <div className="rounded-lg overflow-hidden shadow-md bg-white h-full">
                  <Skeleton className="w-full h-40" />
                  <div className="p-4">
                    <Skeleton className="h-4 w-20 mb-2" />
                    <Skeleton className="h-6 w-full mb-3" />
                    <Skeleton className="h-4 w-3/4 mb-1" />
                    <Skeleton className="h-4 w-2/3 mb-4" />
                    <Skeleton className="h-4 w-24" />
                  </div>
                </div>
              </div>
              
              {/* Bottom right article skeleton */}
              <div className="col-span-12 sm:col-span-6 md:col-span-12 lg:col-span-6 xl:col-span-6 h-[calc(50%-0.75rem)]">
                <div className="rounded-lg overflow-hidden shadow-md bg-white h-full">
                  <Skeleton className="w-full h-40" />
                  <div className="p-4">
                    <Skeleton className="h-4 w-20 mb-2" />
                    <Skeleton className="h-6 w-full mb-3" />
                    <Skeleton className="h-4 w-3/4 mb-1" />
                    <Skeleton className="h-4 w-2/3 mb-4" />
                    <Skeleton className="h-4 w-24" />
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          {/* Bottom row skeletons */}
          {Array.from({ length: Math.min(4, count) }).map((_, index) => (
            <div key={`bottom-${index}`} className="col-span-12 sm:col-span-6 md:col-span-6 lg:col-span-3">
              <div className="rounded-lg overflow-hidden shadow-md bg-white h-full">
                <Skeleton className="w-full h-36" />
                <div className="p-4">
                  <Skeleton className="h-4 w-20 mb-2" />
                  <Skeleton className="h-6 w-full mb-2" />
                  <Skeleton className="h-4 w-3/4 mb-1" />
                  <Skeleton className="h-4 w-24 mt-2" />
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
