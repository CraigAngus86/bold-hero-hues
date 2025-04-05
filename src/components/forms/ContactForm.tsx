
import React from 'react';
import { useForm } from 'react-hook-form';
import { Button } from '@/components/ui';
import { Input } from '@/components/ui/input';
import { toast } from 'sonner';

interface ContactFormProps {
  className?: string;
}

interface FormValues {
  name: string;
  email: string;
  subject: string;
  message: string;
}

const ContactForm: React.FC<ContactFormProps> = ({ className }) => {
  const { register, handleSubmit, formState: { errors }, reset } = useForm<FormValues>();

  const onSubmit = async (data: FormValues) => {
    try {
      // This is where you would send the form data to your server or API
      console.log('Form submitted:', data);
      
      // Show success message
      toast.success('Message sent successfully! We will get back to you soon.');
      
      // Reset the form
      reset();
    } catch (error) {
      console.error('Error submitting form:', error);
      toast.error('Failed to send message. Please try again later.');
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className={className}>
      <div className="space-y-4">
        <div>
          <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
            Your Name
          </label>
          <Input
            id="name"
            {...register('name', { required: 'Name is required' })}
            className="w-full"
            placeholder="John Doe"
          />
          {errors.name && (
            <p className="mt-1 text-sm text-red-600">{errors.name.message}</p>
          )}
        </div>

        <div>
          <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
            Email Address
          </label>
          <Input
            id="email"
            type="email"
            {...register('email', { 
              required: 'Email is required',
              pattern: {
                value: /\S+@\S+\.\S+/,
                message: 'Please enter a valid email address'
              }
            })}
            className="w-full"
            placeholder="john.doe@example.com"
          />
          {errors.email && (
            <p className="mt-1 text-sm text-red-600">{errors.email.message}</p>
          )}
        </div>

        <div>
          <label htmlFor="subject" className="block text-sm font-medium text-gray-700 mb-1">
            Subject
          </label>
          <Input
            id="subject"
            {...register('subject', { required: 'Subject is required' })}
            className="w-full"
            placeholder="General Inquiry"
          />
          {errors.subject && (
            <p className="mt-1 text-sm text-red-600">{errors.subject.message}</p>
          )}
        </div>

        <div>
          <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-1">
            Message
          </label>
          <textarea
            id="message"
            {...register('message', { required: 'Message is required' })}
            rows={5}
            className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
            placeholder="Your message here..."
          />
          {errors.message && (
            <p className="mt-1 text-sm text-red-600">{errors.message.message}</p>
          )}
        </div>

        <Button type="submit">
          Send Message
        </Button>
      </div>
    </form>
  );
};

export default ContactForm;
