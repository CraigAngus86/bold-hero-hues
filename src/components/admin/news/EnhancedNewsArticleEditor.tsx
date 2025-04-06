
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { createNewsArticle, updateNewsArticle } from '@/services/newsService';
import { NewsArticle } from '@/types';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { RichTextEditor } from '@/components/admin/common/RichTextEditor';
import NewsImageUploader from '@/components/admin/common/NewsImageUploader';
import { toast } from 'sonner';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Eye, Save, ArrowLeft } from 'lucide-react';

interface EnhancedNewsArticleEditorProps {
  article?: NewsArticle | null;
  categories?: string[];
  onSaveComplete?: () => void;
  isLoadingCategories?: boolean;
}

const EnhancedNewsArticleEditor: React.FC<EnhancedNewsArticleEditorProps> = ({
  article,
  categories = [],
  onSaveComplete,
  isLoadingCategories = false,
}) => {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [category, setCategory] = useState('');
  const [author, setAuthor] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [isFeatured, setIsFeatured] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [slug, setSlug] = useState('');
  const [activeTab, setActiveTab] = useState('edit');
  const [publishDate, setPublishDate] = useState<string>(
    new Date().toISOString().split('T')[0]
  );

  useEffect(() => {
    if (article) {
      setTitle(article.title || '');
      setContent(article.content || '');
      setCategory(article.category || '');
      setAuthor(article.author || '');
      setImageUrl(article.image_url || '');
      setIsFeatured(article.is_featured || false);
      setSlug(article.slug || '');
      
      // Format the date for input[type="date"]
      if (article.publish_date) {
        const date = new Date(article.publish_date);
        setPublishDate(date.toISOString().split('T')[0]);
      }
    }
  }, [article]);

  const handleImageUploaded = (url: string) => {
    setImageUrl(url);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !content || !category) {
      toast.error('Please fill out all required fields');
      return;
    }

    setIsSubmitting(true);

    try {
      // Format date with time for database
      const formattedDate = `${publishDate}T12:00:00`;
      
      const articleData = {
        title,
        content,
        category,
        author,
        image_url: imageUrl,
        is_featured: isFeatured,
        publish_date: formattedDate,
        slug: slug || undefined // Only include if provided
      };

      let result;
      
      if (article?.id) {
        // Update existing article
        result = await updateNewsArticle(article.id, articleData);
      } else {
        // Create new article
        result = await createNewsArticle(articleData);
      }
      
      if (result.success && result.data) {
        toast.success(`Article ${article ? 'updated' : 'created'} successfully`);
        onSaveComplete?.();
      } else {
        throw new Error(result.error || 'Failed to save article');
      }
    } catch (error) {
      console.error('Error saving article:', error);
      toast.error(`Failed to save article: ${error.message}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Generate a preview of the article
  const previewContent = () => {
    return (
      <div className="prose prose-blue max-w-none">
        <h1>{title}</h1>
        {imageUrl && (
          <img
            src={imageUrl}
            alt={title}
            className="w-full h-64 object-cover object-center rounded-lg mb-6"
          />
        )}
        <div className="flex justify-between text-sm text-gray-600 mb-4">
          <span>By {author || 'Anonymous'}</span>
          <span>{new Date(publishDate).toLocaleDateString()}</span>
        </div>
        <div dangerouslySetInnerHTML={{ __html: content }} />
      </div>
    );
  };

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>{article ? 'Edit' : 'Create'} News Article</CardTitle>
        <div className="flex space-x-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => onSaveComplete?.()}
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to List
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="mb-6">
            <TabsTrigger value="edit">Edit Article</TabsTrigger>
            <TabsTrigger value="preview">Preview</TabsTrigger>
          </TabsList>
          
          <TabsContent value="edit">
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="title">Title *</Label>
                  <Input
                    id="title"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="Article Title"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="category">Category *</Label>
                  <Select
                    value={category}
                    onValueChange={setCategory}
                    disabled={isLoadingCategories}
                  >
                    <SelectTrigger id="category">
                      <SelectValue placeholder="Select a category" />
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
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="author">Author</Label>
                  <Input
                    id="author"
                    value={author}
                    onChange={(e) => setAuthor(e.target.value)}
                    placeholder="Article Author"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="publishDate">Publish Date</Label>
                  <Input
                    id="publishDate"
                    type="date"
                    value={publishDate}
                    onChange={(e) => setPublishDate(e.target.value)}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="slug">Slug (Optional)</Label>
                  <Input
                    id="slug"
                    value={slug}
                    onChange={(e) => setSlug(e.target.value)}
                    placeholder="article-url-slug"
                  />
                  <p className="text-xs text-gray-500">Leave blank to auto-generate from title</p>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="content">Content *</Label>
                <RichTextEditor
                  id="content"
                  value={content}
                  onChange={setContent}
                  placeholder="Write your article content here..."
                  className="min-h-[300px]"
                />
              </div>

              <div className="space-y-2">
                <Label>Featured Image</Label>
                <NewsImageUploader 
                  onUploadComplete={handleImageUploaded} 
                  className="mt-2"
                />
                
                {imageUrl && (
                  <div className="mt-4">
                    <p className="text-sm font-medium mb-2">Current Image</p>
                    <div className="relative aspect-video overflow-hidden rounded-md border">
                      <img
                        src={imageUrl}
                        alt="Article featured"
                        className="w-full h-full object-cover"
                      />
                    </div>
                  </div>
                )}
              </div>

              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  id="featured"
                  checked={isFeatured}
                  onChange={(e) => setIsFeatured(e.target.checked)}
                  className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary"
                />
                <Label htmlFor="featured" className="text-sm font-medium">
                  Feature this article on the homepage
                </Label>
              </div>

              <div className="flex justify-end space-x-2 pt-4">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setActiveTab('preview')}
                >
                  <Eye className="mr-2 h-4 w-4" />
                  Preview
                </Button>
                <Button type="submit" disabled={isSubmitting}>
                  <Save className="mr-2 h-4 w-4" />
                  {isSubmitting
                    ? 'Saving...'
                    : article
                    ? 'Update Article'
                    : 'Create Article'}
                </Button>
              </div>
            </form>
          </TabsContent>
          
          <TabsContent value="preview" className="relative">
            <div className="absolute top-0 right-0">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setActiveTab('edit')}
              >
                Back to Editing
              </Button>
            </div>
            <div className="p-6 bg-white rounded-lg border mt-10">
              {previewContent()}
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};

export default EnhancedNewsArticleEditor;
