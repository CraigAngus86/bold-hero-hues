
import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { createNewsArticle, updateNewsArticle } from '@/services/newsService';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { toast } from 'sonner';
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { MoveLeft, Save, Upload, ImagePlus, Eye, Monitor, Smartphone, Tablet } from 'lucide-react';
import { useImageUpload } from '@/services/images';
import { Typography } from '@/components/ui';
import { NewsArticle, CreateNewsArticleData } from '@/types';
import { generateSlug } from '@/services/news/utils';
import { RichTextEditor } from '@/components/admin/common/RichTextEditor';
import { MediaGalleryModal } from '@/components/admin/media/MediaGalleryModal';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

const { H3, Body, Small } = Typography;

interface EnhancedNewsArticleEditorProps {
  article?: NewsArticle | null;
  categories: string[];
  onSaveComplete: () => void;
  isLoadingCategories?: boolean;
}

export const EnhancedNewsArticleEditor: React.FC<EnhancedNewsArticleEditorProps> = ({
  article,
  categories,
  onSaveComplete,
  isLoadingCategories = false,
}) => {
  const queryClient = useQueryClient();
  const [slug, setSlug] = useState('');
  const [imagePreview, setImagePreview] = useState<string | null>(article?.image_url || null);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [mediaGalleryOpen, setMediaGalleryOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<'edit' | 'preview'>('edit');
  const [previewDevice, setPreviewDevice] = useState<'desktop' | 'tablet' | 'mobile'>('desktop');
  const { upload, isUploading, progress } = useImageUpload();
  
  const form = useForm<CreateNewsArticleData>({
    defaultValues: {
      title: article?.title || '',
      content: article?.content || '',
      category: article?.category || '',
      is_featured: article?.is_featured || false,
      slug: article?.slug || '',
      publish_date: article?.publish_date ? new Date(article.publish_date).toISOString().split('T')[0] : new Date().toISOString().split('T')[0],
      author: article?.author || '',
    },
  });
  
  const { watch } = form;
  const title = watch('title');
  const content = watch('content');
  
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
      } else if (imagePreview) {
        // If we have a preview from gallery but no file
        data.image_url = imagePreview;
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
      } else if (imagePreview && imagePreview !== article?.image_url) {
        // If we have a preview from gallery that's different from the original
        data.article.image_url = imagePreview;
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

  const handleMediaSelect = (mediaUrl: string) => {
    setImagePreview(mediaUrl);
    setImageFile(null); // We're using a URL from the media gallery, not a file
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
        
        <Tabs value={activeTab} onValueChange={(value: string) => setActiveTab(value as 'edit' | 'preview')}>
          <div className="flex justify-between items-center mb-4">
            <TabsList>
              <TabsTrigger value="edit" className="flex items-center gap-2">
                <Save size={16} />
                Edit
              </TabsTrigger>
              <TabsTrigger value="preview" className="flex items-center gap-2">
                <Eye size={16} />
                Preview
              </TabsTrigger>
            </TabsList>
            
            {activeTab === 'preview' && (
              <div className="flex border rounded-md">
                <Button
                  variant={previewDevice === 'desktop' ? 'secondary' : 'ghost'}
                  size="sm"
                  onClick={() => setPreviewDevice('desktop')}
                  title="Desktop preview"
                >
                  <DeviceDesktop size={16} />
                </Button>
                <Button
                  variant={previewDevice === 'tablet' ? 'secondary' : 'ghost'}
                  size="sm"
                  onClick={() => setPreviewDevice('tablet')}
                  title="Tablet preview"
                >
                  <Tablet size={16} />
                </Button>
                <Button
                  variant={previewDevice === 'mobile' ? 'secondary' : 'ghost'}
                  size="sm"
                  onClick={() => setPreviewDevice('mobile')}
                  title="Mobile preview"
                >
                  <Smartphone size={16} />
                </Button>
              </div>
            )}
          </div>

          <TabsContent value="edit">
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

                    <div className="grid grid-cols-2 gap-4">
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
                                {categories.map((category, index) => (
                                  <SelectItem key={index} value={category}>
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
                    </div>

                    <FormField
                      control={form.control}
                      name="author"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Author</FormLabel>
                          <FormControl>
                            <Input {...field} placeholder="Author name" />
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
                            <div className="absolute top-2 right-2 space-x-2">
                              <Button
                                type="button"
                                variant="secondary"
                                size="sm"
                                className="bg-white/80 hover:bg-white"
                                onClick={() => setMediaGalleryOpen(true)}
                              >
                                Change Image
                              </Button>
                              <Button
                                type="button"
                                variant="destructive"
                                size="sm"
                                className="bg-white/80 hover:bg-red-50"
                                onClick={() => {
                                  setImagePreview(null);
                                  setImageFile(null);
                                }}
                              >
                                Remove
                              </Button>
                            </div>
                          </div>
                        ) : (
                          <div className="flex flex-col items-center justify-center py-8">
                            <ImagePlus size={40} className="text-gray-400 mb-2" />
                            <Body className="text-gray-500 mb-2">Drag and drop or click to upload</Body>
                            <Small className="text-gray-400 mb-4">Recommended size: 1200 x 630 pixels</Small>
                            <div className="flex gap-2">
                              <Button
                                type="button"
                                variant="outline"
                                className="relative"
                                onClick={() => document.getElementById('image-upload')?.click()}
                              >
                                <Upload size={16} className="mr-2" />
                                Upload Image
                              </Button>
                              <Button
                                type="button"
                                variant="secondary"
                                onClick={() => setMediaGalleryOpen(true)}
                              >
                                Select from Gallery
                              </Button>
                            </div>
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
                            <RichTextEditor
                              value={field.value}
                              onChange={field.onChange}
                              height={600}
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
          </TabsContent>
          
          <TabsContent value="preview">
            <div className={`
              border rounded-lg overflow-hidden mx-auto bg-white
              ${previewDevice === 'desktop' ? 'w-full' : ''}
              ${previewDevice === 'tablet' ? 'w-[768px]' : ''}
              ${previewDevice === 'mobile' ? 'w-[375px]' : ''}
            `}>
              <div className="p-6">
                <Button
                  type="button"
                  onClick={() => setActiveTab('edit')}
                  variant="outline"
                  className="mb-4"
                >
                  Back to editing
                </Button>
                
                {/* Article preview */}
                <article className="prose prose-lg max-w-none">
                  {imagePreview && (
                    <img 
                      src={imagePreview} 
                      alt={title || "Article featured image"}
                      className="w-full h-auto rounded-lg mb-6"
                    />
                  )}
                  <h1 className="text-3xl font-bold mb-4">{title || "Article Title"}</h1>
                  <div className="flex items-center text-gray-500 mb-6">
                    <span>{form.getValues('publish_date') ? new Date(form.getValues('publish_date')).toLocaleDateString() : new Date().toLocaleDateString()}</span>
                    {form.getValues('author') && (
                      <>
                        <span className="mx-2">•</span>
                        <span>{form.getValues('author')}</span>
                      </>
                    )}
                    {form.getValues('category') && (
                      <>
                        <span className="mx-2">•</span>
                        <span>{form.getValues('category')}</span>
                      </>
                    )}
                  </div>
                  
                  {/* Render HTML content safely */}
                  <div dangerouslySetInnerHTML={{ __html: content || "<p>Article content will appear here...</p>" }} />
                </article>
              </div>
            </div>
          </TabsContent>
        </Tabs>
        
        <MediaGalleryModal
          isOpen={mediaGalleryOpen}
          onClose={() => setMediaGalleryOpen(false)}
          onSelectMedia={handleMediaSelect}
        />
      </CardContent>
    </Card>
  );
};

export default EnhancedNewsArticleEditor;
