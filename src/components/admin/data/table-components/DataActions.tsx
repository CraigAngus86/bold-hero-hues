
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
    <div className="flex space-x-3">
      <Button 
        onClick={onExport} 
        variant="outline" 
        size="sm"
        className="flex items-center border-gray-300 hover:bg-gray-100 hover:text-gray-800 transition-colors"
      >
        <Download className="h-4 w-4 mr-1.5" />
        Export Data
      </Button>
      <Button
        onClick={onRefresh}
        variant="default"
        size="sm"
        className="bg-team-blue hover:bg-team-navy flex items-center transition-colors shadow-sm hover:shadow"
      >
        <RefreshCw className="h-4 w-4 mr-1.5" />
        Refresh Data
      </Button>
    </div>
  );
};
