import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/Table';
import { toast } from 'sonner';
import { Plus, Pencil, Trash, Save, X, MapPin } from 'lucide-react';
import { Textarea } from '@/components/ui/textarea';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

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
    { 
      id: '1', 
      name: 'Spain Park', 
      address: 'Canal Road, Aberdeen, AB25 3TL', 
      capacity: 2500,
      facilities: 'Main stand, terracing, refreshments, parking.',
      directions: 'Located in the Bridge of Don area. Bus routes 1, 2, and 40 stop nearby.'
    },
    { 
      id: '2', 
      name: 'Glebe Park', 
      address: 'Glebe Park, Brechin, DD9 6BJ',
      capacity: 4083,
      facilities: 'Main stand, covered terracing, club shop, refreshment areas.',
      directions: 'Just off the A933, walking distance from Brechin town center.'
    },
    { 
      id: '3', 
      name: 'Dudgeon Park', 
      address: 'Dudgeon Park, Brora, KW9 6QH',
      capacity: 4000,
      facilities: 'Modern facilities, covered stand, clubhouse.',
      directions: 'Located in the center of Brora, close to the railway station.'
    },
  ]);
  
  const [formData, setFormData] = useState<Venue>({
    id: '',
    name: '',
    address: '',
    capacity: undefined,
    facilities: '',
    directions: '',
  });
  
  const [isEditing, setIsEditing] = useState(false);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedVenue, setSelectedVenue] = useState<Venue | null>(null);
  
  const resetForm = () => {
    setFormData({
      id: '',
      name: '',
      address: '',
      capacity: undefined,
      facilities: '',
      directions: '',
    });
    setIsEditing(false);
  };
  
  const handleEditVenue = (venue: Venue) => {
    setFormData(venue);
    setIsEditing(true);
    setIsDialogOpen(true);
  };
  
  const handleViewDetails = (venue: Venue) => {
    setSelectedVenue(venue);
  };
  
  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.name || !formData.address) {
      toast.error('Name and address are required fields');
      return;
    }
    
    if (isEditing) {
      // Update existing venue
      setVenues(venues.map(venue => 
        venue.id === formData.id ? formData : venue
      ));
      toast.success('Venue updated successfully');
    } else {
      // Create new venue
      const newVenue = {
        ...formData,
        id: crypto.randomUUID(),
      };
      setVenues([...venues, newVenue]);
      toast.success('Venue created successfully');
    }
    
    resetForm();
    setIsDialogOpen(false);
  };
  
  const handleDeleteVenue = (id: string) => {
    setVenues(venues.filter(venue => venue.id !== id));
    toast.success('Venue deleted successfully');
    
    if (selectedVenue?.id === id) {
      setSelectedVenue(null);
    }
  };
  
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>Venue Management</CardTitle>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={() => { resetForm(); setIsDialogOpen(true); }}>
              <Plus className="mr-2 h-4 w-4" />
              Add Venue
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>
                {isEditing ? 'Edit Venue' : 'Add New Venue'}
              </DialogTitle>
              <DialogDescription>
                {isEditing 
                  ? 'Update the venue details below.' 
                  : 'Enter the details for the new venue.'}
              </DialogDescription>
            </DialogHeader>
            
            <form onSubmit={handleFormSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name">Venue Name</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="e.g., Spain Park"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="address">Address</Label>
                <Textarea
                  id="address"
                  value={formData.address}
                  onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                  placeholder="Full venue address"
                  rows={2}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="capacity">Capacity</Label>
                <Input
                  id="capacity"
                  type="number"
                  min="0"
                  value={formData.capacity || ''}
                  onChange={(e) => setFormData({ 
                    ...formData, 
                    capacity: e.target.value ? parseInt(e.target.value) : undefined 
                  })}
                  placeholder="Stadium capacity"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="facilities">Facilities</Label>
                <Textarea
                  id="facilities"
                  value={formData.facilities || ''}
                  onChange={(e) => setFormData({ ...formData, facilities: e.target.value })}
                  placeholder="Available facilities"
                  rows={3}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="directions">Travel Directions</Label>
                <Textarea
                  id="directions"
                  value={formData.directions || ''}
                  onChange={(e) => setFormData({ ...formData, directions: e.target.value })}
                  placeholder="How to get to the venue"
                  rows={3}
                />
              </div>
              
              <DialogFooter>
                <Button 
                  type="button" 
                  variant="outline" 
                  onClick={() => {
                    resetForm();
                    setIsDialogOpen(false);
                  }}
                >
                  <X className="mr-2 h-4 w-4" />
                  Cancel
                </Button>
                <Button type="submit">
                  <Save className="mr-2 h-4 w-4" />
                  {isEditing ? 'Update' : 'Create'}
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </CardHeader>
      
      <CardContent>
        <div className="grid md:grid-cols-[1fr_350px] gap-6">
          <Card>
            <CardContent className="p-0">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Name</TableHead>
                    <TableHead>Address</TableHead>
                    <TableHead>Capacity</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {venues.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={4} className="text-center py-4 text-muted-foreground">
                        No venues found. Add a venue to get started.
                      </TableCell>
                    </TableRow>
                  ) : (
                    venues.map((venue) => (
                      <TableRow 
                        key={venue.id}
                        className={selectedVenue?.id === venue.id ? "bg-secondary/30" : ""}
                        onClick={() => handleViewDetails(venue)}
                        style={{ cursor: 'pointer' }}
                      >
                        <TableCell className="font-medium">{venue.name}</TableCell>
                        <TableCell className="max-w-[200px] truncate">{venue.address}</TableCell>
                        <TableCell>{venue.capacity?.toLocaleString() || 'Unknown'}</TableCell>
                        <TableCell className="flex space-x-2">
                          <Button 
                            size="icon" 
                            variant="ghost"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleEditVenue(venue);
                            }}
                          >
                            <Pencil className="h-4 w-4" />
                          </Button>
                          <Button 
                            size="icon" 
                            variant="ghost"
                            className="text-destructive hover:text-destructive"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleDeleteVenue(venue.id);
                            }}
                          >
                            <Trash className="h-4 w-4" />
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
          
          <Card className="h-fit">
            {selectedVenue ? (
              <CardContent className="p-6">
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h3 className="text-lg font-semibold">{selectedVenue.name}</h3>
                    <div className="flex items-center text-sm text-muted-foreground">
                      <MapPin className="h-3 w-3 mr-1" />
                      {selectedVenue.address}
                    </div>
                  </div>
                </div>
                
                {selectedVenue.capacity && (
                  <div className="mb-4">
                    <p className="text-sm text-muted-foreground">Capacity</p>
                    <p className="font-medium">{selectedVenue.capacity.toLocaleString()}</p>
                  </div>
                )}
                
                <Accordion type="single" collapsible className="w-full">
                  {selectedVenue.facilities && (
                    <AccordionItem value="facilities">
                      <AccordionTrigger className="text-sm font-medium">
                        Facilities
                      </AccordionTrigger>
                      <AccordionContent>
                        <p className="text-sm">{selectedVenue.facilities}</p>
                      </AccordionContent>
                    </AccordionItem>
                  )}
                  
                  {selectedVenue.directions && (
                    <AccordionItem value="directions">
                      <AccordionTrigger className="text-sm font-medium">
                        Travel Directions
                      </AccordionTrigger>
                      <AccordionContent>
                        <p className="text-sm">{selectedVenue.directions}</p>
                      </AccordionContent>
                    </AccordionItem>
                  )}
                </Accordion>
                
                <div className="mt-4">
                  <Button 
                    variant="outline" 
                    className="w-full"
                    onClick={() => window.open(`https://maps.google.com/?q=${encodeURIComponent(selectedVenue.address)}`, '_blank')}
                  >
                    <MapPin className="h-4 w-4 mr-2" />
                    View on Google Maps
                  </Button>
                </div>
              </CardContent>
            ) : (
              <CardContent className="p-6 text-center flex flex-col items-center justify-center h-[300px] text-muted-foreground">
                <MapPin className="h-8 w-8 mb-2" />
                <p>Select a venue to view details</p>
              </CardContent>
            )}
          </Card>
        </div>
      </CardContent>
    </Card>
  );
};
