
import React from 'react';
import DataScraperControl from './DataScraperControl';
import ScrapedDataTable from './data/ScrapedDataTable';
import { Separator } from "@/components/ui/separator";
import { TooltipProvider } from "@/components/ui/tooltip";
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";
import { Database, Cloud } from "lucide-react";

const AdminDatabaseSection = () => {
  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-medium">League Data Management</h3>
        <p className="text-sm text-gray-500 mt-1">
          Manage Highland League data and refresh the league table data from BBC Sport
        </p>
      </div>
      
      <Alert className="bg-green-50 border-green-200">
        <Cloud className="h-4 w-4 text-green-800" />
        <AlertTitle className="text-green-800">Supabase Cloud Integration</AlertTitle>
        <AlertDescription className="text-green-700">
          Your application is connected to Supabase for data storage and processing. The system:
          <ul className="list-disc list-inside mt-2">
            <li>Uses Supabase Edge Functions to scrape Highland League data</li>
            <li>Stores the data securely in your Supabase database</li>
            <li>Provides automatic fallbacks if the primary data source is unavailable</li>
          </ul>
        </AlertDescription>
      </Alert>
      
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
