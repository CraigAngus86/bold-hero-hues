
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Archive, Eye, Trash2 } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { fetchNewsArticles } from '@/services/newsService';
import { NewsArticle } from '@/types/news';

interface NewsArticleArchiveProps {
  onView?: (article: NewsArticle) => void;
  onDelete?: (id: string) => void;
}

export const NewsArticleArchive: React.FC<NewsArticleArchiveProps> = ({ onView, onDelete }) => {
  const { data, isLoading, error } = useQuery({
    queryKey: ['news', { archived: true }],
    queryFn: () => fetchNewsArticles({ 
      orderBy: 'oldest',
      // In a real app, we might have a status field to filter by archive status
      // Here we're just getting older articles
    })
  });

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-40">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
      </div>
    );
  }

  if (error || !data || !data.success) {
    return (
      <div className="text-center py-8">
        <p className="text-red-500">Failed to load archived articles</p>
        <p className="text-sm text-gray-500 mt-2">
          {error instanceof Error ? error.message : 'Unknown error occurred'}
        </p>
      </div>
    );
  }

  // For this example, let's consider articles older than 3 months as archived
  const threeMonthsAgo = new Date();
  threeMonthsAgo.setMonth(threeMonthsAgo.getMonth() - 3);
  
  const archivedArticles = data.data?.filter(article => 
    article.publish_date && new Date(article.publish_date) < threeMonthsAgo
  ) || [];

  return (
    <div className="space-y-4">
      {archivedArticles.length === 0 ? (
        <div className="text-center py-12">
          <Archive className="mx-auto h-12 w-12 text-gray-400" />
          <h3 className="mt-2 text-sm font-semibold text-gray-900">No archived articles</h3>
          <p className="mt-1 text-sm text-gray-500">
            When you archive articles, they will appear here.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4">
          {archivedArticles.map(article => (
            <Card key={article.id} className="overflow-hidden">
              <CardContent className="p-0">
                <div className="flex items-center border-b p-4">
                  <div className="flex-1">
                    <h3 className="font-medium truncate">{article.title}</h3>
                    <div className="flex space-x-2 text-xs text-gray-500 mt-1">
                      <span>Published: {new Date(article.publish_date).toLocaleDateString()}</span>
                      <span>•</span>
                      <span>{article.category}</span>
                    </div>
                  </div>
                  <div className="flex space-x-2">
                    {onView && (
                      <Button variant="outline" size="sm" onClick={() => onView(article)}>
                        <Eye className="h-4 w-4 mr-1" />
                        View
                      </Button>
                    )}
                    {onDelete && (
                      <Button 
                        variant="outline" 
                        size="sm" 
                        className="text-red-500 hover:text-red-600 hover:bg-red-50"
                        onClick={() => onDelete(article.id)}
                      >
                        <Trash2 className="h-4 w-4 mr-1" />
                        Delete
                      </Button>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

export default NewsArticleArchive;
