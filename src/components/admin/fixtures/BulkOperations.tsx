import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { Upload, Download, FileSpreadsheet, Calendar, RefreshCw, AlertTriangle, FilePlus2 } from 'lucide-react';
import { DatePickerWithRange } from '@/components/ui/date-range-picker';
import { DateRange } from 'react-day-picker';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogFooter, DialogTitle } from '@/components/ui/dialog';
import { Fixture } from '@/types/fixtures';

interface BulkOperationsProps {
  onRefreshData?: () => void;
}

const BulkOperations: React.FC<BulkOperationsProps> = ({ onRefreshData }) => {
  const [isUploading, setIsUploading] = useState(false);
  const [isExporting, setIsExporting] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);
  const [csvFile, setCsvFile] = useState<File | null>(null);
  const [updateType, setUpdateType] = useState<'complete' | 'postpone' | 'reschedule'>('complete');
  const [dateRange, setDateRange] = useState<DateRange | undefined>(undefined);
  const [competition, setCompetition] = useState<string>('all');
  const [competitions, setCompetitions] = useState<string[]>([]);
  const [showOnlyCompleted, setShowOnlyCompleted] = useState(false);
  const [creatingFixtureSeries, setCreatingFixtureSeries] = useState(false);
  const [seriesCompetition, setSeriesCompetition] = useState('');
  const [seriesTeams, setSeriesTeams] = useState('');
  const [seriesVenue, setSeriesVenue] = useState('');
  const [bulkAction, setBulkAction] = useState<string | null>(null);
  const [bulkSeason, setBulkSeason] = useState<string>('');
  const [bulkCompetition, setBulkCompetition] = useState<string>('');
  const [bulkTicketLink, setBulkTicketLink] = useState<string>('');
  
  // Fetch competitions when component mounts
  React.useEffect(() => {
    const fetchCompetitions = async () => {
      try {
        const { data, error } = await supabase
          .from('fixtures')
          .select('competition')
          .order('competition');
        
        if (error) throw error;
        
        const uniqueCompetitions = [...new Set(data.map(item => item.competition))];
        setCompetitions(['all', ...uniqueCompetitions]);
      } catch (error) {
        console.error('Error fetching competitions:', error);
        toast.error('Failed to load competitions');
      }
    };
    
    fetchCompetitions();
  }, []);
  
  // Handle CSV file selection
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setCsvFile(e.target.files[0]);
    }
  };
  
  // Import fixtures from CSV
  const handleImportCSV = async () => {
    if (!csvFile) {
      toast.error("Please select a CSV file to import");
      return;
    }
    
    setIsUploading(true);
    
    try {
      // Read the file
      const fileReader = new FileReader();
      
      fileReader.onload = async (e) => {
        const csvData = e.target?.result as string;
        
        // Parse CSV
        const rows = csvData.split('\n');
        const headers = rows[0].split(',').map(h => h.trim().toLowerCase());
        
        const fixtures = [];
        let skippedRows = 0;
        
        for (let i = 1; i < rows.length; i++) {
          if (!rows[i].trim()) continue;
          
          const values = rows[i].split(',').map(v => v.trim());
          const fixture: Record<string, any> = {};
          
          try {
            headers.forEach((header, index) => {
              const value = values[index];
              
              switch (header) {
                case 'date':
                  // Validate date format
                  const dateRegex = /^\d{4}-\d{2}-\d{2}$/; // YYYY-MM-DD
                  if (!dateRegex.test(value)) {
                    throw new Error(`Invalid date format in row ${i+1}: ${value}. Required format: YYYY-MM-DD`);
                  }
                  fixture.date = value;
                  break;
                case 'time':
                  fixture.time = value || '15:00';
                  break;
                case 'home_team':
                case 'hometeam':
                  fixture.home_team = value;
                  break;
                case 'away_team':
                case 'awayteam':
                  fixture.away_team = value;
                  break;
                case 'competition':
                  fixture.competition = value;
                  break;
                case 'venue':
                  fixture.venue = value;
                  break;
                case 'is_completed':
                case 'completed':
                  fixture.is_completed = value.toLowerCase() === 'true';
                  break;
                case 'home_score':
                case 'homescore':
                  fixture.home_score = parseInt(value) || null;
                  break;
                case 'away_score':
                case 'awayscore':
                  fixture.away_score = parseInt(value) || null;
                  break;
                case 'season':
                  fixture.season = value;
                  break;
                case 'ticket_link':
                  fixture.ticket_link = value;
                  break;
                case 'source':
                  fixture.source = value;
                  break;
                default:
                  fixture[header] = value;
              }
            });
            
            // Add required fields if missing
            if (fixture.is_completed === undefined) fixture.is_completed = false;
            if (!fixture.time) fixture.time = '15:00';
            
            // Validate required fields
            if (!fixture.date || !fixture.home_team || !fixture.away_team || !fixture.competition) {
              throw new Error(`Missing required field(s) in row ${i+1}`);
            }
            
            fixtures.push(fixture);
          } catch (error) {
            console.error(`Error processing row ${i}:`, error);
            skippedRows++;
            continue;
          }
        }
        
        if (fixtures.length === 0) {
          toast.error('No valid fixtures found in CSV file');
          setIsUploading(false);
          return;
        }
        
        // Upload to Supabase
        const { data, error } = await supabase
          .from('fixtures')
          .insert(fixtures);
          
        if (error) {
          throw error;
        }
        
        toast.success(`Successfully imported ${fixtures.length} fixtures${skippedRows > 0 ? ` (${skippedRows} rows skipped)` : ''}`);
        
        // Refresh data if callback provided
        if (onRefreshData) onRefreshData();
      };
      
      fileReader.readAsText(csvFile);
      
    } catch (error) {
      console.error('Error importing fixtures:', error);
      toast.error('Failed to import fixtures');
    } finally {
      setIsUploading(false);
      setCsvFile(null);
      // Reset the input
      const fileInput = document.getElementById('csvFile') as HTMLInputElement;
      if (fileInput) fileInput.value = '';
    }
  };
  
  // Export fixtures to CSV
  const handleExportCSV = async () => {
    setIsExporting(true);
    
    try {
      let query = supabase.from('fixtures').select('*');
      
      // Apply filters
      if (dateRange?.from) {
        query = query.gte('date', dateRange.from.toISOString().split('T')[0]);
      }
      
      if (dateRange?.to) {
        query = query.lte('date', dateRange.to.toISOString().split('T')[0]);
      }
      
      if (competition !== 'all') {
        query = query.eq('competition', competition);
      }
      
      if (showOnlyCompleted) {
        query = query.eq('is_completed', true);
      }
      
      // Execute query
      const { data, error } = await query.order('date', { ascending: true });
        
      if (error) throw error;
      
      if (!data || data.length === 0) {
        toast.error('No fixtures to export with the current filters');
        return;
      }
      
      // Create CSV string
      const headers = Object.keys(data[0]).join(',');
      const rows = data.map(row => 
        Object.values(row).map(value => 
          typeof value === 'string' ? `"${value.replace(/"/g, '""')}"` : value
        ).join(',')
      );
      
      const csvContent = [headers, ...rows].join('\n');
      
      // Create download link
      const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      const date = new Date().toISOString().split('T')[0];
      const competitionText = competition !== 'all' ? `-${competition}` : '';
      const completedText = showOnlyCompleted ? '-completed-only' : '';
      
      link.setAttribute('href', url);
      link.setAttribute('download', `fixtures-export${competitionText}${completedText}-${date}.csv`);
      link.style.visibility = 'hidden';
      
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      
      toast.success(`Exported ${data.length} fixtures`);
    } catch (error) {
      console.error('Error exporting fixtures:', error);
      toast.error('Failed to export fixtures');
    } finally {
      setIsExporting(false);
    }
  };
  
  // Create a fixture series
  const handleCreateFixtureSeries = async () => {
    if (!seriesCompetition || !seriesTeams) {
      toast.error("Please enter required fields");
      return;
    }
    
    try {
      const teams = seriesTeams.split('\n').filter(Boolean).map(team => team.trim());
      
      if (teams.length < 2) {
        toast.error("At least two teams are required");
        return;
      }
      
      const fixtures: Partial<Fixture>[] = [];
      
      // Generate home and away fixtures for each team pair
      for (let i = 0; i < teams.length; i++) {
        for (let j = 0; j < teams.length; j++) {
          if (i === j) continue; // Skip same team
          
          fixtures.push({
            home_team: teams[i],
            away_team: teams[j],
            competition: seriesCompetition,
            venue: seriesVenue || undefined,
            date: new Date().toISOString().split('T')[0], // Default to today
            time: '15:00',
            is_completed: false
          });
        }
      }
      
      toast.success(`Generated ${fixtures.length} fixtures. Please edit dates and times.`);
      setCreatingFixtureSeries(false);
      
      // Here we would typically open a batch editor UI to let the user edit dates and times
      // For now, we'll just close this dialog and let the user know
      toast.info("Add batch editing functionality to edit dates and times");
      
    } catch (error) {
      console.error('Error creating fixture series:', error);
      toast.error('Failed to create fixture series');
    }
  };
  
  // Bulk update fixtures
  const handleBulkUpdate = async () => {
    setIsUpdating(true);
    
    try {
      let query = supabase.from('fixtures').select('id');
      
      // Apply filters
      if (dateRange?.from) {
        query = query.gte('date', dateRange.from.toISOString().split('T')[0]);
      }
      
      if (dateRange?.to) {
        query = query.lte('date', dateRange.to.toISOString().split('T')[0]);
      }
      
      if (competition !== 'all') {
        query = query.eq('competition', competition);
      }
      
      // Execute query to get IDs
      const { data, error } = await query;
        
      if (error) throw error;
      
      if (!data || data.length === 0) {
        toast.error('No fixtures match the current filters');
        return;
      }
      
      const fixtureIds = data.map(item => item.id);
      
      const updateData: Partial<Fixture> = {};
      
      if (bulkAction === 'set-season') {
        updateData.season = bulkSeason;
      }
      
      if (bulkAction === 'set-competition') {
        updateData.competition = bulkCompetition;
      }
      
      if (bulkAction === 'set-ticket-link') {
        updateData.ticket_link = bulkTicketLink;
      }
      
      if (bulkAction === 'mark-completed') {
        updateData.is_completed = true;
      }
      
      if (bulkAction === 'mark-incomplete') {
        updateData.is_completed = false;
        updateData.home_score = null;
        updateData.away_score = null;
      }
      
      if (bulkAction === 'delete') {
        // Handle delete separately
        if (window.confirm(`Are you sure you want to delete ${fixtureIds.length} fixtures?`)) {
          const { error: deleteError } = await supabase
            .from('fixtures')
            .delete()
            .in('id', fixtureIds);
          
          if (deleteError) throw deleteError;
          
          toast.success(`Successfully deleted ${fixtureIds.length} fixtures`);
          
          // Refresh data if callback provided
          if (onRefreshData) onRefreshData();
        }
        return;
      }
      
      // Update fixtures
      const { error: updateError } = await supabase
        .from('fixtures')
        .update(updateData)
        .in('id', fixtureIds);
      
      if (updateError) throw updateError;
      
      toast.success(`Successfully updated ${fixtureIds.length} fixtures`);
      
      // Refresh data if callback provided
      if (onRefreshData) onRefreshData();
    } catch (error) {
      console.error('Error during bulk operation:', error);
      toast.error('Failed to complete bulk operation');
    } finally {
      setIsUpdating(false);
    }
  };
  
  // Generate template CSV
  const downloadTemplateCSV = () => {
    const headers = ['date', 'time', 'home_team', 'away_team', 'competition', 'venue', 'is_completed', 'home_score', 'away_score', 'season', 'ticket_link', 'source'];
    const sampleRow = ['2024-04-20', '15:00', "Banks o' Dee", 'Opponent FC', 'Highland League', 'Spain Park', 'false', '', '', '2023-2024', '', 'manual'];
    
    const csvContent = [
      headers.join(','),
      sampleRow.join(',')
    ].join('\n');
    
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    
    link.setAttribute('href', url);
    link.setAttribute('download', 'fixtures-template.csv');
    link.style.visibility = 'hidden';
    
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    toast.success('Downloaded CSV template');
  };
  
  return (
    <Card className="p-4 mb-6">
      <h3 className="text-lg font-medium mb-4">Bulk Operations</h3>
      
      <Tabs defaultValue="import">
        <TabsList className="mb-4">
          <TabsTrigger value="import">Import</TabsTrigger>
          <TabsTrigger value="export">Export</TabsTrigger>
          <TabsTrigger value="update">Bulk Update</TabsTrigger>
          <TabsTrigger value="series">Create Series</TabsTrigger>
        </TabsList>
        
        <TabsContent value="import" className="space-y-4">
          <Alert variant="default">
            <AlertTriangle className="h-4 w-4" />
            <AlertTitle>Import CSV</AlertTitle>
            <AlertDescription>
              CSV should have headers matching: date, time, home_team, away_team, competition, venue, etc.
            </AlertDescription>
          </Alert>
          
          <div className="grid gap-4">
            <Button
              variant="outline"
              size="sm"
              onClick={downloadTemplateCSV}
              className="w-full sm:w-auto"
            >
              <FileSpreadsheet className="h-4 w-4 mr-2" />
              Download Template CSV
            </Button>
            
            <div className="grid gap-2">
              <Label htmlFor="csvFile">CSV File</Label>
              <Input 
                id="csvFile" 
                type="file" 
                accept=".csv" 
                onChange={handleFileChange}
              />
            </div>
            
            <Button 
              onClick={handleImportCSV} 
              disabled={!csvFile || isUploading}
              className="w-full"
              variant="default"
            >
              {isUploading ? (
                <>
                  <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                  Importing...
                </>
              ) : (
                <>
                  <FileSpreadsheet className="h-4 w-4 mr-2" />
                  Import Fixtures
                </>
              )}
            </Button>
          </div>
        </TabsContent>
        
        <TabsContent value="export" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <div>
              <Label htmlFor="dateRange">Filter by Date Range</Label>
              <DatePickerWithRange
                date={dateRange}
                onDateChange={setDateRange}
                className="w-full"
              />
            </div>
            
            <div>
              <Label htmlFor="competition">Filter by Competition</Label>
              <Select
                value={competition}
                onValueChange={setCompetition}
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
            
            <div className="flex items-center space-x-2">
              <Checkbox 
                id="showOnlyCompleted" 
                checked={showOnlyCompleted}
                onCheckedChange={() => setShowOnlyCompleted(!showOnlyCompleted)}
              />
              <Label htmlFor="showOnlyCompleted">Only Completed Matches</Label>
            </div>
          </div>
          
          <Button
            onClick={handleExportCSV}
            disabled={isExporting}
            className="w-full"
            variant="default"
          >
            {isExporting ? (
              <>
                <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                Exporting...
              </>
            ) : (
              <>
                <Download className="h-4 w-4 mr-2" />
                Export to CSV
              </>
            )}
          </Button>
        </TabsContent>
        
        <TabsContent value="update" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <div>
              <Label htmlFor="bulkDateRange">Filter by Date Range</Label>
              <DatePickerWithRange
                date={dateRange}
                onDateChange={setDateRange}
                className="w-full"
              />
            </div>
            
            <div>
              <Label htmlFor="bulkCompetition">Filter by Competition</Label>
              <Select
                value={competition}
                onValueChange={setBulkCompetition}
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
              <Label htmlFor="bulkAction">Bulk Action</Label>
              <Select
                value={bulkAction}
                onValueChange={setBulkAction}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select Action" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="set-season">Set Season</SelectItem>
                  <SelectItem value="set-competition">Set Competition</SelectItem>
                  <SelectItem value="set-ticket-link">Set Ticket Link</SelectItem>
                  <SelectItem value="mark-completed">Mark as Completed</SelectItem>
                  <SelectItem value="mark-incomplete">Mark as Incomplete</SelectItem>
                  <SelectItem value="delete">Delete</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            {bulkAction === 'set-season' && (
              <div>
                <Label htmlFor="bulkSeason">Season</Label>
                <Input
                  id="bulkSeason"
                  type="text"
                  value={bulkSeason}
                  onChange={(e) => setBulkSeason(e.target.value)}
                  placeholder="e.g. 2024-2025"
                />
              </div>
            )}
            
            {bulkAction === 'set-competition' && (
              <div>
                <Label htmlFor="bulkCompetition">Competition</Label>
                <Input
                  id="bulkCompetition"
                  type="text"
                  value={bulkCompetition}
                  onChange={(e) => setBulkCompetition(e.target.value)}
                  placeholder="e.g. Highland League"
                />
              </div>
            )}
            
            {bulkAction === 'set-ticket-link' && (
              <div>
                <Label htmlFor="bulkTicketLink">Ticket Link</Label>
                <Input
                  id="bulkTicketLink"
                  type="url"
                  value={bulkTicketLink}
                  onChange={(e) => setBulkTicketLink(e.target.value)}
                  placeholder="e.g. https://example.com/tickets"
                />
              </div>
            )}
          </div>
          
          <Button
            onClick={handleBulkUpdate}
            disabled={isUpdating || !bulkAction}
            className="w-full"
            variant="default"
          >
            {isUpdating ? (
              <>
                <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                Updating...
              </>
            ) : (
              <>
                <Calendar className="h-4 w-4 mr-2" />
                Apply Bulk Update
              </>
            )}
          </Button>
        </TabsContent>
        
        <TabsContent value="series" className="space-y-4">
          <Alert variant="default">
            <FilePlus2 className="h-4 w-4" />
            <AlertTitle>Create Fixture Series</AlertTitle>
            <AlertDescription>
              Quickly generate a series of fixtures for a competition.
            </AlertDescription>
          </Alert>
          
          <Button
            onClick={() => setCreatingFixtureSeries(true)}
            className="w-full"
            variant="default"
          >
            <Calendar className="h-4 w-4 mr-2" />
            Create New Fixture Series
          </Button>
          
          <Dialog open={creatingFixtureSeries} onOpenChange={setCreatingFixtureSeries}>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Create Fixture Series</DialogTitle>
              </DialogHeader>
              
              <div className="space-y-4 py-4">
                <div className="grid gap-2">
                  <Label htmlFor="seriesCompetition">Competition Name</Label>
                  <Input
                    id="seriesCompetition"
                    value={seriesCompetition}
                    onChange={e => setSeriesCompetition(e.target.value)}
                    placeholder="e.g. Highland League"
                  />
                </div>
                
                <div className="grid gap-2">
                  <Label htmlFor="seriesTeams">Teams (one per line)</Label>
                  <textarea
                    id="seriesTeams"
                    value={seriesTeams}
                    onChange={e => setSeriesTeams(e.target.value)}
                    placeholder="Banks o' Dee\nInverurie Locos\nForres Mechanics\nBuckie Thistle"
                    className="min-h-[120px] p-2 border rounded-md"
                  />
                </div>
                
                <div className="grid gap-2">
                  <Label htmlFor="seriesVenue">Default Venue (optional)</Label>
                  <Input
                    id="seriesVenue"
                    value={seriesVenue}
                    onChange={e => setSeriesVenue(e.target.value)}
                    placeholder="e.g. Spain Park"
                  />
                </div>
              </div>
              
              <DialogFooter>
                <Button 
                  variant="outline" 
                  onClick={() => setCreatingFixtureSeries(false)}
                >
                  Cancel
                </Button>
                <Button onClick={handleCreateFixtureSeries}>
                  Generate Fixtures
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </TabsContent>
      </Tabs>
    </Card>
  );
};

export default BulkOperations;
