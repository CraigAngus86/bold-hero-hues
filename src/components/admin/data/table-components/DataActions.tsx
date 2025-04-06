
import React from 'react';
import { Button } from '@/components/ui/button';
import { Download, RefreshCw } from 'lucide-react';

interface DataActionsProps {
  onExport: () => void;
  onRefresh: () => void;
  isRefreshing?: boolean;
}

const DataActions: React.FC<DataActionsProps> = ({ 
  onExport, 
  onRefresh, 
  isRefreshing = false 
}) => {
  return (
    <div className="flex space-x-2">
      <Button
        variant="outline"
        size="sm"
        onClick={onExport}
        className="text-xs"
      >
        <Download className="h-4 w-4 mr-1" />
        Export
      </Button>
      <Button
        variant="outline"
        size="sm"
        onClick={onRefresh}
        disabled={isRefreshing}
        className="text-xs"
      >
        <RefreshCw className={`h-4 w-4 mr-1 ${isRefreshing ? 'animate-spin' : ''}`} />
        Refresh
      </Button>
    </div>
  );
};

export default DataActions;
