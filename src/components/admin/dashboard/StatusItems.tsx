
import React from 'react';
import { Check, AlertTriangle, AlertCircle, Clock } from 'lucide-react';
import { SystemStatusName } from '@/types/system/status';
import { Badge } from '@/components/ui/badge';
import { formatDistanceToNow } from 'date-fns';

interface StatusItemProps {
  name: string;
  status: SystemStatusName;
  value?: string;
  lastChecked: Date | string;
}

export const StatusItems = ({ name, status, value = 'Unknown', lastChecked }: StatusItemProps) => {
  // Status configuration mapping
  const statusConfig = {
    healthy: { icon: <Check className="h-4 w-4" />, color: 'text-green-500 bg-green-50', label: 'Healthy' },
    warning: { icon: <AlertTriangle className="h-4 w-4" />, color: 'text-amber-500 bg-amber-50', label: 'Warning' },
    error: { icon: <AlertCircle className="h-4 w-4" />, color: 'text-red-500 bg-red-50', label: 'Error' },
    offline: { icon: <AlertCircle className="h-4 w-4" />, color: 'text-gray-500 bg-gray-50', label: 'Offline' },
    maintenance: { icon: <Clock className="h-4 w-4" />, color: 'text-blue-500 bg-blue-50', label: 'Maintenance' }
  };

  const config = statusConfig[status];

  const formatLastChecked = () => {
    try {
      const date = typeof lastChecked === 'string' ? new Date(lastChecked) : lastChecked;
      return formatDistanceToNow(date, { addSuffix: true });
    } catch (e) {
      return 'Unknown';
    }
  };

  return (
    <div className="flex items-center justify-between p-2 hover:bg-gray-50 rounded transition-colors">
      <div className="flex items-center space-x-3">
        <div className={`p-1.5 rounded-full ${config.color}`}>{config.icon}</div>
        <div>
          <div className="font-medium">{name}</div>
          <div className="text-xs text-gray-500">Last checked: {formatLastChecked()}</div>
        </div>
      </div>
      <div className="flex items-center">
        {value && <div className="mr-3 text-sm">{value}</div>}
        <Badge variant={status === 'healthy' ? 'outline' : 'secondary'} className={config.color}>
          {config.label}
        </Badge>
      </div>
    </div>
  );
};

export default StatusItems;
