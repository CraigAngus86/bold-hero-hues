
import React, { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Cpu, HardDrive, Activity, Server, Clock, Users } from 'lucide-react';
import StatusItemCard from './StatusItemCard';
import { SystemStatus, SystemStatusName, SystemMetric, Service } from '@/types/system/status';

interface SystemStatusPanelProps {
  status?: SystemStatus;
  isLoading?: boolean;
  error?: Error;
  onRefresh?: () => void;
}

const SystemStatusPanel: React.FC<SystemStatusPanelProps> = ({ 
  status, 
  isLoading = false, 
  error, 
  onRefresh 
}) => {
  const [activeTab, setActiveTab] = useState('overview');

  useEffect(() => {
    if (onRefresh) {
      onRefresh();
      // Set up polling every 30 seconds
      const intervalId = setInterval(() => {
        onRefresh();
      }, 30000);

      return () => clearInterval(intervalId);
    }
  }, [onRefresh]);

  const renderService = (service: Service, iconComponent: React.ComponentType<any>, color: string) => {
    return (
      <StatusItemCard
        key={service.name}
        name={service.name}
        status={service.status}
        value={service.status === 'healthy' ? 'Operational' : 'Issues Detected'}
        metricValue={`${service.uptime.toFixed(2)}% uptime`}
        lastChecked={service.lastChecked}
        icon={iconComponent}
        color={color}
      />
    );
  };

  // Helper function to render metric cards
  const renderMetricCards = (metrics: SystemMetric[], title: string) => {
    if (!metrics || !Array.isArray(metrics) || metrics.length === 0) {
      return (
        <div className="text-center p-4 text-gray-500">
          No {title.toLowerCase()} metrics available
        </div>
      );
    }

    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {metrics.map((metric) => (
          <Card key={metric.name} className="p-4">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-sm text-gray-500">{metric.name}</p>
                <div className="flex items-center mt-1">
                  <p className="text-2xl font-bold">
                    {metric.value}
                    {metric.unit && <span className="text-sm ml-1">{metric.unit}</span>}
                  </p>
                </div>
                {metric.description && (
                  <p className="text-xs text-gray-500 mt-1">{metric.description}</p>
                )}
              </div>
              {metric.change !== undefined && (
                <div className={`px-2 py-1 rounded text-xs ${
                  metric.changeType === 'positive' ? 'bg-green-100 text-green-800' :
                  metric.changeType === 'negative' ? 'bg-red-100 text-red-800' :
                  'bg-gray-100 text-gray-800'
                }`}>
                  {metric.change > 0 ? '+' : ''}{metric.change}%
                </div>
              )}
            </div>
          </Card>
        ))}
      </div>
    );
  };

  if (isLoading) {
    return (
      <div className="p-8 text-center">
        <div className="animate-spin w-8 h-8 border-4 border-primary border-t-transparent rounded-full mx-auto mb-4"></div>
        <p className="text-gray-500">Loading system status...</p>
      </div>
    );
  }

  if (!status) {
    return (
      <div className="p-8 text-center">
        <p className="text-gray-500">System status data unavailable</p>
      </div>
    );
  }

  const { metrics, services } = status;

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatusItemCard
          name="System Status"
          status={status.overall_status}
          value={
            status.overall_status === 'healthy' ? 'All Systems Normal' :
            status.overall_status === 'warning' ? 'Performance Degraded' :
            status.overall_status === 'critical' ? 'Critical Issues' : 'System Status Unknown'
          }
          metricValue={`${status.uptime.toFixed(2)}% uptime`}
          lastChecked={status.last_updated}
          icon={Server}
          color="blue"
        />
        
        {services && services.length > 0 && services[0] && 
          renderService(services[0], Cpu, 'green')}
        
        {services && services.length > 1 && services[1] && 
          renderService(services[1], HardDrive, 'amber')}
        
        {services && services.length > 2 && services[2] && 
          renderService(services[2], Activity, 'purple')}
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="performance">Performance</TabsTrigger>
          <TabsTrigger value="storage">Storage</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="mt-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {services && services.map((service, index) => {
              const icons = [Server, Cpu, HardDrive, Activity, Clock, Users];
              const colors = ['blue', 'green', 'amber', 'purple', 'indigo', 'red'];
              const IconComponent = icons[index % icons.length];
              const color = colors[index % colors.length];
              
              return renderService(service, IconComponent, color);
            })}
          </div>
        </TabsContent>

        <TabsContent value="performance" className="mt-4">
          {metrics && metrics.performance ? 
            renderMetricCards(metrics.performance, 'Performance') : 
            <div className="text-center p-4 text-gray-500">No performance metrics available</div>
          }
        </TabsContent>

        <TabsContent value="storage" className="mt-4">
          {metrics && metrics.storage ? 
            renderMetricCards(metrics.storage, 'Storage') : 
            <div className="text-center p-4 text-gray-500">No storage metrics available</div>
          }
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default SystemStatusPanel;
