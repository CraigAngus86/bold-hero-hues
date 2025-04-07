
import React from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ChevronRight } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { formatDate } from '@/utils/date';

interface NewsItem {
  id: string;
  title: string;
  slug: string;
  excerpt?: string;
  content?: string;
  category: string;
  image_url?: string;
  author?: string;
  publish_date: string;
  is_featured: boolean;
}

interface NewsGridProps {
  articles: NewsItem[];
  featuredArticles?: NewsItem[];
  showFeatured?: boolean;
  maxItems?: number;
  showCategories?: boolean;
}

const NewsGrid: React.FC<NewsGridProps> = ({
  articles,
  featuredArticles,
  showFeatured = true,
  maxItems = 6,
  showCategories = true,
}) => {
  // Use provided featured articles or filter from all articles
  const featured = featuredArticles || articles.filter(article => article.is_featured);
  
  // Filter out featured articles from regular display if showFeatured is true
  const regularArticles = showFeatured 
    ? articles.filter(article => !article.is_featured)
    : articles;
  
  // Limit the number of regular articles shown
  const displayedArticles = regularArticles.slice(0, maxItems);
  
  // Helper to create excerpt from content if needed
  const getExcerpt = (article: NewsItem) => {
    if (article.excerpt) return article.excerpt;
    if (article.content) {
      // Strip HTML tags and limit to 150 chars
      return article.content.replace(/<[^>]*>?/gm, '').substring(0, 150) + '...';
    }
    return '';
  };

  return (
    <div className="space-y-8">
      {/* Featured Articles Section */}
      {showFeatured && featured.length > 0 && (
        <div className="space-y-4">
          <h2 className="text-2xl font-bold tracking-tight">Featured News</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {featured.slice(0, 2).map((article) => (
              <Card key={article.id} className="overflow-hidden">
                {article.image_url && (
                  <div className="h-48 overflow-hidden">
                    <img 
                      src={article.image_url}
                      alt={article.title}
                      className="w-full h-full object-cover"
                    />
                  </div>
                )}
                <CardHeader>
                  {showCategories && (
                    <CardDescription>
                      <Badge variant="outline" className="mb-2">{article.category}</Badge>
                    </CardDescription>
                  )}
                  <CardTitle>{article.title}</CardTitle>
                  <CardDescription>
                    {formatDate(article.publish_date)} {article.author && `by ${article.author}`}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <p>{getExcerpt(article)}</p>
                </CardContent>
                <CardFooter>
                  <Button variant="link" asChild className="px-0">
                    <a href={`/news/${article.slug}`}>
                      Read more <ChevronRight className="ml-1 h-4 w-4" />
                    </a>
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>
        </div>
      )}

      {/* Regular Articles Grid */}
      <div className="space-y-4">
        <h2 className="text-2xl font-bold tracking-tight">Latest News</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {displayedArticles.map((article) => (
            <Card key={article.id}>
              {article.image_url && (
                <div className="h-40 overflow-hidden">
                  <img 
                    src={article.image_url}
                    alt={article.title}
                    className="w-full h-full object-cover"
                  />
                </div>
              )}
              <CardHeader>
                {showCategories && (
                  <CardDescription>
                    <Badge variant="outline" className="mb-2">{article.category}</Badge>
                  </CardDescription>
                )}
                <CardTitle className="line-clamp-2">{article.title}</CardTitle>
                <CardDescription>
                  {formatDate(article.publish_date)}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="line-clamp-3">{getExcerpt(article)}</p>
              </CardContent>
              <CardFooter>
                <Button variant="link" asChild className="px-0">
                  <a href={`/news/${article.slug}`}>
                    Read more <ChevronRight className="ml-1 h-4 w-4" />
                  </a>
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      </div>

      {/* View All News Button */}
      <div className="flex justify-center mt-8">
        <Button asChild>
          <a href="/news">View All News</a>
        </Button>
      </div>
    </div>
  );
};

export default NewsGrid;
