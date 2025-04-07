import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Calendar } from 'lucide-react';
import { toast } from 'sonner';
import { useMutation } from '@tanstack/react-query';
import { createSponsor, updateSponsor, getSponsor } from '@/services/sponsorsService';
import { Sponsor } from '@/types/sponsors';
import SponsorLogoUploader from './SponsorLogoUploader';

interface SponsorEditorProps {
  sponsorId?: string;
  onClose: () => void;
}

const SponsorEditor: React.FC<SponsorEditorProps> = ({ sponsorId, onClose }) => {
  const [logoUrl, setLogoUrl] = useState('');
  const isEditMode = !!sponsorId;

  const form = useForm<Sponsor>({
    defaultValues: {
      name: '',
      website_url: '',
      logo_url: '',
      description: '',
      contact_name: '',
      contact_email: '',
      contact_phone: '',
      start_date: new Date().toISOString().split('T')[0],
      end_date: new Date(new Date().setFullYear(new Date().getFullYear() + 1)).toISOString().split('T')[0],
      tier: 'gold',
      notes: ''
    }
  });

  useEffect(() => {
    if (sponsorId) {
      const fetchSponsor = async () => {
        try {
          const sponsor = await getSponsor(sponsorId);
          if (sponsor) {
            form.reset(sponsor);
            setLogoUrl(sponsor.logo_url || '');
          } else {
            toast.error('Sponsor not found');
            onClose();
          }
        } catch (error) {
          console.error('Error fetching sponsor:', error);
          toast.error('Failed to load sponsor');
          onClose();
        }
      };
      fetchSponsor();
    }
  }, [sponsorId, form, onClose]);

  const updateMutation = useMutation({
    mutationFn: async (sponsorData: Partial<Sponsor>) => {
      if (sponsorData.start_date && typeof sponsorData.start_date !== 'string') {
        sponsorData.start_date = (sponsorData.start_date as Date).toISOString();
      }
      if (sponsorData.end_date && typeof sponsorData.end_date !== 'string') {
        sponsorData.end_date = (sponsorData.end_date as Date).toISOString();
      }
      return await updateSponsor(sponsorId!, sponsorData);
    },
    onSuccess: () => {
      toast.success('Sponsor updated successfully');
      onClose();
    },
    onError: (error: any) => {
      toast.error(error?.message || 'Failed to update sponsor');
    }
  });

  const createMutation = useMutation({
    mutationFn: async (sponsorData: Omit<Sponsor, 'id'>) => {
      if (sponsorData.start_date && typeof sponsorData.start_date !== 'string') {
        sponsorData.start_date = (sponsorData.start_date as Date).toISOString();
      }
      if (sponsorData.end_date && typeof sponsorData.end_date !== 'string') {
        sponsorData.end_date = (sponsorData.end_date as Date).toISOString();
      }
      return await createSponsor(sponsorData);
    },
    onSuccess: () => {
      toast.success('Sponsor created successfully');
      onClose();
    },
    onError: (error: any) => {
      toast.error(error?.message || 'Failed to create sponsor');
    }
  });

  const handleSubmit = async (data: Sponsor) => {
    const sponsorData = {
      ...data,
      logo_url: logoUrl
    };

    if (isEditMode) {
      updateMutation.mutate(sponsorData);
    } else {
      createMutation.mutate(sponsorData);
    }
  };

  return (
    <Card className="w-full">
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>{isEditMode ? 'Edit Sponsor' : 'Create New Sponsor'}</CardTitle>
        <Button variant="ghost" size="sm" onClick={onClose}>
          Cancel
        </Button>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Name</FormLabel>
                    <FormControl>
                      <Input placeholder="Sponsor Name" {...field} />
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
            </div>

            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Description</FormLabel>
                  <FormControl>
                    <Textarea placeholder="Sponsor Description" className="resize-none" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <FormField
                control={form.control}
                name="contact_name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Contact Name</FormLabel>
                    <FormControl>
                      <Input placeholder="Contact Name" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="contact_email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Contact Email</FormLabel>
                    <FormControl>
                      <Input type="email" placeholder="Contact Email" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="contact_phone"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Contact Phone</FormLabel>
                    <FormControl>
                      <Input placeholder="Contact Phone" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="start_date"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Start Date</FormLabel>
                    <FormControl>
                      <Input type="date" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="end_date"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>End Date</FormLabel>
                    <FormControl>
                      <Input type="date" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="tier"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Tier</FormLabel>
                  <FormControl>
                    <Input placeholder="Sponsor Tier" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="notes"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Notes</FormLabel>
                  <FormControl>
                    <Textarea placeholder="Additional Notes" className="resize-none" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormItem>
              <FormLabel>Logo</FormLabel>
              <SponsorLogoUploader 
                logoUrl={logoUrl} 
                onUpload={setLogoUrl} 
              />
            </FormItem>

            <CardFooter className="flex justify-between">
              <Button variant="ghost" onClick={onClose}>
                Cancel
              </Button>
              <Button type="submit" disabled={updateMutation.isLoading || createMutation.isLoading}>
                {isEditMode
                  ? updateMutation.isLoading ? 'Updating...' : 'Update Sponsor'
                  : createMutation.isLoading ? 'Creating...' : 'Create Sponsor'}
              </Button>
            </CardFooter>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
};

export default SponsorEditor;
