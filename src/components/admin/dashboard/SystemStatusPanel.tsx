
import React, { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Cpu, HardDrive, Activity, Server, Clock, Users } from 'lucide-react';
import StatusItemCard from './StatusItemCard';
import { SystemStatus, SystemStatusName, SystemMetric, Service } from '@/types/system/status';
import { useSystemStatus } from '@/hooks/useSystemStatus';

const SystemStatusPanel: React.FC = () => {
  const { systemStatus, fetchSystemStatus, loading } = useSystemStatus();
  const [activeTab, setActiveTab] = useState('overview');

  useEffect(() => {
    fetchSystemStatus();
    // Set up polling every 30 seconds
    const intervalId = setInterval(() => {
      fetchSystemStatus();
    }, 30000);

    return () => clearInterval(intervalId);
  }, [fetchSystemStatus]);

  const renderService = (service: Service, icon: React.ReactNode, color: string) => {
    return (
      <StatusItemCard
        key={service.name}
        name={service.name}
        status={service.status}
        value={service.status === 'healthy' ? 'Operational' : 'Issues Detected'}
        metricValue={`${service.uptime.toFixed(2)}% uptime`}
        lastChecked={service.lastChecked}
        icon={icon as React.ComponentType<any>}
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

  if (loading) {
    return (
      <div className="p-8 text-center">
        <div className="animate-spin w-8 h-8 border-4 border-primary border-t-transparent rounded-full mx-auto mb-4"></div>
        <p className="text-gray-500">Loading system status...</p>
      </div>
    );
  }

  if (!systemStatus) {
    return (
      <div className="p-8 text-center">
        <p className="text-gray-500">System status data unavailable</p>
      </div>
    );
  }

  const { metrics, services } = systemStatus;

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatusItemCard
          name="System Status"
          status={systemStatus.overall_status}
          value={
            systemStatus.overall_status === 'healthy' ? 'All Systems Normal' :
            systemStatus.overall_status === 'warning' ? 'Performance Degraded' :
            systemStatus.overall_status === 'critical' ? 'Critical Issues' : 'System Status Unknown'
          }
          metricValue={`${systemStatus.uptime.toFixed(2)}% uptime`}
          lastChecked={systemStatus.last_updated}
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
            renderMetricCards(Object.entries(metrics.performance).map(([key, value]) => ({
              name: key.charAt(0).toUpperCase() + key.slice(1),
              value: typeof value === 'number' ? value : 0,
              unit: key === 'cpu' ? '%' : key === 'memory' ? 'MB' : '',
            })), 'Performance') : 
            <div className="text-center p-4 text-gray-500">No performance metrics available</div>
          }
        </TabsContent>

        <TabsContent value="storage" className="mt-4">
          {metrics && metrics.storage ? 
            renderMetricCards(Object.entries(metrics.storage).map(([key, value]) => ({
              name: key.charAt(0).toUpperCase() + key.slice(1),
              value: typeof value === 'number' ? value : 0,
              unit: 'GB',
            })), 'Storage') : 
            <div className="text-center p-4 text-gray-500">No storage metrics available</div>
          }
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default SystemStatusPanel;
