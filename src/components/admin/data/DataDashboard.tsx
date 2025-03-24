
import React from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { TooltipProvider } from "@/components/ui/tooltip";
import { Globe, Server, Calendar } from "lucide-react";
import DataScraperControl from '@/components/admin/DataScraperControl';
import ScrapedDataTable from '@/components/admin/data/ScrapedDataTable';
import ServerMonitor from '@/components/admin/data/ServerMonitor';
import { ApiConfig, DEFAULT_API_CONFIG } from '@/services/config/apiConfig';
import FixturesImporter from '@/components/admin/fixtures/FixturesImporter';
import FixturesScraper from '@/components/admin/fixtures/FixturesScraper';

const DataDashboard = () => {
  // Create a complete ApiConfig object for the ServerMonitor component
  const apiConfig: ApiConfig = {
    ...DEFAULT_API_CONFIG,
    apiServerUrl: localStorage.getItem('apiServerUrl') || 'http://localhost:3001',
    apiKey: localStorage.getItem('apiKey') || ''
  };

  return (
    <div className="space-y-6">
      <Tabs defaultValue="highland" className="w-full">
        <TabsList className="mb-4">
          <TabsTrigger value="highland" className="flex items-center">
            <Globe className="h-4 w-4 mr-2" />
            Highland League
          </TabsTrigger>
          <TabsTrigger value="fixtures" className="flex items-center">
            <Calendar className="h-4 w-4 mr-2" />
            Fixtures Management
          </TabsTrigger>
          <TabsTrigger value="server" className="flex items-center">
            <Server className="h-4 w-4 mr-2" />
            Server Status
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="highland" className="space-y-6">
          <TooltipProvider>
            <DataScraperControl />
          </TooltipProvider>
          
          <ScrapedDataTable />
        </TabsContent>
        
        <TabsContent value="fixtures" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <FixturesImporter />
            <FixturesScraper />
          </div>
        </TabsContent>
        
        <TabsContent value="server" className="space-y-6">
          <ServerMonitor config={apiConfig} />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default DataDashboard;
