
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { createNewsArticle, updateNewsArticle } from '@/services/newsService';
import { NewsArticle } from '@/types';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { RichTextEditor } from '@/components/admin/common/RichTextEditor';
import NewsImageUploader from '@/components/admin/common/NewsImageUploader';
import { toast } from 'sonner';

interface NewsArticleEditorProps {
  article?: NewsArticle | null;
  categories?: string[];
  onSaveComplete?: () => void;
  isLoadingCategories?: boolean;
}

const NewsArticleEditor: React.FC<NewsArticleEditorProps> = ({
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
  const [publishDate, setPublishDate] = useState<string>(
    new Date().toISOString().split('T')[0]
  );
  const [slug, setSlug] = useState('');

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

  // Generate a slug from the title whenever title changes
  useEffect(() => {
    if (!article?.slug && title) {
      const generatedSlug = title
        .toLowerCase()
        .replace(/[^\w\s]/gi, '')
        .replace(/\s+/g, '-');
      setSlug(generatedSlug);
    }
  }, [title, article]);

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
        slug: slug || title.toLowerCase().replace(/[^\w\s]/gi, '').replace(/\s+/g, '-')
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

  return (
    <Card>
      <CardHeader>
        <CardTitle>{article ? 'Edit' : 'Create'} News Article</CardTitle>
      </CardHeader>
      <CardContent>
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

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
          </div>

          <div className="space-y-2">
            <Label htmlFor="slug">URL Slug *</Label>
            <Input
              id="slug"
              value={slug}
              onChange={(e) => setSlug(e.target.value)}
              placeholder="article-url-slug"
              required
            />
            <p className="text-xs text-gray-500">This will be used in the article's URL</p>
          </div>

          <div className="space-y-2">
            <Label>Content *</Label>
            <RichTextEditor
              value={content}
              onChange={setContent}
              placeholder="Write your article content here..."
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

          <div className="flex justify-end space-x-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => onSaveComplete?.()}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting
                ? 'Saving...'
                : article
                ? 'Update Article'
                : 'Create Article'}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
};

export default NewsArticleEditor;
