
import React from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import { TooltipProvider } from "@/components/ui/tooltip";
import { Database, Server, Globe } from "lucide-react";
import DataScraperControl from '@/components/admin/DataScraperControl';
import ScrapedDataTable from '@/components/admin/data/ScrapedDataTable';
import ServerMonitor from '@/components/admin/data/ServerMonitor';
import { ApiConfig, DEFAULT_API_CONFIG } from '@/services/config/apiConfig';
import TransfermarktScraper from '@/components/admin/fixtures/TransfermarktScraper';

const DataDashboard = () => {
  // Create a complete ApiConfig object for the ServerMonitor component
  const apiConfig: ApiConfig = {
    ...DEFAULT_API_CONFIG,
    apiServerUrl: localStorage.getItem('apiServerUrl') || 'http://localhost:3001',
    apiKey: localStorage.getItem('apiKey') || ''
  };

  return (
    <div className="space-y-6">
      <Tabs defaultValue="fixtures" className="w-full">
        <TabsList className="mb-4">
          <TabsTrigger value="fixtures" className="flex items-center">
            <Globe className="h-4 w-4 mr-2" />
            Transfermarkt Fixtures
          </TabsTrigger>
          <TabsTrigger value="scrapers" className="flex items-center">
            <Database className="h-4 w-4 mr-2" />
            Data Scrapers
          </TabsTrigger>
          <TabsTrigger value="server" className="flex items-center">
            <Server className="h-4 w-4 mr-2" />
            Server Status
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="fixtures" className="space-y-6">
          <TransfermarktScraper />
        </TabsContent>
        
        <TabsContent value="scrapers" className="space-y-6">
          <TooltipProvider>
            <DataScraperControl />
          </TooltipProvider>
          
          <Separator />
          
          <ScrapedDataTable />
        </TabsContent>
        
        <TabsContent value="server" className="space-y-6">
          <ServerMonitor config={apiConfig} />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default DataDashboard;
