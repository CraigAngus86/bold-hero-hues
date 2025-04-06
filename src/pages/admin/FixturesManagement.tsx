
import React, { useState, useEffect } from 'react';
import { AdminLayout } from '@/components/admin/layout';
import { Helmet } from 'react-helmet-async';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  CalendarDays, 
  CalendarIcon, 
  Settings, 
  Upload, 
  Download,
  List, 
  FileSpreadsheet,
  Clock,
  ImageIcon,
  FileText,
  Search
} from 'lucide-react';
import { 
  FixturesManager, 
  FixturesImporter, 
  BulkOperations, 
  FixturesScraper, 
  CompetitionManager,
  VenueManager, 
  CalendarView 
} from '@/components/admin/fixtures';
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Fixture } from '@/types';
import { toast } from 'sonner';
import { DateRange } from 'react-day-picker';
import { adaptFixtureToMatch } from '@/adapters/fixtureAdapter';

const FixturesManagement: React.FC = () => {
  const [fixtures, setFixtures] = useState<Fixture[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [dateRange, setDateRange] = useState<DateRange | undefined>(undefined);
  
  useEffect(() => {
    fetchFixtures();
  }, []);
  
  const fetchFixtures = async () => {
    setIsLoading(true);
    try {
      // Build the query
      let query = supabase
        .from('fixtures')
        .select('*');
      
      // Apply date range filters if set
      if (dateRange?.from) {
        query = query.gte('date', dateRange.from.toISOString().split('T')[0]);
      }
      
      if (dateRange?.to) {
        query = query.lte('date', dateRange.to.toISOString().split('T')[0]);
      }
      
      // Execute the query
      const { data, error } = await query.order('date', { ascending: true });
      
      if (error) throw error;
      
      // Convert DB format to our app format
      const fixturesWithFormattedData = data.map(fixture => ({
        ...fixture,
        home_team: fixture.homeTeam || fixture.home_team,
        away_team: fixture.awayTeam || fixture.away_team,
        ticket_link: fixture.ticketLink || fixture.ticket_link,
      })) as Fixture[];
      
      // Create matches for calendar using the adapter
      const matchesForCalendar = fixturesWithFormattedData.map(adaptFixtureToMatch);
      
      setFixtures(fixturesWithFormattedData);
    } catch (error) {
      console.error('Error fetching fixtures:', error);
      toast.error('Failed to load fixtures data');
    } finally {
      setIsLoading(false);
    }
  };
  
  const handleDateRangeChange = (newRange: DateRange | undefined) => {
    setDateRange(newRange);
    fetchFixtures(); // Refetch with new date range
  };
  
  return (
    <AdminLayout>
      <div className="container mx-auto px-4 py-6">
        <Helmet>
          <title>Fixtures Management - Banks o' Dee FC Admin</title>
        </Helmet>
        
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-team-blue">Fixtures Management</h1>
          <p className="text-gray-600 mt-2">
            Manage all fixtures, results, and competitions for the club.
          </p>
        </div>
        
        <Tabs defaultValue="fixtures" className="space-y-4">
          <TabsList className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-2">
            <TabsTrigger value="fixtures" className="flex items-center gap-2">
              <List size={16} />
              Fixtures List
            </TabsTrigger>
            <TabsTrigger value="calendar" className="flex items-center gap-2">  
              <CalendarDays size={16} />
              Calendar View
            </TabsTrigger>
            <TabsTrigger value="import-export" className="flex items-center gap-2">
              <FileSpreadsheet size={16} />
              Import/Export
            </TabsTrigger>
            <TabsTrigger value="scraper" className="flex items-center gap-2">
              <Clock size={16} />
              Auto-Update
            </TabsTrigger>
            <TabsTrigger value="bulk" className="flex items-center gap-2">
              <CalendarIcon size={16} />
              Bulk Edit
            </TabsTrigger>
            <TabsTrigger value="media" className="flex items-center gap-2">
              <ImageIcon size={16} />
              Match Media
            </TabsTrigger>
            <TabsTrigger value="competitions" className="flex items-center gap-2">
              <Settings size={16} />
              Settings
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="fixtures">
            <FixturesManager />
          </TabsContent>
          
          <TabsContent value="calendar">
            <CalendarView 
              matches={fixtures.map(adaptFixtureToMatch)} 
              isLoading={isLoading}
              onFilterChange={handleDateRangeChange}
            />
          </TabsContent>
          
          <TabsContent value="import-export">
            <FixturesImporter />
          </TabsContent>
          
          <TabsContent value="scraper">
            <FixturesScraper />
          </TabsContent>
          
          <TabsContent value="bulk">
            <BulkOperations onRefreshData={fetchFixtures} />
          </TabsContent>
          
          <TabsContent value="media">
            <div className="p-6 bg-white rounded-lg border">
              <div className="flex items-center justify-center flex-col h-64">
                <ImageIcon className="h-16 w-16 text-gray-300 mb-4" />
                <h3 className="text-xl font-bold mb-2">Match Media Management</h3>
                <p className="text-gray-500 mb-4 text-center max-w-md">
                  Upload and manage photos, videos, and media related to matches.
                  Link media to specific fixtures for easy organization.
                </p>
                <p className="text-blue-500 text-sm">Coming soon</p>
              </div>
            </div>
          </TabsContent>
          
          <TabsContent value="competitions">
            <Tabs defaultValue="competitions" className="space-y-4">
              <TabsList className="mb-4">
                <TabsTrigger value="competitions">Competitions</TabsTrigger>
                <TabsTrigger value="venues">Venues</TabsTrigger>
              </TabsList>
              
              <TabsContent value="competitions">
                <CompetitionManager />
              </TabsContent>
              
              <TabsContent value="venues">
                <VenueManager />
              </TabsContent>
            </Tabs>
          </TabsContent>
        </Tabs>
      </div>
    </AdminLayout>
  );
};

export default FixturesManagement;
