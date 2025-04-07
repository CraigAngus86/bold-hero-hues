import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Form, FormField, FormItem, FormLabel, FormControl, FormMessage } from '@/components/ui/form';
import { Plus, Edit, Trash2, Loader2, Check } from 'lucide-react';
import { toast } from 'sonner';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { supabase } from '@/integrations/supabase/client';

interface Venue {
  id: string;
  name: string;
  address: string;
  capacity: number;
  facilities: string;
  directions: string;
}

// Define form schema
const venueFormSchema = z.object({
  name: z.string().min(1, 'Venue name is required'),
  address: z.string().optional(),
  capacity: z.number().optional().nullable(),
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
      capacity: 0,
      facilities: '',
      directions: '',
    },
  });

  // Fetch all venues
  const fetchData = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('venues')
        .select('*');
      
      if (error) throw error;
      
      // Map the data to the Venue interface
      if (data) {
        setVenues(mapVenuesToState(data));
      }
    } catch (error) {
      console.error('Error fetching venues:', error);
      toast.error('Failed to load venues');
    } finally {
      setLoading(false);
    }
  };

  // Fix the name handling to ensure string type
  const mapVenuesToState = (data: any[]): Venue[] => {
    return data.map(venue => ({
      id: venue.id,
      name: String(venue.name || ''), // Ensure name is string
      address: venue.address || '',
      capacity: venue.capacity || 0,
      facilities: venue.facilities || '',
      directions: venue.directions || ''
    }));
  };

  // Initial data fetch
  useEffect(() => {
    fetchData();
  }, []);

  // Open dialog for creating a new venue
  const handleOpenCreateDialog = () => {
    form.reset({
      name: '',
      address: '',
      capacity: 0,
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
      facilities: venue.facilities,
      directions: venue.directions,
    });
    setEditingVenue(venue);
    setDialogOpen(true);
  };

  // Handle form submission (create or update)
  const onSubmit = async (values: VenueFormValues) => {
    setLoading(true);
    try {
      // Transform values to ensure correct types
      const transformedValues = safetyTransform(values);
      
      if (editingVenue) {
        // Update existing venue
        const { error } = await supabase
          .from('venues')
          .update(transformedValues)
          .eq('id', editingVenue.id);
        
        if (error) throw error;
        
        toast.success('Venue updated successfully');
      } else {
        // Create new venue
        const { error } = await supabase
          .from('venues')
          .insert([transformedValues]);
        
        if (error) throw error;
        
        toast.success('Venue created successfully');
      }
      
      setDialogOpen(false);
      fetchData();
    } catch (error) {
      console.error('Error saving venue:', error);
      toast.error('Failed to save venue');
    } finally {
      setLoading(false);
    }
  };

  // Update the safetyTransform function 
  const safetyTransform = (venue: any): Venue => {
    return {
      id: venue.id,
      name: String(venue.name || ''), // Ensure name is string
      address: String(venue.address || ''),
      capacity: Number(venue.capacity || 0),
      facilities: String(venue.facilities || ''),
      directions: String(venue.directions || '')
    };
  };

  // Handle venue deletion
  const handleDeleteVenue = async (venueId: string) => {
    setLoading(true);
    try {
      const { error } = await supabase
        .from('venues')
        .delete()
        .eq('id', venueId);
      
      if (error) throw error;
      
      toast.success('Venue deleted successfully');
      fetchData();
    } catch (error) {
      console.error('Error deleting venue:', error);
      toast.error('Failed to delete venue');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <CardTitle>Venue Management</CardTitle>
          <Button onClick={handleOpenCreateDialog}>
            <Plus className="h-4 w-4 mr-2" />
            Add Venue
          </Button>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="flex justify-center py-8">
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
                  <TableHead className="w-[100px]">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {venues.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={4} className="text-center py-4 text-gray-500">
                      No venues found
                    </TableCell>
                  </TableRow>
                ) : (
                  venues.map((venue) => (
                    <TableRow key={venue.id}>
                      <TableCell className="font-medium">{venue.name}</TableCell>
                      <TableCell>{venue.address}</TableCell>
                      <TableCell>{venue.capacity}</TableCell>
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
                      <Input type="number" {...field} placeholder="Enter capacity" />
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
                      <Input {...field} placeholder="Enter facilities" />
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
                      <Input {...field} placeholder="Enter directions" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <DialogFooter>
                <Button type="button" variant="outline" onClick={() => setDialogOpen(false)} disabled={loading}>
                  Cancel
                </Button>
                <Button type="submit" disabled={loading}>
                  {loading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Saving...
                    </>
                  ) : (
                    <>
                      <Check className="mr-2 h-4 w-4" />
                      {editingVenue ? 'Update Venue' : 'Create Venue'}
                    </>
                  )}
                </Button>
              </DialogFooter>
            </form>
          </Form>
        </DialogContent>
      </Dialog>
    </div>
  );
};
