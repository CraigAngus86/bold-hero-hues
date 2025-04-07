
import React from 'react';
import { ArrowUp, ArrowDown, MinusIcon, ServerCrash, Database, Activity, Cpu, HardDrive, Users } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { SystemStatus } from '@/types/system/status';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';

const formatUptime = (uptime: number): string => {
  const days = Math.floor(uptime / (24 * 3600));
  const hours = Math.floor((uptime % (24 * 3600)) / 3600);
  const minutes = Math.floor((uptime % 3600) / 60);
  
  if (days > 0) {
    return `${days}d ${hours}h ${minutes}m`;
  } else if (hours > 0) {
    return `${hours}h ${minutes}m`;
  } else {
    return `${minutes}m`;
  }
};

const formatNumber = (value: number | string): string => {
  if (typeof value === 'string') return value;
  return new Intl.NumberFormat('en-US', { 
    maximumFractionDigits: 1 
  }).format(value);
};

const getStatusColor = (status: string): string => {
  switch (status) {
    case 'healthy':
    case 'online':
      return 'bg-green-500';
    case 'warning':
    case 'degraded':
      return 'bg-yellow-500';
    case 'error':
    case 'offline':
      return 'bg-red-500';
    case 'maintenance':
      return 'bg-blue-500';
    default:
      return 'bg-gray-500';
  }
};

const getValueChangeIcon = (direction?: 'up' | 'down' | 'neutral') => {
  switch (direction) {
    case 'up':
      return <ArrowUp className="h-4 w-4 text-green-500" />;
    case 'down':
      return <ArrowDown className="h-4 w-4 text-red-500" />;
    default:
      return <MinusIcon className="h-4 w-4 text-gray-500" />;
  }
};

const getValueChangeColor = (direction?: 'up' | 'down' | 'neutral') => {
  switch (direction) {
    case 'up':
      return 'text-green-500';
    case 'down':
      return 'text-red-500';
    default:
      return 'text-gray-500';
  }
};

interface SystemStatusPanelProps {
  status: SystemStatus | null;
  isLoading: boolean;
  onRefresh?: () => void;
}

