
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { toast } from 'sonner';
import { Plus, Pencil, Trash, Save, X } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

interface Competition {
  id: string;
  name: string;
  season: string;
  type: 'league' | 'cup' | 'friendly';
}

export const CompetitionManager: React.FC = () => {
  const [competitions, setCompetitions] = useState<Competition[]>([
    { id: '1', name: 'Highland League', season: '2023-2024', type: 'league' },
    { id: '2', name: 'Highland League Cup', season: '2023-2024', type: 'cup' },
    { id: '3', name: 'Scottish Cup', season: '2023-2024', type: 'cup' },
    { id: '4', name: 'North of Scotland Cup', season: '2023-2024', type: 'cup' },
    { id: '5', name: 'Friendly Match', season: '2023-2024', type: 'friendly' },
  ]);
  
  const [formData, setFormData] = useState({
    id: '',
    name: '',
    season: '',
    type: 'league' as 'league' | 'cup' | 'friendly',
  });
  
  const [isEditing, setIsEditing] = useState(false);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  
  const resetForm = () => {
    setFormData({
      id: '',
      name: '',
      season: '',
      type: 'league',
    });
    setIsEditing(false);
  };
  
  const handleEditCompetition = (competition: Competition) => {
    setFormData(competition);
    setIsEditing(true);
    setIsDialogOpen(true);
  };
  
  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.name || !formData.season) {
      toast.error('Please fill in all required fields');
      return;
    }
    
    if (isEditing) {
      // Update existing competition
      setCompetitions(competitions.map(comp => 
        comp.id === formData.id ? formData : comp
      ));
      toast.success('Competition updated successfully');
    } else {
      // Create new competition
      const newCompetition = {
        ...formData,
        id: crypto.randomUUID(),
      };
      setCompetitions([...competitions, newCompetition]);
      toast.success('Competition created successfully');
    }
    
    resetForm();
    setIsDialogOpen(false);
  };
  
  const handleDeleteCompetition = (id: string) => {
    setCompetitions(competitions.filter(comp => comp.id !== id));
    toast.success('Competition deleted successfully');
  };
  
  const getTypeLabel = (type: string) => {
    switch(type) {
      case 'league': return 'League';
      case 'cup': return 'Cup/Tournament';
      case 'friendly': return 'Friendly';
      default: return type;
    }
  };
  
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>Competition Management</CardTitle>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={() => { resetForm(); setIsDialogOpen(true); }}>
              <Plus className="mr-2 h-4 w-4" />
              Add Competition
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>
                {isEditing ? 'Edit Competition' : 'Add New Competition'}
              </DialogTitle>
              <DialogDescription>
                {isEditing 
                  ? 'Update the competition details below.' 
                  : 'Enter the details for the new competition.'}
              </DialogDescription>
            </DialogHeader>
            
            <form onSubmit={handleFormSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name">Competition Name</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="e.g., Highland League"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="season">Season</Label>
                <Input
                  id="season"
                  value={formData.season}
                  onChange={(e) => setFormData({ ...formData, season: e.target.value })}
                  placeholder="e.g., 2023-2024"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="type">Competition Type</Label>
                <Select 
                  value={formData.type}
                  onValueChange={(value) => setFormData({ 
                    ...formData, 
                    type: value as 'league' | 'cup' | 'friendly'
                  })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="league">League</SelectItem>
                    <SelectItem value="cup">Cup/Tournament</SelectItem>
                    <SelectItem value="friendly">Friendly</SelectItem>
                  </SelectContent>
                </Select>
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
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Season</TableHead>
              <TableHead>Type</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {competitions.length === 0 ? (
              <TableRow>
                <TableCell colSpan={4} className="text-center py-4 text-muted-foreground">
                  No competitions found. Add a competition to get started.
                </TableCell>
              </TableRow>
            ) : (
              competitions.map((competition) => (
                <TableRow key={competition.id}>
                  <TableCell className="font-medium">{competition.name}</TableCell>
                  <TableCell>{competition.season}</TableCell>
                  <TableCell>
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-secondary text-secondary-foreground">
                      {getTypeLabel(competition.type)}
                    </span>
                  </TableCell>
                  <TableCell className="flex space-x-2">
                    <Button 
                      size="icon" 
                      variant="ghost"
                      onClick={() => handleEditCompetition(competition)}
                    >
                      <Pencil className="h-4 w-4" />
                    </Button>
                    <Button 
                      size="icon" 
                      variant="ghost"
                      className="text-destructive hover:text-destructive"
                      onClick={() => handleDeleteCompetition(competition.id)}
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
  );
};
