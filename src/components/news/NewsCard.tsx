
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
              target.src = '/lovable-uploads/940ac3a1-b89d-40c9-957e-217a64371120.png';
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
