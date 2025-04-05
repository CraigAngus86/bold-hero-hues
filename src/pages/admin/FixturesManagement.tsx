import React, { useState, useEffect } from 'react';
import { AdminLayout } from '@/components/admin/layout';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { 
  Calendar, 
  FileText, 
  Filter, 
  Settings, 
  RefreshCw,
  FileDown, 
  Database, 
  MapPin,
  BarChart,
  Upload,
  Search,
  Plus
} from 'lucide-react';
import { toast } from 'sonner';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { DateRange } from '@/components/admin/fixtures/DateRange';
import { supabase } from '@/integrations/supabase/client';

// Import components
import { FixturesList } from '@/components/admin/fixtures/FixturesList';
import FixturesManager from '@/components/admin/fixtures/FixturesManager';
import FixtureEditor from '@/components/admin/fixtures/FixtureEditor';
import CalendarView from '@/components/admin/fixtures/CalendarView';
import BulkOperations from '@/components/admin/fixtures/BulkOperations';
import { VenueManager } from '@/components/admin/fixtures/VenueManager';
import { CompetitionManager } from '@/components/admin/fixtures/CompetitionManager';
import { ScraperLogs } from '@/components/admin/fixtures/ScraperLogs';
import BBCScraperConfig from '@/components/admin/fixtures/BBCScraperConfig';
import { convertToMatches } from '@/types/fixtures';
import { Match } from '@/components/fixtures/types';
import { exportFixturesToJson } from '@/services/supabase/fixtures/importExport';

