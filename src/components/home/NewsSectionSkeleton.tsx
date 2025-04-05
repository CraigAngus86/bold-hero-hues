
import React from 'react';
import { Skeleton } from '@/components/ui/skeleton';
import { useIsMobile } from '@/hooks/use-mobile';

interface NewsSectionSkeletonProps {
  count?: number;
  featured?: boolean;
}

const NewsSectionSkeleton: React.FC<NewsSectionSkeletonProps> = ({ 
  count = 8, // Default to 8 standard articles
  featured = false 
}) => {
  const isMobile = useIsMobile();
  const displayCount = isMobile ? 3 : count; // Limit to 3 standard articles on mobile (plus 1 featured = 4 total)
  
  return (
    <section className="py-16 bg-white">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center mb-8">
          <Skeleton className="h-8 w-40" />
          <Skeleton className="h-10 w-36" />
        </div>
        
        <div className="grid grid-cols-12 gap-6">
          {/* Featured Article Skeleton - 6x6 grid area */}
          {featured && (
            <div className="col-span-12 md:col-span-6 row-span-2">
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
          
          {/* Standard Articles - 3x3 grid each */}
          {Array.from({ length: displayCount }).map((_, index) => (
            <div key={`article-${index}`} className="col-span-12 sm:col-span-6 md:col-span-3">
              <div className="rounded-lg overflow-hidden shadow-md bg-white h-full">
                <Skeleton className="w-full h-40" />
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
