
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/Table';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Loader2, Save, FileInput, Upload } from 'lucide-react';
import { toast } from 'sonner';
import { useSquadStore } from '@/services/squadService';
import { useTeamStore } from '@/services/teamService';
import { TeamMember } from '@/types/team';
import { PlayerStatistics as PlayerStatsType } from '@/types/squad';
import { Bar, BarChart, ResponsiveContainer, XAxis, YAxis, Tooltip, CartesianGrid } from 'recharts';

interface StatEditorDialogProps {
  player: TeamMember | null;
  open: boolean;
  onClose: () => void;
}

const StatEditorDialog: React.FC<StatEditorDialogProps> = ({ player, open, onClose }) => {
  const { playerStatistics, updatePlayerStatistics } = useSquadStore();
  const [season, setSeason] = useState('2023-2024');
  const [stats, setStats] = useState<Partial<PlayerStatsType>>({
    appearances: 0,
    goals: 0,
    assists: 0,
    yellow_cards: 0,
    red_cards: 0,
    minutes_played: 0,
    clean_sheets: 0
  });
  const [isSaving, setIsSaving] = useState(false);
  
  useEffect(() => {
    if (open && player) {
      // Find existing stats for this player and season
      const existingStats = playerStatistics.find(
        ps => ps.player_id === player.id && ps.season === season
      );
      
      if (existingStats) {
        setStats({
          appearances: existingStats.appearances || 0,
          goals: existingStats.goals || 0,
          assists: existingStats.assists || 0,
          yellow_cards: existingStats.yellow_cards || 0,
          red_cards: existingStats.red_cards || 0,
          minutes_played: existingStats.minutes_played || 0,
          clean_sheets: existingStats.clean_sheets || 0
        });
      } else {
        // Reset stats for new entry
        setStats({
          appearances: 0,
          goals: 0,
          assists: 0,
          yellow_cards: 0,
          red_cards: 0,
          minutes_played: 0,
          clean_sheets: 0
        });
      }
    }
  }, [open, player, season, playerStatistics]);
  
  const handleSave = async () => {
    if (!player) return;
    
    try {
      setIsSaving(true);
      await updatePlayerStatistics(player.id, season, stats);
      toast.success('Statistics saved successfully');
      onClose();
    } catch (error) {
      toast.error('Failed to save statistics');
      console.error('Error saving player statistics:', error);
    } finally {
      setIsSaving(false);
    }
  };
  
  const availableSeasons = ['2023-2024', '2022-2023', '2021-2022'];
  
  if (!player) return null;
  
  const isGoalkeeper = player.position?.toLowerCase().includes('goalkeeper');
  
  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Edit Statistics for {player.name}</DialogTitle>
        </DialogHeader>
        
        <div className="grid gap-6 py-4">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-3">
              {player.image_url && (
                <div className="h-12 w-12 rounded-full overflow-hidden">
                  <img src={player.image_url} alt={player.name} className="h-full w-full object-cover" />
                </div>
              )}
              <div>
                <h3 className="font-bold">{player.name}</h3>
                <p className="text-sm text-gray-500">{player.position}</p>
              </div>
            </div>
            
            <div className="w-40">
              <Label htmlFor="season">Season</Label>
              <Select value={season} onValueChange={setSeason}>
                <SelectTrigger id="season">
                  <SelectValue placeholder="Select season" />
                </SelectTrigger>
                <SelectContent>
                  {availableSeasons.map((s) => (
                    <SelectItem key={s} value={s}>{s}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
          
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="appearances">Appearances</Label>
              <Input 
                id="appearances" 
                type="number" 
                min="0"
                value={stats.appearances || 0}
                onChange={(e) => setStats({...stats, appearances: parseInt(e.target.value) || 0})}
              />
            </div>
            <div>
              <Label htmlFor="minutes">Minutes Played</Label>
              <Input 
                id="minutes" 
                type="number" 
                min="0"
                value={stats.minutes_played || 0}
                onChange={(e) => setStats({...stats, minutes_played: parseInt(e.target.value) || 0})}
              />
            </div>
            <div>
              <Label htmlFor="goals">Goals</Label>
              <Input 
                id="goals" 
                type="number" 
                min="0"
                value={stats.goals || 0}
                onChange={(e) => setStats({...stats, goals: parseInt(e.target.value) || 0})}
              />
            </div>
            <div>
              <Label htmlFor="assists">Assists</Label>
              <Input 
                id="assists" 
                type="number" 
                min="0"
                value={stats.assists || 0}
                onChange={(e) => setStats({...stats, assists: parseInt(e.target.value) || 0})}
              />
            </div>
            <div>
              <Label htmlFor="yellows">Yellow Cards</Label>
              <Input 
                id="yellows" 
                type="number" 
                min="0"
                value={stats.yellow_cards || 0}
                onChange={(e) => setStats({...stats, yellow_cards: parseInt(e.target.value) || 0})}
              />
            </div>
            <div>
              <Label htmlFor="reds">Red Cards</Label>
              <Input 
                id="reds" 
                type="number" 
                min="0"
                value={stats.red_cards || 0}
                onChange={(e) => setStats({...stats, red_cards: parseInt(e.target.value) || 0})}
              />
            </div>
            {isGoalkeeper && (
              <div className="md:col-span-2">
                <Label htmlFor="cleanSheets">Clean Sheets</Label>
                <Input 
                  id="cleanSheets" 
                  type="number" 
                  min="0"
                  value={stats.clean_sheets || 0}
                  onChange={(e) => setStats({...stats, clean_sheets: parseInt(e.target.value) || 0})}
                />
              </div>
            )}
          </div>
        </div>
        
        <DialogFooter>
          <Button variant="outline" onClick={onClose}>Cancel</Button>
          <Button onClick={handleSave} disabled={isSaving}>
            {isSaving ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Saving...
              </>
            ) : (
              <>
                <Save className="mr-2 h-4 w-4" />
                Save Statistics
              </>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

interface BulkStatImportDialogProps {
  open: boolean;
  onClose: () => void;
}

const BulkStatImportDialog: React.FC<BulkStatImportDialogProps> = ({ open, onClose }) => {
  const [season, setSeason] = useState('2023-2024');
  const [importType, setImportType] = useState('match');
  const [isProcessing, setIsProcessing] = useState(false);
  const { bulkUpdateStatistics } = useSquadStore();
  const { players } = useTeamStore();
  
  const handleBulkImport = async () => {
    try {
      setIsProcessing(true);
      
      // For demo purposes, let's simulate random stat updates for all players
      const updates = players.filter(p => p.member_type === 'player').map(player => {
        const isGoalkeeper = player.position?.toLowerCase().includes('goalkeeper');
        
        // Generate random stat increases
        const goalIncrement = isGoalkeeper ? 0 : Math.floor(Math.random() * 3);
        const assistIncrement = isGoalkeeper ? 0 : Math.floor(Math.random() * 2);
        const yellowIncrement = Math.random() > 0.7 ? 1 : 0;
        const redIncrement = Math.random() > 0.95 ? 1 : 0;
        const appearanceIncrement = Math.random() > 0.3 ? 1 : 0;
        const minutesIncrement = appearanceIncrement ? Math.floor(Math.random() * 90) + 1 : 0;
        const cleanSheetIncrement = isGoalkeeper && appearanceIncrement && Math.random() > 0.6 ? 1 : 0;
        
        return {
          player_id: player.id,
          season,
          // Instead of setting absolute values, we'd normally increment existing values
          // For this mock implementation, we're assuming we're incrementing from existing stats
          goals: goalIncrement,
          assists: assistIncrement,
          yellow_cards: yellowIncrement,
          red_cards: redIncrement,
          appearances: appearanceIncrement,
          minutes_played: minutesIncrement,
          clean_sheets: cleanSheetIncrement
        };
      });
      
      await bulkUpdateStatistics(updates);
      toast.success(`Statistics updated for ${updates.filter(u => u.appearances > 0).length} players`);
      onClose();
    } catch (error) {
      toast.error('Failed to import statistics');
      console.error('Error importing statistics:', error);
    } finally {
      setIsProcessing(false);
    }
  };
  
  const availableSeasons = ['2023-2024', '2022-2023', '2021-2022'];
  
  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Bulk Update Statistics</DialogTitle>
        </DialogHeader>
        
        <div className="grid gap-6 py-4">
          <div>
            <Label htmlFor="bulkSeason">Season</Label>
            <Select value={season} onValueChange={setSeason}>
              <SelectTrigger id="bulkSeason">
                <SelectValue placeholder="Select season" />
              </SelectTrigger>
              <SelectContent>
                {availableSeasons.map((s) => (
                  <SelectItem key={s} value={s}>{s}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          
          <div>
            <Label htmlFor="importType">Update Type</Label>
            <Select value={importType} onValueChange={setImportType}>
              <SelectTrigger id="importType">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="match">Single Match</SelectItem>
                <SelectItem value="csv">CSV Import</SelectItem>
                <SelectItem value="manual">Manual Entry</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          {importType === 'csv' && (
            <div className="border-2 border-dashed rounded-md p-6 text-center">
              <FileInput className="mx-auto h-10 w-10 text-gray-400" />
              <p className="mt-2 text-gray-500">Drop CSV file here or click to browse</p>
              <p className="text-xs text-gray-400 mt-1">
                CSV must include columns: player_id, appearances, goals, assists, etc.
              </p>
              <Button variant="outline" size="sm" className="mt-2">
                <Upload className="mr-2 h-4 w-4" />
                Upload File
              </Button>
            </div>
          )}
          
          {importType === 'match' && (
            <Card>
              <CardContent className="pt-6">
                <p className="text-sm text-gray-500">
                  This will simulate adding statistics from a recent match for all active players.
                </p>
                <p className="text-sm font-medium mt-3">Statistics to be updated:</p>
                <ul className="text-sm text-gray-500 mt-1 list-disc pl-5">
                  <li>Appearances</li>
                  <li>Goals</li>
                  <li>Assists</li>
                  <li>Yellow/Red cards</li>
                  <li>Minutes played</li>
                  <li>Clean sheets (for goalkeepers)</li>
                </ul>
              </CardContent>
            </Card>
          )}
        </div>
        
        <DialogFooter>
          <Button variant="outline" onClick={onClose}>Cancel</Button>
          <Button onClick={handleBulkImport} disabled={isProcessing}>
            {isProcessing ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Processing...
              </>
            ) : (
              'Update Statistics'
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

interface SeasonStatsTabProps {
  season: string;
  onEditPlayer: (player: TeamMember) => void;
}

const SeasonStatsTab: React.FC<SeasonStatsTabProps> = ({ season, onEditPlayer }) => {
  const { playerStatistics, isLoading } = useSquadStore();
  const { players } = useTeamStore();
  
  // Get stats for this season
  const seasonStats = playerStatistics.filter(stat => stat.season === season);
  
  // Get player objects for players with stats
  const playersWithStats = players.filter(player => 
    player.member_type === 'player' && 
    seasonStats.some(stat => stat.player_id === player.id)
  );
  
  // Prepare data for the chart
  const chartData = playersWithStats
    .map(player => {
      const stats = seasonStats.find(stat => stat.player_id === player.id);
      if (!stats) return null;
      
      return {
        name: player.name,
        goals: stats.goals || 0,
        assists: stats.assists || 0,
        appearances: stats.appearances || 0
      };
    })
    .filter(item => item !== null)
    .sort((a, b) => (b!.goals + b!.assists) - (a!.goals + a!.assists))
    .slice(0, 5) as any[];
  
  if (isLoading) {
    return (
      <div className="flex justify-center items-center py-12">
        <Loader2 className="h-8 w-8 animate-spin text-gray-400" />
      </div>
    );
  }
  
  return (
    <div className="space-y-6">
      {/* Stats Summary */}
      <Card>
        <CardHeader>
          <CardTitle>Season {season} Statistics Summary</CardTitle>
        </CardHeader>
        <CardContent>
          {chartData.length > 0 ? (
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={chartData}
                  margin={{
                    top: 20,
                    right: 30,
                    left: 20,
                    bottom: 60,
                  }}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis 
                    dataKey="name" 
                    angle={-45} 
                    textAnchor="end"
                    height={70}
                  />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="goals" name="Goals" fill="#4f46e5" />
                  <Bar dataKey="assists" name="Assists" fill="#06b6d4" />
                </BarChart>
              </ResponsiveContainer>
              <p className="text-center text-sm text-gray-500 mt-2">Top 5 goal contributors</p>
            </div>
          ) : (
            <div className="text-center py-12">
              <p className="text-gray-500">No statistics available for this season</p>
            </div>
          )}
        </CardContent>
      </Card>
      
      {/* Detailed Player Stats */}
      <Card>
        <CardHeader>
          <CardTitle>Player Statistics</CardTitle>
        </CardHeader>
        <CardContent>
          {playersWithStats.length > 0 ? (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Player</TableHead>
                  <TableHead className="text-right">Apps</TableHead>
                  <TableHead className="text-right">Goals</TableHead>
                  <TableHead className="text-right">Assists</TableHead>
                  <TableHead className="text-right">Yellow</TableHead>
                  <TableHead className="text-right">Red</TableHead>
                  <TableHead></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {playersWithStats.map(player => {
                  const stats = seasonStats.find(stat => stat.player_id === player.id);
                  if (!stats) return null;
                  
                  return (
                    <TableRow key={player.id}>
                      <TableCell className="font-medium">{player.name}</TableCell>
                      <TableCell className="text-right">{stats.appearances || 0}</TableCell>
                      <TableCell className="text-right">{stats.goals || 0}</TableCell>
                      <TableCell className="text-right">{stats.assists || 0}</TableCell>
                      <TableCell className="text-right">{stats.yellow_cards || 0}</TableCell>
                      <TableCell className="text-right">{stats.red_cards || 0}</TableCell>
                      <TableCell>
                        <Button variant="ghost" size="sm" onClick={() => onEditPlayer(player)}>
                          Edit
                        </Button>
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          ) : (
            <div className="text-center py-8">
              <p className="text-gray-500">No player statistics available for this season</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

const PlayerStatistics: React.FC = () => {
  const { loadPlayerStatistics, isLoading } = useSquadStore();
  const { players, loadTeamMembers } = useTeamStore();
  const [selectedSeason, setSelectedSeason] = useState('2023-2024');
  const [statDialogOpen, setStatDialogOpen] = useState(false);
  const [bulkDialogOpen, setBulkDialogOpen] = useState(false);
  const [selectedPlayer, setSelectedPlayer] = useState<TeamMember | null>(null);
  
  useEffect(() => {
    loadTeamMembers();
    loadPlayerStatistics();
  }, [loadTeamMembers, loadPlayerStatistics]);
  
  const handleEditPlayerStats = (player: TeamMember) => {
    setSelectedPlayer(player);
    setStatDialogOpen(true);
  };
  
  const handleBulkUpdate = () => {
    setBulkDialogOpen(true);
  };
  
  if (isLoading && players.length === 0) {
    return (
      <div className="flex justify-center items-center py-12">
        <Loader2 className="h-8 w-8 animate-spin text-gray-400" />
      </div>
    );
  }
  
  const availableSeasons = ['2023-2024', '2022-2023', '2021-2022'];
  
  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold">Player Statistics</h2>
          <p className="text-gray-500">Track and update player performance metrics</p>
        </div>
        <div className="flex gap-3 w-full sm:w-auto">
          <Button onClick={handleBulkUpdate} variant="outline" className="flex-1 sm:flex-none">
            Bulk Update
          </Button>
          <Select value={selectedSeason} onValueChange={setSelectedSeason}>
            <SelectTrigger className="w-full sm:w-40">
              <SelectValue placeholder="Select season" />
            </SelectTrigger>
            <SelectContent>
              {availableSeasons.map(season => (
                <SelectItem key={season} value={season}>{season}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>
      
      <Tabs value={selectedSeason} onValueChange={setSelectedSeason}>
        <TabsList className="mb-6">
          {availableSeasons.map(season => (
            <TabsTrigger key={season} value={season}>
              {season}
            </TabsTrigger>
          ))}
        </TabsList>
        
        {availableSeasons.map(season => (
          <TabsContent key={season} value={season}>
            <SeasonStatsTab 
              season={season} 
              onEditPlayer={handleEditPlayerStats} 
            />
          </TabsContent>
        ))}
      </Tabs>
      
      <StatEditorDialog 
        player={selectedPlayer}
        open={statDialogOpen}
        onClose={() => setStatDialogOpen(false)}
      />
      
      <BulkStatImportDialog
        open={bulkDialogOpen}
        onClose={() => setBulkDialogOpen(false)}
      />
    </div>
  );
};

export default PlayerStatistics;
