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
import { createSponsor, updateSponsor, fetchSponsorById } from '@/services/sponsorsService';
import { Sponsor } from '@/types/sponsors';
import SponsorLogoUploader from './SponsorLogoUploader';

interface SponsorEditorProps {
  sponsorId?: string;
  onClose: () => void;
  onSaved?: () => void;
  onCancel?: () => void;
}

const SponsorEditor: React.FC<SponsorEditorProps> = ({ sponsorId, onClose, onSaved = onClose, onCancel = onClose }) => {
  const [logoUrl, setLogoUrl] = useState('');
  const [isLoading, setIsLoading] = useState(false);
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
      notes: '',
      is_active: true
    }
  });

  useEffect(() => {
    if (sponsorId) {
      const fetchSponsor = async () => {
        setIsLoading(true);
        try {
          const response = await fetchSponsorById(sponsorId);
          if (response.success && response.data) {
            const sponsor = response.data;
            form.reset(sponsor);
            setLogoUrl(sponsor.logo_url || '');
          } else {
            throw new Error(response.error || 'Failed to load sponsor');
          }
        } catch (error) {
          console.error('Error fetching sponsor:', error);
          toast.error(error instanceof Error ? error.message : 'Failed to load sponsor');
          onClose();
        } finally {
          setIsLoading(false);
        }
      };
      fetchSponsor();
    }
  }, [sponsorId, form, onClose]);

  const handleImageUpload = (url: string) => {
    setLogoUrl(url);
  };

  const handleSubmit = async (data: Sponsor) => {
    setIsLoading(true);
    try {
      const sponsorData = {
        ...data,
        logo_url: logoUrl
      };

      let result;
      if (isEditMode) {
        result = await updateSponsor(sponsorId!, sponsorData);
      } else {
        result = await createSponsor(sponsorData);
      }

      if (result.success) {
        toast.success(`Sponsor ${isEditMode ? 'updated' : 'created'} successfully`);
        onSaved();
      } else {
        throw new Error(result.error || 'Failed to save sponsor');
      }
    } catch (error) {
      console.error(`Error ${isEditMode ? 'updating' : 'creating'} sponsor:`, error);
      toast.error(error instanceof Error ? error.message : 'Failed to save sponsor');
    } finally {
      setIsLoading(false);
    }
  };

  const tierRenderer = (field) => {
    const tierValue = typeof field.value === 'object' && field.value !== null
      ? field.value.name || ''
      : field.value;

    return (
      <FormItem>
        <FormLabel>Tier</FormLabel>
        <FormControl>
          <Input
            onChange={(e) => field.onChange(e.target.value)}
            value={String(tierValue)}
            placeholder="Sponsor tier"
          />
        </FormControl>
        <FormMessage />
      </FormItem>
    );
  };

  const renderContactFields = () => (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
      <div>
        <Label htmlFor="contact_name">Contact Name</Label>
        <Input 
          id="contact_name" 
          placeholder="Contact Name"
          value={form.watch('contact_name') || ''}
          onChange={(e) => form.setValue('contact_name', e.target.value)}
        />
      </div>
      <div>
        <Label htmlFor="contact_email">Contact Email</Label>
        <Input 
          id="contact_email"
          type="email" 
          placeholder="Contact Email"
          value={form.watch('contact_email') || ''}
          onChange={(e) => form.setValue('contact_email', e.target.value)}
        />
      </div>
      <div>
        <Label htmlFor="contact_phone">Contact Phone</Label>
        <Input 
          id="contact_phone" 
          placeholder="Contact Phone"
          value={form.watch('contact_phone') || ''}
          onChange={(e) => form.setValue('contact_phone', e.target.value)}
        />
      </div>
    </div>
  );

  return (
    <Card className="w-full">
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>{isEditMode ? 'Edit Sponsor' : 'Create New Sponsor'}</CardTitle>
        <Button variant="ghost" size="sm" onClick={onCancel}>
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

            {renderContactFields()}

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
              render={tierRenderer}
            />

            <div>
              <Label>Notes</Label>
              <Textarea
                placeholder="Additional Notes"
                className="resize-none"
                value={form.watch('notes') || ''}
                onChange={(e) => form.setValue('notes', e.target.value)}
              />
            </div>

            <FormItem>
              <FormLabel>Logo</FormLabel>
              <SponsorLogoUploader 
                logoUrl={logoUrl} 
                onUpload={handleImageUpload} 
              />
            </FormItem>

            <CardFooter className="flex justify-between">
              <Button variant="ghost" onClick={onCancel}>
                Cancel
              </Button>
              <Button type="submit" disabled={isLoading}>
                {isEditMode
                  ? isLoading ? 'Updating...' : 'Update Sponsor'
                  : isLoading ? 'Creating...' : 'Create Sponsor'}
              </Button>
            </CardFooter>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
};

export default SponsorEditor;
