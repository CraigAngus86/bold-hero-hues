
import React, { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useQuery, useMutation } from '@tanstack/react-query';
import { Loader2 } from 'lucide-react';
import { toast } from 'sonner';

import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  FormDescription,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

import SponsorLogoUploader from '@/components/admin/common/SponsorLogoUploader';
import { fetchSponsorById, createSponsor, updateSponsor } from '@/services/sponsorsDbService';
import { Sponsor } from '@/types/sponsors';

interface SponsorEditorProps {
  sponsorId: string | null; // null for new sponsor
  onSaved: () => void;
  onCancel: () => void;
}

// Form validation schema
const formSchema = z.object({
  name: z.string().min(2, "Sponsor name must be at least 2 characters"),
  website_url: z.string().url("Please enter a valid URL").or(z.literal("")),
  description: z.string().optional(),
  tier: z.enum(["platinum", "gold", "silver", "bronze"]),
  is_active: z.boolean().default(true),
  logo_url: z.string().optional(),
});

type FormValues = z.infer<typeof formSchema>;

const SponsorEditor: React.FC<SponsorEditorProps> = ({ sponsorId, onSaved, onCancel }) => {
  const isEditing = !!sponsorId;
  
  // Set up form
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      website_url: "",
      description: "",
      tier: "bronze",
      is_active: true,
      logo_url: "",
    },
  });

  // Fetch sponsor data if editing
  const { data: sponsorData, isLoading: isLoadingSponsor } = useQuery({
    queryKey: ['sponsor', sponsorId],
    queryFn: async () => {
      if (!sponsorId) return null;
      const response = await fetchSponsorById(sponsorId);
      if (!response.success) {
        throw new Error(response.error?.message || 'Failed to load sponsor');
      }
      return response.data;
    },
    enabled: !!sponsorId,
  });

  // Update form when sponsor data is loaded
  useEffect(() => {
    if (sponsorData) {
      form.reset({
        name: sponsorData.name,
        website_url: sponsorData.website_url || "",
        description: sponsorData.description || "",
        tier: sponsorData.tier as "platinum" | "gold" | "silver" | "bronze",
        is_active: sponsorData.is_active !== false, // Default to true if undefined
        logo_url: sponsorData.logo_url || "",
      });
    }
  }, [sponsorData, form]);

  // Create/Update mutations
  const createMutation = useMutation({
    mutationFn: async (data: Omit<Sponsor, "id">) => {
      const response = await createSponsor(data);
      if (!response.success) {
        throw new Error(response.error?.message || 'Failed to create sponsor');
      }
      return response.data;
    },
    onSuccess: () => {
      toast.success("Sponsor created successfully");
      onSaved();
    },
    onError: (error) => {
      toast.error(`Error: ${error.message}`);
    },
  });

  const updateMutation = useMutation({
    mutationFn: async ({ id, data }: { id: string; data: Partial<Sponsor> }) => {
      const response = await updateSponsor(id, data);
      if (!response.success) {
        throw new Error(response.error?.message || 'Failed to update sponsor');
      }
      return response.data;
    },
    onSuccess: () => {
      toast.success("Sponsor updated successfully");
      onSaved();
    },
    onError: (error) => {
      toast.error(`Error: ${error.message}`);
    },
  });

  const onSubmit = async (values: FormValues) => {
    if (isEditing && sponsorId) {
      updateMutation.mutate({ id: sponsorId, data: values });
    } else {
      // Ensure all required fields are present for creating a new sponsor
      const sponsorData: Omit<Sponsor, "id"> = {
        name: values.name, // name is guaranteed to exist due to the form validation
        tier: values.tier,
        is_active: values.is_active,
        website_url: values.website_url || undefined,
        description: values.description || undefined,
        logo_url: values.logo_url || undefined
      };
      
      createMutation.mutate(sponsorData);
    }
  };

  const handleLogoUpload = (imageUrl: string) => {
    form.setValue('logo_url', imageUrl);
  };

  const isSubmitting = createMutation.isPending || updateMutation.isPending;

  // Loading state
  if (isEditing && isLoadingSponsor) {
    return (
      <div className="flex justify-center items-center py-12">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row gap-6">
        <div className="flex-1 space-y-4">
          <Card>
            <CardContent className="pt-6">
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                  <FormField
                    control={form.control}
                    name="name"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Sponsor Name</FormLabel>
                        <FormControl>
                          <Input placeholder="Enter sponsor name" {...field} />
                        </FormControl>
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
                          <Input placeholder="https://example.com" {...field} />
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
                        <FormLabel>Sponsorship Tier</FormLabel>
                        <Select
                          onValueChange={field.onChange}
                          defaultValue={field.value}
                          value={field.value}
                        >
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
                          Different tiers may be displayed differently on the site
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="description"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Description</FormLabel>
                        <FormControl>
                          <Textarea 
                            placeholder="Enter description of the sponsorship" 
                            {...field} 
                            value={field.value || ""}
                          />
                        </FormControl>
                        <FormDescription>
                          This may be displayed on the sponsor's detail page
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="is_active"
                    render={({ field }) => (
                      <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                        <div className="space-y-0.5">
                          <FormLabel className="text-base">Active Status</FormLabel>
                          <FormDescription>
                            Only active sponsors are displayed on the website
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

                  <div className="flex justify-end gap-2 pt-4">
                    <Button 
                      type="button" 
                      variant="outline" 
                      onClick={onCancel}
                      disabled={isSubmitting}
                    >
                      Cancel
                    </Button>
                    <Button type="submit" disabled={isSubmitting}>
                      {isSubmitting ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          {isEditing ? 'Updating...' : 'Creating...'}
                        </>
                      ) : (
                        isEditing ? 'Update Sponsor' : 'Create Sponsor'
                      )}
                    </Button>
                  </div>
                </form>
              </Form>
            </CardContent>
          </Card>
        </div>

        <div className="md:w-1/3 space-y-4">
          <div>
            <h3 className="text-lg font-medium mb-2">Sponsor Logo</h3>
            <SponsorLogoUploader
              initialImageUrl={form.watch('logo_url')}
              onUpload={handleLogoUpload}
              sponsorName={form.watch('name')}
            />
          </div>
          
          <Card>
            <CardContent className="pt-6">
              <h3 className="text-lg font-medium mb-4">Preview</h3>
              <div className="border rounded-lg p-4 flex flex-col items-center">
                {form.watch('logo_url') ? (
                  <img 
                    src={form.watch('logo_url')} 
                    alt="Sponsor logo preview" 
                    className="max-h-32 max-w-full object-contain mb-3" 
                  />
                ) : (
                  <div className="bg-gray-100 flex items-center justify-center h-32 w-full mb-3 rounded">
                    <p className="text-gray-400 text-sm">No logo uploaded</p>
                  </div>
                )}
                
                <span className="font-medium">{form.watch('name') || 'Sponsor Name'}</span>
                
                {form.watch('website_url') && (
                  <a 
                    href={form.watch('website_url')} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="text-sm text-blue-600 hover:underline mt-1"
                  >
                    Visit Website
                  </a>
                )}
                
                <div className="mt-2">
                  <Badge className={
                    form.watch('tier') === 'platinum' ? 'bg-zinc-300' :
                    form.watch('tier') === 'gold' ? 'bg-yellow-100 text-yellow-800' :
                    form.watch('tier') === 'silver' ? 'bg-gray-100 text-gray-800' :
                    'bg-amber-100 text-amber-800'
                  }>
                    {form.watch('tier')?.charAt(0).toUpperCase() + form.watch('tier')?.slice(1) || 'Bronze'}
                  </Badge>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default SponsorEditor;

// Importing the Badge component that we're using in the preview
import { Badge } from '@/components/ui/badge';
