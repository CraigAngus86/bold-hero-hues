
import React, { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Editor } from '@tinymce/tinymce-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { toast } from 'sonner';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { useSupabase } from '@/hooks/useSupabase';
import { MediaSelector } from '@/components/admin/common/media-selector';
import { NewsArticle } from '@/types';
import { slugify } from '@/lib/stringUtils';

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

const NewsEditor = () => {
  const { articleId } = useParams<{ articleId: string }>();
  const navigate = useNavigate();
  const { supabase } = useSupabase();
  const [article, setArticle] = useState<NewsArticle | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [editorContent, setEditorContent] = useState('');
  const [selectedImage, setSelectedImage] = useState<string | null>(null);

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
  })

  const loadArticle = useCallback(async () => {
    if (!articleId) return;

    setIsLoading(true);
    try {
      const { data, error } = await supabase
        .from('news_articles')
        .select('*')
        .eq('id', articleId)
        .single();

      if (error) {
        throw error;
      }

      if (data) {
        const articleData = data as NewsArticle;
        setArticle(articleData);
        
        form.reset({
          title: articleData.title || '',
          content: articleData.content || '',
          image_url: articleData.image_url || '',
          category: articleData.category || 'news',
          author: articleData.author || '',
          is_featured: articleData.is_featured || false,
          slug: articleData.slug || '',
        });
        
        setEditorContent(articleData.content || '');
        setSelectedImage(articleData.image_url || null);
      }
    } catch (error: any) {
      toast.error(`Failed to load article: ${error.message}`);
    } finally {
      setIsLoading(false);
    }
  }, [articleId, supabase, form]);

  useEffect(() => {
    loadArticle();
  }, [loadArticle]);

  const handleEditorChange = (content: string) => {
    setEditorContent(content);
    form.setValue("content", content);
  };

  const handleImageSelect = (imageUrl: string) => {
    setSelectedImage(imageUrl);
    form.setValue("image_url", imageUrl);
  };

  const handleCreate = async (formData: FormValues) => {
    setIsLoading(true);
    try {
      const { data, error } = await supabase
        .from('news_articles')
        .insert({
          title: formData.title,
          content: editorContent,
          image_url: selectedImage,
          category: formData.category,
          slug: formData.slug,
          author: formData.author,
          is_featured: formData.is_featured
        })
        .select();

      if (error) throw error;

      toast.success('Article created successfully');
      navigate('/admin/news');
    } catch (error: any) {
      toast.error(`Failed to create article: ${error.message}`);
    } finally {
      setIsLoading(false);
    }
  };

  const handleUpdate = async (formData: FormValues) => {
    setIsLoading(true);
    
    try {
      const updates = {
        title: formData.title,
        content: formData.content,
        category: formData.category,
        slug: formData.slug,
        author: formData.author,
        image_url: formData.image_url,
        is_featured: formData.is_featured
      };
      
      const { data, error } = await supabase
        .from('news_articles')
        .update(updates)
        .eq('id', articleId)
        .select();

      if (error) throw error;

      toast.success('Article updated successfully');
      navigate('/admin/news');
    } catch (error: any) {
      toast.error(`Failed to update article: ${error.message}`);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!articleId) return;

    setIsLoading(true);
    try {
      const { error } = await supabase
        .from('news_articles')
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

  const onSubmit = (data: FormValues) => {
    if (articleId) {
      handleUpdate(data);
    } else {
      handleCreate(data);
    }
  }

  return (
    <div className="container mx-auto py-10">
      <h1 className="text-3xl font-bold mb-5">{articleId ? 'Edit Article' : 'Create Article'}</h1>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Title</FormLabel>
                  <FormControl>
                    <Input placeholder="Article title" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="slug"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Slug</FormLabel>
                  <FormControl>
                    <Input placeholder="Article slug" {...field} onChange={(e) => {
                      field.onChange(slugify(e.target.value));
                    }} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="category"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Category</FormLabel>
                  <FormControl>
                    <Input placeholder="Category" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="author"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Author</FormLabel>
                  <FormControl>
                    <Input placeholder="Author" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <div>
            <Label>Content</Label>
            <Editor
              apiKey={process.env.NEXT_PUBLIC_TINY_MCE_API_KEY || ''}
              value={editorContent}
              init={{
                height: 500,
                menubar: true,
                plugins: [
                  'advlist autolink lists link image charmap print preview anchor',
                  'searchreplace visualblocks code fullscreen',
                  'insertdatetime media table paste code help wordcount'
                ],
                toolbar:
                  'undo redo | formatselect | ' +
                  'bold italic backcolor | alignleft aligncenter ' +
                  'alignright alignjustify | bullist numlist outdent indent | ' +
                  'removeformat | help',
                content_style: 'body { font-family:Helvetica,Arial,sans-serif; font-size:14px }'
              }}
              onEditorChange={handleEditorChange}
            />
            <FormMessage />
          </div>

          <div>
            <Label>Image</Label>
            <MediaSelector onSelect={handleImageSelect} selectedImage={selectedImage} />
            <FormMessage />
          </div>

          <FormField
            control={form.control}
            name="is_featured"
            render={({ field }) => (
              <FormItem className="flex items-center space-x-2">
                <FormLabel>Featured</FormLabel>
                <FormControl>
                  <Switch
                    checked={field.value}
                    onCheckedChange={field.onChange}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

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

export default NewsEditor;
