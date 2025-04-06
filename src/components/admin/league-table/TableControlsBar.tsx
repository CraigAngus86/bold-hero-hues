
import React from 'react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Download, Filter, TableProperties, RefreshCw } from "lucide-react";

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
            <SelectItem value="full">
              <div className="flex items-center gap-2">
                <TableProperties size={14} />
                <span>Full Table</span>
              </div>
            </SelectItem>
            <SelectItem value="top-half">
              <div className="flex items-center gap-2">
                <Filter size={14} />
                <span>Top Half</span>
              </div>
            </SelectItem>
            <SelectItem value="bottom-half">
              <div className="flex items-center gap-2">
                <Filter size={14} />
                <span>Bottom Half</span>
              </div>
            </SelectItem>
            <SelectItem value="promotion">
              <div className="flex items-center gap-2">
                <Filter size={14} />
                <span>Promotion Zone</span>
              </div>
            </SelectItem>
            <SelectItem value="relegation">
              <div className="flex items-center gap-2">
                <Filter size={14} />
                <span>Relegation Zone</span>
              </div>
            </SelectItem>
          </SelectContent>
        </Select>
      </div>
      
      <div className="flex gap-2">
        <Button
          variant="outline"
          size="sm"
          className="flex items-center gap-2"
        >
          <RefreshCw className="h-4 w-4" />
          Refresh
        </Button>
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
    </div>
  );
};

export default TableControlsBar;
