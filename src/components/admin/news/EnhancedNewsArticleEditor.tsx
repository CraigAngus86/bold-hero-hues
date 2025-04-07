
// Fixed the import statements
import React, { useState } from 'react';
import { useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';
import { ArrowLeft, Save } from 'lucide-react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import NewsImageUploader from '@/components/admin/common/NewsImageUploader';
import { createNewsArticle, updateNewsArticle } from '@/services/newsService';
import { toast } from 'sonner';
import { NewsArticle } from '@/types/news';
import { useCategories } from '@/hooks/useCategories';
import { generateSlug } from '@/utils/stringUtils';

interface NewsArticleEditorProps {
  article: NewsArticle | null;
  onBack: () => void;
  onSaved: () => void;
}

const NewsArticleEditor: React.FC<NewsArticleEditorProps> = ({ article, onBack, onSaved }) => {
  const { data: categories, isLoading } = useCategories();
  
  // Form state
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [excerpt, setExcerpt] = useState('');  // Added excerpt
  const [imageUrl, setImageUrl] = useState<string | undefined>('');
  const [publishDate, setPublishDate] = useState('');
  const [category, setCategory] = useState<string>('');
  const [author, setAuthor] = useState('');
  const [isFeatured, setIsFeatured] = useState(false);
  const [slug, setSlug] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Populate form if editing an existing article
  useEffect(() => {
    if (article) {
      setTitle(article.title || '');
      setContent(article.content || '');
      setExcerpt(article.excerpt || '');  // Set excerpt from article
      setImageUrl(article.image_url || '');
      setPublishDate(article.publish_date ? new Date(article.publish_date).toISOString().slice(0, 16) : '');
      setCategory(article.category || '');
      setAuthor(article.author || '');
      setIsFeatured(article.is_featured || false);
      setSlug(article.slug || '');
    } else {
      // Default values for new article
      setPublishDate(new Date().toISOString().slice(0, 16));
      setAuthor('Editor'); // Default author
      setIsFeatured(false);
    }
  }, [article]);

  // Generate slug when title changes
  useEffect(() => {
    if (!slug || slug === generateSlug(title)) {
      setSlug(generateSlug(title));
    }
  }, [title, slug]);

  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setTitle(e.target.value);
  };

  const handleImageUpload = (url: string) => {
    setImageUrl(url);
    toast.success('Image uploaded successfully');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const articleData = {
        title,
        content,
        excerpt,  // Include excerpt in articleData
        slug,
        image_url: imageUrl,
        publish_date: publishDate,
        category,
        author,
        is_featured: isFeatured
      };

      let result;
      if (article?.id) {
        // Update existing article
        result = await updateNewsArticle(article.id, articleData);
      } else {
        // Create new article
        result = await createNewsArticle(articleData);
      }

      if (!result.success) {
        throw new Error(result.error || 'Failed to save article');
      }

      toast.success(`Article ${article?.id ? 'updated' : 'created'} successfully`);
      onSaved();
    } catch (error) {
      console.error('Error saving article:', error);
      toast.error(error instanceof Error ? error.message : 'Failed to save article');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Card>
      <CardContent className="pt-6">
        <div className="flex justify-between items-center mb-6">
          <Button variant="ghost" size="sm" onClick={onBack}>
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Articles
          </Button>
          <h2 className="text-2xl font-bold">{article?.id ? 'Edit Article' : 'Create New Article'}</h2>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="title">Title</Label>
                  <Input 
                    id="title" 
                    value={title} 
                    onChange={(e) => setTitle(e.target.value)}
                    required
                    placeholder="Article Title"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="slug">Slug</Label>
                  <Input 
                    id="slug" 
                    value={slug} 
                    onChange={(e) => setSlug(e.target.value)}
                    required
                    placeholder="article-slug"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="category">Category</Label>
                  <Select 
                    value={category} 
                    onValueChange={setCategory}
                    required
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select a category" />
                    </SelectTrigger>
                    <SelectContent>
                      {!isLoading && categories ? categories.map((cat) => (
                        <SelectItem key={cat.id} value={cat.name}>{cat.name}</SelectItem>
                      )) : (
                        <SelectItem value="loading">Loading categories...</SelectItem>
                      )}
                      <SelectItem value="News">News</SelectItem>
                      <SelectItem value="Match Report">Match Report</SelectItem>
                      <SelectItem value="Club News">Club News</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="excerpt">Excerpt</Label>
                  <Textarea 
                    id="excerpt" 
                    value={excerpt} 
                    onChange={(e) => setExcerpt(e.target.value)}
                    required
                    placeholder="Brief summary of the article..."
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="publish-date">Publish Date</Label>
                  <Input 
                    id="publish-date" 
                    type="datetime-local"
                    value={publishDate} 
                    onChange={(e) => setPublishDate(e.target.value)}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="author">Author</Label>
                  <Input 
                    id="author" 
                    value={author} 
                    onChange={(e) => setAuthor(e.target.value)}
                    placeholder="Article Author"
                  />
                </div>

                <div className="flex items-center space-x-2">
                  <Checkbox 
                    id="featured" 
                    checked={isFeatured}
                    onCheckedChange={(value) => setIsFeatured(!!value)}
                  />
                  <Label htmlFor="featured">Featured Article</Label>
                </div>
              </div>

              <div className="space-y-4">
                <Label>Featured Image</Label>
                {imageUrl ? (
                  <div className="relative">
                    <img 
                      src={imageUrl} 
                      alt="Article featured image" 
                      className="w-full h-auto rounded-md object-cover max-h-64"
                    />
                    <Button
                      type="button"
                      variant="destructive"
                      size="sm"
                      className="absolute top-2 right-2"
                      onClick={() => setImageUrl('')}
                    >
                      Remove
                    </Button>
                  </div>
                ) : (
                  <NewsImageUploader onUploadComplete={handleImageUpload} />
                )}
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="content">Content</Label>
              <Textarea
                id="content"
                value={content}
                onChange={(e) => setContent(e.target.value)}
                required
                placeholder="Write your article content here..."
                className="min-h-[300px]"
              />
            </div>
          </div>

          <div className="flex justify-end gap-2">
            <Button 
              type="button" 
              variant="outline" 
              onClick={onBack}
              disabled={isSubmitting}
            >
              Cancel
            </Button>
            <Button 
              type="submit"
              disabled={isSubmitting}
            >
              <Save className="mr-2 h-4 w-4" />
              {isSubmitting ? 'Saving...' : 'Save Article'}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
};

export default NewsArticleEditor;
