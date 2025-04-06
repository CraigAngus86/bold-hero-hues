
import React from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { 
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormDescription,
  FormMessage
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { FormSection, FormImageField, FormRichTextField } from './index';

// Demo schema for the form
const formSchema = z.object({
  title: z.string().min(5, { message: "Title must be at least 5 characters." }),
  content: z.string().min(20, { message: "Content must be at least 20 characters." }),
  image: z.string().optional(),
});

type FormData = z.infer<typeof formSchema>;

const FormComponentUsage = () => {
  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: "",
      content: "",
      image: "",
    },
  });

  const onSubmit = (data: FormData) => {
    console.log('Form submitted:', data);
    // Handle form submission
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h2 className="text-2xl font-bold mb-6">Form Components Usage Example</h2>
      
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
          <FormSection title="Basic Information" description="Enter the basic details">
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Title <span className="text-red-500">*</span></FormLabel>
                  <FormControl>
                    <Input placeholder="Enter title" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </FormSection>

          <FormSection title="Content" description="Enter the main content">
            <FormRichTextField
              control={form.control}
              name="content"
              label="Main Content"
              required
              description="Rich text content with formatting options"
              height={300}
            />
          </FormSection>

          <FormSection title="Media" description="Upload or select images">
            <FormImageField
              control={form.control}
              name="image"
              label="Featured Image"
              description="Select an image from the media library or upload a new one"
            />
          </FormSection>

          <Button type="submit">Submit Form</Button>
        </form>
      </Form>
    </div>
  );
};

export default FormComponentUsage;
