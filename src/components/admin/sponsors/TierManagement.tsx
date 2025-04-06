
import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { toast } from 'sonner';
import DataTable from '@/components/tables/DataTable';

// Currently, the tier system is hardcoded, but we'll build an interface to eventually make it dynamic
const TierManagement: React.FC = () => {
  // Form schema for tier editing
  const formSchema = z.object({
    name: z.string().min(2, "Tier name must be at least 2 characters"),
    description: z.string().min(5, "Description must be at least 5 characters"),
    benefits: z.string().optional(),
    order: z.number().int().min(1, "Order must be at least 1"),
  });
  
  const defaultValues = {
    name: '',
    description: '',
    benefits: '',
    order: 1,
  };
  
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues,
  });
  
  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      // This would eventually connect to a service function
      console.log('Form submitted with values:', values);
      toast.success("This feature is coming soon! The tier system is currently hardcoded.");
      form.reset(defaultValues);
    } catch (error) {
      console.error('Error:', error);
      toast.error('An error occurred');
    }
  };
  
  // Sample tier data for the table
  const tiers = [
    {
      id: 'platinum',
      name: 'Platinum',
      description: 'Top-tier sponsorship with maximum visibility across all platforms',
      benefits: 'Logo on homepage, all printed materials, and exclusive event access',
      order: 1,
    },
    {
      id: 'gold',
      name: 'Gold',
      description: 'High visibility sponsorship with prominent placement',
      benefits: 'Logo on homepage and event-specific recognition',
      order: 2,
    },
    {
      id: 'silver',
      name: 'Silver',
      description: 'Mid-tier sponsorship with good visibility',
      benefits: 'Logo on sponsors page and digital materials',
      order: 3,
    },
    {
      id: 'bronze',
      name: 'Bronze',
      description: 'Entry-level sponsorship option',
      benefits: 'Logo on sponsors page',
      order: 4,
    },
  ];
  
  const columns = [
    { key: 'name', title: 'Tier Name' },
    { key: 'description', title: 'Description' },
    { 
      key: 'order', 
      title: 'Display Order',
      render: (tier: any) => (
        <span className="px-2 py-1 bg-gray-100 rounded text-sm">{tier.order}</span>
      )
    },
    {
      key: 'actions',
      title: 'Actions',
      render: () => (
        <Button variant="ghost" size="sm" disabled>Edit</Button>
      )
    }
  ];

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-semibold mb-4">Sponsorship Tiers</h2>
        <p className="text-muted-foreground mb-6">
          Manage the different sponsorship tiers available on your site. 
          Tiers determine how sponsors are displayed and what benefits they receive.
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Current Tiers</CardTitle>
          <CardDescription>
            Tiers are shown from highest (1) to lowest based on display order
          </CardDescription>
        </CardHeader>
        <CardContent>
          <DataTable
            columns={columns}
            data={tiers}
            caption="Currently, tiers are hardcoded in the system. The ability to add custom tiers is coming soon."
          />
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Add/Edit Tier</CardTitle>
          <CardDescription>
            This feature is coming soon. For now, the system uses the default tiers.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Tier Name</FormLabel>
                      <FormControl>
                        <Input placeholder="e.g. Platinum" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="order"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Display Order</FormLabel>
                      <FormControl>
                        <Input 
                          type="number" 
                          min={1} 
                          {...field} 
                          onChange={(e) => field.onChange(parseInt(e.target.value))} 
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              
              <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Description</FormLabel>
                    <FormControl>
                      <Textarea placeholder="Description of this tier" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="benefits"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Benefits</FormLabel>
                    <FormControl>
                      <Textarea placeholder="List of benefits for this tier" {...field} value={field.value || ''} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <div className="flex justify-end">
                <Button type="submit" disabled>
                  Save Tier (Coming Soon)
                </Button>
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
};

export default TierManagement;
