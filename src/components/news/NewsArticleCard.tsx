
import React from 'react';
import { Link } from 'react-router-dom';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { CalendarDays } from 'lucide-react';
import { format } from 'date-fns';
import { NewsArticle } from '@/types/news';

interface NewsArticleCardProps {
  article: NewsArticle;
}

export const NewsArticleCard: React.FC<NewsArticleCardProps> = ({ article }) => {
  const formatDate = (date: string) => {
    try {
      return format(new Date(date), 'MMM dd, yyyy');
    } catch (e) {
      return date;
    }
  };

  return (
    <Card className="overflow-hidden hover:shadow-md transition-all duration-300 h-full flex flex-col">
      <div className="relative h-48 overflow-hidden">
        {article.image_url ? (
          <img 
            src={article.image_url} 
            alt={article.title} 
            className="w-full h-full object-cover transition-transform duration-500 hover:scale-105"
          />
        ) : (
          <div className="w-full h-full bg-gray-200 flex items-center justify-center">
            <span className="text-gray-400">No image</span>
          </div>
        )}
        <div className="absolute top-0 right-0 p-2">
          <Badge variant="secondary" className="bg-blue-100 text-blue-800 hover:bg-blue-200">
            {article.category}
          </Badge>
        </div>
      </div>
      
      <CardContent className="p-4 flex-1 flex flex-col">
        <div className="flex items-center text-sm text-gray-500 mb-2">
          <CalendarDays className="h-4 w-4 mr-1" />
          <span>{formatDate(article.publish_date)}</span>
        </div>
        
        <Link to={`/news/${article.slug}`} className="group">
          <h3 className="font-semibold text-lg mb-2 group-hover:text-blue-700 transition-colors line-clamp-2">
            {article.title}
          </h3>
        </Link>
        
        <p className="text-gray-600 text-sm line-clamp-3 mb-4">
          {article.content.replace(/<[^>]*>?/gm, '').substring(0, 150)}...
        </p>
        
        <Link to={`/news/${article.slug}`} className="mt-auto text-blue-600 hover:text-blue-800 text-sm font-medium inline-flex items-center">
          Read More
          <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3"></path>
          </svg>
        </Link>
      </CardContent>
    </Card>
  );
};
