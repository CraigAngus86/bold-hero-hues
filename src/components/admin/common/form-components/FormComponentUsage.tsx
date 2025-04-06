
import React from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { Form } from '@/components/ui/form';
import { FormSection, FormImageField, FormRichTextField } from './index';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { toast } from 'sonner';

/**
 * This is a demonstration component to show how to use the form components
 */

const formSchema = z.object({
  title: z.string().min(3, 'Title must be at least 3 characters'),
  content: z.string().min(10, 'Content must be at least 10 characters'),
  image: z.string().optional(),
});

type FormValues = z.infer<typeof formSchema>;

const FormComponentUsage: React.FC = () => {
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: '',
      content: '',
      image: '',
    },
  });

  const onSubmit = (data: FormValues) => {
    console.log('Form data:', data);
    toast.success('Form submitted successfully');
  };

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-6">Form Components Demo</h2>
      
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
          <FormSection 
            title="Basic Information" 
            description="Enter the basic information for this content."
          >
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Form.Field
                control={form.control}
                name="title"
                render={({ field }) => (
                  <Form.Item>
                    <Form.Label>Title<span className="text-red-500 ml-1">*</span></Form.Label>
                    <Form.Control>
                      <Input placeholder="Enter title" {...field} />
                    </Form.Control>
                    <Form.Message />
                  </Form.Item>
                )}
              />
              
              <FormImageField
                control={form.control}
                name="image"
                label="Featured Image"
                description="Select an image to represent this content"
              />
            </div>
          </FormSection>
          
          <FormSection 
            title="Content" 
            description="Enter the main content."
          >
            <FormRichTextField
              control={form.control}
              name="content"
              label="Content"
              required
              height={300}
            />
          </FormSection>
          
          <div className="flex justify-end space-x-2">
            <Button type="button" variant="outline">
              Cancel
            </Button>
            <Button type="submit">
              Save Changes
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
};

export default FormComponentUsage;
