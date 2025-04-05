
import React from 'react';
import { Link } from 'react-router-dom';
import { Card, CardContent } from '@/components/ui/card';
import { Typography } from '@/components/ui';
import { cn } from '@/lib/utils';
import { Badge } from '@/components/ui/badge';

const { H3, H4, Small, Body } = Typography;

interface NewsCardProps {
  title: string;
  excerpt: string;
  image: string;
  date: string;
  category?: string;
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
  className
}) => {
  const imageHeight = size === 'small' ? 'h-40' : size === 'large' ? 'h-64' : 'h-52';
  
  // Define a list of fallback images
  const getFallbackImage = () => {
    const fallbackImages = [
      '/lovable-uploads/02654c64-77bc-4a05-ae93-7c8173d0dc3c.png',
      '/lovable-uploads/46e4429e-478d-4098-9cf9-fb6444adfc3b.png',
      '/lovable-uploads/587f8bd1-4140-4179-89f8-dc2ac1b2e072.png',
      '/lovable-uploads/73ac703f-7365-4abb-811e-159280ad234b.png',
      '/lovable-uploads/940ac3a1-b89d-40c9-957e-217a64371120.png',
      '/lovable-uploads/9cecca5c-daf2-4f52-a6ca-06e02ca9ea44.png',
      '/lovable-uploads/b937e144-e94f-4e75-881f-1e560c6b520a.png',
      '/lovable-uploads/cb95b9fb-0f2d-42ef-9788-10509a80ed6e.png',
      '/lovable-uploads/0c8edeaf-c67c-403f-90f0-61b390e5e89a.png'
    ];
    return fallbackImages[Math.floor(Math.random() * fallbackImages.length)];
  };
  
  return (
    <Link to={`/news/${slug}`}>
      <Card className={cn('overflow-hidden h-full hover:shadow-lg transition-shadow border border-gray-200', className)}>
        <div className={`relative ${imageHeight} overflow-hidden`}>
          <img 
            src={image} 
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
              <Badge variant="secondary" className="bg-secondary-300 text-primary-800 font-medium">
                {category}
              </Badge>
            </div>
          )}
        </div>
        
        <CardContent className="p-4">
          {size === 'large' ? (
            <H3 className="mb-2 line-clamp-2">{title}</H3>
          ) : (
            <H4 className="mb-2 line-clamp-2">{title}</H4>
          )}
          
          {size !== 'small' && (
            <Body className="mb-3 line-clamp-3 text-gray-600">{excerpt}</Body>
          )}
          
          <Small>{date}</Small>
        </CardContent>
      </Card>
    </Link>
  );
};

export default NewsCard;
