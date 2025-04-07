
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useQuery } from '@tanstack/react-query';
import { fetchNewsArticles } from '@/services/newsService';
import { Badge } from '@/components/ui/badge';
import { Calendar, Star } from 'lucide-react';
import { format } from 'date-fns';

const RecentNewsWidget = () => {
  const { data, isLoading } = useQuery({
    queryKey: ['recentNews'],
    queryFn: () => fetchNewsArticles({ limit: 4, orderBy: 'newest' }),
  });

  const formatDate = (dateString: string) => {
    try {
      return format(new Date(dateString), 'MMM d, yyyy');
    } catch (error) {
      return 'Invalid date';
    }
  };

  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle>Recent News</CardTitle>
      </CardHeader>
      <CardContent className="p-0">
        {isLoading ? (
          <div className="p-4 space-y-4">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="animate-pulse flex">
                <div className="bg-gray-200 w-16 h-16 rounded"></div>
                <div className="ml-4 flex-1">
                  <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                  <div className="h-3 bg-gray-200 rounded w-1/2 mb-2"></div>
                  <div className="h-3 bg-gray-200 rounded w-1/4"></div>
                </div>
              </div>
            ))}
          </div>
        ) : data?.data && data.data.length > 0 ? (
          <div className="divide-y">
            {data.data.map((article) => (
              <div key={article.id} className="p-4 hover:bg-gray-50 transition-colors">
                <div className="flex items-start">
                  {article.image_url ? (
                    <div className="flex-shrink-0">
                      <div className="w-16 h-16 rounded overflow-hidden">
                        <img src={article.image_url} alt={article.title} className="w-full h-full object-cover" />
                      </div>
                    </div>
                  ) : null}
                  <div className={article.image_url ? "ml-4" : ""}>
                    <div className="flex items-center">
                      {article.is_featured && (
                        <Star className="h-3 w-3 text-yellow-400 mr-1" />
                      )}
                      <h3 className="font-medium text-sm line-clamp-2">{article.title}</h3>
                    </div>
                    <div className="flex items-center text-xs text-gray-500 mt-1">
                      <Badge variant="outline" size="sm" className="mr-2 text-xs">
                        {article.category}
                      </Badge>
                      <div className="flex items-center">
                        <Calendar className="h-3 w-3 mr-1" />
                        {formatDate(article.publish_date)}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="p-4 text-center text-sm text-gray-500">
            No recent news found.
          </div>
        )}
      </CardContent>
      <CardFooter className="bg-gray-50 p-3 border-t">
        <Button variant="ghost" className="w-full text-blue-500">
          View All News
        </Button>
      </CardFooter>
    </Card>
  );
};

export default RecentNewsWidget;
