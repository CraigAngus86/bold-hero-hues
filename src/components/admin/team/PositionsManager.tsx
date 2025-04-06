
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/Table';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { Plus, PenSquare, Trash, Loader2 } from 'lucide-react';
import { toast } from 'sonner';
import { usePositionsStore, PositionCategory, PositionItem } from '@/services/positionsService';

interface PositionDialogProps {
  position: PositionItem | null;
  open: boolean;
  onClose: () => void;
  onSave: (position: Omit<PositionItem, 'id'>) => void;
}

const PositionDialog: React.FC<PositionDialogProps> = ({ position, open, onClose, onSave }) => {
  const [name, setName] = useState(position?.name || '');
  const [category, setCategory] = useState<PositionCategory>(position?.category || 'player');
  
  useEffect(() => {
    if (open) {
      setName(position?.name || '');
      setCategory(position?.category || 'player');
    }
  }, [open, position]);
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      toast.error('Position name is required');
      return;
    }
    
    onSave({
      name,
      category,
    });
  };
  
  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{position ? 'Edit Position' : 'Add Position'}</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <label htmlFor="name" className="text-sm font-medium">Position Name</label>
              <Input
                id="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g. Goalkeeper, Center Back, etc."
                required
              />
            </div>
            <div className="grid gap-2">
              <label htmlFor="category" className="text-sm font-medium">Category</label>
              <Select value={category} onValueChange={(value) => setCategory(value as PositionCategory)}>
                <SelectTrigger>
                  <SelectValue placeholder="Select category" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="player">Player</SelectItem>
                  <SelectItem value="management">Management</SelectItem>
                  <SelectItem value="official">Official</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" type="button" onClick={onClose}>Cancel</Button>
            <Button type="submit">{position ? 'Update' : 'Add'}</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

const getCategoryLabel = (category: PositionCategory): string => {
  switch (category) {
    case 'player': return 'Player';
    case 'management': return 'Management';
    case 'official': return 'Official';
    default: return category;
  }
};

const PositionsManager: React.FC = () => {
  const { positions, isLoading, loadPositions, addPosition, updatePosition, deletePosition } = usePositionsStore();
  const [dialogOpen, setDialogOpen] = useState(false);
  const [selectedPosition, setSelectedPosition] = useState<PositionItem | null>(null);
  const [activeCategory, setActiveCategory] = useState<PositionCategory | 'all'>('all');
  
  useEffect(() => {
    loadPositions();
  }, [loadPositions]);
  
  const handleAddPosition = () => {
    setSelectedPosition(null);
    setDialogOpen(true);
  };
  
  const handleEditPosition = (position: PositionItem) => {
    setSelectedPosition(position);
    setDialogOpen(true);
  };
  
  const handleDeletePosition = async (id: string) => {
    if (confirm('Are you sure you want to delete this position?')) {
      await deletePosition(id);
    }
  };
  
  const handleSavePosition = async (positionData: Omit<PositionItem, 'id'>) => {
    if (selectedPosition) {
      await updatePosition(selectedPosition.id, positionData);
    } else {
      await addPosition(positionData);
      // If we're adding a position and have a filter, set the filter to show the newly added position
      if (activeCategory !== 'all' && activeCategory !== positionData.category) {
        setActiveCategory(positionData.category);
      }
    }
    setDialogOpen(false);
  };
  
  const filteredPositions = positions.filter(
    position => activeCategory === 'all' || position.category === activeCategory
  );
  
  const getPositionsByCategory = (category: PositionCategory) => {
    return positions.filter(position => position.category === category);
  };
  
  const playerPositionsCount = getPositionsByCategory('player').length;
  const managementPositionsCount = getPositionsByCategory('management').length;
  const officialPositionsCount = getPositionsByCategory('official').length;
  
  if (isLoading && positions.length === 0) {
    return (
      <div className="flex justify-center items-center py-12">
        <Loader2 className="h-8 w-8 animate-spin text-gray-400" />
      </div>
    );
  }
  
  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold">Position Management</h2>
          <p className="text-gray-500">Define available positions for team members</p>
        </div>
        <Button onClick={handleAddPosition}>
          <Plus size={16} className="mr-2" />
          Add Position
        </Button>
      </div>
      
      <Tabs value={activeCategory} onValueChange={setActiveCategory as any}>
        <TabsList className="mb-4">
          <TabsTrigger value="all">
            All Positions
            <Badge variant="secondary" className="ml-2">{positions.length}</Badge>
          </TabsTrigger>
          <TabsTrigger value="player">
            Player
            <Badge variant="secondary" className="ml-2">{playerPositionsCount}</Badge>
          </TabsTrigger>
          <TabsTrigger value="management">
            Management
            <Badge variant="secondary" className="ml-2">{managementPositionsCount}</Badge>
          </TabsTrigger>
          <TabsTrigger value="official">
            Official
            <Badge variant="secondary" className="ml-2">{officialPositionsCount}</Badge>
          </TabsTrigger>
        </TabsList>
        
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <span>{activeCategory === 'all' ? 'All Positions' : `${getCategoryLabel(activeCategory as PositionCategory)} Positions`}</span>
              <Button variant="outline" size="sm" onClick={handleAddPosition}>
                <Plus size={14} className="mr-2" />
                Add Position
              </Button>
            </CardTitle>
          </CardHeader>
          <CardContent>
            {filteredPositions.length === 0 ? (
              <div className="text-center py-8">
                <p className="text-gray-500">No positions found</p>
                <Button variant="outline" size="sm" className="mt-4" onClick={handleAddPosition}>
                  <Plus size={14} className="mr-2" />
                  Add Position
                </Button>
              </div>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Position Name</TableHead>
                    {activeCategory === 'all' && <TableHead>Category</TableHead>}
                    <TableHead className="w-[100px]">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredPositions.map((position) => (
                    <TableRow key={position.id}>
                      <TableCell>{position.name}</TableCell>
                      {activeCategory === 'all' && (
                        <TableCell>
                          <Badge variant="outline">
                            {getCategoryLabel(position.category)}
                          </Badge>
                        </TableCell>
                      )}
                      <TableCell>
                        <div className="flex space-x-2">
                          <Button variant="ghost" size="icon" onClick={() => handleEditPosition(position)}>
                            <PenSquare size={16} />
                          </Button>
                          <Button 
                            variant="ghost" 
                            size="icon" 
                            className="text-red-500 hover:text-red-700"
                            onClick={() => handleDeletePosition(position.id)}
                          >
                            <Trash size={16} />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
            <div className="mt-4 text-sm text-gray-500 text-right">
              Showing {filteredPositions.length} of {positions.length} positions
            </div>
          </CardContent>
        </Card>
      </Tabs>
      
      <PositionDialog
        position={selectedPosition}
        open={dialogOpen}
        onClose={() => setDialogOpen(false)}
        onSave={handleSavePosition}
      />
    </div>
  );
};

export default PositionsManager;
