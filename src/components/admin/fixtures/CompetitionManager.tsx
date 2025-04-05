
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/Table';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Trash, Edit, Plus, Save } from 'lucide-react';
import { toast } from 'sonner';

interface Competition {
  id: string;
  name: string;
  season: string;
  type: 'league' | 'cup' | 'friendly';
  teams?: string[];
  format?: string;
}

export const CompetitionManager: React.FC = () => {
  const [competitions, setCompetitions] = useState<Competition[]>([
    { id: '1', name: 'Highland League', season: '2023-2024', type: 'league' },
    { id: '2', name: 'Scottish Cup', season: '2023-2024', type: 'cup' },
    { id: '3', name: 'Friendly Matches', season: '2023-2024', type: 'friendly' }
  ]);
  
  const [loading, setLoading] = useState(false);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [currentCompetition, setCurrentCompetition] = useState<Competition | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    season: '',
    type: 'league' as 'league' | 'cup' | 'friendly',
    format: ''
  });
  
  const handleOpenDialog = (competition?: Competition) => {
    if (competition) {
      setCurrentCompetition(competition);
      setFormData({
        name: competition.name,
        season: competition.season,
        type: competition.type,
        format: competition.format || ''
      });
    } else {
      setCurrentCompetition(null);
      setFormData({
        name: '',
        season: '',
        type: 'league',
        format: ''
      });
    }
    setDialogOpen(true);
  };
  
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };
  
  const handleSelectChange = (name: string, value: string) => {
    setFormData(prev => ({ ...prev, [name]: value }));
  };
  
  const handleSave = () => {
    if (!formData.name || !formData.season) {
      toast.error('Name and season are required fields');
      return;
    }
    
    setLoading(true);
    
    try {
      // In a real application, you would save to your database here
      if (currentCompetition) {
        // Update existing competition
        setCompetitions(prevCompetitions => 
          prevCompetitions.map(comp => 
            comp.id === currentCompetition.id 
              ? { ...comp, ...formData }
              : comp
          )
        );
        toast.success(`Updated competition: ${formData.name}`);
      } else {
        // Create new competition
        const newCompetition = {
          ...formData,
          id: Math.random().toString(36).substring(2, 9)
        };
        setCompetitions(prevCompetitions => [...prevCompetitions, newCompetition]);
        toast.success(`Created new competition: ${formData.name}`);
      }
    } catch (error) {
      console.error('Error saving competition:', error);
      toast.error('Failed to save competition');
    } finally {
      setLoading(false);
      setDialogOpen(false);
    }
  };
  
  const handleDelete = (id: string) => {
    if (confirm('Are you sure you want to delete this competition? This action cannot be undone.')) {
      setCompetitions(prevCompetitions => prevCompetitions.filter(comp => comp.id !== id));
      toast.success('Competition deleted');
    }
  };
  
  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-medium">Competition Management</h3>
        <Button onClick={() => handleOpenDialog()} className="flex items-center">
          <Plus className="h-4 w-4 mr-2" />
          Add Competition
        </Button>
      </div>
      
      <Card>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Season</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Format</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {competitions.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={5} className="text-center py-6 text-muted-foreground">
                    No competitions found. Add your first competition.
                  </TableCell>
                </TableRow>
              ) : (
                competitions.map(comp => (
                  <TableRow key={comp.id}>
                    <TableCell className="font-medium">{comp.name}</TableCell>
                    <TableCell>{comp.season}</TableCell>
                    <TableCell>
                      <span className="capitalize">{comp.type}</span>
                    </TableCell>
                    <TableCell>{comp.format || '—'}</TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end space-x-2">
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleOpenDialog(comp)}
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleDelete(comp.id)}
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
              {currentCompetition ? 'Edit Competition' : 'Add New Competition'}
            </DialogTitle>
          </DialogHeader>
          
          <div className="space-y-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="name" className="text-right">Name</Label>
              <Input
                id="name"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                className="col-span-3"
                placeholder="Highland League"
              />
            </div>
            
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="season" className="text-right">Season</Label>
              <Input
                id="season"
                name="season"
                value={formData.season}
                onChange={handleInputChange}
                className="col-span-3"
                placeholder="2023-2024"
              />
            </div>
            
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="type" className="text-right">Type</Label>
              <Select
                value={formData.type}
                onValueChange={(value) => handleSelectChange('type', value)}
              >
                <SelectTrigger id="type" className="col-span-3">
                  <SelectValue placeholder="Select type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="league">League</SelectItem>
                  <SelectItem value="cup">Cup</SelectItem>
                  <SelectItem value="friendly">Friendly</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="format" className="text-right">Format</Label>
              <Input
                id="format"
                name="format"
                value={formData.format}
                onChange={handleInputChange}
                className="col-span-3"
                placeholder="Round-robin, knockout, etc."
              />
            </div>
          </div>
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleSave} disabled={loading}>
              {loading ? 'Saving...' : 'Save Competition'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};
