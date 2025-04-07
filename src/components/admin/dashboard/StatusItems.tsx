
import React from 'react';
import { Server, Database, Wifi, HardDrive, Clock, Users, Mail, FileText } from 'lucide-react';
import { SystemStatusType, SystemStatusItemProps } from '@/types/system/status';
import StatusItemCard from './StatusItemCard';

export const getServerStatus = (status: SystemStatusType, uptime: any, lastChecked: any) => {
  return {
    name: "Server",
    status: status,
    value: "Online",
    metricValue: "99.9%",
    icon: Server,
    tooltip: "Application server status",
    lastChecked: lastChecked,
  } as SystemStatusItemProps;
};

export const getDatabaseStatus = (status: SystemStatusType, lastChecked: any) => {
  return {
    name: "Database",
    status: status,
    value: "Connected",
    metricValue: "150ms",
    icon: Database,
    tooltip: "Database connection status",
    lastChecked: lastChecked,
  } as SystemStatusItemProps;
};

export const getApiStatus = (status: SystemStatusType, lastChecked: any) => {
  return {
    name: "API",
    status: status,
    value: status,
    metricValue: "223ms",
    icon: Wifi,
    tooltip: "External API services status",
    lastChecked: lastChecked,
  } as SystemStatusItemProps;
};

export const getStorageStatus = (status: SystemStatusType, lastChecked: any) => {
  return {
    name: "Storage",
    status: status,
    value: "85% free",
    metricValue: "1.2TB",
    icon: HardDrive,
    tooltip: "File storage system status",
    lastChecked: lastChecked,
  } as SystemStatusItemProps;
};

export const getSchedulerStatus = (status: SystemStatusType, lastChecked: any) => {
  return {
    name: "Scheduler",
    status: status,
    icon: Clock,
    value: "Running",
    metricValue: "16 jobs",
    tooltip: "Background job scheduler status",
    color: "#6366f1",
    lastChecked: lastChecked,
  } as SystemStatusItemProps;
};

export const getAuthStatus = (status: SystemStatusType, lastChecked: any) => {
  return {
    name: "Auth",
    status: status,
    icon: Users,
    value: "Active",
    metricValue: "23 sessions",
    tooltip: "Authentication service status",
    color: "#8b5cf6",
    lastChecked: lastChecked,
  } as SystemStatusItemProps;
};

export const getEmailStatus = (status: SystemStatusType, lastChecked: any) => {
  return {
    name: "Email",
    status: status,
    icon: Mail,
    value: "Operational",
    metricValue: "98.7% delivered",
    tooltip: "Email delivery service status",
    color: "#ec4899",
    lastChecked: lastChecked,
  } as SystemStatusItemProps;
};

export const getBackupStatus = (status: SystemStatusType, lastChecked: any) => {
  return {
    name: "Backups",
    status: status,
    icon: FileText,
    metricValue: "Daily @ 1AM",
    value: "Current",
    tooltip: "Database backup status",
    color: "#0ea5e9",
    lastChecked: lastChecked,
  } as SystemStatusItemProps;
};

interface StatusItemsProps {
  items: SystemStatusItemProps[];
}

export const StatusItems: React.FC<StatusItemsProps> = ({ items }) => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {items.map((item, index) => (
        <StatusItemCard 
          key={index}
          name={item.name}
          status={item.status}
          value={item.value}
          metricValue={item.metricValue || ''}
          tooltip={item.tooltip}
          lastChecked={item.lastChecked}
          icon={item.icon}
          color={item.color}
          viewAllLink={item.viewAllLink}
          details={item.details}
        />
      ))}
    </div>
  );
};

export default StatusItems;
