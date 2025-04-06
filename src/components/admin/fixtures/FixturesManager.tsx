
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Link, Calendar, Edit, ExternalLink, Loader2, Clock, Info, Image as ImageIcon, FileText, Activity, Users, Timer } from 'lucide-react';
import { toast } from 'sonner';
import { Fixture, FixtureExtended } from '@/types/fixtures';
import { format } from 'date-fns';
import { supabase } from '@/lib/supabase';
import { DatePickerWithRange } from '@/components/ui/date-range-picker';
import { DateRange } from 'react-day-picker';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

interface MatchEvent {
  id: string;
  time: number;
  type: 'goal' | 'yellow-card' | 'red-card' | 'substitution' | 'other';
  player: string;
  team: string;
  description?: string;
}

interface MatchLineup {
  homeTeam: LineupPlayer[];
  awayTeam: LineupPlayer[];
}

interface LineupPlayer {
  id: string;
  name: string;
  position: string;
  number?: number;
  isStarting: boolean;
}

interface MatchStats {
  possession?: [number, number]; // Home, Away percentages
  shots?: [number, number]; // Home, Away
  shotsOnTarget?: [number, number]; // Home, Away
  corners?: [number, number]; // Home, Away
  fouls?: [number, number]; // Home, Away
  offsides?: [number, number]; // Home, Away
}

