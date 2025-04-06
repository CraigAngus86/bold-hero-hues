
import React from 'react';
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
  Clock
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

const FixturesManagement: React.FC = () => {
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
          <TabsList className="grid grid-cols-2 md:grid-cols-4 gap-2">
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
            <TabsTrigger value="competitions" className="flex items-center gap-2">
              <Settings size={16} />
              Competitions
            </TabsTrigger>
            <TabsTrigger value="venues" className="flex items-center gap-2">
              <Settings size={16} />
              Venues
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="fixtures">
            <FixturesManager />
          </TabsContent>
          
          <TabsContent value="calendar">
            <CalendarView />
          </TabsContent>
          
          <TabsContent value="import-export">
            <FixturesImporter />
          </TabsContent>
          
          <TabsContent value="scraper">
            <FixturesScraper />
          </TabsContent>
          
          <TabsContent value="bulk">
            <BulkOperations />
          </TabsContent>
          
          <TabsContent value="competitions">
            <CompetitionManager />
          </TabsContent>
          
          <TabsContent value="venues">
            <VenueManager />
          </TabsContent>
        </Tabs>
      </div>
    </AdminLayout>
  );
};

export default FixturesManagement;
