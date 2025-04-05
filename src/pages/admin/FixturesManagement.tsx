
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
  Upload
} from 'lucide-react';
import { FixturesList } from '@/components/admin/fixtures/FixturesList';
import { DateRange } from '@/components/admin/fixtures/DateRange';
import CalendarView from '@/components/admin/fixtures/CalendarView';
import FixturesScraper from '@/components/admin/fixtures/FixturesScraper';
import FixturesImporter from '@/components/admin/fixtures/FixturesImporter';
import ScraperDocumentation from '@/components/admin/fixtures/ScraperDocumentation';
import FixturesManager from '@/components/admin/fixtures/FixturesManager';
import { ScraperLogs } from '@/components/admin/fixtures/ScraperLogs';
import { fetchMatchesFromSupabase } from '@/services/supabase/fixturesService';
import { toast } from 'sonner';
import { convertToMatches } from '@/types/fixtures';
import { Match } from '@/components/fixtures/types';
import { Fixture } from '@/types/fixtures';
import { generateFixturesExport } from '@/services/supabase/fixtures/testUtils';
import { VenueManager } from '@/components/admin/fixtures/VenueManager';
import { CompetitionManager } from '@/components/admin/fixtures/CompetitionManager';

const FixturesManagement = () => {
  const [loading, setLoading] = useState(false);
  const [matches, setMatches] = useState<Match[]>([]);
  const [fixtures, setFixtures] = useState<Fixture[]>([]);
  const [dateFilter, setDateFilter] = useState({ from: undefined, to: undefined });
  const [view, setView] = useState('upcoming');
  
  const handleDateFilterChange = (range) => {
    setDateFilter(range);
    // Here you would typically fetch fixtures based on the date range
  };
  
  const fetchMatches = async () => {
    try {
      setLoading(true);
      const fixturesData = await fetchMatchesFromSupabase();
      const convertedMatches = convertToMatches(fixturesData);
      setMatches(convertedMatches);
      setFixtures(convertedMatches);
      toast.success(`Loaded ${convertedMatches.length} fixtures and results`);
    } catch (error) {
      console.error('Error loading fixtures:', error);
      toast.error('Failed to load fixtures data');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMatches();
  }, []);
  
  return (
    <AdminLayout>
      <div className="p-6 space-y-6">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <h1 className="text-2xl font-semibold">Fixtures Management</h1>
          <div className="flex flex-wrap gap-2">
            <Button 
              onClick={generateFixturesExport}
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
            <Button variant="outline" size="sm">
              <Settings className="h-4 w-4 mr-2" />
              Settings
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
          
          {/* Calendar View Tab */}
          <TabsContent value="calendar" className="mt-4">
            <CalendarView 
              matches={matches}
              onFilterChange={(filters) => console.log('Filter changed:', filters)}
            />
          </TabsContent>
          
          {/* Fixture List Tab */}
          <TabsContent value="list" className="mt-4">
            <Card className="p-4 mb-6">
              <div className="flex flex-col md:flex-row gap-4 items-start md:items-center justify-between">
                <div className="flex items-center gap-2">
                  <Calendar className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm font-medium">Filter by date:</span>
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
                ) : fixtures.length > 0 ? (
                  <FixturesList 
                    fixtures={fixtures.filter(f => !f.isCompleted)} 
                    onEdit={(fixture) => console.log('Editing fixture:', fixture)}
                    onDelete={(fixtureId) => console.log('Deleting fixture:', fixtureId)}
                  />
                ) : (
                  <div className="text-center p-12 border border-dashed rounded-md">
                    <p className="text-gray-500">No upcoming fixtures found.</p>
                    <p className="text-sm text-muted-foreground mt-1">Try adjusting your filters or add new fixtures.</p>
                  </div>
                )}
              </TabsContent>
              
              <TabsContent value="past" className="mt-4">
                {loading ? (
                  <div className="flex justify-center p-8">
                    <RefreshCw className="h-8 w-8 animate-spin text-primary" />
                  </div>
                ) : fixtures.filter(f => f.isCompleted).length > 0 ? (
                  <FixturesList 
                    fixtures={fixtures.filter(f => f.isCompleted)} 
                    onEdit={(fixture) => console.log('Editing fixture:', fixture)}
                    onDelete={(fixtureId) => console.log('Deleting fixture:', fixtureId)}
                  />
                ) : (
                  <div className="text-center p-12 border border-dashed rounded-md">
                    <p className="text-gray-500">No past fixtures found.</p>
                    <p className="text-sm text-muted-foreground mt-1">Try adjusting your filters or add new fixtures.</p>
                  </div>
                )}
              </TabsContent>
              
              <TabsContent value="all" className="mt-4">
                {loading ? (
                  <div className="flex justify-center p-8">
                    <RefreshCw className="h-8 w-8 animate-spin text-primary" />
                  </div>
                ) : fixtures.length > 0 ? (
                  <FixturesList 
                    fixtures={fixtures} 
                    onEdit={(fixture) => console.log('Editing fixture:', fixture)}
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
          
          {/* Import & Scrape Tab */}
          <TabsContent value="import" className="mt-4">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <FixturesScraper />
              <FixturesImporter />
            </div>
            
            <div className="mt-6">
              <ScraperDocumentation />
            </div>
          </TabsContent>
          
          {/* Venues Tab */}
          <TabsContent value="venues" className="mt-4">
            <VenueManager />
          </TabsContent>
          
          {/* Competitions Tab */}
          <TabsContent value="competitions" className="mt-4">
            <CompetitionManager />
          </TabsContent>
          
          {/* Logs Tab */}
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
    </AdminLayout>
  );
};

export default FixturesManagement;
