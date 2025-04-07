
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { HexColorPicker } from 'react-colorful';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Grid, Plus, Edit, Trash, ChevronUp, ChevronDown, Check } from 'lucide-react';
import { SponsorTier } from '@/types/sponsors';

// Using the predefined interface from types/sponsors.ts
interface TierManagementProps {
  onTierUpdate?: (tiers: SponsorTier[]) => void;
}

export default function TierManagement({ onTierUpdate }: TierManagementProps) {
  const [tiers, setTiers] = useState<SponsorTier[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [dialogOpen, setDialogOpen] = useState<boolean>(false);
  const [editingTier, setEditingTier] = useState<Partial<SponsorTier> | null>(null);
  const [colorPickerOpen, setColorPickerOpen] = useState<boolean>(false);

  useEffect(() => {
    // Mock fetch tiers for now
    const mockTiers: SponsorTier[] = [
      { id: '1', name: 'Gold', description: 'Top tier sponsorship', color: '#FFD700', order_position: 1 },
      { id: '2', name: 'Silver', description: 'Second tier sponsorship', color: '#C0C0C0', order_position: 2 },
      { id: '3', name: 'Bronze', description: 'Entry level sponsorship', color: '#CD7F32', order_position: 3 }
    ];
    
    setTiers(mockTiers);
    setIsLoading(false);
  }, []);

  const handleNewTier = () => {
    setEditingTier({
      name: '',
      description: '',
      color: '#3B82F6',
      order_position: tiers.length + 1
    });
    setDialogOpen(true);
  };

  const handleEditTier = (tier: SponsorTier) => {
    setEditingTier({...tier});
    setDialogOpen(true);
  };

  const handleSaveTier = () => {
    if (!editingTier?.name) return;
    
    if (editingTier.id) {
      // Update existing tier
      const updatedTiers = tiers.map(tier => 
        tier.id === editingTier.id ? {...tier, ...editingTier} as SponsorTier : tier
      );
      setTiers(updatedTiers);
    } else {
      // Add new tier
      const newTier: SponsorTier = {
        id: `tier-${Date.now()}`,
        name: editingTier.name || '',
        description: editingTier.description || '',
        color: editingTier.color || '#3B82F6',
        order_position: editingTier.order_position || tiers.length + 1,
        benefits: editingTier.benefits || []
      };
      
      setTiers([...tiers, newTier]);
    }
    
    // Call the optional update callback
    if (onTierUpdate) {
      onTierUpdate(tiers);
    }
    
    setDialogOpen(false);
    setEditingTier(null);
  };

  const handleDeleteTier = (tierId: string) => {
    const updatedTiers = tiers.filter(tier => tier.id !== tierId);
    
    // Reorder the remaining tiers
    const reorderedTiers = updatedTiers.map((tier, index) => ({
      ...tier,
      order_position: index + 1
    }));
    
    setTiers(reorderedTiers);
    
    if (onTierUpdate) {
      onTierUpdate(reorderedTiers);
    }
  };

  const handleMoveTier = (tierId: string, direction: 'up' | 'down') => {
    const tierIndex = tiers.findIndex(tier => tier.id === tierId);
    if (tierIndex === -1) return;
    
    // Don't allow moving first item up or last item down
    if (
      (direction === 'up' && tierIndex === 0) || 
      (direction === 'down' && tierIndex === tiers.length - 1)
    ) {
      return;
    }
    
    const newTiers = [...tiers];
    const targetIndex = direction === 'up' ? tierIndex - 1 : tierIndex + 1;
    
    // Swap the position in the array
    [newTiers[tierIndex], newTiers[targetIndex]] = [newTiers[targetIndex], newTiers[tierIndex]];
    
    // Update order_position property for both tiers
    newTiers[tierIndex].order_position = tierIndex + 1;
    newTiers[targetIndex].order_position = targetIndex + 1;
    
    setTiers(newTiers);
    
    if (onTierUpdate) {
      onTierUpdate(newTiers);
    }
  };

  // Sort tiers by order_position for display
  const sortedTiers = [...tiers].sort((a, b) => a.order_position - b.order_position);

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>Sponsorship Tiers</CardTitle>
        <Button onClick={handleNewTier}>
          <Plus className="h-4 w-4 mr-2" />
          Add Tier
        </Button>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="text-center py-4">Loading tiers...</div>
        ) : sortedTiers.length === 0 ? (
          <div className="text-center py-4 text-gray-500">
            No sponsorship tiers defined yet. Add your first tier.
          </div>
        ) : (
          <div className="space-y-3">
            {sortedTiers.map((tier) => (
              <div 
                key={tier.id}
                className="flex items-center justify-between p-3 border rounded-lg"
              >
                <div className="flex items-center gap-3">
                  <div 
                    className="w-4 h-4 rounded-full" 
                    style={{ backgroundColor: tier.color || '#888888' }}
                  />
                  <div>
                    <h4 className="font-medium">{tier.name}</h4>
                    {tier.description && (
                      <p className="text-sm text-gray-500">{tier.description}</p>
                    )}
                  </div>
                </div>
                
                <div className="flex items-center gap-1">
                  <Button variant="ghost" size="icon" onClick={() => handleMoveTier(tier.id, 'up')}>
                    <ChevronUp className="h-4 w-4" />
                  </Button>
                  <Button variant="ghost" size="icon" onClick={() => handleMoveTier(tier.id, 'down')}>
                    <ChevronDown className="h-4 w-4" />
                  </Button>
                  <Button variant="ghost" size="icon" onClick={() => handleEditTier(tier)}>
                    <Edit className="h-4 w-4" />
                  </Button>
                  <Button variant="ghost" size="icon" onClick={() => handleDeleteTier(tier.id)}>
                    <Trash className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}
        
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>
                {editingTier?.id ? 'Edit Tier' : 'Add New Tier'}
              </DialogTitle>
            </DialogHeader>
            
            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <Label htmlFor="name">Tier Name</Label>
                <Input
                  id="name"
                  value={editingTier?.name || ''}
                  onChange={(e) => 
                    setEditingTier(prev => 
                      prev ? {...prev, name: e.target.value} : null
                    )
                  }
                  placeholder="e.g. Gold, Premium, etc."
                />
              </div>
              
              <div className="grid gap-2">
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  value={editingTier?.description || ''}
                  onChange={(e) => 
                    setEditingTier(prev => 
                      prev ? {...prev, description: e.target.value} : null
                    )
                  }
                  placeholder="Describe what this tier offers"
                />
              </div>
              
              <div className="grid gap-2">
                <Label>Color</Label>
                <div className="flex gap-3 items-center">
                  <div 
                    className="h-8 w-8 rounded-full cursor-pointer border"
                    style={{ backgroundColor: editingTier?.color || '#3B82F6' }} 
                    onClick={() => setColorPickerOpen(!colorPickerOpen)}
                  />
                  <Input
                    value={editingTier?.color || ''}
                    onChange={(e) => 
                      setEditingTier(prev => 
                        prev ? {...prev, color: e.target.value} : null
                      )
                    }
                    placeholder="#RRGGBB"
                  />
                </div>
                {colorPickerOpen && (
                  <div className="relative z-10 mt-2">
                    <HexColorPicker
                      color={editingTier?.color || '#3B82F6'}
                      onChange={(color) => 
                        setEditingTier(prev => 
                          prev ? {...prev, color} : null
                        )
                      }
                    />
                  </div>
                )}
              </div>
            </div>
            
            <DialogFooter>
              <Button 
                variant="outline" 
                onClick={() => {
                  setDialogOpen(false);
                  setEditingTier(null);
                  setColorPickerOpen(false);
                }}
              >
                Cancel
              </Button>
              <Button onClick={handleSaveTier}>
                <Check className="h-4 w-4 mr-2" />
                Save
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </CardContent>
    </Card>
  );
}
