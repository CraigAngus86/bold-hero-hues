
import React from 'react';
import { StatusSummary } from './StatusSummary';
import { EnhancedSystemStatus } from './EnhancedSystemStatus';
import { EventsCalendar } from './EventsCalendar';
import { contentStatusItems, mockEvents } from './mockData';
import { Database } from 'lucide-react';
import { toast } from 'sonner';

interface StatusItemsProps {
  systemStatus: {
    supabase: {
      status: 'online' | 'offline' | 'warning' | 'unknown';
      lastChecked: Date;
    };
    fixtures: {
      status: 'online' | 'offline' | 'warning' | 'unknown';
      lastChecked: Date;
      metricValue?: string;
    };
    storage: {
      status: 'online' | 'offline' | 'warning' | 'unknown';
      lastChecked: Date;
      metricValue?: string;
    };
    leagueTable: {
      status: 'online' | 'offline' | 'warning' | 'unknown';
      lastChecked: Date;
      metricValue?: string;
    };
  } | undefined;
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
  const systemStatusItems = systemStatus ? [
    {
      name: 'Supabase Connection',
      status: systemStatus.supabase.status,
      lastChecked: systemStatus.supabase.lastChecked,
      icon: <Database className="h-4 w-4" />,
      tooltip: 'Status of the connection to the Supabase database'
    },
    {
      name: 'Fixture Scraper',
      status: systemStatus.fixtures.status,
      lastChecked: systemStatus.fixtures.lastChecked,
      metricValue: systemStatus.fixtures.metricValue,
      tooltip: 'Status of the BBC fixture scraper service'
    },
    {
      name: 'Storage Service',
      status: systemStatus.storage.status,
      lastChecked: systemStatus.storage.lastChecked,
      metricValue: systemStatus.storage.metricValue,
      tooltip: 'Status of the storage service'
    },
    {
      name: 'League Table Scraper',
      status: systemStatus.leagueTable.status,
      lastChecked: systemStatus.leagueTable.lastChecked,
      metricValue: systemStatus.leagueTable.metricValue,
      tooltip: 'Status of the league table scraper service'
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
          onRefresh={() => refetchSystemStatus()}
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
