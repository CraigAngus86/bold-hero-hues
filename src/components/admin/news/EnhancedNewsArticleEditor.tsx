
import React, { useState, useEffect, useCallback } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import { toast } from 'sonner';
import { NewsArticle } from '@/types/news';
import { createNewsArticle, updateNewsArticle } from '@/services/news';
import { useNavigate } from 'react-router-dom';
import FormImageField from '../common/form-components/FormImageField';
import RichTextEditor from '../common/RichTextEditor';

// Define the schema for the news article form
const newsArticleSchema = z.object({
  title: z.string().min(3, { message: "Title must be at least 3 characters." }),
  slug: z.string().min(3, { message: "Slug must be at least 3 characters." }),
  content: z.string().min(10, { message: "Content must be at least 10 characters." }),
  image_url: z.string().optional(),
  publish_date: z.string().optional(),
  category: z.string().min(3, { message: "Category must be at least 3 characters." }),
  author: z.string().optional(),
  is_featured: z.boolean().default(false),
});

// Define the type for the form values based on the schema
type NewsArticleFormValues = z.infer<typeof newsArticleSchema>;

// Define the props for the EnhancedNewsArticleEditor component
export interface EnhancedNewsArticleEditorProps {
  article?: NewsArticle;
  onSave?: (article: NewsArticle) => void;
  onCancel?: () => void;
  onBack?: () => void;
  onSaved?: () => void;
}

export default function EnhancedNewsArticleEditor({ 
  article, 
  onSave, 
  onCancel, 
  onBack, 
  onSaved 
}: EnhancedNewsArticleEditorProps) {
  const navigate = useNavigate();
  const [content, setContent] = useState(article?.content || '');

  // Initialize the form with useForm
  const form = useForm<NewsArticleFormValues>({
    resolver: zodResolver(newsArticleSchema),
    defaultValues: {
      title: article?.title || "",
      slug: article?.slug || "",
      content: article?.content || "",
      image_url: article?.image_url || "",
      publish_date: article?.publish_date || new Date().toISOString().split('T')[0],
      category: article?.category || "",
      author: article?.author || "",
      is_featured: article?.is_featured || false,
    },
    mode: "onChange",
  });

  // Function to handle form submission
  const onSubmit = useCallback(async (values: NewsArticleFormValues) => {
    try {
      const articleData = {
        ...values,
        content: content,
        title: values.title, // Ensure title is included (required)
      };

      let savedArticle: NewsArticle | null = null;

      if (article) {
        // Update existing article
        const result = await updateNewsArticle(article.id, articleData);
        if (result.success && result.data) {
          savedArticle = result.data;
          toast.success("Article updated successfully!");
        } else {
          toast.error(result.error || "Failed to update article.");
          return;
        }
      } else {
        // Create new article
        const result = await createNewsArticle(articleData);
        if (result.success && result.data) {
          savedArticle = result.data;
          toast.success("Article created successfully!");
        } else {
          toast.error(result.error || "Failed to create article.");
          return;
        }
      }

      if (savedArticle) {
        // Use the appropriate callback
        if (onSaved) {
          onSaved();
        } else if (onSave) {
          onSave(savedArticle);
        } else {
          // Redirect to the news article's page
          navigate(`/admin/news`);
        }
      }
    } catch (error) {
      console.error("Error saving article:", error);
      toast.error("Failed to save article. Please try again.");
    }
  }, [article, content, navigate, onSave, onSaved]);

  const handleBack = () => {
    if (onBack) onBack();
    else if (onCancel) onCancel();
    else navigate('/admin/news');
  };

  return (
    <div className="space-y-6 p-6 bg-white rounded-lg shadow-md">
      {/* Form Header */}
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-semibold">
          {article ? "Edit Article" : "Create New Article"}
        </h2>
        <div className="space-x-2">
          <Button variant="ghost" onClick={handleBack}>
            Cancel
          </Button>
          <Button type="submit" onClick={form.handleSubmit(onSubmit)}>
            {article ? "Update" : "Create"}
          </Button>
        </div>
      </div>

      {/* Form */}
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
          {/* Title and Slug */}
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
                  <FormDescription>
                    This is the title of the article.
                  </FormDescription>
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
                    <Input placeholder="article-slug" {...field} />
                  </FormControl>
                  <FormDescription>
                    This is the unique URL-friendly identifier for the article.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          {/* Image URL */}
          <FormField
            control={form.control}
            name="image_url"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Featured Image</FormLabel>
                <FormControl>
                  <Input placeholder="Image URL" {...field} />
                </FormControl>
                <FormDescription>
                  URL of the article image.
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Publish Date and Category */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormField
              control={form.control}
              name="publish_date"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Publish Date</FormLabel>
                  <FormControl>
                    <Input type="date" {...field} />
                  </FormControl>
                  <FormDescription>
                    The date the article will be published.
                  </FormDescription>
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
                  <FormDescription>
                    The category of the article.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          {/* Author and Is Featured */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormField
              control={form.control}
              name="author"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Author</FormLabel>
                  <FormControl>
                    <Input placeholder="Author" {...field} />
                  </FormControl>
                  <FormDescription>
                    The author of the article.
                  </FormDescription>
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
                    <FormLabel>Featured</FormLabel>
                    <FormDescription>
                      Mark this article as featured.
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
          </div>
          
          {/* Content/Body Editor */}
          <div className="space-y-3">
            <Label htmlFor="content">Content</Label>
            <RichTextEditor
              value={content}
              onChange={setContent}
              placeholder="Write article content here..."
              className="min-h-[400px]"
              id="content"
            />
            {form.formState.errors.content && (
              <p className="text-sm text-red-500">{form.formState.errors.content.message}</p>
            )}
          </div>

          {/* Submit Buttons */}
          <div className="flex justify-end space-x-2">
            <Button type="button" variant="outline" onClick={handleBack}>
              Cancel
            </Button>
            <Button type="submit">
              {article ? "Update Article" : "Create Article"}
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
}
