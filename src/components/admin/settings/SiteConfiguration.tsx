
import React from 'react';
import {
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle,
  CardFooter
} from '@/components/ui/card';
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
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Separator } from '@/components/ui/separator';
import { useForm } from 'react-hook-form';
import { toast } from '@/hooks/use-toast';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { Globe, Facebook, Twitter, Instagram, Youtube, AtSign, Phone, MapPin } from 'lucide-react';

// Define the schema for site configuration form
const siteConfigSchema = z.object({
  // Club Information
  clubName: z.string().min(1, { message: "Club name is required" }),
  clubAddress: z.string(),
  clubEmail: z.string().email({ message: "Please enter a valid email" }),
  clubPhone: z.string(),
  
  // Social Media
  facebookUrl: z.string().url({ message: "Please enter a valid URL" }).optional().or(z.literal('')),
  twitterUrl: z.string().url({ message: "Please enter a valid URL" }).optional().or(z.literal('')),
  instagramUrl: z.string().url({ message: "Please enter a valid URL" }).optional().or(z.literal('')),
  youtubeUrl: z.string().url({ message: "Please enter a valid URL" }).optional().or(z.literal('')),
  
  // SEO Settings
  siteTitle: z.string(),
  siteDescription: z.string(),
  ogImage: z.string().url({ message: "Please enter a valid URL" }).optional().or(z.literal('')),
  
  // Analytics
  googleAnalyticsId: z.string().optional(),
  
  // Maintenance
  maintenanceMode: z.boolean().default(false),
  maintenanceMessage: z.string().optional(),
});

type SiteConfigValues = z.infer<typeof siteConfigSchema>;

