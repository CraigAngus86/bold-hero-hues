
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Edit, File, Trash2 } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { fetchNewsArticles } from '@/services/newsService';
import { NewsArticle } from '@/types/news';

interface NewsArticleDraftsProps {
  onEdit?: (article: NewsArticle) => void;
  onDelete?: (id: string) => void;
}

export const NewsArticleDrafts: React.FC<NewsArticleDraftsProps> = ({ onEdit, onDelete }) => {
  const { data, isLoading, error } = useQuery({
    queryKey: ['news', { isDraft: true }],
    queryFn: () => fetchNewsArticles({ 
      orderBy: 'newest',
      // Here we're considering articles without a publish_date as drafts
      // In a real application, you might have a specific draft status field
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
        <p className="text-red-500">Failed to load drafts</p>
        <p className="text-sm text-gray-500 mt-2">
          {error instanceof Error ? error.message : 'Unknown error occurred'}
        </p>
      </div>
    );
  }

  const drafts = data.data?.filter(article => 
    !article.publish_date || new Date(article.publish_date) > new Date()
  ) || [];

  return (
    <div className="space-y-4">
      {drafts.length === 0 ? (
        <div className="text-center py-12">
          <File className="mx-auto h-12 w-12 text-gray-400" />
          <h3 className="mt-2 text-sm font-semibold text-gray-900">No drafts</h3>
          <p className="mt-1 text-sm text-gray-500">
            You don't have any draft articles yet.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4">
          {drafts.map(draft => (
            <Card key={draft.id} className="overflow-hidden">
              <CardContent className="p-0">
                <div className="flex items-center border-b p-4">
                  <div className="flex-1">
                    <h3 className="font-medium truncate">{draft.title}</h3>
                    <div className="flex space-x-2 text-xs text-gray-500 mt-1">
                      <span>Created: {new Date(draft.created_at).toLocaleDateString()}</span>
                      <span>•</span>
                      <span>{draft.category}</span>
                    </div>
                  </div>
                  <div className="flex space-x-2">
                    {onEdit && (
                      <Button variant="outline" size="sm" onClick={() => onEdit(draft)}>
                        <Edit className="h-4 w-4 mr-1" />
                        Edit
                      </Button>
                    )}
                    {onDelete && (
                      <Button 
                        variant="outline" 
                        size="sm" 
                        className="text-red-500 hover:text-red-600 hover:bg-red-50"
                        onClick={() => onDelete(draft.id)}
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

export default NewsArticleDrafts;