const FixturesManager = () => {
  const [fixtures, setFixtures] = useState<FixtureExtended[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedFixture, setSelectedFixture] = useState<FixtureExtended | null>(null);
  const [ticketLink, setTicketLink] = useState('');
  const [matchReport, setMatchReport] = useState('');
  const [attendance, setAttendance] = useState('');
  const [referee, setReferee] = useState('');
  const [dialogOpen, setDialogOpen] = useState(false);
  const [detailsDialogOpen, setDetailsDialogOpen] = useState(false);
  const [dateRange, setDateRange] = useState<DateRange | undefined>(undefined);
  const [competitions, setCompetitions] = useState<string[]>([]);
  const [selectedCompetition, setSelectedCompetition] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [isCompletedFilter, setIsCompletedFilter] = useState<'all' | 'completed' | 'upcoming'>('all');
  const [activeDetailsTab, setActiveDetailsTab] = useState('info');

  useEffect(() => {
    fetchFixtures();
  }, []);

  const fetchFixtures = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('fixtures')
        .select('*')
        .order('date', { ascending: true });
      
      if (error) throw error;
      
      const formattedFixtures = data.map(fixture => ({
        ...fixture,
        match_report: fixture.match_report || '',
        attendance: fixture.attendance || '',
        referee: fixture.referee || '',
        matchEvents: [],
        lineups: { homeTeam: [], awayTeam: [] },
        matchStats: {}
      }));
      
      const uniqueCompetitions = [...new Set(formattedFixtures.map(f => f.competition))];
      setCompetitions(['all', ...uniqueCompetitions]);
      
      setFixtures(formattedFixtures);
      toast.success(`Loaded ${formattedFixtures.length} fixtures`);
    } catch (error) {
      console.error('Error fetching fixtures:', error);
      toast.error('Failed to load fixtures data');
    } finally {
      setLoading(false);
    }
  };

  const handleOpenTicketDialog = (fixture: FixtureExtended) => {
    setSelectedFixture(fixture);
    setTicketLink(fixture.ticket_link || '');
    setDialogOpen(true);
  };

  const handleOpenDetailsDialog = (fixture: FixtureExtended) => {
    setSelectedFixture(fixture);
    setMatchReport(fixture.match_report || '');
    setAttendance(fixture.attendance ? String(fixture.attendance) : '');
    setReferee(fixture.referee || '');
    setDetailsDialogOpen(true);
  };

  const handleSaveTicketLink = async () => {
    if (!selectedFixture) return;

    try {
      const { error } = await supabase
        .from('fixtures')
        .update({ ticket_link: ticketLink })
        .eq('id', selectedFixture.id);
        
      if (error) throw error;
      
      setFixtures(fixtures.map(f => 
        f.id === selectedFixture.id ? { ...f, ticket_link: ticketLink } : f
      ));
      
      toast.success('Ticket link updated successfully');
      setDialogOpen(false);
    } catch (error) {
      console.error('Error updating ticket link:', error);
      toast.error('Failed to update ticket link');
    }
  };

  const handleSaveMatchDetails = async () => {
    if (!selectedFixture) return;

    try {
      const attendanceValue = attendance ? attendance : null;
      
      const { error } = await supabase
        .from('fixtures')
        .update({ 
          match_report: matchReport,
          attendance: attendanceValue,
          referee: referee
        })
        .eq('id', selectedFixture.id);
        
      if (error) throw error;
      
      setFixtures(fixtures.map(f => 
        f.id === selectedFixture.id ? {
          ...f, 
          match_report: matchReport,
          attendance: attendanceValue || '',
          referee
        } : f
      ));
      
      toast.success('Match details updated successfully');
      setDetailsDialogOpen(false);
    } catch (error) {
      console.error('Error updating match details:', error);
      toast.error('Failed to update match details');
    }
  };

  const formatDate = (dateStr: string) => {
    try {
      return format(new Date(dateStr), 'dd MMM yyyy');
    } catch (e) {
      return dateStr;
    }
  };

  const handleDateRangeChange = (range: DateRange | undefined) => {
    setDateRange(range);
  };

  const filteredFixtures = fixtures.filter(fixture => {
    if (dateRange?.from && new Date(fixture.date) < dateRange.from) return false;
    if (dateRange?.to && new Date(fixture.date) > dateRange.to) return false;
    
    if (selectedCompetition !== 'all' && fixture.competition !== selectedCompetition) return false;
    
    if (isCompletedFilter === 'completed' && !fixture.is_completed) return false;
    if (isCompletedFilter === 'upcoming' && fixture.is_completed) return false;
    
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      const homeTeam = fixture.home_team.toLowerCase();
      const awayTeam = fixture.away_team.toLowerCase();
      const competition = fixture.competition.toLowerCase();
      const venue = fixture.venue?.toLowerCase() || '';
      
      if (!homeTeam.includes(query) && 
          !awayTeam.includes(query) && 
          !competition.includes(query) && 
          !venue.includes(query)) {
        return false;
      }
    }
    
    return true;
  });

  return (
    <div>
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
        <h3 className="text-lg font-medium">Fixtures Management</h3>
        <Button onClick={fetchFixtures} variant="outline" size="sm" disabled={loading}>
          <Calendar className={`h-4 w-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
          Refresh Fixtures
        </Button>
      </div>

      <div className="mb-6 grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <div>
          <Label>Filter by Date Range</Label>
          <DatePickerWithRange
            date={dateRange}
            onDateChange={handleDateRangeChange}
            className="w-full"
          />
        </div>
        
        <div>
          <Label>Filter by Competition</Label>
          <Select
            value={selectedCompetition}
            onValueChange={setSelectedCompetition}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select Competition" />
            </SelectTrigger>
            <SelectContent>
              {competitions.map(comp => (
                <SelectItem key={comp} value={comp}>
                  {comp === 'all' ? 'All Competitions' : comp}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        
        <div>
          <Label>Filter by Status</Label>
          <Select
            value={isCompletedFilter}
            onValueChange={(value) => setIsCompletedFilter(value as 'all' | 'completed' | 'upcoming')}
          >
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Fixtures</SelectItem>
              <SelectItem value="completed">Completed Only</SelectItem>
              <SelectItem value="upcoming">Upcoming Only</SelectItem>
            </SelectContent>
          </Select>
        </div>
        
        <div>
          <Label>Search</Label>
          <Input
            placeholder="Search teams, venues..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>

      {loading ? (
        <div className="flex justify-center p-8">
          <Loader2 className="h-8 w-8 animate-spin text-primary mr-2" />
          <p>Loading fixtures...</p>
        </div>
      ) : (
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Date</TableHead>
              <TableHead>Home</TableHead>
              <TableHead>Away</TableHead>
              <TableHead>Competition</TableHead>
              <TableHead>Venue</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Result</TableHead>
              <TableHead className="w-[150px]">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredFixtures.length === 0 ? (
              <TableRow>
                <TableCell colSpan={8} className="text-center py-4 text-gray-500">
                  No fixtures found
                </TableCell>
              </TableRow>
            ) : (
              filteredFixtures.map((fixture) => (
                <TableRow key={fixture.id}>
                  <TableCell>
                    {formatDate(fixture.date)} - {fixture.time}
                  </TableCell>
                  <TableCell>{fixture.home_team}</TableCell>
                  <TableCell>{fixture.away_team}</TableCell>
                  <TableCell>{fixture.competition}</TableCell>
                  <TableCell>{fixture.venue || 'TBD'}</TableCell>
                  <TableCell>
                    {fixture.is_completed ? (
                      <span className="text-green-600 font-medium">Completed</span>
                    ) : (
                      <span className="text-amber-600 font-medium">Upcoming</span>
                    )}
                  </TableCell>
                  <TableCell>
                    {fixture.is_completed && fixture.home_score !== undefined && fixture.away_score !== undefined ? (
                      <span className="font-semibold">{fixture.home_score} - {fixture.away_score}</span>
                    ) : (
                      <span className="text-gray-400">-</span>
                    )}
                  </TableCell>
                  <TableCell>
                    <div className="flex space-x-1">
                      <Button variant="ghost" size="icon" onClick={() => handleOpenTicketDialog(fixture)} title="Manage Ticket Link">
                        <Link className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="icon" onClick={() => handleOpenDetailsDialog(fixture)} title="Manage Match Details">
                        <Info className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      )}

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="sm:max-w-[550px]">
          <DialogHeader>
            <DialogTitle>
              {selectedFixture?.ticket_link ? 'Edit' : 'Add'} Ticket Link
            </DialogTitle>
          </DialogHeader>

          <div className="py-4">
            <p className="mb-4">
              {selectedFixture?.home_team} vs {selectedFixture?.away_team} on {selectedFixture?.date}
            </p>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="ticketLink" className="text-right text-sm font-medium">Ticket URL</Label>
              <Input
                id="ticketLink"
                value={ticketLink}
                onChange={(e) => setTicketLink(e.target.value)}
                className="col-span-3"
                placeholder="https://example.com/tickets"
              />
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" type="button" onClick={() => setDialogOpen(false)}>
              Cancel
            </Button>
            <Button type="button" onClick={handleSaveTicketLink}>
              Save
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={detailsDialogOpen} onOpenChange={setDetailsDialogOpen}>
        <DialogContent className="sm:max-w-[750px]">
          <DialogHeader>
            <DialogTitle>
              Match Details
            </DialogTitle>
            <DialogDescription>
              {selectedFixture?.home_team} vs {selectedFixture?.away_team} on {selectedFixture?.date}
            </DialogDescription>
          </DialogHeader>

          <Tabs value={activeDetailsTab} onValueChange={setActiveDetailsTab}>
            <TabsList className="grid grid-cols-5">
              <TabsTrigger value="info" className="flex items-center gap-1">
                <Info className="h-4 w-4" />
                Basic Info
              </TabsTrigger>
              <TabsTrigger value="report" className="flex items-center gap-1">
                <FileText className="h-4 w-4" />
                Match Report
              </TabsTrigger>
              <TabsTrigger value="timeline" className="flex items-center gap-1">
                <Activity className="h-4 w-4" />
                Timeline
              </TabsTrigger>
              <TabsTrigger value="lineup" className="flex items-center gap-1">
                <Users className="h-4 w-4" />
                Lineups
              </TabsTrigger>
              <TabsTrigger value="stats" className="flex items-center gap-1">
                <Timer className="h-4 w-4" />
                Stats
              </TabsTrigger>
            </TabsList>
            
            <TabsContent value="info" className="space-y-4 pt-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="attendance">Attendance</Label>
                  <Input 
                    id="attendance"
                    type="text"
                    value={attendance}
                    onChange={e => setAttendance(e.target.value)}
                    placeholder="e.g. 1200"
                  />
                </div>
                
                <div>
                  <Label htmlFor="referee">Match Official</Label>
                  <Input 
                    id="referee"
                    value={referee}
                    onChange={e => setReferee(e.target.value)}
                    placeholder="Referee name"
                  />
                </div>
              </div>
              
              <div>
                <Label htmlFor="result">Match Result</Label>
                <div className="grid grid-cols-5 gap-2 items-center">
                  <div className="text-right font-medium">{selectedFixture?.home_team}</div>
                  <Input 
                    value={selectedFixture?.home_score !== undefined ? String(selectedFixture.home_score) : ''}
                    readOnly 
                  />
                  <div className="text-center">-</div>
                  <Input 
                    value={selectedFixture?.away_score !== undefined ? String(selectedFixture.away_score) : ''} 
                    readOnly 
                  />
                  <div className="font-medium">{selectedFixture?.away_team}</div>
                </div>
                <p className="text-sm text-gray-500 mt-1">
                  To update the score, use the Result Entry feature
                </p>
              </div>
            </TabsContent>
            
            <TabsContent value="report" className="pt-4">
              <Label htmlFor="matchReport">Match Report</Label>
              <Textarea
                id="matchReport"
                value={matchReport}
                onChange={e => setMatchReport(e.target.value)}
                placeholder="Write a match report or summary..."
                className="min-h-[200px]"
              />
            </TabsContent>
            
            <TabsContent value="timeline" className="pt-4">
              <div className="p-6 text-center text-gray-500">
                <Activity className="h-12 w-12 mx-auto mb-2 text-gray-400" />
                <h3 className="text-lg font-medium mb-2">Timeline Feature Coming Soon</h3>
                <p>
                  Track goals, cards, substitutions and other key match events.
                </p>
              </div>
            </TabsContent>
            
            <TabsContent value="lineup" className="pt-4">
              <div className="p-6 text-center text-gray-500">
                <Users className="h-12 w-12 mx-auto mb-2 text-gray-400" />
                <h3 className="text-lg font-medium mb-2">Lineups Feature Coming Soon</h3>
                <p>
                  Add player lineups and track individual performances.
                </p>
              </div>
            </TabsContent>
            
            <TabsContent value="stats" className="pt-4">
              <div className="p-6 text-center text-gray-500">
                <Timer className="h-12 w-12 mx-auto mb-2 text-gray-400" />
                <h3 className="text-lg font-medium mb-2">Statistics Feature Coming Soon</h3>
                <p>
                  Track possession, shots, corners and other match statistics.
                </p>
              </div>
            </TabsContent>
          </Tabs>

          <DialogFooter className="pt-2">
            <Button variant="outline" type="button" onClick={() => setDetailsDialogOpen(false)}>
              Cancel
            </Button>
            <Button type="button" onClick={handleSaveMatchDetails}>
              Save Changes
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default FixturesManager;
