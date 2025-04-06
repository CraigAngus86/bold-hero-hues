
import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Switch } from '@/components/ui/switch';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { toast } from 'sonner';

// Currently a placeholder for future settings, hardcoded for now
const SponsorsSettings: React.FC = () => {
  // Form schema for display settings
  const formSchema = z.object({
    showOnHomepage: z.boolean(),
    displayMode: z.enum(['grid', 'carousel', 'list']),
    sponsorsPerRow: z.number().min(1).max(6),
    carouselSpeed: z.number().min(1000).max(10000),
    showTierHeadings: z.boolean(),
    randomizeOrder: z.boolean(),
    maxLogosHomepage: z.number().min(0),
  });
  
  const defaultValues = {
    showOnHomepage: true,
    displayMode: 'carousel' as const,
    sponsorsPerRow: 4,
    carouselSpeed: 5000,
    showTierHeadings: true,
    randomizeOrder: false,
    maxLogosHomepage: 12,
  };
  
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues,
  });
  
  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      // This would eventually save to a settings table or similar
      console.log('Settings submitted:', values);
      toast.success("This feature is coming soon! Display settings are currently hardcoded.");
    } catch (error) {
      console.error('Error:', error);
      toast.error('An error occurred');
    }
  };

  const displayMode = form.watch('displayMode');

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-semibold mb-4">Sponsors Display Settings</h2>
        <p className="text-muted-foreground mb-6">
          Configure how sponsors are displayed across your website. These settings affect visibility and presentation.
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Display Configuration</CardTitle>
          <CardDescription>
            Control where and how sponsors are shown on your site
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <FormField
                control={form.control}
                name="showOnHomepage"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                    <div className="space-y-0.5">
                      <FormLabel className="text-base">Show on Homepage</FormLabel>
                      <FormDescription>
                        Display sponsors section on the homepage
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

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="displayMode"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Display Mode</FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select display mode" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="grid">Grid</SelectItem>
                          <SelectItem value="carousel">Carousel</SelectItem>
                          <SelectItem value="list">List</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormDescription>
                        How sponsors are visually arranged
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                {displayMode === 'grid' && (
                  <FormField
                    control={form.control}
                    name="sponsorsPerRow"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Sponsors Per Row</FormLabel>
                        <FormControl>
                          <Input 
                            type="number" 
                            min={1} 
                            max={6} 
                            {...field} 
                            onChange={(e) => field.onChange(parseInt(e.target.value))} 
                          />
                        </FormControl>
                        <FormDescription>
                          Number of sponsors to display in each row (1-6)
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                )}
                
                {displayMode === 'carousel' && (
                  <FormField
                    control={form.control}
                    name="carouselSpeed"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Carousel Speed (ms)</FormLabel>
                        <FormControl>
                          <Input 
                            type="number" 
                            min={1000} 
                            max={10000} 
                            step={500}
                            {...field} 
                            onChange={(e) => field.onChange(parseInt(e.target.value))} 
                          />
                        </FormControl>
                        <FormDescription>
                          Rotation speed in milliseconds (1000-10000)
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                )}
                
                <FormField
                  control={form.control}
                  name="maxLogosHomepage"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Max Logos on Homepage</FormLabel>
                      <FormControl>
                        <Input 
                          type="number" 
                          min={0}
                          {...field} 
                          onChange={(e) => field.onChange(parseInt(e.target.value))} 
                        />
                      </FormControl>
                      <FormDescription>
                        Maximum number of sponsor logos to display on homepage (0 for unlimited)
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <div className="space-y-4">
                <FormField
                  control={form.control}
                  name="showTierHeadings"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3">
                      <div className="space-y-0.5">
                        <FormLabel>Show Tier Headings</FormLabel>
                        <FormDescription>
                          Display tier names as headings (e.g. "Platinum Sponsors")
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
                
                <FormField
                  control={form.control}
                  name="randomizeOrder"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3">
                      <div className="space-y-0.5">
                        <FormLabel>Randomize Order</FormLabel>
                        <FormDescription>
                          Randomly shuffle sponsors within each tier
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
              
              <div className="flex justify-end">
                <Button type="submit" disabled>
                  Save Settings (Coming Soon)
                </Button>
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
};

export default SponsorsSettings;
