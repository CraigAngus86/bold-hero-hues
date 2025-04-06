
import React, { useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getNewsArticles, deleteNewsArticle, toggleArticleFeatured } from '@/services/newsService';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { Typography } from '@/components/ui';
import DataTable from '@/components/tables/DataTable';
import { format } from 'date-fns';
import { 
  Eye, Trash2, Star, Edit, Search, Filter, Calendar, SlidersHorizontal,
  FileText, Clock, User, X, ChevronDown, Save
} from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { toast } from 'sonner';
import { 
  AlertDialog, 
  AlertDialogAction, 
  AlertDialogCancel, 
  AlertDialogContent, 
  AlertDialogDescription, 
  AlertDialogFooter, 
  AlertDialogHeader, 
  AlertDialogTitle, 
  AlertDialogTrigger 
} from "@/components/ui/alert-dialog";
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { 
  Popover, 
  PopoverContent, 
  PopoverTrigger 
} from "@/components/ui/popover";
import { NewsArticle } from '@/types';
import { cn } from '@/lib/utils';
import { Checkbox } from '@/components/ui/checkbox';
import { Separator } from '@/components/ui/separator';
import { DatePickerWithRange } from '@/components/ui/date-range-picker';
import { DateRange } from 'react-day-picker';

const { H3, H4, Body, Small } = Typography;

interface EnhancedNewsArticleListProps {
  onEditArticle: (article: NewsArticle) => void;
}

