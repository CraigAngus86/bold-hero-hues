
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { format } from 'date-fns';
import { CalendarIcon, Edit, Save, X, PlusCircle, Trash2 } from 'lucide-react';
import { toast } from 'sonner';
import { Match } from '@/components/fixtures/types';
import { competitions, mockMatches } from '@/components/fixtures/fixturesMockData';
import { formatDate, groupMatchesByMonth } from '@/components/fixtures/types';

const AdminFixturesSection = () => {
  const [matches, setMatches] = useState<Match[]>(mockMatches);
  const [activeTab, setActiveTab] = useState('upcoming');
  const [editingMatch, setEditingMatch] = useState<Match | null>(null);
  const [isAddingMatch, setIsAddingMatch] = useState(false);
  
  const [formData, setFormData] = useState<Omit<Match, 'id'>>({
    homeTeam: '',
    awayTeam: '',
    date: format(new Date(), 'yyyy-MM-dd'),
    time: '15:00',
    competition: 'Highland League',
    isCompleted: false,
    venue: '',
    homeScore: 0,
    awayScore: 0,
  });
  
  const upcomingMatches = matches.filter(match => !match.isCompleted);
  const completedMatches = matches.filter(match => match.isCompleted);
  
  const handleStartEdit = (match: Match) => {
    setEditingMatch(match);
    setFormData({
      homeTeam: match.homeTeam,
      awayTeam: match.awayTeam,
      date: match.date,
      time: match.time,
      competition: match.competition,
      isCompleted: match.isCompleted,
      venue: match.venue,
      homeScore: match.homeScore || 0,
      awayScore: match.awayScore || 0,
    });
    setIsAddingMatch(false);
  };
  
  const handleStartAdd = () => {
    setIsAddingMatch(true);
    setEditingMatch(null);
    setFormData({
      homeTeam: "Banks o' Dee",
      awayTeam: '',
      date: format(new Date(), 'yyyy-MM-dd'),
      time: '15:00',
      competition: 'Highland League',
      isCompleted: false,
      venue: 'Spain Park',
      homeScore: 0,
      awayScore: 0,
    });
  };
  
  const handleCancel = () => {
    setEditingMatch(null);
    setIsAddingMatch(false);
  };
  
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type } = e.target;
    
    setFormData(prev => ({
      ...prev,
      [name]: type === 'number' ? parseInt(value) || 0 : value
    }));
  };
  
  const handleSelectChange = (name: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };
  
  const handleDateChange = (date: Date | undefined) => {
    if (date) {
      setFormData(prev => ({
        ...prev,
        date: format(date, 'yyyy-MM-dd')
      }));
    }
  };
  
  const handleToggleComplete = (checked: boolean) => {
    setFormData(prev => ({
      ...prev,
      isCompleted: checked
    }));
  };
  
  const handleSave = () => {
    if (editingMatch) {
      // Update existing match
      setMatches(matches.map(match => 
        match.id === editingMatch.id 
          ? { ...match, ...formData } 
          : match
      ));
      toast.success('Match updated successfully');
    } else {
      // Add new match
      const newMatch: Match = {
        id: Date.now(),
        ...formData
      };
      setMatches([...matches, newMatch]);
      toast.success('Match added successfully');
    }
    
    setEditingMatch(null);
    setIsAddingMatch(false);
  };
  
  const handleDelete = (id: number) => {
    setMatches(matches.filter(match => match.id !== id));
    toast.success('Match deleted successfully');
  };
  
  const teams = Array.from(new Set(matches.flatMap(match => [match.homeTeam, match.awayTeam]))).sort();
  
  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-semibold">Fixtures & Results Management</h2>
        <div className="flex gap-2">
          <Button 
            variant="outline"
            onClick={() => {
              setMatches(mockMatches);
              toast.success("Fixtures reset to default values");
            }}
          >
            Reset Fixtures
          </Button>
          {!isAddingMatch && !editingMatch && (
            <Button onClick={handleStartAdd} className="flex items-center">
              <PlusCircle className="h-4 w-4 mr-2" />
              Add Match
            </Button>
          )}
        </div>
      </div>
      
      {(isAddingMatch || editingMatch) && (
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>{editingMatch ? 'Edit Match' : 'Add Match'}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div>
                  <Label>Home Team</Label>
                  <Select
                    value={formData.homeTeam}
                    onValueChange={(value) => handleSelectChange('homeTeam', value)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select home team" />
                    </SelectTrigger>
                    <SelectContent>
                      {teams.map(team => (
                        <SelectItem key={`home-${team}`} value={team}>{team}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                
                <div>
                  <Label>Away Team</Label>
                  <Select
                    value={formData.awayTeam}
                    onValueChange={(value) => handleSelectChange('awayTeam', value)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select away team" />
                    </SelectTrigger>
                    <SelectContent>
                      {teams.map(team => (
                        <SelectItem key={`away-${team}`} value={team}>{team}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                
                <div>
                  <Label>Competition</Label>
                  <Select
                    value={formData.competition}
                    onValueChange={(value) => handleSelectChange('competition', value)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select competition" />
                    </SelectTrigger>
                    <SelectContent>
                      {competitions.filter(c => c !== 'All Competitions').map(comp => (
                        <SelectItem key={comp} value={comp}>{comp}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                
                <div>
                  <Label>Venue</Label>
                  <Input
                    name="venue"
                    value={formData.venue}
                    onChange={handleInputChange}
                    placeholder="Match venue"
                  />
                </div>
              </div>
              
              <div className="space-y-4">
                <div>
                  <Label>Date</Label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        className="w-full justify-start text-left font-normal"
                      >
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {formData.date ? format(new Date(formData.date), 'PPP') : <span>Pick a date</span>}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0">
                      <Calendar
                        mode="single"
                        selected={formData.date ? new Date(formData.date) : undefined}
                        onSelect={handleDateChange}
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>
                </div>
                
                <div>
                  <Label>Time</Label>
                  <Input
                    name="time"
                    value={formData.time}
                    onChange={handleInputChange}
                    placeholder="15:00"
                  />
                </div>
                
                <div className="flex items-center space-x-2">
                  <Switch
                    id="match-complete"
                    checked={formData.isCompleted}
                    onCheckedChange={handleToggleComplete}
                  />
                  <Label htmlFor="match-complete">Match Completed</Label>
                </div>
                
                {formData.isCompleted && (
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label>Home Score</Label>
                      <Input
                        name="homeScore"
                        type="number"
                        min="0"
                        value={formData.homeScore}
                        onChange={handleInputChange}
                      />
                    </div>
                    <div>
                      <Label>Away Score</Label>
                      <Input
                        name="awayScore"
                        type="number"
                        min="0"
                        value={formData.awayScore}
                        onChange={handleInputChange}
                      />
                    </div>
                  </div>
                )}
              </div>
            </div>
            
            <div className="flex justify-end gap-2 mt-6">
              <Button variant="outline" onClick={handleCancel}>
                <X className="h-4 w-4 mr-2" />
                Cancel
              </Button>
              <Button onClick={handleSave}>
                <Save className="h-4 w-4 mr-2" />
                {editingMatch ? 'Update Match' : 'Add Match'}
              </Button>
            </div>
          </CardContent>
        </Card>
      )}
      
      <Tabs defaultValue={activeTab} onValueChange={setActiveTab} className="space-y-4">
        <TabsList>
          <TabsTrigger value="upcoming">Upcoming Fixtures</TabsTrigger>
          <TabsTrigger value="results">Results</TabsTrigger>
        </TabsList>
        
        <TabsContent value="upcoming">
          <Card>
            <CardHeader>
              <CardTitle>Upcoming Fixtures</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Date</TableHead>
                      <TableHead>Competition</TableHead>
                      <TableHead>Home</TableHead>
                      <TableHead>Away</TableHead>
                      <TableHead>Time</TableHead>
                      <TableHead>Venue</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {upcomingMatches.length > 0 ? (
                      upcomingMatches
                        .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
                        .map((match) => (
                          <TableRow 
                            key={match.id}
                            className={(match.homeTeam === "Banks o' Dee" || match.awayTeam === "Banks o' Dee") 
                              ? "bg-team-lightBlue/20" 
                              : ""}
                          >
                            <TableCell>{format(new Date(match.date), 'dd MMM yyyy')}</TableCell>
                            <TableCell>{match.competition}</TableCell>
                            <TableCell>{match.homeTeam}</TableCell>
                            <TableCell>{match.awayTeam}</TableCell>
                            <TableCell>{match.time}</TableCell>
                            <TableCell>{match.venue}</TableCell>
                            <TableCell className="text-right">
                              <div className="flex justify-end gap-2">
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => handleStartEdit(match)}
                                  className="h-8 w-8 p-0"
                                >
                                  <Edit className="h-4 w-4" />
                                </Button>
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => handleDelete(match.id)}
                                  className="h-8 w-8 p-0 text-red-500 hover:text-red-600"
                                >
                                  <Trash2 className="h-4 w-4" />
                                </Button>
                              </div>
                            </TableCell>
                          </TableRow>
                        ))
                    ) : (
                      <TableRow>
                        <TableCell colSpan={7} className="text-center py-4 text-gray-500">
                          No upcoming fixtures found
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="results">
          <Card>
            <CardHeader>
              <CardTitle>Match Results</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Date</TableHead>
                      <TableHead>Competition</TableHead>
                      <TableHead>Home</TableHead>
                      <TableHead>Score</TableHead>
                      <TableHead>Away</TableHead>
                      <TableHead>Venue</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {completedMatches.length > 0 ? (
                      completedMatches
                        .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
                        .map((match) => (
                          <TableRow 
                            key={match.id}
                            className={(match.homeTeam === "Banks o' Dee" || match.awayTeam === "Banks o' Dee") 
                              ? "bg-team-lightBlue/20" 
                              : ""}
                          >
                            <TableCell>{format(new Date(match.date), 'dd MMM yyyy')}</TableCell>
                            <TableCell>{match.competition}</TableCell>
                            <TableCell>{match.homeTeam}</TableCell>
                            <TableCell className="font-medium">
                              {match.homeScore} - {match.awayScore}
                            </TableCell>
                            <TableCell>{match.awayTeam}</TableCell>
                            <TableCell>{match.venue}</TableCell>
                            <TableCell className="text-right">
                              <div className="flex justify-end gap-2">
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => handleStartEdit(match)}
                                  className="h-8 w-8 p-0"
                                >
                                  <Edit className="h-4 w-4" />
                                </Button>
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => handleDelete(match.id)}
                                  className="h-8 w-8 p-0 text-red-500 hover:text-red-600"
                                >
                                  <Trash2 className="h-4 w-4" />
                                </Button>
                              </div>
                            </TableCell>
                          </TableRow>
                        ))
                    ) : (
                      <TableRow>
                        <TableCell colSpan={7} className="text-center py-4 text-gray-500">
                          No results found
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default AdminFixturesSection;
