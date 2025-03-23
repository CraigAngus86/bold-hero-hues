
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Edit, Save, X, PlusCircle, Trash2 } from 'lucide-react';
import { toast } from 'sonner';
import { TeamStats, fullMockLeagueData } from '@/components/league/types';

const AdminLeagueSection = () => {
  const [leagueData, setLeagueData] = useState<TeamStats[]>(fullMockLeagueData);
  const [editingTeam, setEditingTeam] = useState<TeamStats | null>(null);
  
  const handleStartEdit = (team: TeamStats) => {
    setEditingTeam({ ...team });
  };
  
  const handleCancelEdit = () => {
    setEditingTeam(null);
  };
  
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!editingTeam) return;
    
    const { name, value } = e.target;
    const numValue = name !== 'team' ? parseInt(value) || 0 : value;
    
    setEditingTeam(prev => {
      if (!prev) return null;
      return {
        ...prev,
        [name]: numValue
      }
    });
  };
  
  const handleSaveTeam = () => {
    if (!editingTeam) return;
    
    // Calculate goal difference
    const updatedTeam = {
      ...editingTeam,
      goalDifference: editingTeam.goalsFor - editingTeam.goalsAgainst
    };
    
    // Update the team in the league data
    setLeagueData(leagueData.map(team => 
      team.position === updatedTeam.position ? updatedTeam : team
    ));
    
    // Sort by points (this is simplistic, real sorting would consider other factors)
    const sortedData = [...leagueData].sort((a, b) => b.points - a.points)
      .map((team, index) => ({
        ...team,
        position: index + 1
      }));
    
    setLeagueData(sortedData);
    setEditingTeam(null);
    toast.success(`Team ${updatedTeam.team} updated successfully`);
  };
  
  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-semibold">League Table Management</h2>
        <Button 
          variant="outline"
          onClick={() => {
            setLeagueData(fullMockLeagueData);
            toast.success("League table reset to default values");
          }}
        >
          Reset Table
        </Button>
      </div>
      
      <Card>
        <CardHeader>
          <CardTitle>Highland League Table</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-12">Pos</TableHead>
                  <TableHead>Team</TableHead>
                  <TableHead className="text-center">P</TableHead>
                  <TableHead className="text-center">W</TableHead>
                  <TableHead className="text-center">D</TableHead>
                  <TableHead className="text-center">L</TableHead>
                  <TableHead className="text-center">GF</TableHead>
                  <TableHead className="text-center">GA</TableHead>
                  <TableHead className="text-center">GD</TableHead>
                  <TableHead className="text-center">Pts</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {leagueData.map((team) => (
                  <TableRow key={team.position} className={team.team === "Banks o' Dee" ? "bg-team-lightBlue/20" : ""}>
                    {editingTeam && editingTeam.position === team.position ? (
                      <>
                        <TableCell>{team.position}</TableCell>
                        <TableCell>
                          <Input
                            name="team"
                            value={editingTeam.team}
                            onChange={handleInputChange}
                            className="w-full"
                          />
                        </TableCell>
                        <TableCell>
                          <Input
                            name="played"
                            type="number"
                            value={editingTeam.played}
                            onChange={handleInputChange}
                            className="w-16"
                          />
                        </TableCell>
                        <TableCell>
                          <Input
                            name="won"
                            type="number"
                            value={editingTeam.won}
                            onChange={handleInputChange}
                            className="w-16"
                          />
                        </TableCell>
                        <TableCell>
                          <Input
                            name="drawn"
                            type="number"
                            value={editingTeam.drawn}
                            onChange={handleInputChange}
                            className="w-16"
                          />
                        </TableCell>
                        <TableCell>
                          <Input
                            name="lost"
                            type="number"
                            value={editingTeam.lost}
                            onChange={handleInputChange}
                            className="w-16"
                          />
                        </TableCell>
                        <TableCell>
                          <Input
                            name="goalsFor"
                            type="number"
                            value={editingTeam.goalsFor}
                            onChange={handleInputChange}
                            className="w-16"
                          />
                        </TableCell>
                        <TableCell>
                          <Input
                            name="goalsAgainst"
                            type="number"
                            value={editingTeam.goalsAgainst}
                            onChange={handleInputChange}
                            className="w-16"
                          />
                        </TableCell>
                        <TableCell className="text-center">
                          {editingTeam.goalsFor - editingTeam.goalsAgainst}
                        </TableCell>
                        <TableCell>
                          <Input
                            name="points"
                            type="number"
                            value={editingTeam.points}
                            onChange={handleInputChange}
                            className="w-16"
                          />
                        </TableCell>
                        <TableCell className="text-right">
                          <div className="flex justify-end gap-2">
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={handleCancelEdit}
                              className="h-8 w-8 p-0"
                            >
                              <X className="h-4 w-4" />
                            </Button>
                            <Button
                              variant="default"
                              size="sm"
                              onClick={handleSaveTeam}
                              className="h-8 w-8 p-0"
                            >
                              <Save className="h-4 w-4" />
                            </Button>
                          </div>
                        </TableCell>
                      </>
                    ) : (
                      <>
                        <TableCell>{team.position}</TableCell>
                        <TableCell className="font-medium">{team.team}</TableCell>
                        <TableCell className="text-center">{team.played}</TableCell>
                        <TableCell className="text-center">{team.won}</TableCell>
                        <TableCell className="text-center">{team.drawn}</TableCell>
                        <TableCell className="text-center">{team.lost}</TableCell>
                        <TableCell className="text-center">{team.goalsFor}</TableCell>
                        <TableCell className="text-center">{team.goalsAgainst}</TableCell>
                        <TableCell className="text-center">{team.goalDifference}</TableCell>
                        <TableCell className="text-center font-bold">{team.points}</TableCell>
                        <TableCell className="text-right">
                          <Button
                            variant="ghost"
                            size="sm"
                            disabled={!!editingTeam}
                            onClick={() => handleStartEdit(team)}
                            className="h-8 w-8 p-0"
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                        </TableCell>
                      </>
                    )}
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminLeagueSection;
