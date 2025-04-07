
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { ArrowUp, ArrowDown, Edit, Trash } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { toast } from 'sonner';
import { SponsorTier } from '@/types/sponsors';
import { fetchSponsorshipTiers, updateSponsorshipTier, createSponsorshipTier, deleteSponsorshipTier } from '@/services/sponsorsService';

const TierManagement: React.FC = () => {
  const [tiers, setTiers] = useState<SponsorTier[]>([]);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [currentTier, setCurrentTier] = useState<Partial<SponsorTier> | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    loadTiers();
  }, []);

  const loadTiers = async () => {
    setIsLoading(true);
    try {
      const response = await fetchSponsorshipTiers();
      if (response.success) {
        setTiers(response.data || []);
      } else {
        toast.error('Failed to load tiers: ' + response.error);
      }
    } catch (error) {
      console.error('Error loading tiers:', error);
      toast.error('An error occurred while loading tiers');
    } finally {
      setIsLoading(false);
    }
  };

  const openNewDialog = () => {
    setCurrentTier({
      name: '',
      description: '',
      color: '#999999',
      order_position: tiers.length + 1
    });
    setDialogOpen(true);
  };

  const openEditDialog = (tier: SponsorTier) => {
    setCurrentTier({ ...tier });
    setDialogOpen(true);
  };

  const closeDialog = () => {
    setDialogOpen(false);
    setCurrentTier(null);
  };

  const handleSaveTier = async () => {
    if (!currentTier?.name) return;

    try {
      if (currentTier.id) {
        // Update existing tier
        const response = await updateSponsorshipTier(currentTier.id, currentTier);
        if (response.success) {
          setTiers(tiers.map(t => t.id === currentTier.id ? response.data : t));
          toast.success('Tier updated successfully');
        } else {
          toast.error('Failed to update tier: ' + response.error);
        }
      } else {
        // Add new tier
        const response = await createSponsorshipTier(currentTier as Omit<SponsorTier, 'id'>);
        if (response.success) {
          setTiers([...tiers, response.data]);
          toast.success('Tier added successfully');
        } else {
          toast.error('Failed to add tier: ' + response.error);
        }
      }

      closeDialog();
    } catch (error) {
      console.error('Error saving tier:', error);
      toast.error('An error occurred while saving the tier');
    }
  };

  const handleDeleteTier = async (id: string) => {
    if (!confirm('Are you sure you want to delete this tier?')) return;

    try {
      const response = await deleteSponsorshipTier(id);
      if (response.success) {
        setTiers(tiers.filter(t => t.id !== id));
        toast.success('Tier deleted successfully');
      } else {
        toast.error('Failed to delete tier: ' + response.error);
      }
    } catch (error) {
      console.error('Error deleting tier:', error);
      toast.error('An error occurred while deleting the tier');
    }
  };

  const moveUp = async (tier: SponsorTier, index: number) => {
    if (index <= 0) return;
    
    try {
      const newPosition = tier.order_position - 1;
      const updatedTier = { ...tier, order_position: newPosition };
      const response = await updateSponsorshipTier(tier.id, updatedTier);
      
      if (response.success) {
        // Also need to update the tier that was in this position
        const tierToMoveDown = tiers.find(t => t.order_position === newPosition && t.id !== tier.id);
        if (tierToMoveDown) {
          await updateSponsorshipTier(tierToMoveDown.id, { 
            ...tierToMoveDown, 
            order_position: tier.order_position 
          });
        }
        
        await loadTiers(); // Reload all tiers to ensure order is correct
      } else {
        toast.error('Failed to move tier: ' + response.error);
      }
    } catch (error) {
      console.error('Error moving tier:', error);
      toast.error('An error occurred while moving the tier');
    }
  };

  const moveDown = async (tier: SponsorTier, index: number) => {
    if (index >= tiers.length - 1) return;
    
    try {
      const newPosition = tier.order_position + 1;
      const updatedTier = { ...tier, order_position: newPosition };
      const response = await updateSponsorshipTier(tier.id, updatedTier);
      
      if (response.success) {
        // Also need to update the tier that was in this position
        const tierToMoveUp = tiers.find(t => t.order_position === newPosition && t.id !== tier.id);
        if (tierToMoveUp) {
          await updateSponsorshipTier(tierToMoveUp.id, { 
            ...tierToMoveUp, 
            order_position: tier.order_position 
          });
        }
        
        await loadTiers(); // Reload all tiers to ensure order is correct
      } else {
        toast.error('Failed to move tier: ' + response.error);
      }
    } catch (error) {
      console.error('Error moving tier:', error);
      toast.error('An error occurred while moving the tier');
    }
  };

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>Sponsorship Tiers</CardTitle>
        <Button onClick={openNewDialog}>Add New Tier</Button>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="text-center py-4">Loading tiers...</div>
        ) : tiers.length === 0 ? (
          <div className="text-center py-4">No tiers found. Add your first tier!</div>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Order</TableHead>
                <TableHead>Name</TableHead>
                <TableHead>Description</TableHead>
                <TableHead>Color</TableHead>
                <TableHead className="w-[100px]">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {tiers.sort((a, b) => a.order_position - b.order_position).map((tier, index) => (
                <TableRow key={tier.id}>
                  <TableCell className="flex gap-1">
                    <div className="flex flex-col">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => moveUp(tier, index)}
                        disabled={index === 0}
                      >
                        <ArrowUp className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => moveDown(tier, index)}
                        disabled={index === tiers.length - 1}
                      >
                        <ArrowDown className="h-4 w-4" />
                      </Button>
                    </div>
                    <span className="ml-2">{tier.order_position}</span>
                  </TableCell>
                  <TableCell className="font-medium">{tier.name}</TableCell>
                  <TableCell>{tier.description}</TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <div 
                        className="w-6 h-6 rounded-full" 
                        style={{ backgroundColor: tier.color }}
                      />
                      {tier.color}
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex space-x-2">
                      <Button variant="ghost" size="sm" onClick={() => openEditDialog(tier)}>
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="sm" onClick={() => handleDeleteTier(tier.id)}>
                        <Trash className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}

        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>{currentTier?.id ? 'Edit Tier' : 'Add New Tier'}</DialogTitle>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <Label htmlFor="name">Name</Label>
                <Input
                  id="name"
                  value={currentTier?.name || ''}
                  onChange={(e) => setCurrentTier(prev => ({...prev, name: e.target.value}))}
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="description">Description</Label>
                <Input
                  id="description"
                  value={currentTier?.description || ''}
                  onChange={(e) => setCurrentTier(prev => ({...prev, description: e.target.value}))}
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="color">Color</Label>
                <div className="flex gap-2">
                  <input
                    type="color"
                    id="color"
                    value={currentTier?.color || '#999999'}
                    onChange={(e) => setCurrentTier(prev => ({...prev, color: e.target.value}))}
                    className="w-12 h-8"
                  />
                  <Input
                    value={currentTier?.color || '#999999'}
                    onChange={(e) => setCurrentTier(prev => ({...prev, color: e.target.value}))}
                  />
                </div>
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={closeDialog}>Cancel</Button>
              <Button onClick={handleSaveTier}>Save</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </CardContent>
    </Card>
  );
};

export default TierManagement;
