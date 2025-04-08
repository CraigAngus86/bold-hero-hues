
import React from 'react';
import { Link } from 'react-router-dom';
import { cn } from '@/lib/utils';

interface NewsCardProps {
  title: string;
  excerpt: string;
  image?: string;
  date?: string;
  category?: string;
  slug?: string;
  featured?: boolean;
  size?: 'small' | 'medium' | 'large';
  className?: string;
}

const NewsCard: React.FC<NewsCardProps> = ({
  title,
  excerpt,
  image,
  date,
  category,
  slug = '#',
  featured = false,
  size = 'medium',
  className
}) => {
  const imageHeight = size === 'small' ? 'h-40' : size === 'large' ? 'h-64' : 'h-52';
  
  // Format date for display
  const formattedDate = date ? new Date(date).toLocaleDateString('en-GB', {
    day: 'numeric',
    month: 'long',
    year: 'numeric'
  }) : '';
  
  // Define a list of fallback images
  const getFallbackImage = () => {
    const fallbackImages = [
      '/public/banks-o-dee-dark-logo.png',
      '/public/Spain_Park_Slider_1920x1080.jpg',
      '/public/Keith_Slider_1920x1080.jpg',
      '/public/HLC_Slider_1920x1080.jpg'
    ];
    return fallbackImages[Math.floor(Math.random() * fallbackImages.length)];
  };
  
  return (
    <Link to={`/news/${slug}`} className="block h-full">
      <div className={cn('card-premium overflow-hidden h-full hover:shadow-lg transition-shadow border border-gray-200', className)}>
        <div className={`relative ${imageHeight} overflow-hidden`}>
          <img 
            src={image || getFallbackImage()} 
            alt={title}
            className="w-full h-full object-cover transition-transform duration-500 hover:scale-105"
            onError={(e) => {
              const target = e.target as HTMLImageElement;
              target.onerror = null;
              target.src = getFallbackImage();
            }}
          />
          {category && (
            <div className="absolute top-3 left-3">
              <span className="bg-white/80 backdrop-blur-sm text-team-blue px-3 py-1 text-xs font-semibold rounded">
                {category}
              </span>
            </div>
          )}
        </div>
        
        <div className="p-4">
          {size === 'large' ? (
            <h3 className="text-xl md:text-2xl font-bold mb-2 line-clamp-2">{title}</h3>
          ) : (
            <h4 className="text-lg font-bold mb-2 line-clamp-2">{title}</h4>
          )}
          
          {size !== 'small' && (
            <p className="mb-3 line-clamp-3 text-gray-600">{excerpt}</p>
          )}
          
          {formattedDate && (
            <div className="text-sm text-gray-500">{formattedDate}</div>
          )}
        </div>
        
        {featured && (
          <div className="card-accent-corner"></div>
        )}
      </div>
    </Link>
  );
};

export default NewsCard;
