
import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { getNewsArticles, deleteNewsArticle, toggleArticleFeatured } from '@/services/newsService';
import { NewsArticle } from '@/types/news';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';

export interface EnhancedNewsArticleListProps {
  onEditArticle?: (article: NewsArticle) => void;
  onEdit?: (article: NewsArticle) => void;
  onCreateNew?: () => void;
}

export function EnhancedNewsArticleList({ onEdit, onEditArticle, onCreateNew }: EnhancedNewsArticleListProps) {
  const [searchTerm, setSearchTerm] = useState('');
  
  // Article edit handler that works with either prop name
  const handleEditArticle = (article: NewsArticle) => {
    if (onEdit) {
      onEdit(article);
    } else if (onEditArticle) {
      onEditArticle(article);
    }
  };

  // Use a query to fetch articles
  const { data: articlesData, isLoading } = useQuery({
    queryKey: ['articles'],
    queryFn: async () => {
      const result = await getNewsArticles();
      if (!result.success) {
        throw new Error(result.error || 'Failed to fetch articles');
      }
      return result.data || [];
    }
  });

  // Placeholder for the article list - replace with actual implementation later
  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold">News Articles</h2>
        <Button onClick={onCreateNew}>Create Article</Button>
      </div>
      
      {isLoading ? (
        <p>Loading articles...</p>
      ) : articlesData && articlesData.length > 0 ? (
        <div className="space-y-2">
          {articlesData.map((article: NewsArticle) => (
            <div key={article.id} className="p-4 border rounded-lg flex justify-between items-center">
              <div>
                <h3 className="font-medium">{article.title}</h3>
                <p className="text-sm text-gray-500">
                  {article.publish_date ? new Date(article.publish_date).toLocaleDateString() : 'No date'} • {article.category || 'Uncategorized'}
                </p>
              </div>
              <Button variant="outline" onClick={() => handleEditArticle(article)}>
                Edit
              </Button>
            </div>
          ))}
        </div>
      ) : (
        <p className="text-center py-8 text-gray-500">No articles found</p>
      )}
    </div>
  );
}
