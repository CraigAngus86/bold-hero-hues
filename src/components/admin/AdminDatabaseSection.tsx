
import React from 'react';
import { useApiConfig } from './data/useApiConfig';
import DataScraperControl from './DataScraperControl';
import ScrapedDataTable from './data/ScrapedDataTable';
import ServerMonitor from './data/ServerMonitor';
import { Separator } from "@/components/ui/separator";
import { TooltipProvider } from "@/components/ui/tooltip";
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";
import { Terminal, Info, Database } from "lucide-react";

const AdminDatabaseSection = () => {
  const { config } = useApiConfig();

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-medium">League Data Management</h3>
        <p className="text-sm text-gray-500 mt-1">
          Manage Highland League data settings and refresh the league table data
        </p>
      </div>
      
      <Alert className="bg-green-50 border-green-200">
        <Database className="h-4 w-4 text-green-800" />
        <AlertTitle className="text-green-800">Supabase Integration Active</AlertTitle>
        <AlertDescription className="text-green-700">
          Your application is now connected to Supabase for data storage. The system can automatically:
          <ul className="list-disc list-inside mt-2">
            <li>Scrape Highland League data from BBC Sport</li>
            <li>Store the data in your Supabase database</li>
            <li>Display real-time data in your application</li>
          </ul>
        </AlertDescription>
      </Alert>
      
      <Alert className="bg-amber-50 border-amber-200">
        <Info className="h-4 w-4 text-amber-800" />
        <AlertTitle className="text-amber-800">About Highland League Data</AlertTitle>
        <AlertDescription className="text-amber-700">
          This application can display Highland League data in three ways:
          <ul className="list-disc list-inside mt-2">
            <li>From Supabase (real-time data scraped from BBC Sport)</li>
            <li>From a custom API server (legacy method)</li>
            <li>Mock data (built-in, always available as fallback)</li>
          </ul>
        </AlertDescription>
      </Alert>
      
      <Separator />
      
      <TooltipProvider>
        <ServerMonitor config={config} />
      </TooltipProvider>
      
      <Separator />
      
      <TooltipProvider>
        <DataScraperControl />
      </TooltipProvider>
      
      <Separator />
      
      <ScrapedDataTable />
    </div>
  );
};

export default AdminDatabaseSection;
