
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Archive, Edit, Eye, Trash2 } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { fetchNewsArticles } from '@/services/newsService';

export const NewsArticleArchive = () => {
  // Filter for archived articles - typically older than a certain date
  // This is just a placeholder logic
  const oneMonthAgo = new Date();
  oneMonthAgo.setMonth(oneMonthAgo.getMonth() - 1);
  
  const { data, isLoading, error } = useQuery({
    queryKey: ['news', { archived: true }],
    queryFn: () => fetchNewsArticles({ 
      orderBy: 'oldest'
      // In a real application, you'd have a specific archive flag or date filter
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

  // Filter for articles older than a month for demonstration purposes
  const archivedArticles = data.data?.filter(article => 
    article.publish_date && new Date(article.publish_date) < oneMonthAgo
  ) || [];

  return (
    <div className="space-y-4">
      {archivedArticles.length === 0 ? (
        <div className="text-center py-12">
          <Archive className="mx-auto h-12 w-12 text-gray-400" />
          <h3 className="mt-2 text-sm font-semibold text-gray-900">No archived articles</h3>
          <p className="mt-1 text-sm text-gray-500">
            Your archive is empty.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4">
          {archivedArticles.map(article => (
            <Card key={article.id} className="overflow-hidden bg-gray-50">
              <CardContent className="p-0">
                <div className="flex items-center border-b p-4">
                  <div className="flex-1">
                    <h3 className="font-medium truncate">{article.title}</h3>
                    <div className="flex space-x-2 text-xs text-gray-500 mt-1">
                      <span>Published: {new Date(article.publish_date || article.created_at).toLocaleDateString()}</span>
                      <span>•</span>
                      <span>{article.category}</span>
                    </div>
                  </div>
                  <div className="flex space-x-2">
                    <Button variant="ghost" size="sm">
                      <Eye className="h-4 w-4 mr-1" />
                      View
                    </Button>
                    <Button variant="ghost" size="sm">
                      <Edit className="h-4 w-4 mr-1" />
                      Restore
                    </Button>
                    <Button variant="ghost" size="sm" className="text-red-500 hover:text-red-600 hover:bg-red-50">
                      <Trash2 className="h-4 w-4 mr-1" />
                      Delete
                    </Button>
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
