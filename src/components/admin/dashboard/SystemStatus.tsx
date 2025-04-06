
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { formatDistanceToNow } from 'date-fns';
import { AlertCircle, CheckCircle, Database, Server } from 'lucide-react';

interface SystemStatusItemProps {
  name: string;
  status: 'online' | 'offline' | 'warning';
  lastChecked: Date;
  metricValue?: string;
  icon?: React.ReactNode;
}

function SystemStatusItem({ name, status, lastChecked, metricValue, icon }: SystemStatusItemProps) {
  return (
    <div className="flex items-center justify-between py-2">
      <div className="flex items-center">
        <div className="mr-3 text-muted-foreground">
          {icon || <Server className="h-4 w-4" />}
        </div>
        <div>
          <p className="text-sm font-medium">{name}</p>
          <p className="text-xs text-muted-foreground">
            Last check: {formatDistanceToNow(lastChecked, { addSuffix: true })}
          </p>
        </div>
      </div>
      <div className="flex items-center gap-2">
        {metricValue && <span className="text-xs text-muted-foreground">{metricValue}</span>}
        <Badge
          variant="outline"
          className={
            status === 'online'
              ? 'border-green-200 text-green-600 bg-green-50'
              : status === 'warning'
              ? 'border-amber-200 text-amber-600 bg-amber-50'
              : 'border-red-200 text-red-600 bg-red-50'
          }
        >
          {status === 'online' ? (
            <CheckCircle className="h-3 w-3 mr-1" />
          ) : status === 'warning' ? (
            <AlertCircle className="h-3 w-3 mr-1" />
          ) : (
            <AlertCircle className="h-3 w-3 mr-1" />
          )}
          {status === 'online' ? 'Online' : status === 'warning' ? 'Warning' : 'Offline'}
        </Badge>
      </div>
    </div>
  );
}

export function SystemStatus() {
  const systems = [
    {
      name: 'Supabase Connection',
      status: 'online' as const,
      lastChecked: new Date(),
      icon: <Database className="h-4 w-4" />,
    },
    {
      name: 'Fixture Scraper',
      status: 'online' as const,
      lastChecked: new Date(Date.now() - 1000 * 60 * 60 * 12), // 12 hours ago
      metricValue: 'Last run: 12 hours ago',
    },
    {
      name: 'Storage Service',
      status: 'warning' as const,
      lastChecked: new Date(),
      metricValue: '78% used',
    },
    {
      name: 'League Table Scraper',
      status: 'online' as const,
      lastChecked: new Date(Date.now() - 1000 * 60 * 60 * 2), // 2 hours ago
      metricValue: 'Last run: 2 hours ago',
    },
  ];

  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="text-sm font-medium">System Health</CardTitle>
        <CardDescription>Current status of connected services</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-1">
          {systems.map((system) => (
            <SystemStatusItem key={system.name} {...system} />
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
