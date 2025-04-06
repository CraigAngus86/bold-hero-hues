
import React from 'react';
import { Database, Server, HardDrive, Upload } from 'lucide-react';
import { EnhancedSystemStatus } from './EnhancedSystemStatus';
import { useSystemStatus } from '@/hooks/useSystemStatus';
import { SystemStatusItemProps } from '@/types/system';

const StatusItems: React.FC = () => {
  const { status, isLoading, lastUpdated, refresh } = useSystemStatus();
  
  // Transform the status data into the format expected by EnhancedSystemStatus
  const systemItems: SystemStatusItemProps[] = React.useMemo(() => {
    if (!status) return [];
    
    return [
      {
        name: 'Database',
        status: status.database.status as 'healthy' | 'degraded' | 'error' | 'unknown',
        lastChecked: status.database.lastChecked,
        metricValue: status.database.metricValue,
        icon: Database,
        tooltip: 'Database response time and connectivity status'
      },
      {
        name: 'API Services',
        status: status.api.status as 'healthy' | 'degraded' | 'error' | 'unknown',
        lastChecked: status.api.lastChecked,
        metricValue: status.api.metricValue,
        icon: Server,
        tooltip: 'External API services response time'
      },
      {
        name: 'Content Engine',
        status: status.content.status as 'healthy' | 'degraded' | 'error' | 'unknown',
        lastChecked: status.content.lastChecked,
        metricValue: status.content.metricValue,
        icon: HardDrive,
        tooltip: 'Content management system status'
      },
      {
        name: 'Storage',
        status: status.uploads.status as 'healthy' | 'degraded' | 'error' | 'unknown',
        lastChecked: status.uploads.lastChecked,
        metricValue: status.uploads.metricValue,
        icon: Upload,
        tooltip: 'Media storage capacity and availability'
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
