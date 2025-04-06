
import React from 'react';
import { Database, Server, HardDrive, LineChart } from 'lucide-react';
import { EnhancedSystemStatus } from './EnhancedSystemStatus';
import { useSystemStatus } from '@/hooks/useSystemStatus';
import { SystemStatusItemProps } from '@/types/system';

export const StatusItems: React.FC = () => {
  const { status, isLoading, lastUpdated, refresh } = useSystemStatus();
  
  const systemItems: SystemStatusItemProps[] = React.useMemo(() => {
    if (!status) return [];
    
    return [
      {
        name: 'Database',
        status: status.database.status as 'healthy' | 'degraded' | 'error' | 'unknown',
        lastChecked: status.database.lastChecked,
        icon: <Database className="h-5 w-5 text-blue-500" />,
        metricValue: status.database.metricValue,
        tooltip: 'Supabase connection and performance'
      },
      {
        name: 'API Server',
        status: status.api.status as 'healthy' | 'degraded' | 'error' | 'unknown',
        lastChecked: status.api.lastChecked,
        icon: <Server className="h-5 w-5 text-green-500" />,
        metricValue: status.api.metricValue,
        tooltip: 'API response times and availability'
      },
      {
        name: 'Content Delivery',
        status: status.content.status as 'healthy' | 'degraded' | 'error' | 'unknown',
        lastChecked: status.content.lastChecked,
        icon: <LineChart className="h-5 w-5 text-purple-500" />,
        metricValue: status.content.metricValue,
        tooltip: 'Content delivery statistics and performance'
      },
      {
        name: 'Storage',
        status: status.uploads.status as 'healthy' | 'degraded' | 'error' | 'unknown',
        lastChecked: status.uploads.lastChecked,
        icon: <HardDrive className="h-5 w-5 text-amber-500" />,
        metricValue: status.uploads.metricValue,
        tooltip: 'Storage usage and availability'
      }
    ];
  }, [status]);

  return (
    <EnhancedSystemStatus
      systems={systemItems}
      isLoading={isLoading}
      lastUpdated={lastUpdated}
      onRefresh={refresh}
    />
  );
};

export default StatusItems;
