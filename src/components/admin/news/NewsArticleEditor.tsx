
import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { createNewsArticle, updateNewsArticle } from '@/services/newsService';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { toast } from 'sonner';
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { MoveLeft, Save, Upload, ImagePlus } from 'lucide-react';
import { useImageUpload } from '@/services/images';
import { Typography } from '@/components/ui';
import { NewsArticle, CreateNewsArticleData } from '@/types';
import { generateSlug } from '@/services/news/utils';

const { H3, Body, Small } = Typography;

interface NewsArticleEditorProps {
  article?: NewsArticle | null;
  categories: string[];
  onSaveComplete: () => void;
  isLoadingCategories?: boolean;
}

export const NewsArticleEditor: React.FC<NewsArticleEditorProps> = ({
  article,
  categories,
  onSaveComplete,
  isLoadingCategories = false,
}) => {
  const queryClient = useQueryClient();
  const [slug, setSlug] = useState('');
  const [imagePreview, setImagePreview] = useState<string | null>(article?.image_url || null);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const { upload, isUploading, progress } = useImageUpload();
  
  const form = useForm<CreateNewsArticleData>({
    defaultValues: {
      title: article?.title || '',
      content: article?.content || '',
      category: article?.category || '',
      is_featured: article?.is_featured || false,
      slug: article?.slug || '',
      publish_date: article?.publish_date ? new Date(article.publish_date).toISOString().split('T')[0] : new Date().toISOString().split('T')[0],
    },
  });
  
  const { watch } = form;
  const title = watch('title');
  
  useEffect(() => {
    // Generate slug from title
    if (title && !article) {
      const generatedSlug = generateSlug(title);
      setSlug(generatedSlug);
      form.setValue('slug', generatedSlug);
    } else if (article) {
      setSlug(article.slug);
    }
  }, [title, article, form]);

  const createMutation = useMutation({
    mutationFn: async (data: CreateNewsArticleData) => {
      // Handle image upload first if there's a new image
      if (imageFile) {
        const result = await upload(
          imageFile,
          'news',
          'articles'
        );
        if (result.success && result.data) {
          data.image_url = result.data.url;
        } else {
          throw new Error('Failed to upload image');
        }
      }
      return createNewsArticle(data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['newsArticles'] });
      toast.success('Article created successfully');
      onSaveComplete();
    },
    onError: (error) => {
      toast.error('Failed to create article');
      console.error('Error creating article:', error);
    },
  });

  const updateMutation = useMutation({
    mutationFn: async (data: { id: string; article: Partial<CreateNewsArticleData> }) => {
      // Handle image upload first if there's a new image
      if (imageFile) {
        const result = await upload(
          imageFile,
          'news',
          'articles'
        );
        if (result.success && result.data) {
          data.article.image_url = result.data.url;
        } else {
          throw new Error('Failed to upload image');
        }
      }
      return updateNewsArticle(data.id, data.article);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['newsArticles'] });
      toast.success('Article updated successfully');
      onSaveComplete();
    },
    onError: (error) => {
      toast.error('Failed to update article');
      console.error('Error updating article:', error);
    },
  });

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImageFile(file);
      const imageUrl = URL.createObjectURL(file);
      setImagePreview(imageUrl);
    }
  };

  const onSubmit = (data: CreateNewsArticleData) => {
    if (article) {
      updateMutation.mutate({
        id: article.id,
        article: data,
      });
    } else {
      createMutation.mutate(data);
    }
  };

  const isSubmitting = createMutation.isPending || updateMutation.isPending || isUploading;

  return (
    <Card>
      <CardContent className="pt-6">
        <div className="mb-6">
          <Button
            variant="ghost"
            onClick={onSaveComplete}
            className="flex items-center gap-1 mb-4"
          >
            <MoveLeft size={16} /> Back to Articles
          </Button>
          <H3>{article ? 'Edit Article' : 'Create New Article'}</H3>
        </div>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-6">
                <FormField
                  control={form.control}
                  name="title"
                  rules={{ required: 'Title is required' }}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Title</FormLabel>
                      <FormControl>
                        <Input {...field} placeholder="Article title" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="slug"
                  rules={{ required: 'Slug is required' }}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Slug</FormLabel>
                      <FormControl>
                        <Input {...field} placeholder="article-slug" value={slug} onChange={(e) => {
                          setSlug(e.target.value);
                          field.onChange(e);
                        }} />
                      </FormControl>
                      <FormDescription>
                        Used in the URL: /news/{slug}
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="category"
                  rules={{ required: 'Category is required' }}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Category</FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                        disabled={isLoadingCategories}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select a category" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {categories.map(category => (
                            <SelectItem key={category} value={category}>
                              {category}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="publish_date"
                  rules={{ required: 'Publication date is required' }}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Publication Date</FormLabel>
                      <FormControl>
                        <Input type="date" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="is_featured"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                      <div className="space-y-0.5">
                        <FormLabel className="text-base">Featured Article</FormLabel>
                        <FormDescription>
                          Featured articles appear prominently on the homepage
                        </FormDescription>
                      </div>
                      <FormControl>
                        <Switch
                          checked={field.value}
                          onCheckedChange={field.onChange}
                        />
                      </FormControl>
                    </FormItem>
                  )}
                />

                <div className="space-y-2">
                  <Label htmlFor="image">Featured Image</Label>
                  <div className="border border-dashed border-gray-300 rounded-md p-4">
                    {imagePreview ? (
                      <div className="relative">
                        <img
                          src={imagePreview}
                          alt="Article preview"
                          className="w-full h-auto rounded-md"
                        />
                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          className="absolute top-2 right-2 bg-white"
                          onClick={() => {
                            setImagePreview(null);
                            setImageFile(null);
                          }}
                        >
                          Change Image
                        </Button>
                      </div>
                    ) : (
                      <div className="flex flex-col items-center justify-center py-8">
                        <ImagePlus size={40} className="text-gray-400 mb-2" />
                        <Body className="text-gray-500 mb-2">Drag and drop or click to upload</Body>
                        <Small className="text-gray-400 mb-4">Recommended size: 1200 x 630 pixels</Small>
                        <Button
                          type="button"
                          variant="outline"
                          className="relative"
                          onClick={() => document.getElementById('image-upload')?.click()}
                        >
                          <Upload size={16} className="mr-2" />
                          Select Image
                        </Button>
                      </div>
                    )}
                    <input
                      id="image-upload"
                      type="file"
                      accept="image/*"
                      onChange={handleImageChange}
                      className="hidden"
                    />
                    {isUploading && (
                      <div className="mt-2">
                        <div className="w-full bg-gray-200 rounded-full h-2.5">
                          <div
                            className="bg-primary-800 h-2.5 rounded-full"
                            style={{ width: `${progress}%` }}
                          ></div>
                        </div>
                        <Small className="text-gray-500 mt-1">Uploading... {progress}%</Small>
                      </div>
                    )}
                  </div>
                </div>
              </div>
              
              <div>
                <FormField
                  control={form.control}
                  name="content"
                  rules={{ required: 'Content is required' }}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Content</FormLabel>
                      <FormControl>
                        <Textarea
                          {...field}
                          placeholder="Write your article content here..."
                          className="min-h-[400px]"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </div>

            <div className="flex justify-end space-x-2">
              <Button
                type="button"
                variant="outline"
                onClick={onSaveComplete}
                disabled={isSubmitting}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={isSubmitting}
                className="flex items-center gap-1"
              >
                <Save size={16} />
                {isSubmitting ? 'Saving...' : 'Save Article'}
              </Button>
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
};
