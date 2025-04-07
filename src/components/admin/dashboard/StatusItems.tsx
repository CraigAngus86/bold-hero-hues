import React from 'react';
import { 
  Database, HardDrive, Lock, Server, Users, FileText, Calendar, 
  Activity, Award, MessageSquare, Image, Clock 
} from 'lucide-react';
import StatusItem from './StatusItem';
import { SystemStatusItemProps, SystemStatusType } from '@/types/system/status';
import { formatTimeAgo } from '@/utils/date';

interface StatusItemsProps {
  status: any;
}

const StatusItems: React.FC<StatusItemsProps> = ({ status }) => {
  // Primary system status items
  const systemItems: SystemStatusItemProps[] = [
    {
      name: 'Database',
      status: status?.components?.database?.status || 'unknown',
      metricValue: status?.components?.database?.responseTime 
        ? `${status.components.database.responseTime}ms` 
        : undefined,
      icon: Database,
      tooltip: 'Database connection status and response time',
      lastChecked: status?.components?.database?.lastChecked
    },
    {
      name: 'Storage',
      status: status?.components?.storage?.status || 'unknown',
      metricValue: status?.components?.storage?.usedSpace 
        ? `${Math.round(status.components.storage.usedSpace / 1024 / 1024)}MB` 
        : undefined,
      icon: HardDrive,
      tooltip: 'File storage status and used space',
      lastChecked: status?.components?.storage?.lastChecked
    },
    {
      name: 'Auth',
      status: status?.components?.auth?.status || 'unknown',
      metricValue: status?.components?.auth?.activeUsers?.toString(),
      icon: Lock,
      tooltip: 'Authentication service status',
      lastChecked: status?.components?.auth?.lastChecked
    },
    {
      name: 'API',
      status: status?.components?.api?.status || 'unknown',
      metricValue: status?.components?.api?.responseTime 
        ? `${status.components.api.responseTime}ms` 
        : undefined,
      icon: Server,
      tooltip: 'API service status and response time',
      lastChecked: status?.components?.api?.lastChecked
    }
  ];

  // Other system metrics
  const metricItems: SystemStatusItemProps[] = [
    {
      name: 'Active Users',
      status: 'healthy' as SystemStatusType,
      icon: Users,
      metricValue: status?.metrics?.dailyActiveUsers?.toString() || '0',
      tooltip: 'Daily active users',
      color: 'bg-blue-50',
      viewAllLink: '/admin/users',
      lastChecked: status?.lastUpdated
    },
    {
      name: 'Fixtures',
      status: 'healthy' as SystemStatusType,
      icon: Calendar,
      metricValue: status?.metrics?.fixturesCount?.toString() || '0',
      tooltip: 'Total fixtures in system',
      color: 'bg-green-50',
      viewAllLink: '/admin/fixtures',
      lastChecked: status?.lastUpdated
    },
    {
      name: 'News',
      status: 'healthy' as SystemStatusType,
      icon: FileText,
      metricValue: status?.metrics?.newsCount?.toString() || '0',
      tooltip: 'Total news articles',
      color: 'bg-purple-50',
      viewAllLink: '/admin/news',
      lastChecked: status?.lastUpdated
    },
    {
      name: 'System Uptime',
      status: 'healthy' as SystemStatusType,
      icon: Clock,
      metricValue: status?.uptime ? `${Math.floor(status.uptime / 3600)}h` : undefined,
      tooltip: 'System uptime in hours',
      color: 'bg-amber-50',
      lastChecked: status?.lastUpdated
    }
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
      {systemItems.map((item) => (
        <StatusItem key={item.name} {...item} />
      ))}
      
      {metricItems.map((item) => (
        <StatusItem key={item.name} {...item} />
      ))}
    </div>
  );
};

export default StatusItems;
