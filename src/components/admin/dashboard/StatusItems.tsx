
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Clock, Database, HardDrive, Users, Server, AlertTriangle, CheckCircle, XCircle, Activity } from "lucide-react";
import { SystemStatus, SystemStatusName } from '@/types/system/status';
import { formatDistanceToNow } from 'date-fns';

export interface StatusItemCardProps {
  title: string;
  value: string | number;
  status?: SystemStatusName;
  icon?: React.ReactNode;
  color?: string;
  change?: number;
  changeType?: 'positive' | 'negative' | 'neutral';
  lastUpdated?: Date | string;
}

export const StatusItemCard = ({ 
  title, 
  value, 
  status = 'healthy', 
  icon, 
  color = 'green-500', 
  change, 
  changeType = 'neutral',
  lastUpdated
}: StatusItemCardProps) => {
  return (
    <Card>
      <CardContent className="p-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-muted-foreground mb-1">{title}</p>
            <div className="flex items-center">
              <span className="text-2xl font-bold">{value}</span>
              {change !== undefined && (
                <span className={`ml-2 text-sm font-medium ${
                  changeType === 'positive' ? 'text-green-500' : 
                  changeType === 'negative' ? 'text-red-500' : 'text-gray-500'
                }`}>
                  {change > 0 ? `+${change}%` : `${change}%`}
                </span>
              )}
            </div>
            {lastUpdated && (
              <p className="text-xs text-muted-foreground mt-1">
                Updated {typeof lastUpdated === 'string' ? lastUpdated : formatDistanceToNow(lastUpdated, { addSuffix: true })}
              </p>
            )}
          </div>
          <div className={`p-2 rounded-full bg-${status === 'healthy' ? 'green' : status === 'warning' ? 'amber' : 'red'}-100`}>
            {icon}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export const SystemStatusItems = ({ status }: { status: SystemStatus }) => {
  if (!status) return null;

  // Helper function to determine icon based on status
  const getStatusIcon = (status: SystemStatusName) => {
    switch (status) {
      case 'healthy':
        return <CheckCircle className="h-5 w-5 text-green-500" />;
      case 'warning':
        return <AlertTriangle className="h-5 w-5 text-yellow-500" />;
      case 'error':
      case 'offline':
        return <XCircle className="h-5 w-5 text-red-500" />;
      default:
        return <Activity className="h-5 w-5 text-blue-500" />;
    }
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      {/* API Status */}
      <StatusItemCard 
        title="API Server"
        value={status.services?.api?.status || 'Unknown'}
        status={status.services?.api?.status || 'warning'}
        icon={<Server className="h-5 w-5 text-blue-500" />}
        lastUpdated={status.services?.api?.lastChecked || new Date()}
      />
      
      {/* Database Status */}
      <StatusItemCard 
        title="Database"
        value={status.services?.database?.status || 'Unknown'}
        status={status.services?.database?.status || 'warning'}
        icon={<Database className="h-5 w-5 text-indigo-500" />}
        lastUpdated={status.services?.database?.lastChecked || new Date()}
      />
      
      {/* Storage Status */}
      <StatusItemCard 
        title="Storage"
        value={status.services?.storage?.status || 'Unknown'}
        status={status.services?.storage?.status || 'warning'}
        icon={<HardDrive className="h-5 w-5 text-purple-500" />}
        lastUpdated={status.services?.storage?.lastChecked || new Date()}
      />
      
      {/* Auth Status */}
      <StatusItemCard 
        title="Authentication"
        value={status.services?.auth?.status || 'Unknown'}
        status={status.services?.auth?.status || 'warning'}
        icon={<Users className="h-5 w-5 text-emerald-500" />}
        lastUpdated={status.services?.auth?.lastChecked || new Date()}
      />
      
      {/* Response Time */}
      <StatusItemCard 
        title="Response Time"
        value={`${status.metrics?.responseTime || 0}ms`}
        status={status.overall_status || 'warning'}
        icon={<Clock className="h-5 w-5 text-orange-500" />}
        lastUpdated={new Date()}
      />
    </div>
  );
};
