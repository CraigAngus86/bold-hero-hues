
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/Table';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { PlusCircle, Edit, Trash, ExternalLink } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';
import { useSponsorsStore, Sponsor } from '@/services/sponsorsService';

const tierOptions = ['platinum', 'gold', 'silver', 'bronze'] as const;

const SponsorsManager = () => {
  const { toast } = useToast();
  const { sponsors, addSponsor, updateSponsor, deleteSponsor } = useSponsorsStore();
  const [dialogOpen, setDialogOpen] = useState(false);
  const [currentSponsor, setCurrentSponsor] = useState<Sponsor | null>(null);
  
  const openNewDialog = () => {
    setCurrentSponsor({
      id: sponsors.length > 0 ? Math.max(...sponsors.map(item => item.id)) + 1 : 1,
      name: '',
      logoUrl: '',
      website: '',
      tier: 'bronze',
      description: ''
    });
    setDialogOpen(true);
  };
  
  const openEditDialog = (sponsor: Sponsor) => {
    setCurrentSponsor(sponsor);
    setDialogOpen(true);
  };
  
  const closeDialog = () => {
    setDialogOpen(false);
    setCurrentSponsor(null);
  };
  
  const handleDelete = (id: number) => {
    deleteSponsor(id);
    toast({
      title: "Sponsor deleted",
      description: "The sponsor has been successfully removed.",
    });
  };
  
  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!currentSponsor) return;
    
    if (sponsors.some(item => item.id === currentSponsor.id)) {
      // Update existing
      updateSponsor(currentSponsor);
      toast({
        title: "Sponsor updated",
        description: "The sponsor information has been successfully updated."
      });
    } else {
      // Add new
      addSponsor(currentSponsor);
      toast({
        title: "Sponsor added",
        description: "A new sponsor has been successfully added."
      });
    }
    
    closeDialog();
  };
  
  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-lg font-medium">Club Sponsors</h3>
        <Button onClick={openNewDialog} className="flex items-center">
          <PlusCircle className="mr-2 h-4 w-4" />
          Add Sponsor
        </Button>
      </div>
      
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Name</TableHead>
            <TableHead>Tier</TableHead>
            <TableHead>Website</TableHead>
            <TableHead className="w-[100px]">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {sponsors.map((sponsor) => (
            <TableRow key={sponsor.id}>
              <TableCell className="font-medium">{sponsor.name}</TableCell>
              <TableCell className="capitalize">{sponsor.tier}</TableCell>
              <TableCell>
                {sponsor.website && (
                  <a 
                    href={sponsor.website} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="flex items-center text-blue-500 hover:underline"
                  >
                    {sponsor.website.replace(/^https?:\/\//, '')}
                    <ExternalLink className="ml-1 h-3 w-3" />
                  </a>
                )}
              </TableCell>
              <TableCell>
                <div className="flex space-x-2">
                  <Button variant="ghost" size="sm" onClick={() => openEditDialog(sponsor)}>
                    <Edit className="h-4 w-4" />
                  </Button>
                  <Button variant="ghost" size="sm" onClick={() => handleDelete(sponsor.id)}>
                    <Trash className="h-4 w-4" />
                  </Button>
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
      
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="sm:max-w-[550px]">
          <DialogHeader>
            <DialogTitle>{currentSponsor?.id && sponsors.some(item => item.id === currentSponsor.id) ? 'Edit Sponsor' : 'Add Sponsor'}</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSave}>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <label htmlFor="name" className="text-right text-sm font-medium">Name</label>
                <Input
                  id="name"
                  value={currentSponsor?.name || ''}
                  onChange={(e) => setCurrentSponsor(prev => prev ? {...prev, name: e.target.value} : null)}
                  className="col-span-3"
                  required
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <label htmlFor="logoUrl" className="text-right text-sm font-medium">Logo URL</label>
                <Input
                  id="logoUrl"
                  value={currentSponsor?.logoUrl || ''}
                  onChange={(e) => setCurrentSponsor(prev => prev ? {...prev, logoUrl: e.target.value} : null)}
                  className="col-span-3"
                  required
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <label htmlFor="website" className="text-right text-sm font-medium">Website</label>
                <Input
                  id="website"
                  value={currentSponsor?.website || ''}
                  onChange={(e) => setCurrentSponsor(prev => prev ? {...prev, website: e.target.value} : null)}
                  className="col-span-3"
                  placeholder="https://example.com"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <label htmlFor="tier" className="text-right text-sm font-medium">Tier</label>
                <Select 
                  value={currentSponsor?.tier}
                  onValueChange={(value: 'platinum' | 'gold' | 'silver' | 'bronze') => 
                    setCurrentSponsor(prev => prev ? {...prev, tier: value} : null)
                  }
                >
                  <SelectTrigger className="col-span-3">
                    <SelectValue placeholder="Select tier" />
                  </SelectTrigger>
                  <SelectContent>
                    {tierOptions.map(tier => (
                      <SelectItem key={tier} value={tier} className="capitalize">{tier}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="grid grid-cols-4 items-start gap-4">
                <label htmlFor="description" className="text-right text-sm font-medium">Description</label>
                <Textarea
                  id="description"
                  value={currentSponsor?.description || ''}
                  onChange={(e) => setCurrentSponsor(prev => prev ? {...prev, description: e.target.value} : null)}
                  className="col-span-3"
                  rows={3}
                />
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" type="button" onClick={closeDialog}>Cancel</Button>
              <Button type="submit">Save</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default SponsorsManager;
