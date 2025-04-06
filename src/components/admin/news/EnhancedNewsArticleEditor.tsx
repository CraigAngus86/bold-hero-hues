
import React, { useState, useEffect } from 'react';
import { toast } from 'sonner';
import { useQueryClient } from '@tanstack/react-query';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Separator } from '@/components/ui/separator';
import { RichTextEditor } from '@/components/admin/common/RichTextEditor';
import { ImageUploader } from '@/components/common/ImageUploader';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { ArrowLeft, Calendar, Check, Pencil, X } from 'lucide-react';
import { createNewsArticle, updateNewsArticle, getNewsCategories } from '@/services/news';
import { NewsArticle } from '@/types';
import { format, parseISO } from 'date-fns';

interface EnhancedNewsArticleEditorProps {
  article?: NewsArticle;
  onBack: () => void;
  onSaved?: () => void;
}

const EnhancedNewsArticleEditor: React.FC<EnhancedNewsArticleEditorProps> = ({
  article,
  onBack,
  onSaved
}) => {
  // Query client for cache invalidation
  const queryClient = useQueryClient();

  // Form state
  const [title, setTitle] = useState<string>(article?.title || '');
  const [content, setContent] = useState<string>(article?.content || '');
  const [category, setCategory] = useState<string>(article?.category || '');
  const [author, setAuthor] = useState<string>(article?.author || '');
  const [imageUrl, setImageUrl] = useState<string>(article?.image_url || '');
  const [isFeatured, setIsFeatured] = useState<boolean>(article?.is_featured || false);
  const [publishDate, setPublishDate] = useState<string>('');
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [categories, setCategories] = useState<string[]>([]);
  const [activeTab, setActiveTab] = useState<string>('edit');

  // Load categories on mount
  useEffect(() => {
    const loadCategories = async () => {
      try {
        const cats = await getNewsCategories();
        if (cats && cats.length > 0) {
          setCategories(cats);
          // Set default category if none is set
          if (!article?.category) {
            setCategory(cats[0]);
          }
        }
      } catch (error) {
        console.error('Error loading categories:', error);
        toast.error('Failed to load categories');
      }
    };

    loadCategories();
  }, [article]);

  // Format publish date on mount
  useEffect(() => {
    if (article?.publish_date) {
      try {
        const date = parseISO(article.publish_date);
        setPublishDate(format(date, 'yyyy-MM-dd'));
      } catch (error) {
        console.error('Error parsing publish date:', error);
        setPublishDate(format(new Date(), 'yyyy-MM-dd'));
      }
    } else {
      setPublishDate(format(new Date(), 'yyyy-MM-dd'));
    }
  }, [article]);

  // Handle image upload
  const handleImageUpload = (url: string) => {
    setImageUrl(url);
    toast.success('Image uploaded successfully');
  };

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      // Validate form
      if (!title.trim()) {
        throw new Error('Title is required');
      }

      if (!content.trim()) {
        throw new Error('Content is required');
      }

      if (!category) {
        throw new Error('Category is required');
      }

      // Prepare full article data
      const articleData = {
        title,
        content,
        category,
        author: author || null,
        image_url: imageUrl || null,
        is_featured: isFeatured,
        publish_date: new Date(publishDate).toISOString(),
        slug: article?.slug || ''
      };

      let result;
      
      // Create new or update existing
      if (article?.id) {
        result = await updateNewsArticle(article.id, articleData);
      } else {
        result = await createNewsArticle(articleData);
      }

      if (result.success) {
        toast.success(article?.id ? 'Article updated successfully' : 'Article created successfully');
        
        // Invalidate relevant queries
        queryClient.invalidateQueries({ queryKey: ['newsArticles'] });
        
        // Call onSaved if provided
        if (onSaved) {
          onSaved();
        }
      } else {
        throw new Error(result.error || 'Failed to save article');
      }
    } catch (error) {
      console.error('Error saving article:', error);
      toast.error(error instanceof Error ? error.message : 'An error occurred');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <Card className="border-muted">
        <CardHeader className="bg-muted/20 border-b">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Button 
                type="button" 
                variant="ghost" 
                size="sm" 
                onClick={onBack}
              >
                <ArrowLeft className="h-4 w-4 mr-1" />
                Back
              </Button>
              <Separator orientation="vertical" className="h-6" />
              <CardTitle>
                {article?.id ? 'Edit Article' : 'Create Article'}
              </CardTitle>
            </div>
            
            <div className="flex items-center space-x-2">
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={onBack}
                disabled={isSubmitting}
              >
                <X className="h-4 w-4 mr-1" />
                Cancel
              </Button>
              <Button
                type="submit"
                size="sm"
                disabled={isSubmitting}
              >
                {isSubmitting ? (
                  <>Saving...</>
                ) : (
                  <>
                    <Check className="h-4 w-4 mr-1" />
                    Save
                  </>
                )}
              </Button>
            </div>
          </div>
        </CardHeader>
        
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <div className="px-6 pt-4 border-b">
            <TabsList className="mb-2">
              <TabsTrigger value="edit" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
                <Pencil className="h-4 w-4 mr-1" />
                Edit
              </TabsTrigger>
              <TabsTrigger value="preview" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
                Preview
              </TabsTrigger>
            </TabsList>
          </div>
          
          <TabsContent value="edit">
            <CardContent className="p-6 space-y-6">
              <div className="space-y-4">
                <div>
                  <Label htmlFor="title">Title *</Label>
                  <Input
                    id="title"
                    placeholder="Enter article title"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    required
                    className="mt-1"
                  />
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="category">Category *</Label>
                    <Select 
                      value={category} 
                      onValueChange={setCategory}
                    >
                      <SelectTrigger className="mt-1">
                        <SelectValue placeholder="Select category" />
                      </SelectTrigger>
                      <SelectContent>
                        {categories.map((cat) => (
                          <SelectItem key={cat} value={cat}>
                            {cat}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div>
                    <Label htmlFor="author">Author</Label>
                    <Input
                      id="author"
                      placeholder="Author name"
                      value={author}
                      onChange={(e) => setAuthor(e.target.value)}
                      className="mt-1"
                    />
                  </div>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="publishDate">Publish Date *</Label>
                    <div className="relative mt-1">
                      <Input
                        id="publishDate"
                        type="date"
                        value={publishDate}
                        onChange={(e) => setPublishDate(e.target.value)}
                        required
                      />
                      <Calendar className="absolute right-3 top-2.5 h-4 w-4 text-muted-foreground" />
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-2 mt-7">
                    <Switch
                      id="featured"
                      checked={isFeatured}
                      onCheckedChange={setIsFeatured}
                    />
                    <Label htmlFor="featured">Featured Article</Label>
                  </div>
                </div>
                
                <div>
                  <Label htmlFor="image">Featured Image</Label>
                  <div className="mt-1">
                    <ImageUploader
                      currentImage={imageUrl}
                      onImageUploaded={handleImageUpload}
                      folder="news"
                    />
                  </div>
                </div>
                
                <div>
                  <Label htmlFor="content">Content *</Label>
                  <div className="mt-1">
                    <RichTextEditor 
                      value={content} 
                      onChange={setContent}
                      placeholder="Write article content here..." 
                      className="min-h-[300px]"
                    />
                  </div>
                </div>
              </div>
            </CardContent>
          </TabsContent>
          
          <TabsContent value="preview">
            <CardContent className="p-6">
              <div className="max-w-3xl mx-auto space-y-6">
                {imageUrl && (
                  <div className="relative w-full h-72 rounded-lg overflow-hidden">
                    <img 
                      src={imageUrl} 
                      alt={title} 
                      className="object-cover w-full h-full"
                    />
                  </div>
                )}
                
                <div>
                  <h1 className="text-3xl font-bold">{title || 'Untitled Article'}</h1>
                  
                  <div className="flex items-center mt-2 text-sm text-muted-foreground">
                    {category && (
                      <span className="bg-primary/10 text-primary px-2 py-1 rounded-full text-xs">
                        {category}
                      </span>
                    )}
                    
                    <span className="mx-2">•</span>
                    
                    <span>
                      {publishDate ? format(new Date(publishDate), 'MMM d, yyyy') : 'Unpublished'}
                    </span>
                    
                    {author && (
                      <>
                        <span className="mx-2">•</span>
                        <span>By {author}</span>
                      </>
                    )}
                    
                    {isFeatured && (
                      <>
                        <span className="mx-2">•</span>
                        <span className="bg-yellow-100 text-yellow-800 px-2 py-1 rounded-full text-xs">
                          Featured
                        </span>
                      </>
                    )}
                  </div>
                </div>
                
                <div 
                  className="prose max-w-none"
                  dangerouslySetInnerHTML={{ __html: content }}
                />
              </div>
            </CardContent>
          </TabsContent>
        </Tabs>
        
        <CardFooter className="bg-muted/20 border-t p-4 flex justify-between">
          <Button
            type="button"
            variant="ghost"
            onClick={onBack}
            disabled={isSubmitting}
          >
            Cancel
          </Button>
          
          <Button
            type="submit"
            disabled={isSubmitting}
          >
            {isSubmitting ? 'Saving...' : article?.id ? 'Update' : 'Publish'}
          </Button>
        </CardFooter>
      </Card>
    </form>
  );
};

export default EnhancedNewsArticleEditor;
