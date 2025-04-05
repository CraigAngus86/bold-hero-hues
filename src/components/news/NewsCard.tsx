
import React from 'react';
import { motion } from 'framer-motion';
import { CalendarIcon } from 'lucide-react';
import { Link } from 'react-router-dom';
import { cn } from '@/lib/utils';
import { Badge } from '@/components/ui/badge';
import { AspectRatio } from '@/components/ui/aspect-ratio';

interface NewsCardProps {
  title: string;
  excerpt: string;
  image: string;
  date: string;
  category: string;
  slug: string;
  size?: 'small' | 'medium' | 'large';
  className?: string;
}

const NewsCard: React.FC<NewsCardProps> = ({
  title,
  excerpt,
  image,
  date,
  category,
  slug,
  size = 'medium',
  className,
}) => {
  // Use local images from public folder as fallbacks
  const getImageSrc = (src: string): string => {
    // Check if the image is already a local path
    if (src.startsWith('/')) return src;
    
    // If external URL fails, use a fallback image based on category
    const fallbackImage = getFallbackImageByCategory(category);
    
    return src || fallbackImage;
  };
  
  // Provide fallback images based on category
  const getFallbackImageByCategory = (category: string): string => {
    const categoryMap: Record<string, string> = {
      'Match Report': '/lovable-uploads/73ac703f-7365-4abb-811e-159280ad234b.png',
      'Community': '/lovable-uploads/0617ed5b-43b8-449c-870e-5bba374f7cb4.png',
      'Club News': '/lovable-uploads/9cecca5c-daf2-4f52-a6ca-06e02ca9ea44.png',
      'Youth Academy': '/lovable-uploads/940ac3a1-b89d-40c9-957e-217a64371120.png',
      'Fixtures': '/lovable-uploads/8f2cd33f-1e08-494a-9aaa-65792ee9418a.png',
    };
    
    return categoryMap[category] || '/lovable-uploads/587f8bd1-4140-4179-89f8-dc2ac1b2e072.png';
  };

  // Format date to be more user-friendly (e.g., "11 June 2025")
  const formatUserFriendlyDate = (dateString: string): string => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-GB', {
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    });
  };

  return (
    <Link to={`/news/${slug}`} className="block h-full">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-50px" }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        className={cn(
          "group rounded-lg overflow-hidden shadow-md transition-all duration-300 hover:shadow-xl bg-white h-full flex flex-col",
          className
        )}
      >
        {/* Image container with consistent aspect ratio */}
        <div className="overflow-hidden relative w-full">
          <AspectRatio ratio={16 / 9} className="bg-gray-100">
            <div className="absolute top-0 left-0 z-10 m-4">
              <Badge className="bg-team-lightBlue hover:bg-team-lightBlue/90 text-team-blue text-xs font-semibold">
                {category}
              </Badge>
            </div>
            <img 
              src={getImageSrc(image)} 
              alt={title}
              className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
              onError={(e) => {
                const target = e.target as HTMLImageElement;
                target.onerror = null;
                target.src = getFallbackImageByCategory(category);
              }}
            />
          </AspectRatio>
        </div>
        
        <div className={cn(
          "p-5 flex-1 flex flex-col",
          size === 'large' ? "p-6 md:p-7" : "",
          size === 'small' ? "p-4" : ""
        )}>
          <div className="flex items-center mb-2 text-sm text-gray-500">
            <CalendarIcon className="w-4 h-4 mr-2" />
            <span>{formatUserFriendlyDate(date)}</span>
          </div>
          
          <h3 className={cn(
            "font-bold text-gray-900 mb-3 group-hover:text-team-blue transition-colors",
            size === 'large' ? "text-xl md:text-2xl line-clamp-2" : "text-lg line-clamp-2",
            size === 'small' ? "text-base line-clamp-2" : ""
          )}>
            {title}
          </h3>
          
          <p className={cn(
            "text-gray-600 mb-4 flex-1",
            size === 'small' ? "text-sm line-clamp-2" : "",
            size === 'medium' ? "line-clamp-2" : "",
            size === 'large' ? "md:text-lg line-clamp-3 md:line-clamp-4" : ""
          )}>
            {excerpt}
          </p>
          
          <div className="mt-auto">
            <span className="text-team-blue font-medium inline-flex items-center transition-colors group-hover:text-team-blue/70">
              Read Full Story
              <svg className="w-4 h-4 ml-1 transition-transform duration-300 group-hover:translate-x-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
              </svg>
            </span>
          </div>
        </div>
      </motion.div>
    </Link>
  );
};

export default React.memo(NewsCard);
