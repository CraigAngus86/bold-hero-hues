import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/Table';
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Textarea } from '@/components/ui/textarea';
import { Plus, MapPin, Edit, Trash2, Loader2, Check } from 'lucide-react';
import { toast } from 'sonner';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { supabase } from '@/integrations/supabase/client';

interface Venue {
  id: string;
  name: string;
  address: string;
  capacity?: number;
  facilities?: string;
  directions?: string;
}

// Define form schema
const venueFormSchema = z.object({
  name: z.string().min(1, 'Venue name is required'),
  address: z.string().min(1, 'Address is required'),
  capacity: z.number().int().positive().optional(),
  facilities: z.string().optional(),
  directions: z.string().optional(),
});

type VenueFormValues = z.infer<typeof venueFormSchema>;

export const VenueManager: React.FC = () => {
  const [venues, setVenues] = useState<Venue[]>([]);
  const [loading, setLoading] = useState(false);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingVenue, setEditingVenue] = useState<Venue | null>(null);
  
  // Initialize form
  const form = useForm<VenueFormValues>({
    resolver: zodResolver(venueFormSchema),
    defaultValues: {
      name: '',
      address: '',
      capacity: undefined,
      facilities: '',
      directions: '',
    }
  });
  
  // Fetch all venues
  const fetchVenues = async () => {
    setLoading(true);
    try {
      // In a real implementation, you would fetch from a venues table
      // For now, let's extract unique venues from fixtures and create some mock data
      
      const { data, error } = await supabase
        .from('fixtures')
        .select('venue')
        .not('venue', 'is', null);
      
      if (error) throw error;
      
      // Extract unique venues
      const uniqueVenues = [...new Set(data.map(item => item.venue).filter(Boolean))];
      
      // Create sample venue objects with random data
      const venueObjects = uniqueVenues.map((venueName, index) => ({
        id: `venue-${index}`,
        name: venueName,
        address: `${index + 1} Stadium Road, City, Postcode`,
        capacity: Math.floor(Math.random() * 5000) + 1000,
        facilities: 'Parking, Refreshments, Toilets, Covered Seating',
        directions: 'Detailed directions would be provided here...'
      }));
      
      setVenues(venueObjects);
    } catch (error) {
      console.error('Error fetching venues:', error);
      toast.error('Failed to load venues');
    } finally {
      setLoading(false);
    }
  };
  
  // Initial data fetch
  useEffect(() => {
    fetchVenues();
  }, []);
  
  // Open dialog for creating a new venue
  const handleOpenCreateDialog = () => {
    form.reset({
      name: '',
      address: '',
      capacity: undefined,
      facilities: '',
      directions: '',
    });
    setEditingVenue(null);
    setDialogOpen(true);
  };
  
  // Open dialog for editing a venue
  const handleOpenEditDialog = (venue: Venue) => {
    form.reset({
      name: venue.name,
      address: venue.address,
      capacity: venue.capacity,
      facilities: venue.facilities || '',
      directions: venue.directions || '',
    });
    setEditingVenue(venue);
    setDialogOpen(true);
  };
  
  // Handle form submission (create or update)
  const onSubmit = async (values: VenueFormValues) => {
    try {
      // In a real implementation, you would save to a venues table
      // For this demo, we'll just update the local state
      
      if (editingVenue) {
        // Update existing venue
        const updatedVenues = venues.map(venue => 
          venue.id === editingVenue.id ? { ...venue, ...values } : venue
        );
        setVenues(updatedVenues);
        toast.success('Venue updated successfully');
      } else {
        // Create new venue
        const newVenue: Venue = {
          id: `venue-${Date.now()}`,
          name: values.name,
          address: values.address,
          capacity: values.capacity,
          facilities: values.facilities,
          directions: values.directions,
        };
        setVenues([...venues, newVenue]);
        toast.success('Venue created successfully');
      }
      
      setDialogOpen(false);
    } catch (error) {
      console.error('Error saving venue:', error);
      toast.error('Failed to save venue');
    }
  };
  
  // Handle venue deletion
  const handleDeleteVenue = async (venueId: string) => {
    try {
      // In a real implementation, you would delete from a venues table
      
      // Update local state
      setVenues(venues.filter(venue => venue.id !== venueId));
      toast.success('Venue deleted successfully');
    } catch (error) {
      console.error('Error deleting venue:', error);
      toast.error('Failed to delete venue');
    }
  };

  return (
    <div>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Venue Management</CardTitle>
          <Button onClick={handleOpenCreateDialog}>
            <Plus className="h-4 w-4 mr-2" />
            Add Venue
          </Button>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="flex justify-center p-8">
              <Loader2 className="h-8 w-8 animate-spin text-primary mr-2" />
              <p>Loading venues...</p>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Address</TableHead>
                  <TableHead>Capacity</TableHead>
                  <TableHead>Facilities</TableHead>
                  <TableHead className="w-[100px]">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {venues.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={5} className="text-center py-4 text-gray-500">
                      No venues found
                    </TableCell>
                  </TableRow>
                ) : (
                  venues.map((venue) => (
                    <TableRow key={venue.id}>
                      <TableCell className="font-medium">{venue.name}</TableCell>
                      <TableCell>{venue.address}</TableCell>
                      <TableCell>{venue.capacity || 'N/A'}</TableCell>
                      <TableCell>{venue.facilities || 'N/A'}</TableCell>
                      <TableCell>
                        <div className="flex space-x-2">
                          <Button variant="ghost" size="sm" onClick={() => handleOpenEditDialog(venue)}>
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button variant="ghost" size="sm" onClick={() => handleDeleteVenue(venue.id)}>
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="sm:max-w-[550px]">
          <DialogHeader>
            <DialogTitle>
              {editingVenue ? 'Edit Venue' : 'Add New Venue'}
            </DialogTitle>
          </DialogHeader>

          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Venue Name</FormLabel>
                    <FormControl>
                      <Input {...field} placeholder="Enter venue name" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="address"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Address</FormLabel>
                    <FormControl>
                      <Input {...field} placeholder="Enter address" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="capacity"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Capacity</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        {...field}
                        placeholder="Enter capacity"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="facilities"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Facilities</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Enter facilities"
                        className="min-h-[80px]"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="directions"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Directions</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Enter directions"
                        className="min-h-[80px]"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <DialogFooter>
                <Button type="button" variant="outline" onClick={() => setDialogOpen(false)}>
                  Cancel
                </Button>
                <Button type="submit">
                  <Check className="h-4 w-4 mr-2" />
                  {editingVenue ? 'Update Venue' : 'Create Venue'}
                </Button>
              </DialogFooter>
            </form>
          </Form>
        </DialogContent>
      </Dialog>
    </div>
  );
};
