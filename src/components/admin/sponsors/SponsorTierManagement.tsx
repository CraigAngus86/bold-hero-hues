
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { ArrowUp, ArrowDown, Edit, Trash } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { toast } from 'sonner';

// Mock sponsor tiers data
const mockTiers = [
  { id: '1', name: 'Platinum', description: 'Premium sponsorship tier', color: '#E5E4E2', order_position: 1 },
  { id: '2', name: 'Gold', description: 'Top-level sponsorship tier', color: '#FFD700', order_position: 2 },
  { id: '3', name: 'Silver', description: 'Mid-level sponsorship tier', color: '#C0C0C0', order_position: 3 },
  { id: '4', name: 'Bronze', description: 'Entry-level sponsorship tier', color: '#CD7F32', order_position: 4 }
];

const SponsorTierManagement: React.FC = () => {
  const [tiers, setTiers] = useState(mockTiers);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [currentTier, setCurrentTier] = useState<any | null>(null);

  const openNewDialog = () => {
    setCurrentTier({
      id: '',
      name: '',
      description: '',
      color: '#999999',
      order_position: tiers.length + 1
    });
    setDialogOpen(true);
  };

  const openEditDialog = (tier: any) => {
    setCurrentTier({ ...tier });
    setDialogOpen(true);
  };

  const closeDialog = () => {
    setDialogOpen(false);
    setCurrentTier(null);
  };

  const handleSaveTier = () => {
    if (!currentTier?.name) return;

    if (currentTier.id) {
      // Update existing tier
      setTiers(tiers.map(t => t.id === currentTier.id ? currentTier : t));
      toast.success('Tier updated successfully');
    } else {
      // Add new tier
      const newTier = {
        ...currentTier,
        id: Math.random().toString(36).substr(2, 9)
      };
      setTiers([...tiers, newTier]);
      toast.success('Tier added successfully');
    }

    closeDialog();
  };

  const handleDeleteTier = (id: string) => {
    setTiers(tiers.filter(t => t.id !== id));
    toast.success('Tier deleted successfully');
  };

  const moveUp = (index: number) => {
    if (index <= 0) return;
    const newTiers = [...tiers];
    const tier = newTiers[index];
    newTiers[index] = newTiers[index - 1];
    newTiers[index - 1] = tier;

    // Update order positions
    newTiers.forEach((t, i) => {
      t.order_position = i + 1;
    });

    setTiers(newTiers);
  };

  const moveDown = (index: number) => {
    if (index >= tiers.length - 1) return;
    const newTiers = [...tiers];
    const tier = newTiers[index];
    newTiers[index] = newTiers[index + 1];
    newTiers[index + 1] = tier;

    // Update order positions
    newTiers.forEach((t, i) => {
      t.order_position = i + 1;
    });

    setTiers(newTiers);
  };

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>Sponsorship Tiers</CardTitle>
        <Button onClick={openNewDialog}>Add New Tier</Button>
      </CardHeader>
      <CardContent>
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
                      onClick={() => moveUp(index)}
                      disabled={index === 0}
                    >
                      <ArrowUp className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => moveDown(index)}
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

export default SponsorTierManagement;