const FixturesManagement = () => {
  const [loading, setLoading] = useState(false);
  const [matches, setMatches] = useState<Match[]>([]);
  const [dateFilter, setDateFilter] = useState({ from: undefined, to: undefined });
  const [view, setView] = useState('upcoming');
  const [competitionsList, setCompetitionsList] = useState<string[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [competitionFilter, setCompetitionFilter] = useState('all');
  const [editorOpen, setEditorOpen] = useState(false);
  const [editingFixtureId, setEditingFixtureId] = useState<string | undefined>(undefined);
  
  // Handle date filter change
  const handleDateFilterChange = (range) => {
    setDateFilter(range);
  };
  
  // Apply filters to matches
  const getFilteredMatches = () => {
    return matches.filter(match => {
      // Filter by search query
      const matchSearchTerms = [match.homeTeam, match.awayTeam, match.competition, match.venue].join(' ').toLowerCase();
      const matchesSearch = searchQuery ? matchSearchTerms.includes(searchQuery.toLowerCase()) : true;
      
      // Filter by competition
      const matchesCompetition = competitionFilter === 'all' ? true : match.competition === competitionFilter;
      
      // Filter by date range
      let matchesDate = true;
      if (dateFilter.from && dateFilter.to) {
        const matchDate = new Date(match.date);
        matchesDate = matchDate >= dateFilter.from && matchDate <= dateFilter.to;
      }
      
      // Filter by view type (upcoming/past/all)
      let matchesView = true;
      if (view === 'upcoming') {
        matchesView = !match.isCompleted;
      } else if (view === 'past') {
        matchesView = match.isCompleted;
      }
      
      return matchesSearch && matchesCompetition && matchesDate && matchesView;
    });
  };
  
  // Fetch matches from Supabase
  const fetchMatches = async () => {
    try {
      setLoading(true);
      
      // Fetch all fixtures from Supabase
      const { data: fixturesData, error } = await supabase
        .from('fixtures')
        .select('*')
        .order('date', { ascending: true });
        
      if (error) {
        throw error;
      }
      
      // Convert to our app's Match format
      const convertedMatches = convertToMatches(fixturesData);
      setMatches(convertedMatches);
      
      // Extract unique competitions
      const uniqueCompetitions = [...new Set(convertedMatches.map(match => match.competition))];
      setCompetitionsList(uniqueCompetitions);
      
      toast.success(`Loaded ${convertedMatches.length} fixtures and results`);
    } catch (error) {
      console.error('Error loading fixtures:', error);
      toast.error('Failed to load fixtures data');
    } finally {
      setLoading(false);
    }
  };

  // Export fixtures to JSON
  const handleExportFixtures = async () => {
    try {
      const result = await exportFixturesToJson();
      if (result.success) {
        toast.success('Fixtures exported successfully');
      } else {
        toast.error('Failed to export fixtures');
      }
    } catch (error) {
      console.error('Error exporting fixtures:', error);
      toast.error('Failed to export fixtures');
    }
  };

  // Open fixture editor
  const handleOpenEditor = (fixtureId?: string) => {
    setEditingFixtureId(fixtureId);
    setEditorOpen(true);
  };

  // Close fixture editor and refresh data
  const handleEditorSave = () => {
    setEditorOpen(false);
    fetchMatches();
  };

  useEffect(() => {
    fetchMatches();
  }, []);
  
  const filteredMatches = getFilteredMatches();
  
  return (
    <AdminLayout>
      <div className="p-6 space-y-6">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <h1 className="text-2xl font-semibold">Fixtures Management</h1>
          <div className="flex flex-wrap gap-2">
            <Button 
              onClick={handleExportFixtures}
              variant="outline" 
              size="sm"
            >
              <FileDown className="h-4 w-4 mr-2" />
              Export All
            </Button>
            <Button 
              onClick={fetchMatches} 
              variant="outline" 
              size="sm" 
              disabled={loading}
            >
              <RefreshCw className={`h-4 w-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
              Refresh Data
            </Button>
            <Button 
              onClick={() => handleOpenEditor()} 
              variant="default" 
              size="sm"
            >
              <Plus className="h-4 w-4 mr-2" />
              New Fixture
            </Button>
          </div>
        </div>
        
        <Tabs defaultValue="calendar" className="w-full">
          <TabsList className="mb-4 flex flex-wrap">
            <TabsTrigger value="calendar">
              <Calendar className="h-4 w-4 mr-2" />
              Calendar
            </TabsTrigger>
            <TabsTrigger value="list">
              <FileText className="h-4 w-4 mr-2" />
              Fixture List
            </TabsTrigger>
            <TabsTrigger value="ticket-links">
              <FileText className="h-4 w-4 mr-2" />
              Ticket Links
            </TabsTrigger>
            <TabsTrigger value="import">
              <Upload className="h-4 w-4 mr-2" />
              Import & Scrape
            </TabsTrigger>
            <TabsTrigger value="venues">
              <MapPin className="h-4 w-4 mr-2" />
              Venues
            </TabsTrigger>
            <TabsTrigger value="competitions">
              <BarChart className="h-4 w-4 mr-2" />
              Competitions
            </TabsTrigger>
            <TabsTrigger value="logs">
              <Database className="h-4 w-4 mr-2" />
              Scraper Logs
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="calendar" className="mt-4">
            <CalendarView 
              matches={matches}
              isLoading={loading}
              onFilterChange={(filters) => console.log('Filter changed:', filters)}
            />
          </TabsContent>
          
          <TabsContent value="list" className="mt-4">
            <Card className="p-4 mb-6">
              <div className="flex flex-col md:flex-row gap-4 items-start md:items-center justify-between">
                <div className="flex flex-col md:flex-row gap-2 w-full">
                  <div className="relative w-full md:w-64">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      placeholder="Search fixtures..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="pl-10"
                    />
                  </div>
                  
                  <Select
                    value={competitionFilter}
                    onValueChange={setCompetitionFilter}
                  >
                    <SelectTrigger className="w-full md:w-48">
                      <SelectValue placeholder="Filter by competition" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Competitions</SelectItem>
                      {competitionsList.map(comp => (
                        <SelectItem key={comp} value={comp}>{comp}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-2 w-full md:w-auto">
                  <DateRange 
                    onChange={handleDateFilterChange}
                    value={dateFilter}
                    className="w-full"
                  />
                  
                  <Button variant="default" disabled={loading} className="w-full md:w-auto">
                    <Filter className="h-4 w-4 mr-2" />
                    Apply Filter
                  </Button>
                </div>
              </div>
            </Card>
            
            <Tabs defaultValue="upcoming" className="w-full">
              <TabsList>
                <TabsTrigger value="upcoming" onClick={() => setView('upcoming')}>Upcoming</TabsTrigger>
                <TabsTrigger value="past" onClick={() => setView('past')}>Past</TabsTrigger>
                <TabsTrigger value="all" onClick={() => setView('all')}>All Fixtures</TabsTrigger>
              </TabsList>
              
              <TabsContent value="upcoming" className="mt-4">
                {loading ? (
                  <div className="flex justify-center p-8">
                    <RefreshCw className="h-8 w-8 animate-spin text-primary" />
                  </div>
                ) : filteredMatches.length > 0 ? (
                  <FixturesList 
                    fixtures={filteredMatches} 
                    onEdit={(fixture) => handleOpenEditor(fixture.id)}
                    onDelete={(fixtureId) => console.log('Deleting fixture:', fixtureId)}
                  />
                ) : (
                  <div className="text-center p-12 border border-dashed rounded-md">
                    <p className="text-gray-500">No fixtures found.</p>
                    <p className="text-sm text-muted-foreground mt-1">Try adjusting your filters or add new fixtures.</p>
                  </div>
                )}
              </TabsContent>
              
              <TabsContent value="past" className="mt-4">
                {loading ? (
                  <div className="flex justify-center p-8">
                    <RefreshCw className="h-8 w-8 animate-spin text-primary" />
                  </div>
                ) : filteredMatches.length > 0 ? (
                  <FixturesList 
                    fixtures={filteredMatches} 
                    onEdit={(fixture) => handleOpenEditor(fixture.id)}
                    onDelete={(fixtureId) => console.log('Deleting fixture:', fixtureId)}
                  />
                ) : (
                  <div className="text-center p-12 border border-dashed rounded-md">
                    <p className="text-gray-500">No fixtures found.</p>
                    <p className="text-sm text-muted-foreground mt-1">Try adjusting your filters or add new fixtures.</p>
                  </div>
                )}
              </TabsContent>
              
              <TabsContent value="all" className="mt-4">
                {loading ? (
                  <div className="flex justify-center p-8">
                    <RefreshCw className="h-8 w-8 animate-spin text-primary" />
                  </div>
                ) : filteredMatches.length > 0 ? (
                  <FixturesList 
                    fixtures={filteredMatches} 
                    onEdit={(fixture) => handleOpenEditor(fixture.id)}
                    onDelete={(fixtureId) => console.log('Deleting fixture:', fixtureId)}
                  />
                ) : (
                  <div className="text-center p-12 border border-dashed rounded-md">
                    <p className="text-gray-500">No fixtures found.</p>
                    <p className="text-sm text-muted-foreground mt-1">Try adjusting your filters or add new fixtures.</p>
                  </div>
                )}
              </TabsContent>
            </Tabs>
          </TabsContent>
          
          <TabsContent value="ticket-links" className="mt-4">
            <FixturesManager />
          </TabsContent>
          
          <TabsContent value="import" className="mt-4">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <BulkOperations />
              <BBCScraperConfig />
            </div>
          </TabsContent>
          
          <TabsContent value="venues" className="mt-4">
            <VenueManager />
          </TabsContent>
          
          <TabsContent value="competitions" className="mt-4">
            <CompetitionManager />
          </TabsContent>
          
          <TabsContent value="logs" className="mt-4">
            <Card>
              <CardHeader>
                <CardTitle>Scraper Activity Logs</CardTitle>
              </CardHeader>
              <CardContent>
                <ScraperLogs />
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
      
      {/* Fixture Editor Dialog */}
      <Dialog open={editorOpen} onOpenChange={setEditorOpen}>
        <DialogContent className="sm:max-w-[800px] max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{editingFixtureId ? 'Edit Fixture' : 'Add New Fixture'}</DialogTitle>
          </DialogHeader>
          <FixtureEditor 
            fixtureId={editingFixtureId} 
            onSave={handleEditorSave}
            onCancel={() => setEditorOpen(false)}
          />
        </DialogContent>
      </Dialog>
    </AdminLayout>
  );
};

export default FixturesManagement;
