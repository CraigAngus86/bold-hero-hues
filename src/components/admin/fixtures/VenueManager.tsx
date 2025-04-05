
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/Table';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent } from '@/components/ui/card';
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Trash, Edit, Plus, MapPin } from 'lucide-react';
import { toast } from 'sonner';

interface Venue {
  id: string;
  name: string;
  address: string;
  capacity?: number;
  facilities?: string;
  directions?: string;
}

export const VenueManager: React.FC = () => {
  const [venues, setVenues] = useState<Venue[]>([
    { id: '1', name: 'Station Park', address: 'Nairn, Scotland', capacity: 2500 },
    { id: '2', name: 'Christie Park', address: 'Huntly, Scotland', capacity: 3000 },
    { id: '3', name: 'Harmsworth Park', address: 'Wick, Scotland', capacity: 2412 }
  ]);
  
  const [loading, setLoading] = useState(false);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [currentVenue, setCurrentVenue] = useState<Venue | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    address: '',
    capacity: '',
    facilities: '',
    directions: ''
  });
  
  const handleOpenDialog = (venue?: Venue) => {
    if (venue) {
      setCurrentVenue(venue);
      setFormData({
        name: venue.name,
        address: venue.address,
        capacity: venue.capacity ? String(venue.capacity) : '',
        facilities: venue.facilities || '',
        directions: venue.directions || ''
      });
    } else {
      setCurrentVenue(null);
      setFormData({
        name: '',
        address: '',
        capacity: '',
        facilities: '',
        directions: ''
      });
    }
    setDialogOpen(true);
  };
  
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };
  
  const handleSave = () => {
    if (!formData.name || !formData.address) {
      toast.error('Name and address are required fields');
      return;
    }
    
    setLoading(true);
    
    try {
      // In a real application, you would save to your database here
      const venueData = {
        name: formData.name,
        address: formData.address,
        capacity: formData.capacity ? parseInt(formData.capacity) : undefined,
        facilities: formData.facilities || undefined,
        directions: formData.directions || undefined
      };
      
      if (currentVenue) {
        // Update existing venue
        setVenues(prevVenues => 
          prevVenues.map(venue => 
            venue.id === currentVenue.id 
              ? { ...venue, ...venueData }
              : venue
          )
        );
        toast.success(`Updated venue: ${formData.name}`);
      } else {
        // Create new venue
        const newVenue = {
          ...venueData,
          id: Math.random().toString(36).substring(2, 9)
        };
        setVenues(prevVenues => [...prevVenues, newVenue]);
        toast.success(`Added new venue: ${formData.name}`);
      }
    } catch (error) {
      console.error('Error saving venue:', error);
      toast.error('Failed to save venue');
    } finally {
      setLoading(false);
      setDialogOpen(false);
    }
  };
  
  const handleDelete = (id: string) => {
    if (confirm('Are you sure you want to delete this venue? This action cannot be undone.')) {
      setVenues(prevVenues => prevVenues.filter(venue => venue.id !== id));
      toast.success('Venue deleted');
    }
  };
  
  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-medium">Venue Management</h3>
        <Button onClick={() => handleOpenDialog()} className="flex items-center">
          <Plus className="h-4 w-4 mr-2" />
          Add Venue
        </Button>
      </div>
      
      <Card>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Address</TableHead>
                <TableHead>Capacity</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {venues.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={4} className="text-center py-6 text-muted-foreground">
                    No venues found. Add your first venue.
                  </TableCell>
                </TableRow>
              ) : (
                venues.map(venue => (
                  <TableRow key={venue.id}>
                    <TableCell className="font-medium">{venue.name}</TableCell>
                    <TableCell>{venue.address}</TableCell>
                    <TableCell>{venue.capacity ? `${venue.capacity.toLocaleString()} seats` : '—'}</TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end space-x-2">
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleOpenDialog(venue)}
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleDelete(venue.id)}
                          className="text-destructive hover:text-destructive"
                        >
                          <Trash className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
      
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="sm:max-w-[550px]">
          <DialogHeader>
            <DialogTitle>
              {currentVenue ? 'Edit Venue' : 'Add New Venue'}
            </DialogTitle>
          </DialogHeader>
          
          <div className="space-y-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="name" className="text-right">Venue Name</Label>
              <Input
                id="name"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                className="col-span-3"
                placeholder="Stadium name"
              />
            </div>
            
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="address" className="text-right">Address</Label>
              <Input
                id="address"
                name="address"
                value={formData.address}
                onChange={handleInputChange}
                className="col-span-3"
                placeholder="Full address"
              />
            </div>
            
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="capacity" className="text-right">Capacity</Label>
              <Input
                id="capacity"
                name="capacity"
                type="number"
                value={formData.capacity}
                onChange={handleInputChange}
                className="col-span-3"
                placeholder="Seating capacity"
              />
            </div>
            
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="facilities" className="text-right">Facilities</Label>
              <Textarea
                id="facilities"
                name="facilities"
                value={formData.facilities}
                onChange={handleInputChange}
                className="col-span-3"
                placeholder="Describe available facilities"
              />
            </div>
            
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="directions" className="text-right">Directions</Label>
              <Textarea
                id="directions"
                name="directions"
                value={formData.directions}
                onChange={handleInputChange}
                className="col-span-3"
                placeholder="Travel directions"
              />
            </div>
          </div>
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleSave} disabled={loading}>
              {loading ? 'Saving...' : 'Save Venue'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};
