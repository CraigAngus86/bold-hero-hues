import React from 'react';
import { 
  Database, HardDrive, Lock, Server, Users, FileText, Calendar, 
  Activity, Award, MessageSquare, Image, Clock 
} from 'lucide-react';
import StatusItem from './StatusItem';
import { SystemStatusItemProps } from '@/types/system/status';
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
      Icon: Database,
      tooltip: 'Database connection status and response time'
    },
    {
      name: 'Storage',
      status: status?.components?.storage?.status || 'unknown',
      metricValue: status?.components?.storage?.usedSpace 
        ? `${Math.round(status.components.storage.usedSpace / 1024 / 1024)}MB` 
        : undefined,
      Icon: HardDrive,
      tooltip: 'File storage status and used space'
    },
    {
      name: 'Auth',
      status: status?.components?.auth?.status || 'unknown',
      metricValue: status?.components?.auth?.activeUsers?.toString(),
      Icon: Lock,
      tooltip: 'Authentication service status'
    },
    {
      name: 'API',
      status: status?.components?.api?.status || 'unknown',
      metricValue: status?.components?.api?.responseTime 
        ? `${status.components.api.responseTime}ms` 
        : undefined,
      Icon: Server,
      tooltip: 'API service status and response time'
    }
  ];

  // Other system metrics
  const metricItems: SystemStatusItemProps[] = [
    {
      name: 'Active Users',
      status: 'active',
      Icon: Users,
      metricValue: status?.metrics?.dailyActiveUsers?.toString() || '0',
      tooltip: 'Daily active users',
      color: 'bg-blue-50',
      viewAllLink: '/admin/users'
    },
    {
      name: 'Fixtures',
      status: 'info',
      Icon: Calendar,
      metricValue: status?.metrics?.fixturesCount?.toString() || '0',
      tooltip: 'Total fixtures in system',
      color: 'bg-green-50',
      viewAllLink: '/admin/fixtures'
    },
    {
      name: 'News',
      status: 'info',
      Icon: FileText,
      metricValue: status?.metrics?.newsCount?.toString() || '0',
      tooltip: 'Total news articles',
      color: 'bg-purple-50',
      viewAllLink: '/admin/news'
    },
    {
      name: 'System Uptime',
      status: 'info',
      Icon: Clock,
      metricValue: status?.uptime ? `${Math.floor(status.uptime / 3600)}h` : undefined,
      tooltip: 'System uptime in hours',
      color: 'bg-amber-50'
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
