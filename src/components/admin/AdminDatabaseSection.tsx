
import React from 'react';
import DataScraperControl from './DataScraperControl';
import { Separator } from "@/components/ui/separator";

const AdminDatabaseSection = () => {
  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-medium">League Data Management</h3>
        <p className="text-sm text-gray-500 mt-1">
          Manage Highland League data settings and refresh the league table data
        </p>
      </div>
      
      <Separator />
      
      <DataScraperControl />
    </div>
  );
};

export default AdminDatabaseSection;
