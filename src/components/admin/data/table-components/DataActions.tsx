
import React from 'react';
import { Button } from "@/components/ui/button";
import { RefreshCw, Download } from "lucide-react";

interface DataActionsProps {
  onRefresh: () => void;
  onExport: () => void;
}

/**
 * Component with action buttons for data operations
 */
export const DataActions: React.FC<DataActionsProps> = ({ onRefresh, onExport }) => {
  return (
    <div className="flex space-x-2">
      <Button 
        onClick={onExport} 
        variant="outline" 
        size="sm"
        className="flex items-center"
      >
        <Download className="h-4 w-4 mr-1.5" />
        Export
      </Button>
      <Button
        onClick={onRefresh}
        variant="default"
        size="sm"
        className="bg-team-blue hover:bg-team-navy flex items-center"
      >
        <RefreshCw className="h-4 w-4 mr-1.5" />
        Refresh Data
      </Button>
    </div>
  );
};
