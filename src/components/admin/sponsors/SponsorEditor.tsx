import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { format } from 'date-fns';
import { 
  Calendar as CalendarIcon, 
  CalendarRange, 
  Globe, 
  Save, 
  Users, 
  X 
} from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { toast } from 'sonner';
import { Card, CardContent } from '@/components/ui/card';
import { Calendar } from '@/components/ui/calendar';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { cn } from '@/lib/utils';

import SponsorLogoUploader from '@/components/admin/common/SponsorLogoUploader';
import SponsorContactsManager from './SponsorContactsManager';
import SponsorCommunicationsLog from './SponsorCommunicationsLog';
import SponsorDocumentsManager from './SponsorDocumentsManager';
import { fetchSponsorById, createSponsor, updateSponsor, fetchSponsorshipTiers } from '@/services/sponsorsService';
import { Sponsor, SponsorshipTier } from '@/types/sponsors';

const formSchema = z.object({
  name: z.string().min(2, "Sponsor name must be at least 2 characters"),
  tier: z.enum(["platinum", "gold", "silver", "bronze"]),
  description: z.string().optional(),
  website_url: z.string().url("Please enter a valid URL").or(z.literal('')),
  is_active: z.boolean().default(true),
  start_date: z.date().optional().nullable(),
  end_date: z.date().optional().nullable(),
  renewal_status: z.string().optional(),
  display_order: z.number().int().nonnegative().optional(),
});

interface SponsorEditorProps {
  sponsorId: string | null;
  onSaved: () => void;
  onCancel: () => void;
}

