
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
          {/* Featured Article Skeleton - 8 columns on desktop */}
          {featured && (
            <div className="col-span-12 lg:col-span-8">
              <div className="rounded-lg overflow-hidden shadow-md bg-white h-full">
                <Skeleton className="w-full h-72 md:h-80" />
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
          
          {/* Secondary Articles Skeletons */}
          {featured ? (
            <>
              {/* First two articles stack to the right of featured article on desktop */}
              {Array.from({ length: Math.min(2, count) }).map((_, index) => (
                <div key={`side-${index}`} className="col-span-12 md:col-span-6 lg:col-span-4">
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
              
              {/* Remaining articles go below in a row of 3 on desktop */}
              {Array.from({ length: Math.max(0, count - 2) }).map((_, index) => (
                <div key={`bottom-${index}`} className="col-span-12 sm:col-span-6 md:col-span-6 lg:col-span-4">
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
            </>
          ) : (
            /* Regular Articles Skeletons - without featured article */
            Array.from({ length: count }).map((_, index) => (
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
            ))
          )}
        </div>
      </div>
    </section>
  );
};

export default NewsSectionSkeleton;