const SystemStatusPanel: React.FC<SystemStatusPanelProps> = ({ status, isLoading }) => {
  if (isLoading || !status) {
    return <div>Loading system status...</div>;
  }
  
  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <div className="flex items-center">
          <div className={`w-3 h-3 rounded-full ${getStatusColor(status.status)} mr-2`}></div>
          <h2 className="text-lg font-medium">
            System Status: <span className="capitalize">{status.status}</span>
          </h2>
        </div>
        <Badge variant="outline">v{status.version}</Badge>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Memory Usage */}
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-base flex items-center">
              <HardDrive className="h-4 w-4 mr-2" />
              {status.metrics.memory.name}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-baseline justify-between">
              <div className="text-2xl font-bold">
                {formatNumber(status.metrics.memory.value)}
                <span className="ml-1 text-sm font-medium text-muted-foreground">{status.metrics.memory.unit}</span>
              </div>
              <div className={`flex items-center ${getValueChangeColor(status.metrics.memory.changeDirection)}`}>
                {getValueChangeIcon(status.metrics.memory.changeDirection)}
                <span className="ml-1 text-sm">{status.metrics.memory.change}%</span>
              </div>
            </div>
            <Progress value={Number(status.metrics.memory.value)} className="mt-2" />
          </CardContent>
        </Card>
        
        {/* CPU Usage */}
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-base flex items-center">
              <Cpu className="h-4 w-4 mr-2" />
              {status.metrics.cpu.name}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-baseline justify-between">
              <div className="text-2xl font-bold">
                {formatNumber(status.metrics.cpu.value)}
                <span className="ml-1 text-sm font-medium text-muted-foreground">{status.metrics.cpu.unit}</span>
              </div>
              <div className={`flex items-center ${getValueChangeColor(status.metrics.cpu.changeDirection)}`}>
                {getValueChangeIcon(status.metrics.cpu.changeDirection)}
                <span className="ml-1 text-sm">{status.metrics.cpu.change}%</span>
              </div>
            </div>
            <Progress value={Number(status.metrics.cpu.value)} className="mt-2" />
          </CardContent>
        </Card>
        
        {/* Storage */}
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-base flex items-center">
              <Database className="h-4 w-4 mr-2" />
              {status.metrics.storage.name}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-baseline justify-between">
              <div className="text-2xl font-bold">
                {formatNumber(status.metrics.storage.value)}
                <span className="ml-1 text-sm font-medium text-muted-foreground">{status.metrics.storage.unit}</span>
              </div>
              <div className={`flex items-center ${getValueChangeColor(status.metrics.storage.changeDirection)}`}>
                {getValueChangeIcon(status.metrics.storage.changeDirection)}
                <span className="ml-1 text-sm">{status.metrics.storage.change}%</span>
              </div>
            </div>
            <Progress value={Number(status.metrics.storage.value)} className="mt-2" />
          </CardContent>
        </Card>
        
        {/* Active Users */}
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-base flex items-center">
              <Users className="h-4 w-4 mr-2" />
              Active Users
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-baseline justify-between">
              <div className="text-2xl font-bold">{formatNumber(status.metrics.activeUsers.value)}</div>
              <div className={`flex items-center ${getValueChangeColor(status.metrics.activeUsers.changeDirection)}`}>
                {getValueChangeIcon(status.metrics.activeUsers.changeDirection)}
                <span className="ml-1 text-sm">{status.metrics.activeUsers.change}%</span>
              </div>
            </div>
            <div className="text-sm text-muted-foreground mt-1">
              {status.metrics.requests !== undefined ? 
                `${formatNumber(status.metrics.requests)} requests / minute` : 
                'No request data available'}
            </div>
          </CardContent>
        </Card>
      </div>
      
      {status.message && (
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-base">System Message</CardTitle>
          </CardHeader>
          <CardContent>
            <p>{status.message}</p>
          </CardContent>
        </Card>
      )}
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Database Service */}
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-base flex items-center">
              <Database className="h-4 w-4 mr-2" />
              Database
            </CardTitle>
            <CardDescription className="flex items-center">
              <div className={`w-2 h-2 rounded-full ${getStatusColor(status.services.database.status)} mr-2`}></div>
              <span className="capitalize">{status.services.database.status}</span>
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-sm text-muted-foreground">
              Latency: {status.services.database.latency}ms
            </div>
          </CardContent>
        </Card>
        
        {/* API Service */}
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-base flex items-center">
              <Activity className="h-4 w-4 mr-2" />
              API Service
            </CardTitle>
            <CardDescription className="flex items-center">
              <div className={`w-2 h-2 rounded-full ${getStatusColor(status.services.api.status)} mr-2`}></div>
              <span className="capitalize">{status.services.api.status}</span>
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-sm text-muted-foreground">
              Latency: {status.services.api.latency}ms
            </div>
            <div className="text-sm text-muted-foreground">
              {status.services.api.requestsPerMinute} req/min
            </div>
          </CardContent>
        </Card>
        
        {/* Storage Service */}
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-base flex items-center">
              <HardDrive className="h-4 w-4 mr-2" />
              Storage Service
            </CardTitle>
            <CardDescription className="flex items-center">
              <div className={`w-2 h-2 rounded-full ${getStatusColor(status.services.storage.status)} mr-2`}></div>
              <span className="capitalize">{status.services.storage.status}</span>
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-sm text-muted-foreground">
              {formatNumber(status.services.storage.availableSpace)} GB free of {formatNumber(status.services.storage.totalSize)} GB
            </div>
          </CardContent>
        </Card>
      </div>
      
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-base">System Information</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <div>
              <div className="text-sm font-medium">Uptime</div>
              <div className="text-muted-foreground">{formatUptime(status.uptime)}</div>
            </div>
            <div>
              <div className="text-sm font-medium">Last Updated</div>
              <div className="text-muted-foreground">{new Date(status.lastUpdated).toLocaleString()}</div>
            </div>
            <div>
              <div className="text-sm font-medium">Version</div>
              <div className="text-muted-foreground">{status.version}</div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default SystemStatusPanel;
