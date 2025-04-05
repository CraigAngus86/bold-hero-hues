
import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getNewsArticles, deleteNewsArticle, toggleArticleFeatured } from '@/services/newsService';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { Typography } from '@/components/ui';
import DataTable from '@/components/tables/DataTable';
import { format } from 'date-fns';
import { Eye, Trash2, Star, Edit, Search, Filter, Calendar } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { toast } from 'sonner';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { NewsArticle } from '@/types';
import { cn } from '@/lib/utils';

const { H3, Small } = Typography;

interface NewsArticleListProps {
  onEditArticle: (article: NewsArticle) => void;
}

export const NewsArticleList: React.FC<NewsArticleListProps> = ({ onEditArticle }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [featuredFilter, setFeaturedFilter] = useState<boolean | undefined>(undefined);
  const queryClient = useQueryClient();

  // Fetch news articles
  const { data, isLoading } = useQuery({
    queryKey: ['newsArticles'],
    queryFn: () => getNewsArticles({ orderBy: 'publish_date', orderDirection: 'desc' }),
  });

  // Delete article mutation
  const deleteMutation = useMutation({
    mutationFn: (id: string) => deleteNewsArticle(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['newsArticles'] });
      toast.success('Article deleted successfully');
    },
    onError: (error) => {
      toast.error('Failed to delete article');
      console.error('Error deleting article:', error);
    },
  });

  // Toggle featured status mutation
  const toggleFeaturedMutation = useMutation({
    mutationFn: ({ id, featured }: { id: string; featured: boolean }) => 
      toggleArticleFeatured(id, featured),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['newsArticles'] });
      toast.success('Article updated successfully');
    },
    onError: (error) => {
      toast.error('Failed to update article');
      console.error('Error updating article:', error);
    },
  });

  // Extract unique categories
  const categories = data?.data 
    ? [...new Set(data.data.map(article => article.category))]
    : [];

  // Filter articles based on search term and category
  const filteredArticles = data?.data?.filter(article => {
    const matchesSearch = searchTerm 
      ? article.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
        article.content.toLowerCase().includes(searchTerm.toLowerCase())
      : true;
      
    const matchesCategory = selectedCategory 
      ? article.category === selectedCategory 
      : true;
      
    const matchesFeatured = featuredFilter !== undefined 
      ? article.is_featured === featuredFilter 
      : true;
      
    return matchesSearch && matchesCategory && matchesFeatured;
  }) || [];

  const handleToggleFeatured = (id: string, currentStatus: boolean) => {
    toggleFeaturedMutation.mutate({ id, featured: !currentStatus });
  };

  const handleDeleteArticle = (id: string) => {
    deleteMutation.mutate(id);
  };

  const columns = [
    {
      key: 'title',
      title: 'Title',
      render: (article: NewsArticle) => (
        <div className="max-w-md truncate font-medium">{article.title}</div>
      )
    },
    {
      key: 'publish_date',
      title: 'Date',
      render: (article: NewsArticle) => (
        <div className="flex items-center">
          <Calendar size={14} className="mr-2 text-gray-500" />
          {format(new Date(article.publish_date), 'MMM d, yyyy')}
        </div>
      )
    },
    {
      key: 'category',
      title: 'Category',
      render: (article: NewsArticle) => (
        <Badge variant="secondary" className="font-normal">
          {article.category}
        </Badge>
      )
    },
    {
      key: 'is_featured',
      title: 'Featured',
      render: (article: NewsArticle) => (
        <Switch
          checked={article.is_featured}
          onCheckedChange={() => handleToggleFeatured(article.id, article.is_featured)}
          className={cn(
            article.is_featured ? "bg-accent-500" : "bg-gray-200"
          )}
        />
      )
    },
    {
      key: 'actions',
      title: 'Actions',
      render: (article: NewsArticle) => (
        <div className="flex space-x-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => onEditArticle(article)}
            title="Edit article"
          >
            <Edit size={16} />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            asChild
            title="Preview article"
          >
            <a href={`/news/${article.slug}`} target="_blank" rel="noopener noreferrer">
              <Eye size={16} />
            </a>
          </Button>
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button
                variant="ghost"
                size="sm"
                className="text-red-500 hover:bg-red-50 hover:text-red-600"
                title="Delete article"
              >
                <Trash2 size={16} />
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Delete Article</AlertDialogTitle>
                <AlertDialogDescription>
                  Are you sure you want to delete this article? This action cannot be undone.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction
                  onClick={() => handleDeleteArticle(article.id)}
                  className="bg-red-500 hover:bg-red-600"
                >
                  Delete
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>
      )
    }
  ];

  return (
    <Card>
      <CardContent className="pt-6">
        <div className="mb-6 flex flex-col sm:flex-row gap-4 justify-between">
          <div className="relative w-full sm:w-72">
            <Search className="absolute left-2 top-2.5 h-4 w-4 text-gray-500" />
            <Input
              placeholder="Search articles..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-8"
            />
          </div>
          <div className="flex flex-wrap gap-4">
            <Select value={selectedCategory} onValueChange={setSelectedCategory}>
              <SelectTrigger className="w-full sm:w-36">
                <SelectValue placeholder="Category" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="">All Categories</SelectItem>
                {categories.map((category) => (
                  <SelectItem key={category} value={category}>{category}</SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select 
              value={featuredFilter === undefined ? '' : featuredFilter ? 'featured' : 'not-featured'}
              onValueChange={(value) => {
                if (value === '') setFeaturedFilter(undefined);
                else setFeaturedFilter(value === 'featured');
              }}
            >
              <SelectTrigger className="w-full sm:w-36">
                <SelectValue placeholder="Featured Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="">All Articles</SelectItem>
                <SelectItem value="featured">Featured Only</SelectItem>
                <SelectItem value="not-featured">Not Featured</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <DataTable
          columns={columns}
          data={filteredArticles}
          isLoading={isLoading}
          onRowClick={onEditArticle}
          emptyMessage="No articles found. Create your first article!"
        />
        
        {filteredArticles.length > 0 && (
          <div className="mt-4 text-right">
            <Small className="text-gray-500">
              Showing {filteredArticles.length} of {data?.data?.length || 0} articles
            </Small>
          </div>
        )}
      </CardContent>
    </Card>
  );
};
