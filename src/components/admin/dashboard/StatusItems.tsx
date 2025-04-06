
import React from 'react';
import { Database, Server, HardDrive, Upload } from 'lucide-react';
import { EnhancedSystemStatus } from './EnhancedSystemStatus';
import { useSystemStatus } from '@/hooks/useSystemStatus';
import { SystemStatusItemProps } from '@/types/system/status';

const StatusItems: React.FC = () => {
  const { status, isLoading, lastUpdated, refresh } = useSystemStatus();
  
  // Transform the status data into the format expected by EnhancedSystemStatus
  const systemItems: SystemStatusItemProps[] = React.useMemo(() => {
    if (!status) return [];
    
    return [
      {
        name: 'Database',
        status: status.database.status,
        lastChecked: status.database.lastChecked,
        metricValue: status.database.metricValue,
        icon: Database,
        tooltip: 'Database response time and connectivity status',
        count: 1,
        color: 'bg-blue-500',
        viewAllLink: '/admin/system'
      },
      {
        name: 'API Services',
        status: status.api.status,
        lastChecked: status.api.lastChecked,
        metricValue: status.api.metricValue,
        icon: Server,
        tooltip: 'External API services response time',
        count: 1,
        color: 'bg-green-500',
        viewAllLink: '/admin/system'
      },
      {
        name: 'Content Engine',
        status: status.content.status,
        lastChecked: status.content.lastChecked,
        metricValue: status.content.metricValue,
        icon: HardDrive,
        tooltip: 'Content management system status',
        count: 1,
        color: 'bg-amber-500',
        viewAllLink: '/admin/system'
      },
      {
        name: 'Storage',
        status: status.uploads.status,
        lastChecked: status.uploads.lastChecked,
        metricValue: status.uploads.metricValue,
        icon: Upload,
        tooltip: 'Media storage capacity and availability',
        count: 1,
        color: 'bg-indigo-500',
        viewAllLink: '/admin/system'
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