const SiteConfiguration = () => {
  // Setup form with validation
  const form = useForm<SiteConfigValues>({
    resolver: zodResolver(siteConfigSchema),
    defaultValues: {
      clubName: "Banks o' Dee FC",
      clubAddress: "Spain Park, Aberdeen",
      clubEmail: "info@banksofdeefc.co.uk",
      clubPhone: "+44 1234 567890",
      facebookUrl: "https://facebook.com/banksofdeefc",
      twitterUrl: "https://twitter.com/banksofdeefc",
      instagramUrl: "https://instagram.com/banksofdeefc",
      youtubeUrl: "",
      siteTitle: "Banks o' Dee FC | Official Website",
      siteDescription: "Official website of Banks o' Dee Football Club - Aberdeen's Highland League team",
      ogImage: "/lovable-uploads/banks-o-dee-logo.png",
      googleAnalyticsId: "G-XXXXXXXXXX",
      maintenanceMode: false,
      maintenanceMessage: "We're currently updating our website. Please check back soon.",
    },
  });

  // Handle form submission
  const onSubmit = (values: SiteConfigValues) => {
    console.log(values);
    
    toast({
      title: "Settings saved",
      description: "Your site configuration has been updated.",
    });
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Site Configuration</CardTitle>
          <CardDescription>
            Manage site-wide settings and information
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              {/* Club Information */}
              <div className="space-y-4">
                <h3 className="text-lg font-medium">Club Information</h3>
                <Separator />

                <FormField
                  control={form.control}
                  name="clubName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Club Name</FormLabel>
                      <FormControl>
                        <Input placeholder="Banks o' Dee FC" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="clubAddress"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Club Address</FormLabel>
                      <FormControl>
                        <Input placeholder="Spain Park, Aberdeen" {...field} />
                      </FormControl>
                      <FormDescription>
                        <MapPin className="h-3.5 w-3.5 inline mr-1" />
                        Physical address of the club
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="clubEmail"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Contact Email</FormLabel>
                        <FormControl>
                          <Input placeholder="info@banksofdeefc.co.uk" {...field} />
                        </FormControl>
                        <FormDescription>
                          <AtSign className="h-3.5 w-3.5 inline mr-1" />
                          Primary contact email address
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="clubPhone"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Contact Phone</FormLabel>
                        <FormControl>
                          <Input placeholder="+44 1234 567890" {...field} />
                        </FormControl>
                        <FormDescription>
                          <Phone className="h-3.5 w-3.5 inline mr-1" />
                          Primary contact phone number
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </div>

              {/* Social Media Links */}
              <div className="space-y-4 pt-4">
                <h3 className="text-lg font-medium">Social Media Links</h3>
                <Separator />

                <FormField
                  control={form.control}
                  name="facebookUrl"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>
                        <Facebook className="h-4 w-4 inline mr-2" />
                        Facebook URL
                      </FormLabel>
                      <FormControl>
                        <Input placeholder="https://facebook.com/banksofdeefc" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="twitterUrl"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>
                        <Twitter className="h-4 w-4 inline mr-2" />
                        Twitter URL
                      </FormLabel>
                      <FormControl>
                        <Input placeholder="https://twitter.com/banksofdeefc" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="instagramUrl"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>
                        <Instagram className="h-4 w-4 inline mr-2" />
                        Instagram URL
                      </FormLabel>
                      <FormControl>
                        <Input placeholder="https://instagram.com/banksofdeefc" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="youtubeUrl"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>
                        <Youtube className="h-4 w-4 inline mr-2" />
                        YouTube URL
                      </FormLabel>
                      <FormControl>
                        <Input placeholder="https://youtube.com/banksofdeefc" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              {/* SEO Settings */}
              <div className="space-y-4 pt-4">
                <h3 className="text-lg font-medium">SEO Settings</h3>
                <Separator />

                <FormField
                  control={form.control}
                  name="siteTitle"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Site Title</FormLabel>
                      <FormControl>
                        <Input placeholder="Banks o' Dee FC | Official Website" {...field} />
                      </FormControl>
                      <FormDescription>
                        <Globe className="h-3.5 w-3.5 inline mr-1" />
                        Used in browser tabs and search results
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="siteDescription"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Meta Description</FormLabel>
                      <FormControl>
                        <Textarea 
                          placeholder="Official website of Banks o' Dee Football Club - Aberdeen's Highland League team"
                          {...field} 
                        />
                      </FormControl>
                      <FormDescription>
                        A brief description of the site for search engines (150-160 characters recommended)
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="ogImage"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Open Graph Image URL</FormLabel>
                      <FormControl>
                        <Input placeholder="/lovable-uploads/banks-o-dee-logo.png" {...field} />
                      </FormControl>
                      <FormDescription>
                        Image displayed when sharing links on social media
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              {/* Analytics Settings */}
              <div className="space-y-4 pt-4">
                <h3 className="text-lg font-medium">Analytics Settings</h3>
                <Separator />

                <FormField
                  control={form.control}
                  name="googleAnalyticsId"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Google Analytics ID</FormLabel>
                      <FormControl>
                        <Input placeholder="G-XXXXXXXXXX" {...field} />
                      </FormControl>
                      <FormDescription>
                        Your Google Analytics measurement ID
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              {/* Maintenance Mode */}
              <div className="space-y-4 pt-4">
                <h3 className="text-lg font-medium">Maintenance Mode</h3>
                <Separator />

                <FormField
                  control={form.control}
                  name="maintenanceMode"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                      <div className="space-y-0.5">
                        <FormLabel className="text-base">
                          Maintenance Mode
                        </FormLabel>
                        <FormDescription>
                          When enabled, displays a maintenance message to site visitors
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
                  name="maintenanceMessage"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Maintenance Message</FormLabel>
                      <FormControl>
                        <Textarea 
                          placeholder="We're currently updating our website. Please check back soon."
                          {...field}
                          disabled={!form.watch("maintenanceMode")} 
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <CardFooter className="flex justify-end border-t pt-5 mt-6">
                <Button type="submit">Save Settings</Button>
              </CardFooter>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
};

export default SiteConfiguration;
