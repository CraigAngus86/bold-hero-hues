import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/Table';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { toast } from 'sonner';
import { LastUpdatedInfo } from '@/components/admin/data/table-components/LastUpdatedInfo';
import { SponsorLogoUploader } from '@/components/admin/common/SponsorLogoUploader';
import { Sponsor } from '@/types/sponsors';
import { getAllSponsors, createSponsor, updateSponsor, deleteSponsor } from '@/services/sponsorsService';

export default function SponsorsManager() {
  const [sponsors, setSponsors] = useState<Sponsor[]>([]);
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [currentSponsor, setCurrentSponsor] = useState<Partial<Sponsor>>({
    name: '',
    logo_url: '',
    website_url: '',
    tier: 'bronze',
    description: '',
    is_active: true
  });
  const [lastUpdated, setLastUpdated] = useState<string | null>(null);
  
  useEffect(() => {
    fetchSponsors();
  }, []);
  
  const fetchSponsors = async () => {
    setLoading(true);
    try {
      const result = await getAllSponsors();
      if (result.success && result.data) {
        setSponsors(result.data);
        
        // Set the last updated timestamp from the most recently updated sponsor
        if (result.data.length > 0) {
          const sortedByDate = [...result.data].sort((a, b) => {
            return new Date(b.updated_at || 0).getTime() - new Date(a.updated_at || 0).getTime();
          });
          setLastUpdated(sortedByDate[0].updated_at || null);
        }
      } else {
        toast.error('Failed to load sponsors');
      }
    } catch (error) {
      console.error('Error fetching sponsors:', error);
      toast.error('Failed to load sponsors data');
    } finally {
      setLoading(false);
    }
  };
  
  const handleOpenDialog = (sponsor?: Sponsor) => {
    if (sponsor) {
      setCurrentSponsor(sponsor);
    } else {
      setCurrentSponsor({
        name: '',
        logo_url: '',
        website_url: '',
        tier: 'bronze',
        description: '',
        is_active: true
      });
    }
    setDialogOpen(true);
  };
  
  const handleSave = async () => {
    try {
      if (!currentSponsor.name) {
        toast.error('Sponsor name is required');
        return;
      }
      
      let result;
      if ('id' in currentSponsor && currentSponsor.id) {
        result = await updateSponsor(currentSponsor.id, currentSponsor);
      } else {
        result = await createSponsor(currentSponsor as Omit<Sponsor, 'id'>);
      }
      
      if (result.success) {
        toast.success(`Sponsor ${currentSponsor.id ? 'updated' : 'created'} successfully`);
        setDialogOpen(false);
        fetchSponsors(); // Refresh the list
      } else {
        toast.error(`Failed to ${currentSponsor.id ? 'update' : 'create'} sponsor`);
      }
    } catch (error) {
      console.error('Error saving sponsor:', error);
      toast.error(`Failed to ${currentSponsor.id ? 'update' : 'create'} sponsor`);
    }
  };
  
  const handleDelete = async (id: string) => {
    if (confirm('Are you sure you want to delete this sponsor?')) {
      try {
        const result = await deleteSponsor(id);
        if (result.success) {
          toast.success('Sponsor deleted successfully');
          fetchSponsors(); // Refresh the list
        } else {
          toast.error('Failed to delete sponsor');
        }
      } catch (error) {
        console.error('Error deleting sponsor:', error);
        toast.error('Failed to delete sponsor');
      }
    }
  };
  
  const handleLogoUploaded = (url: string) => {
    setCurrentSponsor(prev => ({ ...prev, logo_url: url }));
  };
  
  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold">Sponsors</h2>
        <Button onClick={() => handleOpenDialog()}>Add New Sponsor</Button>
      </div>
      
      <LastUpdatedInfo lastUpdated={lastUpdated} />
      
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Name</TableHead>
            <TableHead>Logo</TableHead>
            <TableHead>Tier</TableHead>
            <TableHead>Website</TableHead>
            <TableHead>Status</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {loading ? (
            <TableRow>
              <TableCell colSpan={6} className="text-center py-10">Loading sponsors...</TableCell>
            </TableRow>
          ) : sponsors.length === 0 ? (
            <TableRow>
              <TableCell colSpan={6} className="text-center py-10">No sponsors found.</TableCell>
            </TableRow>
          ) : (
            sponsors.map((sponsor) => (
              <TableRow key={sponsor.id}>
                <TableCell className="font-medium">{sponsor.name}</TableCell>
                <TableCell>
                  {sponsor.logo_url ? (
                    <img 
                      src={sponsor.logo_url} 
                      alt={`${sponsor.name} logo`} 
                      className="w-16 h-auto object-contain"
                    />
                  ) : (
                    <span className="text-gray-400">No logo</span>
                  )}
                </TableCell>
                <TableCell>
                  <span className={`capitalize px-2 py-1 rounded text-xs font-medium ${
                    sponsor.tier === 'platinum' ? 'bg-purple-100 text-purple-800' : 
                    sponsor.tier === 'gold' ? 'bg-yellow-100 text-yellow-800' :
                    sponsor.tier === 'silver' ? 'bg-gray-100 text-gray-800' :
                    'bg-amber-100 text-amber-800'
                  }`}>
                    {sponsor.tier}
                  </span>
                </TableCell>
                <TableCell>
                  {sponsor.website_url ? (
                    <a 
                      href={sponsor.website_url} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="text-blue-600 hover:underline"
                    >
                      Visit
                    </a>
                  ) : (
                    <span className="text-gray-400">None</span>
                  )}
                </TableCell>
                <TableCell>
                  <span className={`px-2 py-1 rounded text-xs font-medium ${
                    sponsor.is_active ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                  }`}>
                    {sponsor.is_active ? 'Active' : 'Inactive'}
                  </span>
                </TableCell>
                <TableCell className="text-right">
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    onClick={() => handleOpenDialog(sponsor)}
                    className="mr-2"
                  >
                    Edit
                  </Button>
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    onClick={() => handleDelete(sponsor.id)}
                    className="text-red-500"
                  >
                    Delete
                  </Button>
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
      
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>{currentSponsor.id ? 'Edit Sponsor' : 'Add New Sponsor'}</DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <label htmlFor="name" className="text-right text-sm font-medium">Name</label>
              <Input
                id="name"
                value={currentSponsor.name || ''}
                onChange={(e) => setCurrentSponsor(prev => ({ ...prev, name: e.target.value }))}
                className="col-span-3"
                placeholder="Sponsor name"
              />
            </div>
            
            <div className="grid grid-cols-4 items-center gap-4">
              <label htmlFor="tier" className="text-right text-sm font-medium">Tier</label>
              <Select 
                value={currentSponsor.tier || 'bronze'}
                onValueChange={(value) => setCurrentSponsor(prev => ({ ...prev, tier: value as Sponsor['tier'] }))}>
                <SelectTrigger className="col-span-3">
                  <SelectValue placeholder="Select a tier" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="platinum">Platinum</SelectItem>
                  <SelectItem value="gold">Gold</SelectItem>
                  <SelectItem value="silver">Silver</SelectItem>
                  <SelectItem value="bronze">Bronze</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="grid grid-cols-4 items-center gap-4">
              <label htmlFor="website" className="text-right text-sm font-medium">Website URL</label>
              <Input
                id="website"
                value={currentSponsor.website_url || ''}
                onChange={(e) => setCurrentSponsor(prev => ({ ...prev, website_url: e.target.value }))}
                className="col-span-3"
                placeholder="https://example.com"
              />
            </div>
            
            <div className="grid grid-cols-4 items-start gap-4">
              <label htmlFor="description" className="text-right text-sm font-medium pt-2">Description</label>
              <Textarea
                id="description"
                value={currentSponsor.description || ''}
                onChange={(e) => setCurrentSponsor(prev => ({ ...prev, description: e.target.value }))}
                className="col-span-3"
                placeholder="Brief description of the sponsor"
                rows={3}
              />
            </div>
            
            <div className="grid grid-cols-4 items-center gap-4">
              <label htmlFor="logo" className="text-right text-sm font-medium">Logo</label>
              <div className="col-span-3">
                <SponsorLogoUploader 
                  initialImageUrl={currentSponsor?.logo_url || ''}
                  onUpload={(url) => setCurrentSponsor(prev => prev ? {...prev, logo_url: url} : null)}
                />
              </div>
            </div>
            
            <div className="grid grid-cols-4 items-center gap-4">
              <label htmlFor="status" className="text-right text-sm font-medium">Status</label>
              <Select 
                value={currentSponsor.is_active ? 'active' : 'inactive'}
                onValueChange={(value) => setCurrentSponsor(prev => ({ ...prev, is_active: value === 'active' }))}>
                <SelectTrigger className="col-span-3">
                  <SelectValue placeholder="Select status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="active">Active</SelectItem>
                  <SelectItem value="inactive">Inactive</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setDialogOpen(false)}>Cancel</Button>
            <Button type="submit" onClick={handleSave}>Save</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
