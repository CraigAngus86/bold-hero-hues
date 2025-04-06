
import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { toast } from 'sonner';
import { Checkbox } from '@/components/ui/checkbox';
import { supabase } from '@/integrations/supabase/client';
import { MediaSelector } from '@/components/admin/common/media-selector';

// Define the form schema
const newsFormSchema = z.object({
  title: z.string().min(1, { message: "Title is required" }),
  content: z.string().min(1, { message: "Content is required" }),
  category: z.string().min(1, { message: "Category is required" }),
  slug: z.string().min(1, { message: "Slug is required" }),
  image_url: z.string().optional(),
  is_featured: z.boolean().default(false),
  author: z.string().optional(),
});

type NewsFormValues = z.infer<typeof newsFormSchema>;

interface Category {
  id: string;
  name: string;
}

interface NewsEditorProps {
  articleId?: string;
  onSave: () => void;
  onCancel: () => void;
}

const NewsEditor: React.FC<NewsEditorProps> = ({ articleId, onSave, onCancel }) => {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [categories, setCategories] = useState<Category[]>([]);

  // Initialize the form
  const form = useForm<NewsFormValues>({
    resolver: zodResolver(newsFormSchema),
    defaultValues: {
      title: "",
      content: "",
      category: "",
      slug: "",
      image_url: "",
      is_featured: false,
      author: "",
    },
  });

  // Load categories
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const { data, error } = await supabase
          .from('news_categories')
          .select('*')
          .order('name');

        if (error) throw error;
        setCategories(data || []);
      } catch (error) {
        console.error('Error fetching categories:', error);
        toast.error('Failed to load categories');
      }
    };

    fetchCategories();
  }, []);

  // Load article data if editing
  useEffect(() => {
    if (articleId) {
      const fetchArticle = async () => {
        setIsLoading(true);
        try {
          const { data, error } = await supabase
            .from('news_articles')
            .select('*')
            .eq('id', articleId)
            .single();

          if (error) throw error;

          if (data) {
            form.reset({
              title: data.title || "",
              content: data.content || "",
              category: data.category || "",
              slug: data.slug || "",
              image_url: data.image_url || "",
              is_featured: data.is_featured || false,
              author: data.author || "",
            });
          }
        } catch (error) {
          console.error('Error fetching article:', error);
          toast.error('Failed to load article');
        } finally {
          setIsLoading(false);
        }
      };

      fetchArticle();
    }
  }, [articleId, form]);

  // Generate slug from title
  const generateSlug = () => {
    const title = form.getValues("title");
    if (!title) return;

    const slug = title
      .toLowerCase()
      .replace(/[^\w\s-]/g, '') // Remove non-word chars
      .replace(/\s+/g, '-')     // Replace spaces with -
      .replace(/-+/g, '-')      // Replace multiple - with single -
      .trim();                   // Trim leading/trailing whitespace

    form.setValue("slug", slug);
  };

  // Handle form submission
  const onSubmit = async (values: NewsFormValues) => {
    setIsLoading(true);
    try {
      if (articleId) {
        // Update existing article
        const { error } = await supabase
          .from('news_articles')
          .update(values)
          .eq('id', articleId);

        if (error) throw error;
        toast.success('Article updated successfully');
      } else {
        // Create new article
        const { error } = await supabase
          .from('news_articles')
          .insert(values);

        if (error) throw error;
        toast.success('Article created successfully');
      }

      onSave();
    } catch (error) {
      console.error('Error saving article:', error);
      toast.error('Failed to save article');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>{articleId ? 'Edit Article' : 'Create Article'}</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="title">Title</Label>
            <Input 
              id="title" 
              placeholder="Enter article title"
              {...form.register("title")}
              onBlur={() => {
                if (!form.getValues("slug")) {
                  generateSlug();
                }
              }}
            />
            {form.formState.errors.title && (
              <p className="text-sm text-red-500">{form.formState.errors.title.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="slug">Slug</Label>
            <div className="flex gap-2">
              <Input 
                id="slug" 
                placeholder="article-slug"
                {...form.register("slug")}
              />
              <Button 
                type="button" 
                variant="outline" 
                onClick={generateSlug}
              >
                Generate
              </Button>
            </div>
            {form.formState.errors.slug && (
              <p className="text-sm text-red-500">{form.formState.errors.slug.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="category">Category</Label>
            <Select 
              value={form.getValues("category")}
              onValueChange={(value) => form.setValue("category", value)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select category" />
              </SelectTrigger>
              <SelectContent>
                {categories.map((category) => (
                  <SelectItem key={category.id} value={category.name}>
                    {category.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {form.formState.errors.category && (
              <p className="text-sm text-red-500">{form.formState.errors.category.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="author">Author</Label>
            <Input 
              id="author" 
              placeholder="Author Name (optional)"
              {...form.register("author")}
            />
          </div>

          <div className="space-y-2">
            <Label>Featured Image</Label>
            <MediaSelector
              currentValue={form.getValues("image_url")}
              onSelect={(url) => form.setValue("image_url", url)}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="content">Content</Label>
            <Textarea 
              id="content"
              rows={15}
              placeholder="Write your article content here..."
              {...form.register("content")}
            />
            {form.formState.errors.content && (
              <p className="text-sm text-red-500">{form.formState.errors.content.message}</p>
            )}
          </div>

          <div className="flex items-center space-x-2">
            <Checkbox 
              id="is_featured" 
              checked={form.getValues("is_featured")}
              onCheckedChange={(checked) => form.setValue("is_featured", !!checked)}
            />
            <Label htmlFor="is_featured">Feature this article</Label>
          </div>

          <div className="flex justify-end gap-2">
            <Button 
              type="button" 
              variant="outline" 
              onClick={onCancel}
              disabled={isLoading}
            >
              Cancel
            </Button>
            <Button 
              type="submit" 
              disabled={isLoading}
            >
              {isLoading ? 'Saving...' : articleId ? 'Update Article' : 'Create Article'}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
};

export default NewsEditor;
