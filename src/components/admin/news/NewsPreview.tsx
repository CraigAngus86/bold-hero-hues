
import React from 'react';
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { format, parseISO } from 'date-fns';
import { CalendarDays, Star } from 'lucide-react';
import { NewsArticle } from '@/types';
import { cn } from '@/lib/utils';

interface NewsPreviewProps {
  article: NewsArticle;
  variant?: 'default' | 'compact' | 'featured' | 'minimal';
  showCategory?: boolean;
  showAuthor?: boolean;
  showDate?: boolean;
  maxContentLength?: number;
  className?: string;
  onClickView?: (article: NewsArticle) => void;
  onClickEdit?: (article: NewsArticle) => void;
}

export const NewsPreview: React.FC<NewsPreviewProps> = ({
  article,
  variant = 'default',
  showCategory = true,
  showAuthor = true,
  showDate = true,
  maxContentLength = 150,
  className = '',
  onClickView,
  onClickEdit
}) => {
  // Format date for display
  const formatDate = (dateString: string) => {
    try {
      return format(parseISO(dateString), 'PPP');
    } catch (error) {
      return dateString;
    }
  };

  // Truncate content for preview
  const truncateContent = (content: string, maxLength: number) => {
    if (content.length <= maxLength) return content;
    
    // Try to find a space to break at
    const truncated = content.substr(0, maxLength);
    const lastSpace = truncated.lastIndexOf(' ');
    
    return lastSpace > 0 
      ? truncated.substr(0, lastSpace) + '...'
      : truncated + '...';
  };

  // Strip HTML tags from content
  const stripHtml = (html: string) => {
    const doc = new DOMParser().parseFromString(html, 'text/html');
    return doc.body.textContent || '';
  };

  // Generate clean content for preview
  const getCleanContent = () => {
    const stripped = stripHtml(article.content);
    return truncateContent(stripped, maxContentLength);
  };

  // Determine card styles based on variant
  const getCardStyles = () => {
    switch (variant) {
      case 'compact':
        return 'max-w-sm';
      case 'featured':
        return 'md:grid md:grid-cols-2 md:gap-4';
      case 'minimal':
        return 'p-0 border-0 shadow-none';
      default:
        return '';
    }
  };

  return (
    <Card className={cn(
      "overflow-hidden transition-shadow hover:shadow-md", 
      getCardStyles(),
      className
    )}>
      {variant === 'featured' ? (
        <div className="flex flex-col md:flex-row">
          {/* Image section */}
          {article.image_url && (
            <div className="md:w-1/2">
              <div 
                className="aspect-video bg-cover bg-center" 
                style={{ backgroundImage: `url(${article.image_url})` }}
              />
            </div>
          )}
          
          {/* Content section */}
          <div className={article.image_url ? "md:w-1/2" : "w-full"}>
            <CardHeader>
              <div className="flex items-center justify-between">
                {showCategory && (
                  <Badge variant="outline" className="mb-2">
                    {article.category}
                  </Badge>
                )}
                
                {article.is_featured && (
                  <Star className="h-4 w-4 text-amber-500 fill-amber-500" />
                )}
              </div>
              
              <h3 className="font-bold text-xl">{article.title}</h3>
              
              {(showAuthor && article.author) || (showDate && article.publish_date) ? (
                <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                  {showAuthor && article.author && (
                    <span>{article.author}</span>
                  )}
                  
                  {showAuthor && article.author && showDate && article.publish_date && (
                    <span>•</span>
                  )}
                  
                  {showDate && article.publish_date && (
                    <div className="flex items-center">
                      <CalendarDays className="h-3 w-3 mr-1" />
                      <span>{formatDate(article.publish_date)}</span>
                    </div>
                  )}
                </div>
              ) : null}
            </CardHeader>
            
            <CardContent>
              <p className="text-muted-foreground">
                {getCleanContent()}
              </p>
            </CardContent>
            
            {(onClickView || onClickEdit) && (
              <CardFooter className="flex justify-end space-x-2">
                {onClickView && (
                  <button 
                    onClick={() => onClickView(article)}
                    className="text-sm text-blue-600 hover:text-blue-800"
                  >
                    View
                  </button>
                )}
                
                {onClickEdit && (
                  <button 
                    onClick={() => onClickEdit(article)}
                    className="text-sm text-blue-600 hover:text-blue-800"
                  >
                    Edit
                  </button>
                )}
              </CardFooter>
            )}
          </div>
        </div>
      ) : (
        <>
          {/* Regular card layout */}
          {article.image_url && variant !== 'minimal' && (
            <div 
              className="aspect-video bg-cover bg-center" 
              style={{ backgroundImage: `url(${article.image_url})` }}
            />
          )}
          
          <CardHeader className={variant === 'minimal' ? 'px-0 py-2' : ''}>
            <div className="flex items-center justify-between">
              {showCategory && (
                <Badge variant="outline" className="mb-2">
                  {article.category}
                </Badge>
              )}
              
              {article.is_featured && (
                <Star className="h-4 w-4 text-amber-500 fill-amber-500" />
              )}
            </div>
            
            <h3 className={cn(
              "font-bold",
              variant === 'compact' || variant === 'minimal' ? 'text-lg' : 'text-xl'
            )}>
              {article.title}
            </h3>
            
            {(showAuthor && article.author) || (showDate && article.publish_date) ? (
              <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                {showAuthor && article.author && (
                  <span>{article.author}</span>
                )}
                
                {showAuthor && article.author && showDate && article.publish_date && (
                  <span>•</span>
                )}
                
                {showDate && article.publish_date && (
                  <div className="flex items-center">
                    <CalendarDays className="h-3 w-3 mr-1" />
                    <span>{formatDate(article.publish_date)}</span>
                  </div>
                )}
              </div>
            ) : null}
          </CardHeader>
          
          <CardContent className={variant === 'minimal' ? 'px-0 py-2' : ''}>
            <p className={cn(
              "text-muted-foreground",
              variant === 'compact' || variant === 'minimal' ? 'text-sm' : ''
            )}>
              {getCleanContent()}
            </p>
          </CardContent>
          
          {(onClickView || onClickEdit) && (
            <CardFooter className={cn(
              "flex justify-end space-x-2", 
              variant === 'minimal' ? 'px-0 py-2' : ''
            )}>
              {onClickView && (
                <button 
                  onClick={() => onClickView(article)}
                  className="text-sm text-blue-600 hover:text-blue-800"
                >
                  View
                </button>
              )}
              
              {onClickEdit && (
                <button 
                  onClick={() => onClickEdit(article)}
                  className="text-sm text-blue-600 hover:text-blue-800"
                >
                  Edit
                </button>
              )}
            </CardFooter>
          )}
        </>
      )}
    </Card>
  );
};

export default NewsPreview;
