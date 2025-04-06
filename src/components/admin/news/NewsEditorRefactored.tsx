
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { Form } from "@/components/ui/form"
import { Input } from "@/components/ui/input";
import { useSupabase } from '@/hooks/useSupabase';
import { NewsArticle } from '@/types';
import { slugify } from '@/lib/stringUtils';
import { FormSection, FormImageField, FormRichTextField } from '../common/form-components';
import { Switch } from '@/components/ui/switch';

const formSchema = z.object({
  title: z.string().min(3, {
    message: "Title must be at least 3 characters.",
  }),
  content: z.string().min(10, {
    message: "Content must be at least 10 characters.",
  }),
  image_url: z.string().optional(),
  category: z.string().min(3, {
    message: "Category must be at least 3 characters.",
  }),
  author: z.string().optional(),
  is_featured: z.boolean().default(false),
  slug: z.string().min(3, {
    message: "Slug must be at least 3 characters.",
  }),
});

type FormValues = z.infer<typeof formSchema>;

const NewsEditorRefactored = () => {
  const { articleId } = useParams<{ articleId: string }>();
  const navigate = useNavigate();
  const { supabase } = useSupabase();
  const [isLoading, setIsLoading] = useState(false);

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: '',
      content: '',
      image_url: '',
      category: 'news',
      author: '',
      is_featured: false,
      slug: ''
    },
    mode: "onChange"
  });

  // Load article data when editing
  useEffect(() => {
    if (!articleId) return;

    const loadArticle = async () => {
      setIsLoading(true);
      try {
        const { data, error } = await supabase
          .from('news')
          .select('*')
          .eq('id', articleId)
          .single();

        if (error) {
          throw error;
        }

        // Reset form with article data
        form.reset(data);
      } catch (error: any) {
        toast.error(`Failed to load article: ${error.message}`);
      } finally {
        setIsLoading(false);
      }
    };

    loadArticle();
  }, [articleId, supabase, form]);

  // Generate slug from title
  const watchTitle = form.watch('title');
  useEffect(() => {
    if (watchTitle && !articleId && !form.getValues('slug')) {
      const newSlug = slugify(watchTitle);
      form.setValue('slug', newSlug);
    }
  }, [watchTitle, form, articleId]);

  const onSubmit = async (data: FormValues) => {
    setIsLoading(true);
    try {
      if (articleId) {
        // Update existing article
        const { error } = await supabase
          .from('news')
          .update(data)
          .eq('id', articleId);

        if (error) throw error;
        toast.success('Article updated successfully');
      } else {
        // Create new article
        const { error } = await supabase
          .from('news')
          .insert([data]);

        if (error) throw error;
        toast.success('Article created successfully');
      }

      navigate('/admin/news');
    } catch (error: any) {
      toast.error(`Failed to save article: ${error.message}`);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!articleId || !confirm('Are you sure you want to delete this article?')) return;

    setIsLoading(true);
    try {
      const { error } = await supabase
        .from('news')
        .delete()
        .eq('id', articleId);

      if (error) throw error;
      toast.success('Article deleted successfully');
      navigate('/admin/news');
    } catch (error: any) {
      toast.error(`Failed to delete article: ${error.message}`);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="container mx-auto py-10">
      <h1 className="text-3xl font-bold mb-5">{articleId ? 'Edit Article' : 'Create Article'}</h1>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
          <FormSection 
            title="Article Details" 
            description="Basic information about the article"
          >
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Form.Field
                control={form.control}
                name="title"
                render={({ field }) => (
                  <Form.Item>
                    <Form.Label>Title<span className="text-red-500 ml-1">*</span></Form.Label>
                    <Form.Control>
                      <Input placeholder="Article title" {...field} />
                    </Form.Control>
                    <Form.Message />
                  </Form.Item>
                )}
              />
              
              <Form.Field
                control={form.control}
                name="slug"
                render={({ field }) => (
                  <Form.Item>
                    <Form.Label>Slug<span className="text-red-500 ml-1">*</span></Form.Label>
                    <Form.Control>
                      <Input placeholder="article-slug" {...field} />
                    </Form.Control>
                    <Form.Description>
                      Used in the URL: /news/{field.value}
                    </Form.Description>
                    <Form.Message />
                  </Form.Item>
                )}
              />

              <Form.Field
                control={form.control}
                name="category"
                render={({ field }) => (
                  <Form.Item>
                    <Form.Label>Category<span className="text-red-500 ml-1">*</span></Form.Label>
                    <Form.Control>
                      <Input placeholder="Category" {...field} />
                    </Form.Control>
                    <Form.Message />
                  </Form.Item>
                )}
              />

              <Form.Field
                control={form.control}
                name="author"
                render={({ field }) => (
                  <Form.Item>
                    <Form.Label>Author</Form.Label>
                    <Form.Control>
                      <Input placeholder="Author name" {...field} />
                    </Form.Control>
                    <Form.Message />
                  </Form.Item>
                )}
              />
            </div>
          </FormSection>

          <FormSection title="Content">
            <FormRichTextField
              control={form.control}
              name="content"
              label="Article Content"
              required
              height={400}
            />
          </FormSection>

          <FormSection title="Media">
            <FormImageField
              control={form.control}
              name="image_url"
              label="Featured Image"
              description="Select an image for this article"
            />
          </FormSection>

          <FormSection title="Publishing Options">
            <Form.Field
              control={form.control}
              name="is_featured"
              render={({ field }) => (
                <Form.Item className="flex flex-row items-center justify-between rounded-lg border p-4">
                  <div className="space-y-0.5">
                    <Form.Label className="text-base">Featured Article</Form.Label>
                    <Form.Description>
                      Featured articles appear prominently on the homepage
                    </Form.Description>
                  </div>
                  <Form.Control>
                    <Switch
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  </Form.Control>
                </Form.Item>
              )}
            />
          </FormSection>

          <div className="flex justify-between">
            <Button type="submit" disabled={isLoading}>
              {isLoading ? 'Saving...' : 'Save'}
            </Button>
            {articleId && (
              <Button
                type="button"
                variant="destructive"
                onClick={handleDelete}
                disabled={isLoading}
              >
                {isLoading ? 'Deleting...' : 'Delete'}
              </Button>
            )}
          </div>
        </form>
      </Form>
    </div>
  );
};

export default NewsEditorRefactored;
