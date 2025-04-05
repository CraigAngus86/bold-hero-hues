import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/Table';
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Form, FormField, FormItem, FormLabel, FormControl, FormMessage } from '@/components/ui/form';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Plus, Edit, Trash2, Trophy, Loader2, Check } from 'lucide-react';
import { toast } from 'sonner';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { supabase } from '@/integrations/supabase/client';

interface Competition {
  id: string;
  name: string;
  season: string;
  type: 'league' | 'cup' | 'friendly';
  teams: string[];
}

// Define form schema
const competitionFormSchema = z.object({
  name: z.string().min(1, 'Competition name is required'),
  season: z.string().min(1, 'Season is required'),
  type: z.enum(['league', 'cup', 'friendly']),
  teams: z.array(z.string()).optional(),
});

type CompetitionFormValues = z.infer<typeof competitionFormSchema>;

export const CompetitionManager: React.FC = () => {
  const [competitions, setCompetitions] = useState<Competition[]>([]);
  const [loading, setLoading] = useState(false);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingCompetition, setEditingCompetition] = useState<Competition | null>(null);
  const [availableTeams, setAvailableTeams] = useState<string[]>([]);
  const [seasons] = useState<string[]>(['2022-2023', '2023-2024', '2024-2025']);

  // Initialize form
  const form = useForm<CompetitionFormValues>({
    resolver: zodResolver(competitionFormSchema),
    defaultValues: {
      name: '',
      season: seasons[0],
      type: 'league',
      teams: [],
    },
  });

  // Fetch all competitions and teams
  const fetchData = async () => {
    setLoading(true);
    try {
      // Get competitions from fixtures table (unique values)
      const { data: fixtureCompetitions, error } = await supabase
        .from('fixtures')
        .select('competition');
      
      if (error) throw error;
      
      // Get all teams (unique home and away teams)
      const { data: fixtureTeams, error: teamsError } = await supabase
        .from('fixtures')
        .select('home_team, away_team');
      
      if (teamsError) throw teamsError;
      
      // Extract unique competition names
      const uniqueCompetitions = [...new Set(fixtureCompetitions.map(f => f.competition))];
      
      // Extract unique team names
      const allTeams = fixtureTeams.flatMap(fixture => [fixture.home_team, fixture.away_team]);
      const uniqueTeams = [...new Set(allTeams)].sort();
      
      // Create sample competition objects
      const competitionObjects = uniqueCompetitions.map((compName, index) => {
        // Determine competition type based on name
        let type: 'league' | 'cup' | 'friendly' = 'league';
        if (compName.toLowerCase().includes('cup')) type = 'cup';
        if (compName.toLowerCase().includes('friendly')) type = 'friendly';
        
        // Assign random teams (between 6-16 teams)
        const shuffledTeams = [...uniqueTeams].sort(() => 0.5 - Math.random());
        const teamCount = Math.floor(Math.random() * 10) + 6;
        
        return {
          id: `comp-${index}`,
          name: compName,
          season: '2023-2024',
          type,
          teams: shuffledTeams.slice(0, teamCount),
        };
      });
      
      setCompetitions(competitionObjects);
      setAvailableTeams(uniqueTeams);
    } catch (error) {
      console.error('Error fetching data:', error);
      toast.error('Failed to load competitions');
    } finally {
      setLoading(false);
    }
  };

  // Initial data fetch
  useEffect(() => {
    fetchData();
  }, []);

  // Open dialog for creating a new competition
  const handleOpenCreateDialog = () => {
    form.reset({
      name: '',
      season: seasons[0],
      type: 'league',
      teams: [],
    });
    setEditingCompetition(null);
    setDialogOpen(true);
  };

  // Open dialog for editing a competition
  const handleOpenEditDialog = (competition: Competition) => {
    form.reset({
      name: competition.name,
      season: competition.season,
      type: competition.type,
      teams: competition.teams || [],
    });
    setEditingCompetition(competition);
    setDialogOpen(true);
  };

  // Handle form submission (create or update)
  const onSubmit = async (values: CompetitionFormValues) => {
    try {
      // In a real implementation, you would save to a competitions table
      // For this demo, we'll just update the local state
      
      if (editingCompetition) {
        // Update existing competition
        const updatedCompetitions = competitions.map(comp => 
          comp.id === editingCompetition.id ? { ...comp, ...values } : comp
        );
        setCompetitions(updatedCompetitions);
        toast.success('Competition updated successfully');
      } else {
        // Create new competition
        const newCompetition: Competition = {
          id: `comp-${Date.now()}`,
          name: values.name,
          season: values.season,
          type: values.type,
          teams: values.teams || [],
        };
        setCompetitions([...competitions, newCompetition]);
        toast.success('Competition created successfully');
      }
      
      setDialogOpen(false);
    } catch (error) {
      console.error('Error saving competition:', error);
      toast.error('Failed to save competition');
    }
  };

  // Handle competition deletion
  const handleDeleteCompetition = async (competitionId: string) => {
    try {
      // In a real implementation, you would delete from a competitions table
      
      // Update local state
      setCompetitions(competitions.filter(comp => comp.id !== competitionId));
      toast.success('Competition deleted successfully');
    } catch (error) {
      console.error('Error deleting competition:', error);
      toast.error('Failed to delete competition');
    }
  };

  // Get type label with icon
  const getTypeLabel = (type: 'league' | 'cup' | 'friendly') => {
    switch (type) {
      case 'league':
        return <span className="flex items-center"><Trophy className="h-4 w-4 mr-1 text-blue-500" /> League</span>;
      case 'cup':
        return <span className="flex items-center"><Trophy className="h-4 w-4 mr-1 text-amber-500" /> Cup</span>;
      case 'friendly':
        return <span className="flex items-center"><Trophy className="h-4 w-4 mr-1 text-green-500" /> Friendly</span>;
    }
  };

  return (
    <div>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Competition Management</CardTitle>
          <Button onClick={handleOpenCreateDialog}>
            <Plus className="h-4 w-4 mr-2" />
            Add Competition
          </Button>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="flex justify-center p-8">
              <Loader2 className="h-8 w-8 animate-spin text-primary mr-2" />
              <p>Loading competitions...</p>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Season</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead>Teams</TableHead>
                  <TableHead className="w-[100px]">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {competitions.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={5} className="text-center py-4 text-gray-500">
                      No competitions found
                    </TableCell>
                  </TableRow>
                ) : (
                  competitions.map((competition) => (
                    <TableRow key={competition.id}>
                      <TableCell className="font-medium">{competition.name}</TableCell>
                      <TableCell>{competition.season}</TableCell>
                      <TableCell>{getTypeLabel(competition.type)}</TableCell>
                      <TableCell>{competition.teams.length} teams</TableCell>
                      <TableCell>
                        <div className="flex space-x-2">
                          <Button variant="ghost" size="sm" onClick={() => handleOpenEditDialog(competition)}>
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button variant="ghost" size="sm" onClick={() => handleDeleteCompetition(competition.id)}>
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="sm:max-w-[550px]">
          <DialogHeader>
            <DialogTitle>
              {editingCompetition ? 'Edit Competition' : 'Add New Competition'}
            </DialogTitle>
          </DialogHeader>

          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Competition Name</FormLabel>
                    <FormControl>
                      <Input {...field} placeholder="Enter competition name" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="season"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Season</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select season" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {seasons.map((season) => (
                          <SelectItem key={season} value={season}>
                            {season}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="type"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Competition Type</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select type" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="league">League</SelectItem>
                        <SelectItem value="cup">Cup</SelectItem>
                        <SelectItem value="friendly">Friendly</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="teams"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Teams</FormLabel>
                    <div className="max-h-[200px] overflow-y-auto border rounded-md p-2">
                      {availableTeams.length === 0 ? (
                        <p className="text-sm text-muted-foreground p-2">No teams available</p>
                      ) : (
                        <div className="grid grid-cols-2 gap-2">
                          {availableTeams.map(team => (
                            <div key={team} className="flex items-center gap-2">
                              <input
                                type="checkbox"
                                id={`team-${team}`}
                                checked={(field.value || []).includes(team)}
                                onChange={(e) => {
                                  if (e.target.checked) {
                                    field.onChange([...(field.value || []), team]);
                                  } else {
                                    field.onChange((field.value || []).filter(t => t !== team));
                                  }
                                }}
                                className="form-checkbox h-4 w-4"
                              />
                              <label htmlFor={`team-${team}`} className="text-sm">
                                {team}
                              </label>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <DialogFooter>
                <Button type="button" variant="outline" onClick={() => setDialogOpen(false)}>
                  Cancel
                </Button>
                <Button type="submit">
                  <Check className="h-4 w-4 mr-2" />
                  {editingCompetition ? 'Update Competition' : 'Create Competition'}
                </Button>
              </DialogFooter>
            </form>
          </Form>
        </DialogContent>
      </Dialog>
    </div>
  );
};
