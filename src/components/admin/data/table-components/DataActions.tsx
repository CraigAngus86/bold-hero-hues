
import React from 'react';
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Download, RefreshCw } from "lucide-react";

interface DataActionsProps {
  onExport: () => void;
  onRefresh: () => void;
}

/**
 * Component displaying action buttons for the data table
 */
export const DataActions: React.FC<DataActionsProps> = ({ onExport, onRefresh }) => {
  return (
    <div className="flex items-center space-x-2">
      <Badge variant="default">Supabase Data</Badge>
      <Button size="sm" variant="outline" onClick={onExport}>
        <Download className="h-4 w-4 mr-2" />
        Export
      </Button>
      <Button size="sm" onClick={onRefresh}>
        <RefreshCw className="h-4 w-4 mr-2" />
        Refresh
      </Button>
    </div>
  );
};
