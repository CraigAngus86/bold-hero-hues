
import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/Table';
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Award, Plus, Edit, Trash, ExternalLink } from 'lucide-react';
import { toast } from 'sonner';
import { Sponsor } from '@/services/sponsorsService';
import { getAllSponsors, createSponsor, updateSponsor, deleteSponsor } from '@/services/sponsorsService';

const SponsorsManager = () => {
  const [sponsors, setSponsors] = useState<Sponsor[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentSponsor, setCurrentSponsor] = useState<Partial<Sponsor> | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [sponsorToDelete, setSponsorToDelete] = useState<Sponsor | null>(null);

  useEffect(() => {
    fetchSponsors();
  }, []);

  const fetchSponsors = async () => {
    setLoading(true);
    try {
      const response = await getAllSponsors();
      if (response.success && response.data) {
        setSponsors(response.data);
      } else {
        console.error('Error fetching sponsors:', response.error);
        toast.error('Failed to load sponsors');
      }
    } catch (error) {
      console.error('Error fetching sponsors:', error);
      toast.error('Failed to load sponsors');
    } finally {
      setLoading(false);
    }
  };

  const handleOpenAddDialog = () => {
    setCurrentSponsor({
      name: '',
      logoUrl: '',
      tier: 'bronze',
    });
    setDialogOpen(true);
  };

  const handleOpenEditDialog = (sponsor: Sponsor) => {
    setCurrentSponsor(sponsor);
    setDialogOpen(true);
  };

  const handleConfirmDelete = (sponsor: Sponsor) => {
    setSponsorToDelete(sponsor);
    setDeleteDialogOpen(true);
  };

  const handleDelete = async () => {
    if (!sponsorToDelete) return;

    try {
      const response = await deleteSponsor(sponsorToDelete.id.toString());
      if (response.success) {
        setSponsors(sponsors.filter(s => s.id !== sponsorToDelete.id));
        toast.success(`${sponsorToDelete.name} has been removed`);
      }
      setDeleteDialogOpen(false);
    } catch (error) {
      console.error('Error deleting sponsor:', error);
      toast.error('Failed to delete sponsor');
    }
  };

  const handleSave = async () => {
    if (!currentSponsor) return;

    try {
      const dbSponsor = {
        name: currentSponsor.name || '',
        logo_url: currentSponsor.logoUrl || '',
        tier: currentSponsor.tier as 'platinum' | 'gold' | 'silver' | 'bronze',
        website_url: currentSponsor.website,
        description: currentSponsor.description,
        is_active: true,
      };

      let response;
      
      if (currentSponsor.id) {
        // Update existing sponsor
        response = await updateSponsor(currentSponsor.id.toString(), dbSponsor);
        if (response.success && response.data) {
          setSponsors(sponsors.map(s => s.id === response.data?.id ? response.data : s));
          toast.success(`${response.data.name} has been updated`);
        }
      } else {
        // Create new sponsor
        response = await createSponsor(dbSponsor as any);
        if (response.success && response.data) {
          setSponsors([...sponsors, response.data]);
          toast.success(`${response.data.name} has been added`);
        }
      }
      
      setDialogOpen(false);
    } catch (error) {
      console.error('Error saving sponsor:', error);
      toast.error('Failed to save sponsor');
    }
  };

  // Group by tier for better presentation
  const tierOrder = ['platinum', 'gold', 'silver', 'bronze'];
  const sortedSponsors = [...sponsors].sort((a, b) => {
    const tierA = tierOrder.indexOf(a.tier || 'bronze');
    const tierB = tierOrder.indexOf(b.tier || 'bronze');
    return tierA - tierB || a.name.localeCompare(b.name);
  });

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-lg font-medium">Sponsors</h3>
        <Button onClick={handleOpenAddDialog}>
          <Plus className="mr-2 h-4 w-4" />
          Add Sponsor
        </Button>
      </div>

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Name</TableHead>
            <TableHead>Tier</TableHead>
            <TableHead>Logo</TableHead>
            <TableHead>Website</TableHead>
            <TableHead className="w-[100px]">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {sponsors.length === 0 ? (
            <TableRow>
              <TableCell colSpan={5} className="text-center py-4 text-gray-500">
                {loading ? 'Loading sponsors...' : 'No sponsors found'}
              </TableCell>
            </TableRow>
          ) : (
            sortedSponsors.map((sponsor) => (
              <TableRow key={sponsor.id}>
                <TableCell className="font-medium">{sponsor.name}</TableCell>
                <TableCell className="capitalize">{sponsor.tier || 'bronze'}</TableCell>
                <TableCell>
                  {sponsor.logoUrl && (
                    <div className="w-12 h-12 relative">
                      <img 
                        src={sponsor.logoUrl} 
                        alt={`${sponsor.name} logo`} 
                        className="object-contain w-full h-full" 
                      />
                    </div>
                  )}
                </TableCell>
                <TableCell>
                  {sponsor.website && (
                    <a 
                      href={sponsor.website}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center text-blue-600 hover:text-blue-800"
                    >
                      <ExternalLink className="h-4 w-4 mr-1" />
                      Website
                    </a>
                  )}
                </TableCell>
                <TableCell>
                  <div className="flex space-x-2">
                    <Button variant="ghost" size="sm" onClick={() => handleOpenEditDialog(sponsor)}>
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="sm" onClick={() => handleConfirmDelete(sponsor)}>
                      <Trash className="h-4 w-4" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>{currentSponsor?.id ? 'Edit' : 'Add'} Sponsor</DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <label htmlFor="name" className="text-right text-sm font-medium">Name</label>
              <Input
                id="name"
                value={currentSponsor?.name || ''}
                onChange={(e) => setCurrentSponsor(prev => ({ ...prev, name: e.target.value }))}
                className="col-span-3"
              />
            </div>

            <div className="grid grid-cols-4 items-center gap-4">
              <label htmlFor="tier" className="text-right text-sm font-medium">Tier</label>
              <Select
                value={currentSponsor?.tier || 'bronze'}
                onValueChange={(value: 'platinum' | 'gold' | 'silver' | 'bronze') => 
                  setCurrentSponsor(prev => ({ ...prev, tier: value }))
                }
              >
                <SelectTrigger className="col-span-3">
                  <SelectValue placeholder="Select tier" />
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
              <label htmlFor="logoUrl" className="text-right text-sm font-medium">Logo URL</label>
              <Input
                id="logoUrl"
                value={currentSponsor?.logoUrl || ''}
                onChange={(e) => setCurrentSponsor(prev => ({ ...prev, logoUrl: e.target.value }))}
                className="col-span-3"
              />
            </div>

            <div className="grid grid-cols-4 items-center gap-4">
              <label htmlFor="website" className="text-right text-sm font-medium">Website</label>
              <Input
                id="website"
                value={currentSponsor?.website || ''}
                onChange={(e) => setCurrentSponsor(prev => ({ ...prev, website: e.target.value }))}
                className="col-span-3"
                placeholder="https://example.com"
              />
            </div>

            <div className="grid grid-cols-4 items-start gap-4">
              <label htmlFor="description" className="text-right text-sm font-medium">Description</label>
              <Textarea
                id="description"
                value={currentSponsor?.description || ''}
                onChange={(e) => setCurrentSponsor(prev => ({ ...prev, description: e.target.value }))}
                className="col-span-3"
                rows={3}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" type="button" onClick={() => setDialogOpen(false)}>Cancel</Button>
            <Button type="button" onClick={handleSave}>Save</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Confirm Deletion</DialogTitle>
          </DialogHeader>
          <p className="py-4">
            Are you sure you want to remove {sponsorToDelete?.name} from the sponsors list?
          </p>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDeleteDialogOpen(false)}>Cancel</Button>
            <Button variant="destructive" onClick={handleDelete}>Delete</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default SponsorsManager;
