
import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { 
  LayoutGrid, 
  RotateCw, 
  Sliders, 
  Shuffle, 
  Home, 
  Loader2, 
  Save, 
  Eye 
} from 'lucide-react';
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
import { Slider } from '@/components/ui/slider';
import { Switch } from '@/components/ui/switch';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { toast } from 'sonner';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';

import { useQuery, useMutation } from '@tanstack/react-query';
import { fetchSponsorDisplaySettings, updateSponsorDisplaySettings } from '@/services/sponsorsService';
import { SponsorDisplaySettings } from '@/types/sponsors';

const settingsSchema = z.object({
  show_on_homepage: z.boolean().default(true),
  display_mode: z.enum(['grid', 'carousel', 'list']),
  sponsors_per_row: z.number().int().min(1).max(8),
  carousel_speed: z.number().int().min(1000).max(10000),
  show_tier_headings: z.boolean().default(true),
  randomize_order: z.boolean().default(false),
  max_logos_homepage: z.number().int().min(1).max(20),
});

const SponsorsSettings: React.FC = () => {
  const { data: settings, isLoading, refetch } = useQuery({
    queryKey: ['sponsorDisplaySettings'],
    queryFn: async () => {
      const response = await fetchSponsorDisplaySettings();
      if (!response.success) {
        throw new Error(response.error?.message || 'Failed to load display settings');
      }
      return response.data;
    },
  });
  
  const form = useForm<z.infer<typeof settingsSchema>>({
    resolver: zodResolver(settingsSchema),
    defaultValues: {
      show_on_homepage: true,
      display_mode: 'grid',
      sponsors_per_row: 4,
      carousel_speed: 5000,
      show_tier_headings: true,
      randomize_order: false,
      max_logos_homepage: 8,
    },
  });
  
  // Update form when settings are loaded
  useEffect(() => {
    if (settings) {
      form.reset({
        show_on_homepage: settings.show_on_homepage,
        display_mode: settings.display_mode || 'grid',
        sponsors_per_row: settings.sponsors_per_row || 4,
        carousel_speed: settings.carousel_speed || 5000,
        show_tier_headings: settings.show_tier_headings,
        randomize_order: settings.randomize_order,
        max_logos_homepage: settings.max_logos_homepage || 8,
      });
    }
  }, [settings, form]);
  
  const updateMutation = useMutation({
    mutationFn: async (data: z.infer<typeof settingsSchema>) => {
      if (!settings?.id) {
        throw new Error('Settings ID not found');
      }
      return await updateSponsorDisplaySettings(settings.id, data);
    },
    onSuccess: () => {
      toast.success('Display settings updated');
      refetch();
    },
    onError: (error) => {
      toast.error(`Failed to update settings: ${error.message}`);
    },
  });
  
  const onSubmit = async (data: z.infer<typeof settingsSchema>) => {
    updateMutation.mutate(data);
  };
  
  if (isLoading) {
    return (
      <div className="flex justify-center items-center py-12">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }
  
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-semibold mb-4">Sponsor Display Settings</h2>
        <p className="text-muted-foreground mb-6">
          Control how sponsors are displayed on the website. These settings affect all sponsor listings.
        </p>
      </div>
      
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg flex items-center">
                  <Home className="mr-2 h-4 w-4" />
                  Homepage Display
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <FormField
                  control={form.control}
                  name="show_on_homepage"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                      <div className="space-y-0.5">
                        <FormLabel className="text-base">Show on Homepage</FormLabel>
                        <FormDescription>
                          Display sponsors on the website homepage
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
                  name="max_logos_homepage"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Maximum Logos on Homepage</FormLabel>
                      <FormControl>
                        <div className="flex items-center space-x-4">
                          <Slider
                            value={[field.value]}
                            min={1}
                            max={20}
                            step={1}
                            onValueChange={(vals) => field.onChange(vals[0])}
                            className="flex-1"
                          />
                          <span className="w-12 text-center">{field.value}</span>
                        </div>
                      </FormControl>
                      <FormDescription>
                        Limit the number of sponsor logos shown on homepage
                      </FormDescription>
                    </FormItem>
                  )}
                />
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle className="text-lg flex items-center">
                  <Sliders className="mr-2 h-4 w-4" />
                  Display Options
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <FormField
                  control={form.control}
                  name="display_mode"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Display Mode</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
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
                        How sponsors are arranged on the page
                      </FormDescription>
                    </FormItem>
                  )}
                />
                
                {form.watch('display_mode') === 'grid' && (
                  <FormField
                    control={form.control}
                    name="sponsors_per_row"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Sponsors Per Row</FormLabel>
                        <FormControl>
                          <div className="flex items-center space-x-4">
                            <Slider
                              value={[field.value]}
                              min={1}
                              max={8}
                              step={1}
                              onValueChange={(vals) => field.onChange(vals[0])}
                              className="flex-1"
                            />
                            <span className="w-12 text-center">{field.value}</span>
                          </div>
                        </FormControl>
                      </FormItem>
                    )}
                  />
                )}
                
                {form.watch('display_mode') === 'carousel' && (
                  <FormField
                    control={form.control}
                    name="carousel_speed"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Carousel Speed (ms)</FormLabel>
                        <FormControl>
                          <div className="flex items-center space-x-4">
                            <Slider
                              value={[field.value]}
                              min={1000}
                              max={10000}
                              step={500}
                              onValueChange={(vals) => field.onChange(vals[0])}
                              className="flex-1"
                            />
                            <span className="w-16 text-center">{field.value}ms</span>
                          </div>
                        </FormControl>
                        <FormDescription>
                          Speed of carousel rotation (1000ms = 1 second)
                        </FormDescription>
                      </FormItem>
                    )}
                  />
                )}
              </CardContent>
            </Card>
          </div>
          
          <Card>
            <CardHeader>
              <CardTitle className="text-lg flex items-center">
                <LayoutGrid className="mr-2 h-4 w-4" />
                Organization Options
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <FormField
                  control={form.control}
                  name="show_tier_headings"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                      <div className="space-y-0.5">
                        <FormLabel className="text-base">Show Tier Headings</FormLabel>
                        <FormDescription>
                          Group sponsors by their tier with headings
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
                  name="randomize_order"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                      <div className="space-y-0.5">
                        <FormLabel className="text-base">Randomize Order</FormLabel>
                        <FormDescription>
                          Shuffle the order of sponsors within each tier
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
            </CardContent>
            <CardFooter className="flex justify-end space-x-2 pt-4 border-t">
              <Button 
                type="button" 
                variant="outline" 
                onClick={() => refetch()}
              >
                <RotateCw className="mr-2 h-4 w-4" />
                Reset
              </Button>
              <Button 
                type="submit" 
                disabled={
                  updateMutation.isPending || 
                  !form.formState.isDirty
                }
              >
                {updateMutation.isPending ? (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                ) : (
                  <Save className="mr-2 h-4 w-4" />
                )}
                Save Settings
              </Button>
            </CardFooter>
          </Card>
        </form>
      </Form>

      <div className="text-center mt-8 p-4 border rounded-md bg-muted/10">
        <Eye className="h-5 w-5 mx-auto mb-2 text-muted-foreground" />
        <p className="text-sm text-muted-foreground">
          Preview your sponsor display on the <a href="/sponsors" className="underline">sponsors page</a> to see how these settings affect the appearance.
        </p>
      </div>
    </div>
  );
};

export default SponsorsSettings;
