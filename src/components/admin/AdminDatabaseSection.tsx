
import React from 'react';
import DataScraperControl from './DataScraperControl';
import ScrapedDataTable from './data/ScrapedDataTable';
import { Separator } from "@/components/ui/separator";
import { TooltipProvider } from "@/components/ui/tooltip";
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";
import { Database } from "lucide-react";

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
        <Database className="h-4 w-4 text-green-800" />
        <AlertTitle className="text-green-800">Supabase Database Integration</AlertTitle>
        <AlertDescription className="text-green-700">
          Your application is connected to Supabase for data storage. The system automatically:
          <ul className="list-disc list-inside mt-2">
            <li>Scrapes Highland League data from BBC Sport</li>
            <li>Stores the data in your Supabase database</li>
            <li>Displays real-time data in your application</li>
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
