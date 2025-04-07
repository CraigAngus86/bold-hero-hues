
import React from 'react';
import { Link } from 'react-router-dom';
import { Card, CardContent } from '@/components/ui/card';
import { formatDate } from '@/utils/date';
import { NewsArticle } from '@/types/news';

interface NewsArticleCardProps {
  article: NewsArticle;
  compact?: boolean;
}

export const NewsArticleCard: React.FC<NewsArticleCardProps> = ({ 
  article, 
  compact = false 
}) => {
  return (
    <Card className="overflow-hidden h-full hover:shadow-md transition-shadow">
      {article.image_url && (
        <div className="aspect-video relative">
          <img 
            src={article.image_url} 
            alt={article.title} 
            className="w-full h-full object-cover"
          />
          <div className="absolute top-3 left-3">
            <span className="bg-amber-400 text-primary text-xs font-bold px-2 py-1 rounded">
              {article.category}
            </span>
          </div>
        </div>
      )}
      <CardContent className="p-4">
        <h3 className={`font-bold ${compact ? 'text-base' : 'text-lg'} text-primary line-clamp-2 mb-2`}>
          <Link to={`/news/${article.slug}`} className="hover:text-blue-800">
            {article.title}
          </Link>
        </h3>

        {!compact && article.excerpt && (
          <p className="text-sm text-gray-600 line-clamp-2 mb-3">
            {article.excerpt}
          </p>
        )}

        <div className="flex justify-between items-center text-xs text-gray-500">
          <span>{formatDate(article.publish_date)}</span>
          <Link to={`/news/${article.slug}`} className="text-primary font-medium hover:underline">
            Read More
          </Link>
        </div>
      </CardContent>
    </Card>
  );
};

export default NewsArticleCard;