export const EnhancedNewsArticleList: React.FC<EnhancedNewsArticleListProps> = ({ onEditArticle }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [featuredFilter, setFeaturedFilter] = useState<boolean | undefined>(undefined);
  const [sortField, setSortField] = useState<'publish_date' | 'title' | 'created_at'>('publish_date');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('desc');
  const [dateRange, setDateRange] = useState<DateRange | undefined>(undefined);
  const [selectedAuthors, setSelectedAuthors] = useState<string[]>([]);
  const [filterOpen, setFilterOpen] = useState(false);
  const queryClient = useQueryClient();

  // User preferences
  const [userPreferences, setUserPreferences] = useState({
    savedFilters: false,
  });

  // Fetch news articles
  const { data: responseData, isLoading } = useQuery({
    queryKey: ['newsArticles'],
    queryFn: () => getNewsArticles({ 
      orderBy: sortField, 
      orderDirection: sortDirection 
    }),
  });

  // Process the articles data
  const articles = React.useMemo(() => {
    if (!responseData) return [];
    
    if (Array.isArray(responseData)) {
      return responseData;
    } else if (responseData && typeof responseData === 'object') {
      if ('success' in responseData && responseData.data) {
        if (Array.isArray(responseData.data)) {
          return responseData.data;
        } else if (responseData.data.data && Array.isArray(responseData.data.data)) {
          return responseData.data.data;
        }
      }
      else if ('data' in responseData) {
        return Array.isArray(responseData.data) ? responseData.data : [];
      }
    }
    
    return [];
  }, [responseData]);

  // Extract unique categories and authors
  const categories = React.useMemo(() => {
    if (!articles || articles.length === 0) return [];
    return [...new Set(articles.map(article => article.category))].filter(Boolean);
  }, [articles]);

  const authors = React.useMemo(() => {
    if (!articles || articles.length === 0) return [];
    return [...new Set(articles.map(article => article.author))].filter(Boolean);
  }, [articles]);

  // Filter articles based on all criteria
  const filteredArticles = React.useMemo(() => {
    if (!articles || articles.length === 0) return [];
    
    return articles.filter(article => {
      // Search term filter
      const matchesSearch = searchTerm 
        ? article.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
          article.content.toLowerCase().includes(searchTerm.toLowerCase())
        : true;
        
      // Category filter
      const matchesCategory = selectedCategories.length > 0
        ? selectedCategories.includes(article.category)
        : true;
      
      // Featured filter
      const matchesFeatured = featuredFilter !== undefined 
        ? article.is_featured === featuredFilter 
        : true;
      
      // Date range filter
      const matchesDateRange = dateRange?.from && dateRange?.to
        ? new Date(article.publish_date) >= dateRange.from && 
          new Date(article.publish_date) <= (dateRange.to || dateRange.from)
        : true;
      
      // Author filter
      const matchesAuthor = selectedAuthors.length > 0
        ? article.author && selectedAuthors.includes(article.author)
        : true;
        
      return matchesSearch && matchesCategory && matchesFeatured && matchesDateRange && matchesAuthor;
    });
  }, [articles, searchTerm, selectedCategories, featuredFilter, dateRange, selectedAuthors]);

  // Load saved preferences from localStorage when component mounts
  useEffect(() => {
    const savedPreferences = localStorage.getItem('newsFilters');
    if (savedPreferences && userPreferences.savedFilters) {
      try {
        const filters = JSON.parse(savedPreferences);
        setSelectedCategories(filters.selectedCategories || []);
        setFeaturedFilter(filters.featuredFilter);
        setSortField(filters.sortField || 'publish_date');
        setSortDirection(filters.sortDirection || 'desc');
        setSelectedAuthors(filters.selectedAuthors || []);
        // We don't restore date range as it would be confusing
      } catch (error) {
        console.error('Error loading saved preferences', error);
      }
    }
  }, [userPreferences.savedFilters]);

  // Save filter preferences when they change
  useEffect(() => {
    if (userPreferences.savedFilters) {
      localStorage.setItem('newsFilters', JSON.stringify({
        selectedCategories,
        featuredFilter,
        sortField,
        sortDirection,
        selectedAuthors
      }));
    }
  }, [selectedCategories, featuredFilter, sortField, sortDirection, selectedAuthors, userPreferences.savedFilters]);

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

  const handleToggleFeatured = (id: string, currentStatus: boolean) => {
    toggleFeaturedMutation.mutate({ id, featured: !currentStatus });
  };

  const handleDeleteArticle = (id: string) => {
    deleteMutation.mutate(id);
  };

  const clearAllFilters = () => {
    setSearchTerm('');
    setSelectedCategories([]);
    setFeaturedFilter(undefined);
    setDateRange(undefined);
    setSelectedAuthors([]);
  };

  const toggleSaveFilters = () => {
    setUserPreferences(prev => {
      const newValue = !prev.savedFilters;
      
      if (!newValue) {
        // Clear saved preferences if disabled
        localStorage.removeItem('newsFilters');
      }
      
      return { ...prev, savedFilters: newValue };
    });
    
    toast.success(
      userPreferences.savedFilters 
        ? 'Filter preferences will no longer be saved' 
        : 'Filter preferences will be saved for future sessions'
    );
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
      key: 'author',
      title: 'Author',
      render: (article: NewsArticle) => (
        <div className="max-w-[150px] truncate">
          {article.author || <span className="text-gray-400">-</span>}
        </div>
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
        <div className="mb-6 space-y-4">
          <div className="flex flex-col sm:flex-row gap-4 justify-between">
            <div className="relative w-full sm:w-72">
              <Search className="absolute left-2 top-2.5 h-4 w-4 text-gray-500" />
              <Input
                placeholder="Search articles..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-8"
              />
            </div>
            <div className="flex gap-2">
              <Popover open={filterOpen} onOpenChange={setFilterOpen}>
                <PopoverTrigger asChild>
                  <Button 
                    variant="outline" 
                    className="flex items-center gap-2"
                  >
                    <Filter size={16} />
                    Filters
                    {(selectedCategories.length > 0 || featuredFilter !== undefined || 
                      dateRange !== undefined || selectedAuthors.length > 0) && (
                      <Badge className="ml-1 bg-primary text-white">
                        {selectedCategories.length + 
                         (featuredFilter !== undefined ? 1 : 0) + 
                         (dateRange !== undefined ? 1 : 0) + 
                         (selectedAuthors.length > 0 ? 1 : 0)}
                      </Badge>
                    )}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-80 p-4">
                  <div className="flex items-center justify-between mb-4">
                    <H4 className="font-medium">Filter Articles</H4>
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      onClick={clearAllFilters}
                      className="text-xs h-7"
                      disabled={selectedCategories.length === 0 && 
                               featuredFilter === undefined && 
                               dateRange === undefined &&
                               selectedAuthors.length === 0}
                    >
                      Clear all
                    </Button>
                  </div>
                  
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label>Categories</Label>
                      <div className="max-h-32 overflow-y-auto space-y-1 border rounded-md p-2">
                        {categories.map((category) => (
                          <div key={category} className="flex items-center space-x-2">
                            <Checkbox 
                              id={`category-${category}`}
                              checked={selectedCategories.includes(category)}
                              onCheckedChange={(checked) => {
                                if (checked) {
                                  setSelectedCategories(prev => [...prev, category]);
                                } else {
                                  setSelectedCategories(prev => 
                                    prev.filter(c => c !== category)
                                  );
                                }
                              }}
                            />
                            <label 
                              htmlFor={`category-${category}`}
                              className="text-sm cursor-pointer"
                            >
                              {category}
                            </label>
                          </div>
                        ))}
                        {categories.length === 0 && (
                          <div className="text-sm text-gray-500 p-1">
                            No categories available
                          </div>
                        )}
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      <Label>Featured Status</Label>
                      <Select 
                        value={featuredFilter === undefined ? 'all' : featuredFilter ? 'featured' : 'not-featured'}
                        onValueChange={(value) => {
                          if (value === 'all') setFeaturedFilter(undefined);
                          else setFeaturedFilter(value === 'featured');
                        }}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="All Articles" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="all">All Articles</SelectItem>
                          <SelectItem value="featured">Featured Only</SelectItem>
                          <SelectItem value="not-featured">Not Featured</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    
                    <div className="space-y-2">
                      <Label>Publication Date</Label>
                      <DatePickerWithRange 
                        date={dateRange}
                        onDateChange={setDateRange}
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label>Authors</Label>
                      <div className="max-h-32 overflow-y-auto space-y-1 border rounded-md p-2">
                        {authors.map((author) => (
                          <div key={author} className="flex items-center space-x-2">
                            <Checkbox 
                              id={`author-${author}`}
                              checked={selectedAuthors.includes(author)}
                              onCheckedChange={(checked) => {
                                if (checked) {
                                  setSelectedAuthors(prev => [...prev, author]);
                                } else {
                                  setSelectedAuthors(prev => 
                                    prev.filter(a => a !== author)
                                  );
                                }
                              }}
                            />
                            <label 
                              htmlFor={`author-${author}`}
                              className="text-sm cursor-pointer"
                            >
                              {author}
                            </label>
                          </div>
                        ))}
                        {authors.length === 0 && (
                          <div className="text-sm text-gray-500 p-1">
                            No authors available
                          </div>
                        )}
                      </div>
                    </div>
                    
                    <Separator />
                    
                    <div className="space-y-2 pt-2">
                      <Label>Sort By</Label>
                      <div className="grid grid-cols-2 gap-2">
                        <Select
                          value={sortField}
                          onValueChange={(value: any) => setSortField(value)}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Field" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="publish_date">Date</SelectItem>
                            <SelectItem value="title">Title</SelectItem>
                            <SelectItem value="created_at">Created</SelectItem>
                          </SelectContent>
                        </Select>
                        
                        <Select
                          value={sortDirection}
                          onValueChange={(value: any) => setSortDirection(value)}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Order" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="desc">Newest First</SelectItem>
                            <SelectItem value="asc">Oldest First</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                    
                    <div className="flex items-center space-x-2 pt-1">
                      <Checkbox 
                        id="save-filters"
                        checked={userPreferences.savedFilters}
                        onCheckedChange={toggleSaveFilters}
                      />
                      <label 
                        htmlFor="save-filters"
                        className="text-sm cursor-pointer"
                      >
                        Save filter preferences
                      </label>
                    </div>
                    
                    <div className="flex justify-end pt-2">
                      <Button 
                        size="sm"
                        onClick={() => setFilterOpen(false)}
                      >
                        Apply Filters
                      </Button>
                    </div>
                  </div>
                </PopoverContent>
              </Popover>
              
              <Select
                value={sortField}
                onValueChange={(value: any) => setSortField(value)}
              >
                <SelectTrigger className="w-[110px]">
                  <SelectValue placeholder="Sort by" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="publish_date">Date</SelectItem>
                  <SelectItem value="title">Title</SelectItem>
                  <SelectItem value="created_at">Created</SelectItem>
                </SelectContent>
              </Select>
              
              <Select
                value={sortDirection}
                onValueChange={(value: any) => setSortDirection(value)}
              >
                <SelectTrigger className="w-[130px]">
                  <SelectValue placeholder="Direction" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="desc">Newest First</SelectItem>
                  <SelectItem value="asc">Oldest First</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          
          {/* Active filters display */}
          {(selectedCategories.length > 0 || featuredFilter !== undefined || 
            dateRange !== undefined || selectedAuthors.length > 0) && (
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-sm text-gray-500">Filters:</span>
              
              {selectedCategories.map(category => (
                <Badge key={category} variant="secondary" className="pl-2 pr-1 flex items-center gap-1">
                  {category}
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-5 w-5 p-0 text-gray-500 hover:bg-transparent"
                    onClick={() => {
                      setSelectedCategories(prev => prev.filter(c => c !== category));
                    }}
                  >
                    <X size={12} />
                  </Button>
                </Badge>
              ))}
              
              {featuredFilter !== undefined && (
                <Badge variant="secondary" className="pl-2 pr-1 flex items-center gap-1">
                  {featuredFilter ? 'Featured' : 'Not Featured'}
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-5 w-5 p-0 text-gray-500 hover:bg-transparent"
                    onClick={() => setFeaturedFilter(undefined)}
                  >
                    <X size={12} />
                  </Button>
                </Badge>
              )}
              
              {dateRange?.from && (
                <Badge variant="secondary" className="pl-2 pr-1 flex items-center gap-1">
                  {format(dateRange.from, 'MMM d, yyyy')}
                  {dateRange.to && dateRange.to !== dateRange.from && 
                    ` - ${format(dateRange.to, 'MMM d, yyyy')}`}
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-5 w-5 p-0 text-gray-500 hover:bg-transparent"
                    onClick={() => setDateRange(undefined)}
                  >
                    <X size={12} />
                  </Button>
                </Badge>
              )}
              
              {selectedAuthors.map(author => (
                <Badge key={author} variant="secondary" className="pl-2 pr-1 flex items-center gap-1">
                  By: {author}
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-5 w-5 p-0 text-gray-500 hover:bg-transparent"
                    onClick={() => {
                      setSelectedAuthors(prev => prev.filter(a => a !== author));
                    }}
                  >
                    <X size={12} />
                  </Button>
                </Badge>
              ))}
              
              <Button
                variant="ghost"
                size="sm"
                className="h-7 text-xs underline"
                onClick={clearAllFilters}
              >
                Clear all
              </Button>
            </div>
          )}
        </div>

        <DataTable
          columns={columns}
          data={filteredArticles}
          isLoading={isLoading}
          onRowClick={onEditArticle}
          emptyMessage="No articles found. Create your first article!"
        />
        
        {filteredArticles && filteredArticles.length > 0 && (
          <div className="mt-4 text-right">
            <Small className="text-gray-500">
              Showing {filteredArticles.length} of {articles && articles.length || 0} articles
            </Small>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default EnhancedNewsArticleList;
