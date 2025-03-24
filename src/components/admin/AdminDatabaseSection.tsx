
import React from 'react';
import DataScraperControl from './DataScraperControl';
import ScrapedDataTable from './data/ScrapedDataTable';
import { Separator } from "@/components/ui/separator";
import { TooltipProvider } from "@/components/ui/tooltip";
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";
import { Terminal } from "lucide-react";

const AdminDatabaseSection = () => {
  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-medium">League Data Management</h3>
        <p className="text-sm text-gray-500 mt-1">
          Manage Highland League data settings and refresh the league table data
        </p>
      </div>
      
      <Alert>
        <Terminal className="h-4 w-4" />
        <AlertTitle>Server Required for Live Data</AlertTitle>
        <AlertDescription>
          To use live data instead of mock data, you need to run the included Node.js server.
          Navigate to the server directory, run 'npm install' followed by 'npm start'.
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
