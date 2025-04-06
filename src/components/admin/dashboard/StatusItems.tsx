
import React from 'react';
import { StatusSummary } from './StatusSummary';
import { EnhancedSystemStatus } from './EnhancedSystemStatus';
import { EventsCalendar } from './EventsCalendar';
import { contentStatusItems, mockEvents } from './mockData';
import { Database } from 'lucide-react';
import { toast } from 'sonner';
import { SystemStatusData, SystemStatusItemProps } from '@/types/system';

interface StatusItemsProps {
  systemStatus: SystemStatusData | undefined;
  isSystemStatusLoading: boolean;
  systemStatusUpdatedAt: number;
  refetchSystemStatus: () => void;
}

export const StatusItems: React.FC<StatusItemsProps> = ({
  systemStatus,
  isSystemStatusLoading,
  systemStatusUpdatedAt,
  refetchSystemStatus
}) => {
  // Convert system status data to the format expected by EnhancedSystemStatus
  const systemStatusItems: SystemStatusItemProps[] = systemStatus ? [
    {
      name: 'Database Connection',
      status: systemStatus.database.status,
      lastChecked: systemStatus.database.lastChecked,
      icon: <Database className="h-4 w-4" />,
      tooltip: 'Status of the connection to the database'
    },
    {
      name: 'API Services',
      status: systemStatus.api.status,
      lastChecked: systemStatus.api.lastChecked,
      metricValue: systemStatus.api.metricValue,
      tooltip: 'Status of the API services'
    },
    {
      name: 'Content Service',
      status: systemStatus.content.status,
      lastChecked: systemStatus.content.lastChecked,
      metricValue: systemStatus.content.metricValue,
      tooltip: 'Status of the content service'
    },
    {
      name: 'Upload Storage',
      status: systemStatus.uploads.status,
      lastChecked: systemStatus.uploads.lastChecked,
      metricValue: systemStatus.uploads.metricValue,
      tooltip: 'Status of the upload storage service'
    }
  ] : [];

  const handleCalendarRefresh = () => {
    toast.info('Calendar refreshed');
  };

  return (
    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 mt-6">
      <div className="lg:col-span-1">
        <StatusSummary 
          items={contentStatusItems} 
          title="Content Status" 
          viewAllLink="/admin/settings"
        />
      </div>
      
      <div className="lg:col-span-1">
        <EnhancedSystemStatus 
          systems={systemStatusItems} 
          isLoading={isSystemStatusLoading}
          lastUpdated={isSystemStatusLoading ? null : new Date(systemStatusUpdatedAt)}
          onRefresh={refetchSystemStatus}
        />
      </div>
      
      <div className="lg:col-span-1">
        <EventsCalendar 
          events={mockEvents}
          onRefresh={handleCalendarRefresh}
        />
      </div>
    </div>
  );
};

export default StatusItems;
