
import React from 'react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Download } from "lucide-react";

interface TableControlsBarProps {
  viewMode: string;
  onViewModeChange: (mode: string) => void;
}

const TableControlsBar: React.FC<TableControlsBarProps> = ({ 
  viewMode, 
  onViewModeChange 
}) => {
  const handleExportData = () => {
    // Implement export functionality
  };
  
  return (
    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 mb-4 pb-2 border-b">
      <div className="flex items-center gap-2">
        <span className="text-sm font-medium text-gray-600">View:</span>
        <Select value={viewMode} onValueChange={onViewModeChange}>
          <SelectTrigger className="w-[160px]">
            <SelectValue placeholder="Select view" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="full">Full Table</SelectItem>
            <SelectItem value="top-half">Top Half</SelectItem>
            <SelectItem value="bottom-half">Bottom Half</SelectItem>
            <SelectItem value="promotion">Promotion Zone</SelectItem>
            <SelectItem value="relegation">Relegation Zone</SelectItem>
          </SelectContent>
        </Select>
      </div>
      
      <Button
        variant="outline"
        size="sm"
        onClick={handleExportData}
        className="flex items-center gap-2"
      >
        <Download className="h-4 w-4" />
        Export Data
      </Button>
    </div>
  );
};

export default TableControlsBar;
