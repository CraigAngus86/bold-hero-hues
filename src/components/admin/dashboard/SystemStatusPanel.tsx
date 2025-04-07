
import { ServerIcon, Cpu, HardDrive, Activity, Server } from 'lucide-react';
import { SystemStatusPanelProps, SystemMetric } from '@/types/system/status';
import StatusItemCard from './StatusItemCard';
import StatusItems from './StatusItems';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { AlertTriangle, RefreshCw } from 'lucide-react';

const SystemStatusPanel: React.FC<SystemStatusPanelProps> = ({ 
  status, 
  isLoading,
  onRefresh,
  error
}) => {
  const healthyServicesCount = status?.services?.filter(s => s.status === 'healthy')?.length || 0;
  const totalServicesCount = status?.services?.length || 0;

  const formatUptime = (uptime?: number): string => {
    if (!uptime) return 'N/A';
    
    const days = Math.floor(uptime / (24 * 60 * 60));
    const hours = Math.floor((uptime % (24 * 60 * 60)) / (60 * 60));
    const mins = Math.floor((uptime % (60 * 60)) / 60);
    
    if (days > 0) {
      return `${days}d ${hours}h ${mins}m`;
    }
    if (hours > 0) {
      return `${hours}h ${mins}m`;
    }
    return `${mins}m`;
  };

  const formatMetricValue = (value: any): string => {
    if (typeof value === 'number') {
      return value.toLocaleString();
    }
    return String(value);
  };

  const formatPercentage = (value: number): string => {
    return `${value.toFixed(1)}%`;
  };

  const renderMetricChangeIndicator = (metric: SystemMetric) => {
    if (metric.change === undefined || metric.change === 0 || !metric.changeDirection) return null;
    
    return (
      <span className={`ml-1 text-xs ${metric.changeDirection === 'up' ? 'text-green-500' : metric.changeDirection === 'down' ? 'text-red-500' : 'text-gray-500'}`}>
        {metric.changeDirection === 'up' && '↑'}
        {metric.changeDirection === 'down' && '↓'}
        {metric.change > 0 ? `+${metric.change}` : metric.change}
        {metric.unit ? metric.unit : '%'}
      </span>
    );
  };

  const renderPerformanceMetrics = () => {
    if (!status.metrics?.performance || status.metrics.performance.length === 0) {
      return <p className="text-muted-foreground text-sm">No performance metrics available</p>;
    }

    return (
      <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
        {status.metrics.performance.map((metric, index) => (
          <StatusItemCard
            key={`perf-${index}`}
            name={metric.name}
            status={metric.status || 'unknown'}
            value={formatMetricValue(metric.value)}
            metricValue={
              <>
                {formatPercentage(Number(metric.value))}
                {renderMetricChangeIndicator(metric)}
              </>
            }
            tooltip={metric.description}
            lastChecked={status.last_updated}
            icon={Cpu}
            color="blue"
          />
        ))}
      </div>
    );
  };

  const renderStorageMetrics = () => {
    if (!status.metrics?.storage || status.metrics.storage.length === 0) {
      return <p className="text-muted-foreground text-sm">No storage metrics available</p>;
    }

    return (
      <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
        {status.metrics.storage.map((metric, index) => (
          <StatusItemCard
            key={`storage-${index}`}
            name={metric.name}
            status={metric.status || 'unknown'}
            value={formatMetricValue(metric.value)}
            metricValue={
              <>
                {metric.value} {metric.unit || ''}
                {renderMetricChangeIndicator(metric)}
              </>
            }
            tooltip={metric.description}
            lastChecked={status.last_updated}
            icon={HardDrive}
            color="indigo"
          />
        ))}
      </div>
    );
  };

  const renderUsageMetrics = () => {
    if (!status.metrics?.usage || status.metrics.usage.length === 0) {
      return <p className="text-muted-foreground text-sm">No usage metrics available</p>;
    }

    return (
      <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
        {status.metrics.usage.map((metric, index) => (
          <StatusItemCard
            key={`usage-${index}`}
            name={metric.name}
            status={metric.status || 'unknown'}
            value={formatMetricValue(metric.value)}
            metricValue={
              <>
                {metric.value} {metric.unit || ''}
                {renderMetricChangeIndicator(metric)}
              </>
            }
            tooltip={metric.description}
            lastChecked={status.last_updated}
            icon={Activity}
            color="purple"
          />
        ))}
      </div>
    );
  };

  const renderHealthyServices = () => {
    const healthyServices = status.services?.filter(s => s.status === 'healthy') || [];
    
    if (healthyServices.length === 0) {
      return <p className="text-muted-foreground text-sm">No healthy services</p>;
    }

    return (
      <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
        {healthyServices.map((service, index) => (
          <StatusItemCard
            key={`healthy-${index}`}
            name={service.name}
            status={service.status}
            value="Online"
            metricValue={service.uptime ? `Uptime: ${formatUptime(service.uptime)}` : ''}
            tooltip={service.message}
            lastChecked={service.last_checked}
            icon={Server}
            color="green"
          />
        ))}
      </div>
    );
  };

  const renderDegradedServices = () => {
    const degradedServices = status.services?.filter(s => s.status === 'warning') || [];
    
    if (degradedServices.length === 0) {
      return <p className="text-muted-foreground text-sm">No degraded services</p>;
    }

    return (
      <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
        {degradedServices.map((service, index) => (
          <StatusItemCard
            key={`degraded-${index}`}
            name={service.name}
            status={service.status}
            value="Degraded Performance"
            metricValue={service.response_time ? `Response: ${service.response_time}ms` : ''}
            tooltip={service.message}
            lastChecked={service.last_checked}
            icon={Server}
            color="yellow"
          />
        ))}
      </div>
    );
  };

  const renderFailedServices = () => {
    const failedServices = status.services?.filter(s => s.status === 'critical' || s.status === 'unknown') || [];
    const otherServices = status.services?.filter(s => s.status !== 'warning' && s.status !== 'healthy' && s.status !== 'critical' && s.status !== 'unknown') || [];
    
    const allFailedServices = [...failedServices, ...otherServices];
    
    if (allFailedServices.length === 0) {
      return <p className="text-muted-foreground text-sm">No failed services</p>;
    }

    return (
      <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
        {allFailedServices.map((service, index) => (
          <StatusItemCard
            key={`failed-${index}`}
            name={service.name}
            status="critical"
            value="Offline"
            metricValue=""
            tooltip={service.message}
            lastChecked={service.last_checked}
            icon={Server}
            color="red"
          />
        ))}
      </div>
    );
  };

  if (error) {
    return (
      <Alert variant="destructive" className="mb-6">
        <AlertTriangle className="h-4 w-4" />
        <AlertTitle>System Status Error</AlertTitle>
        <AlertDescription>
          <p className="mb-2">Failed to load system status: {error}</p>
          <Button 
            variant="outline" 
            size="sm" 
            className="mt-2"
            onClick={onRefresh}
          >
            <RefreshCw className="mr-2 h-4 w-4" />
            Retry
          </Button>
        </AlertDescription>
      </Alert>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-start">
        <div>
          <h2 className="text-xl font-semibold">System Status</h2>
          <p className="text-gray-500">
            {status.uptime && `System Uptime: ${formatUptime(status.uptime)}`} 
            {status.version && ` | Version: ${status.version}`}
          </p>
        </div>
        <Button 
          variant="outline" 
          size="sm"
          onClick={onRefresh}
          disabled={isLoading}
        >
          <RefreshCw className={`mr-2 h-4 w-4 ${isLoading ? 'animate-spin' : ''}`} />
          {isLoading ? 'Refreshing...' : 'Refresh'}
        </Button>
      </div>

      <StatusItems status={status} />

      <Tabs defaultValue="performance" className="mt-6">
        <TabsList className="mb-4">
          <TabsTrigger value="performance">Performance</TabsTrigger>
          <TabsTrigger value="storage">Storage</TabsTrigger>
          <TabsTrigger value="usage">Usage</TabsTrigger>
        </TabsList>
        <TabsContent value="performance">{renderPerformanceMetrics()}</TabsContent>
        <TabsContent value="storage">{renderStorageMetrics()}</TabsContent>
        <TabsContent value="usage">{renderUsageMetrics()}</TabsContent>
      </Tabs>

      <Tabs defaultValue="healthy" className="mt-6">
        <TabsList className="mb-4">
          <TabsTrigger value="healthy">Healthy Services ({healthyServicesCount})</TabsTrigger>
          <TabsTrigger value="degraded">Degraded Services ({status.services?.filter(s => s.status === 'warning').length || 0})</TabsTrigger>
          <TabsTrigger value="failed">Failed Services ({totalServicesCount - healthyServicesCount - (status.services?.filter(s => s.status === 'warning').length || 0)})</TabsTrigger>
        </TabsList>
        <TabsContent value="healthy">{renderHealthyServices()}</TabsContent>
        <TabsContent value="degraded">{renderDegradedServices()}</TabsContent>
        <TabsContent value="failed">{renderFailedServices()}</TabsContent>
      </Tabs>
    </div>
  );
};

export default SystemStatusPanel;
