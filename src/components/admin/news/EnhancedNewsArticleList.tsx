
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useQuery } from '@tanstack/react-query';
import { fetchNewsArticles, deleteNewsArticle, toggleArticleFeatured } from '@/services/newsService';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { PlusCircle, Search, Edit, Trash2, Star } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { toast } from 'sonner';
import { NewsArticle } from '@/types/news';

interface EnhancedNewsArticleListProps {
  onEdit: (article: NewsArticle) => void;
  onCreateNew: () => void;
}

export const EnhancedNewsArticleList: React.FC<EnhancedNewsArticleListProps> = ({ 
  onEdit,
  onCreateNew 
}) => {
  const [searchQuery, setSearchQuery] = useState('');

  const {
    data,
    isLoading,
    error,
    refetch
  } = useQuery({
    queryKey: ['news'],
    queryFn: () => fetchNewsArticles({
      orderBy: 'newest'
    })
  });

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this article?')) return;
    
    try {
      const result = await deleteNewsArticle(id);
      if (result.success) {
        toast.success('Article deleted successfully');
        refetch();
      } else {
        throw new Error(result.error);
      }
    } catch (error) {
      toast.error(`Failed to delete article: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  };

  const handleToggleFeatured = async (article: NewsArticle) => {
    try {
      const result = await toggleArticleFeatured(article.id, !article.is_featured);
      if (result.success) {
        toast.success(`Article ${result.data?.is_featured ? 'featured' : 'unfeatured'} successfully`);
        refetch();
      } else {
        throw new Error(result.error);
      }
    } catch (error) {
      toast.error(`Failed to update article: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  };

  const filteredArticles = data?.data?.filter(article =>
    article.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    article.content.toLowerCase().includes(searchQuery.toLowerCase()) ||
    article.category.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle>Articles</CardTitle>
        <Button onClick={onCreateNew}>
          <PlusCircle className="mr-2 h-4 w-4" />
          New Article
        </Button>
      </CardHeader>
      <CardContent>
        <div className="mb-4">
          <div className="relative">
            <Search className="absolute left-2 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input
              placeholder="Search articles..."
              value={searchQuery}
              onChange={handleSearch}
              className="pl-8"
            />
          </div>
        </div>

        {isLoading ? (
          <div className="flex justify-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
          </div>
        ) : error ? (
          <div className="text-center py-8 text-red-500">
            Error loading articles: {error instanceof Error ? error.message : 'Unknown error'}
          </div>
        ) : filteredArticles && filteredArticles.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b">
                  <th className="text-left py-3 font-medium">Title</th>
                  <th className="text-left py-3 font-medium">Category</th>
                  <th className="text-left py-3 font-medium">Published</th>
                  <th className="text-left py-3 font-medium">Status</th>
                  <th className="text-right py-3 font-medium">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredArticles.map((article) => (
                  <tr key={article.id} className="border-b hover:bg-gray-50">
                    <td className="py-3">
                      <div className="flex items-center">
                        {article.is_featured && (
                          <Star className="h-4 w-4 text-yellow-400 mr-2 flex-shrink-0" />
                        )}
                        <span className="font-medium truncate max-w-xs">{article.title}</span>
                      </div>
                    </td>
                    <td className="py-3">
                      <Badge variant="outline">{article.category}</Badge>
                    </td>
                    <td className="py-3">
                      {article.publish_date 
                        ? new Date(article.publish_date).toLocaleDateString()
                        : 'Draft'}
                    </td>
                    <td className="py-3">
                      <Badge 
                        variant={article.publish_date && new Date(article.publish_date) <= new Date() ? "default" : "secondary"}
                      >
                        {article.publish_date && new Date(article.publish_date) <= new Date() 
                          ? 'Published' 
                          : 'Draft'}
                      </Badge>
                    </td>
                    <td className="py-3 text-right">
                      <div className="flex justify-end space-x-2">
                        <Button 
                          variant="ghost" 
                          size="sm" 
                          className={article.is_featured ? "text-yellow-500" : ""}
                          onClick={() => handleToggleFeatured(article)}
                        >
                          <Star className="h-4 w-4" />
                          <span className="sr-only">
                            {article.is_featured ? 'Unfeature' : 'Feature'}
                          </span>
                        </Button>
                        <Button 
                          variant="ghost" 
                          size="sm"
                          onClick={() => onEdit(article)}
                        >
                          <Edit className="h-4 w-4" />
                          <span className="sr-only">Edit</span>
                        </Button>
                        <Button 
                          variant="ghost" 
                          size="sm"
                          className="text-red-500 hover:text-red-600 hover:bg-red-50"
                          onClick={() => handleDelete(article.id)}
                        >
                          <Trash2 className="h-4 w-4" />
                          <span className="sr-only">Delete</span>
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="text-center py-8 text-gray-500">
            No articles found. {searchQuery ? 'Try a different search term.' : 'Create your first article to get started.'}
          </div>
        )}
      </CardContent>
    </Card>
  );
};