const SponsorEditor: React.FC<SponsorEditorProps> = ({
  sponsorId,
  onSaved,
  onCancel,
}) => {
  const [logoUrl, setLogoUrl] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState('details');
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const isEditMode = !!sponsorId;
  
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: '',
      tier: "bronze",
      description: '',
      website_url: '',
      is_active: true,
      start_date: null,
      end_date: null,
      renewal_status: 'active',
      display_order: 999,
    },
  });

  const { data: tiers, isLoading: isLoadingTiers } = useQuery({
    queryKey: ['sponsorshipTiers'],
    queryFn: async () => {
      const response = await fetchSponsorshipTiers();
      if (!response.success) {
        throw new Error(response.error || 'Failed to load tiers');
      }
      return response.data;
    },
  });

  const { data: sponsor, isLoading: isLoadingSponsor } = useQuery({
    queryKey: ['sponsor', sponsorId],
    queryFn: async () => {
      if (!sponsorId) return null;
      const response = await fetchSponsorById(sponsorId);
      if (!response.success) {
        throw new Error(response.error || 'Failed to load sponsor');
      }
      return response.data;
    },
    enabled: !!sponsorId
  });

  useEffect(() => {
    if (sponsor) {
      setLogoUrl(sponsor.logo_url || null);
      
      form.reset({
        name: sponsor.name,
        tier: sponsor.tier as "platinum" | "gold" | "silver" | "bronze",
        description: sponsor.description || '',
        website_url: sponsor.website_url || '',
        is_active: sponsor.is_active !== false,
        start_date: sponsor.start_date ? new Date(sponsor.start_date) : null,
        end_date: sponsor.end_date ? new Date(sponsor.end_date) : null,
        renewal_status: sponsor.renewal_status || 'active',
        display_order: sponsor.display_order || 999,
      });
    }
  }, [sponsor, form]);

  const handleLogoUpload = (url: string) => {
    setLogoUrl(url);
  };

  const handleSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      setIsSubmitting(true);
      
      const sponsorData: any = {
        ...values,
        logo_url: logoUrl,
      };
      
      if (!sponsorData.description) delete sponsorData.description;
      if (!sponsorData.website_url) delete sponsorData.website_url;
      
      if (sponsorData.start_date && typeof sponsorData.start_date === 'object') {
        sponsorData.start_date = sponsorData.start_date.toISOString().split('T')[0];
      }
      
      if (sponsorData.end_date && typeof sponsorData.end_date === 'object') {
        sponsorData.end_date = sponsorData.end_date.toISOString().split('T')[0];
      }
      
      let response;
      
      if (isEditMode && sponsorId) {
        response = await updateSponsor(sponsorId, sponsorData);
      } else {
        response = await createSponsor(sponsorData);
      }
      
      if (response.success) {
        toast.success(isEditMode ? 'Sponsor updated successfully' : 'Sponsor created successfully');
        onSaved();
      } else {
        toast.error(response.error || 'An error occurred while saving');
      }
    } catch (error: any) {
      console.error('Error saving sponsor:', error);
      toast.error(error.message || 'An error occurred while saving');
    } finally {
      setIsSubmitting(false);
    }
  };

  const isLoading = isLoadingSponsor || isLoadingTiers || isSubmitting;

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">
          {isEditMode ? `Edit Sponsor: ${sponsor?.name}` : 'Add New Sponsor'}
        </h2>
        <div className="space-x-2">
          <Button variant="outline" onClick={onCancel} disabled={isLoading}>
            Cancel
          </Button>
          <Button 
            type="button" 
            onClick={form.handleSubmit(handleSubmit)}
            disabled={isLoading || !form.formState.isDirty}
          >
            {isLoading && <div className="animate-spin mr-2">◌</div>}
            <Save className="mr-2 h-4 w-4" />
            Save Sponsor
          </Button>
        </div>
      </div>

      {isEditMode && sponsorId && (
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList>
            <TabsTrigger value="details">Sponsor Details</TabsTrigger>
            <TabsTrigger value="contacts">Contacts</TabsTrigger>
            <TabsTrigger value="communications">Communications</TabsTrigger>
            <TabsTrigger value="documents">Documents</TabsTrigger>
          </TabsList>
        </Tabs>
      )}

      <TabsContent value="details" className={!isEditMode ? 'block' : ''}>
        <Form {...form}>
          <form className="space-y-6" onSubmit={form.handleSubmit(handleSubmit)}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-6">
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Sponsor Name*</FormLabel>
                      <FormControl>
                        <Input placeholder="Company/Organization Name" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="tier"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Sponsorship Tier*</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select a tier" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="platinum">Platinum</SelectItem>
                          <SelectItem value="gold">Gold</SelectItem>
                          <SelectItem value="silver">Silver</SelectItem>
                          <SelectItem value="bronze">Bronze</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormDescription>
                        Each tier comes with different benefits and visibility options
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="website_url"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Website URL</FormLabel>
                      <FormControl>
                        <div className="relative">
                          <Globe className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                          <Input placeholder="https://example.com" className="pl-8" {...field} />
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="display_order"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Display Order</FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          min={1}
                          {...field}
                          onChange={(e) => field.onChange(parseInt(e.target.value) || 999)}
                        />
                      </FormControl>
                      <FormDescription>
                        Controls the order within each tier (lower numbers appear first)
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className="grid grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="start_date"
                    render={({ field }) => (
                      <FormItem className="flex flex-col">
                        <FormLabel>Start Date</FormLabel>
                        <Popover>
                          <PopoverTrigger asChild>
                            <FormControl>
                              <Button
                                variant={"outline"}
                                className={cn(
                                  "pl-3 text-left font-normal",
                                  !field.value && "text-muted-foreground"
                                )}
                              >
                                {field.value ? (
                                  format(field.value, "PPP")
                                ) : (
                                  <span>Pick a date</span>
                                )}
                                <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                              </Button>
                            </FormControl>
                          </PopoverTrigger>
                          <PopoverContent className="w-auto p-0" align="start">
                            <Calendar
                              mode="single"
                              selected={field.value || undefined}
                              onSelect={field.onChange}
                              disabled={(date) =>
                                date < new Date("1900-01-01")
                              }
                              initialFocus
                            />
                          </PopoverContent>
                        </Popover>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="end_date"
                    render={({ field }) => (
                      <FormItem className="flex flex-col">
                        <FormLabel>End Date</FormLabel>
                        <Popover>
                          <PopoverTrigger asChild>
                            <FormControl>
                              <Button
                                variant={"outline"}
                                className={cn(
                                  "pl-3 text-left font-normal",
                                  !field.value && "text-muted-foreground"
                                )}
                              >
                                {field.value ? (
                                  format(field.value, "PPP")
                                ) : (
                                  <span>Pick a date</span>
                                )}
                                <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                              </Button>
                            </FormControl>
                          </PopoverTrigger>
                          <PopoverContent className="w-auto p-0" align="start">
                            <Calendar
                              mode="single"
                              selected={field.value || undefined}
                              onSelect={field.onChange}
                              disabled={(date) =>
                                form.getValues().start_date &&
                                date < form.getValues().start_date
                              }
                              initialFocus
                            />
                          </PopoverContent>
                        </Popover>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="renewal_status"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Renewal Status</FormLabel>
                        <Select 
                          onValueChange={field.onChange} 
                          defaultValue={field.value || 'active'}
                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select status" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="active">Active</SelectItem>
                            <SelectItem value="pending">Pending Renewal</SelectItem>
                            <SelectItem value="renewed">Renewed</SelectItem>
                            <SelectItem value="expired">Expired</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="is_active"
                    render={({ field }) => (
                      <FormItem className="flex flex-row items-end space-x-3 space-y-0 rounded-md border p-4">
                        <FormControl>
                          <Switch
                            checked={field.value}
                            onCheckedChange={field.onChange}
                          />
                        </FormControl>
                        <div className="space-y-1 leading-none">
                          <FormLabel>Active Status</FormLabel>
                          <FormDescription>
                            Display this sponsor on the website
                          </FormDescription>
                        </div>
                      </FormItem>
                    )}
                  />
                </div>
              </div>

              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-medium mb-2">Logo</h3>
                  <SponsorLogoUploader 
                    currentLogoUrl={logoUrl} 
                    onUpload={handleLogoUpload} 
                  />
                  <p className="text-sm text-muted-foreground mt-2">
                    Upload a square logo for best results
                  </p>
                </div>

                <FormField
                  control={form.control}
                  name="description"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Description</FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="Describe the sponsor or their partnership"
                          className="min-h-[120px]"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </div>
          </form>
        </Form>

        {!isEditMode && (
          <div className="mt-4 border-t pt-4 text-center text-sm text-muted-foreground">
            <CalendarRange className="inline-block mr-2 h-4 w-4" />
            Save the sponsor to manage contacts, communications, and documents
          </div>
        )}
      </TabsContent>

      {isEditMode && sponsorId && (
        <>
          <TabsContent value="contacts">
            <Card>
              <CardContent className="pt-6">
                <SponsorContactsManager sponsorId={sponsorId} />
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="communications">
            <Card>
              <CardContent className="pt-6">
                <SponsorCommunicationsLog sponsorId={sponsorId} />
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="documents">
            <Card>
              <CardContent className="pt-6">
                <SponsorDocumentsManager sponsorId={sponsorId} />
              </CardContent>
            </Card>
          </TabsContent>
        </>
      )}
    </div>
  );
};

export default SponsorEditor;
