
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { SystemStatus, SystemStatusType } from '@/types/system/status';
import { Cpu, HardDrive, Server, Shield, Users } from 'lucide-react';
import StatusItemCard from './StatusItemCard';

interface StatusItemsProps {
  status: SystemStatus;
}

const StatusItems = ({ status }: StatusItemsProps) => {
  // Helper function to get a service by name
  const getService = (name: string) => {
    return status.services?.find(s => s.name.toLowerCase().includes(name.toLowerCase()));
  };
  
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      <StatusItemCard
        name="CPU Usage"
        status={status.metrics?.performance?.[0]?.status || "unknown"}
        value={`${status.metrics?.performance?.[0]?.value || "N/A"}%`}
        metricValue={`${status.metrics?.performance?.[0]?.change ? (status.metrics?.performance?.[0]?.change > 0 ? "+" : "") + status.metrics?.performance?.[0]?.change + "%" : ""}`}
        tooltip="Current CPU utilization"
        lastChecked={status.last_updated}
        icon={Cpu}
        color="blue"
      />
      
      <StatusItemCard
        name="Memory Usage"
        status={status.metrics?.performance?.[1]?.status || "unknown"}
        value={`${status.metrics?.performance?.[1]?.value || "N/A"}%`}
        metricValue={`${status.metrics?.performance?.[1]?.change ? (status.metrics?.performance?.[1]?.change > 0 ? "+" : "") + status.metrics?.performance?.[1]?.change + "%" : ""}`}
        tooltip="Current RAM utilization"
        lastChecked={status.last_updated}
        icon={Shield}
        color="amber"
      />
      
      <StatusItemCard
        name="Storage"
        status={status.metrics?.storage?.[0]?.status || "unknown"}
        value={`${status.metrics?.storage?.[0]?.value || "N/A"} ${status.metrics?.storage?.[0]?.unit || "GB"}`}
        metricValue={status.metrics?.storage?.[0]?.change !== undefined ? `${status.metrics?.storage?.[0]?.change > 0 ? "+" : ""}${status.metrics?.storage?.[0]?.change}${status.metrics?.storage?.[0]?.unit || "GB"} change` : ""}
        tooltip="Available storage space"
        lastChecked={status.last_updated}
        icon={HardDrive}
        color="purple"
      />
      
      <StatusItemCard
        name="Database"
        status={getService("database")?.status || status.overall_status || "unknown"}
        value={getService("database")?.status === "healthy" ? "Online" : getService("database")?.status === "warning" ? "Degraded" : "Issue Detected"}
        metricValue={getService("database")?.uptime ? `Uptime: ${Math.floor(getService("database")!.uptime! / 3600)}h ${Math.floor((getService("database")!.uptime! % 3600) / 60)}m` : ""}
        tooltip={getService("database")?.message || "Database connection status"}
        lastChecked={getService("database")?.last_checked || status.last_updated}
        icon={Server}
        color="green"
      />

      <StatusItemCard
        name="API Services"
        status={getService("api")?.status || status.overall_status}
        value={getService("api")?.status === "healthy" ? "All Systems Operational" : getService("api")?.status === "warning" ? "Minor Issues" : "Major Outage"}
        metricValue={getService("api")?.response_time ? `Avg Response: ${getService("api")!.response_time}ms` : ""}
        tooltip={getService("api")?.message || "API services status"}
        lastChecked={getService("api")?.last_checked || status.last_updated}
        icon={Server}
        color="green"
      />

      <StatusItemCard
        name="User Services"
        status={getService("users")?.status || status.overall_status}
        value={getService("users")?.status === "healthy" ? "Operating Normally" : getService("users")?.status === "warning" ? "Degraded" : "Issues Detected"}
        metricValue={status.metrics?.usage?.[0]?.value ? `${status.metrics?.usage?.[0]?.value} active users` : ""}
        tooltip={getService("users")?.message || "User authentication and management services"}
        lastChecked={getService("users")?.last_checked || status.last_updated}
        icon={Users}
        color="blue"
      />

      <StatusItemCard
        name="Content Delivery"
        status={getService("cdn")?.status || status.overall_status}
        value={getService("cdn")?.status === "healthy" ? "Operating Normally" : getService("cdn")?.status === "warning" ? "Degraded" : "Issues Detected"}
        metricValue={getService("cdn")?.response_time ? `Avg Response: ${getService("cdn")!.response_time}ms` : ""}
        tooltip={getService("cdn")?.message || "Content delivery network status"}
        lastChecked={getService("cdn")?.last_checked || status.last_updated}
        icon={Server}
        color="indigo"
      />

      <StatusItemCard
        name="Overall System"
        status={status.overall_status}
        value={status.overall_status === "healthy" ? "All Systems Operational" : status.overall_status === "warning" ? "Partial System Outage" : "Major System Outage"}
        metricValue={status.uptime ? `Uptime: ${Math.floor(status.uptime / (24 * 3600))}d ${Math.floor((status.uptime % (24 * 3600)) / 3600)}h` : ""}
        tooltip={status.messages?.[0] || "Overall system status"}
        lastChecked={status.last_updated}
        icon={Shield}
        color="green"
      />
    </div>
  );
};

export default StatusItems;
