import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { SystemStatus } from '@/types/system/status';
import { formatDate } from '@/lib/utils';
import { Usage } from "@/components/ui/usage";

// Mock function to simulate fetching system status
const fetchSystemStatus = async (): Promise<SystemStatus> => {
  // Simulate an API call delay
  await new Promise(resolve => setTimeout(resolve, 1000));

  // Mock data for system status
  return {
    status: 'healthy',
    lastUpdated: new Date().toISOString(),
    isHealthy: true,
    components: [
      { id: 'database', name: 'Database', status: 'healthy', isHealthy: true, lastChecked: new Date().toISOString() },
      { id: 'api', name: 'API Server', status: 'healthy', isHealthy: true, lastChecked: new Date().toISOString() },
      { id: 'cdn', name: 'CDN', status: 'degraded', isHealthy: false, lastChecked: new Date().toISOString() },
    ],
    incidents: [
      { id: 'incident1', title: 'High CPU Usage', description: 'CPU usage exceeded 90%', severity: 'medium', date: new Date().toISOString(), isResolved: false },
    ],
    metrics: {
      cpuUsage: 65,
      memoryUsage: 40,
      diskUsage: 70,
      activeUsers: 1200,
      responseTime: 250,
      uptime: 99.9,
    }
  };
};

// Helper function to format time ago
const formatTimeAgo = (dateString: string): string => {
  const date = new Date(dateString);
  const now = new Date();
  const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);

  if (diffInSeconds < 60) {
    return `${diffInSeconds} seconds ago`;
  } else if (diffInSeconds < 3600) {
    const diffInMinutes = Math.floor(diffInSeconds / 60);
    return `${diffInMinutes} minutes ago`;
  } else if (diffInSeconds < 86400) {
    const diffInHours = Math.floor(diffInSeconds / 3600);
    return `${diffInHours} hours ago`;
  } else {
    return formatDate(dateString);
  }
};

// Helper function to format uptime
const formatUptime = (uptime: number): string => {
  return `${uptime.toFixed(2)}%`;
};

// Helper function to get status color
const getStatusColor = (status: string): string => {
  switch (status) {
    case 'healthy':
      return 'bg-green-500';
    case 'degraded':
      return 'bg-yellow-500';
    case 'error':
      return 'bg-red-500';
    default:
      return 'bg-gray-500';
  }
};

// Helper function to get severity color
const getSeverityColor = (severity: string): string => {
  switch (severity) {
    case 'low':
      return 'bg-green-500';
    case 'medium':
      return 'bg-yellow-500';
    case 'high':
    case 'critical':
      return 'bg-red-500';
    default:
      return 'bg-gray-500';
  }
};

const SystemStatusPanel: React.FC = () => {
  // State
  const [systemStatus, setSystemStatus] = useState<SystemStatus>({
    status: 'unknown',
    lastUpdated: new Date().toISOString(),
    isHealthy: false,
    components: [],
    incidents: [],
    metrics: {
      cpuUsage: 0,
      memoryUsage: 0,
      diskUsage: 0,
      activeUsers: 0,
      responseTime: 0,
      uptime: 0
    }
  });
  const [isLoading, setIsLoading] = useState(false);

  // Effect to fetch system status on mount
  useEffect(() => {
    refreshStatus();
  }, []);

  // Function to refresh system status
  const refreshStatus = async () => {
    setIsLoading(true);
    try {
      const status = await fetchSystemStatus();
      setSystemStatus(status);
    } catch (error) {
      console.error('Error fetching system status:', error);
      setSystemStatus(prevState => ({
        ...prevState,
        status: 'error',
        isHealthy: false
      }));
    } finally {
      setIsLoading(false);
    }
  };

  const renderSystemHealthStatus = () => {
    return (
      <div className="flex items-center space-x-2">
        <div className={`w-3 h-3 rounded-full ${systemStatus.isHealthy ? 'bg-green-500' : 'bg-red-500'}`}></div>
        <span className={systemStatus.isHealthy ? 'text-green-600' : 'text-red-600'}>
          {systemStatus.isHealthy ? 'All systems operational' : 'Issues detected'}
        </span>
      </div>
    );
  };

  return (
    <Card className="overflow-hidden">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle>System Status</CardTitle>
          <Button variant="ghost" size="sm" onClick={refreshStatus} disabled={isLoading}>
            <RefreshCw className={`h-4 w-4 mr-1 ${isLoading ? 'animate-spin' : ''}`} />
            {isLoading ? 'Checking...' : 'Refresh'}
          </Button>
        </div>
        <div className="flex items-center justify-between pt-1">
          {renderSystemHealthStatus()}
          <div className="text-xs text-gray-500">
            Last checked: {formatTimeAgo(systemStatus.lastUpdated)}
          </div>
        </div>
      </CardHeader>
      
      <CardContent className="p-0">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-0">
          {systemStatus.components && systemStatus.components.length > 0 ? (
            systemStatus.components.map((component) => (
              <div
                key={component.id}
                className="border-t border-gray-100 p-3 flex justify-between items-center"
              >
                <div className="flex items-center">
                  <div className={`w-2 h-2 rounded-full mr-2 ${getStatusColor(component.status)}`}></div>
                  <span className="text-sm font-medium">{component.name}</span>
                </div>
                <span className="text-xs text-gray-500">{formatTimeAgo(component.lastChecked)}</span>
              </div>
            ))
          ) : (
            <div className="border-t border-gray-100 p-4 text-center text-gray-500 text-sm">
              No component data available
            </div>
          )}
        </div>

        {/* System Metrics */}
        <div className="border-t border-gray-100 p-4">
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
            <div>
              <div className="text-xs text-gray-500 mb-1">CPU Usage</div>
              <div className="flex items-center space-x-2">
                <div className="text-lg font-semibold">
                  {systemStatus.metrics?.cpuUsage || 0}%
                </div>
                <Usage value={systemStatus.metrics?.cpuUsage || 0} />
              </div>
            </div>
            
            <div>
              <div className="text-xs text-gray-500 mb-1">Memory</div>
              <div className="flex items-center space-x-2">
                <div className="text-lg font-semibold">
                  {systemStatus.metrics?.memoryUsage || 0}%
                </div>
                <Usage value={systemStatus.metrics?.memoryUsage || 0} />
              </div>
            </div>
            
            <div>
              <div className="text-xs text-gray-500 mb-1">Disk Space</div>
              <div className="flex items-center space-x-2">
                <div className="text-lg font-semibold">
                  {systemStatus.metrics?.diskUsage || 0}%
                </div>
                <Usage value={systemStatus.metrics?.diskUsage || 0} />
              </div>
            </div>
          </div>
        </div>
        
        {/* Recent Incidents */}
        {systemStatus.incidents && systemStatus.incidents.length > 0 && (
          <div className="border-t border-gray-100">
            <div className="p-3 bg-gray-50">
              <h4 className="text-sm font-medium">Recent Incidents</h4>
            </div>
            {systemStatus.incidents.map((incident) => (
              <div key={incident.id} className="border-t border-gray-100 p-3">
                <div className="flex items-center mb-1">
                  <div 
                    className={`w-2 h-2 rounded-full mr-2 ${
                      incident.isResolved ? 'bg-green-500' : getSeverityColor(incident.severity)
                    }`}
                  ></div>
                  <span className="text-sm font-medium">{incident.title}</span>
                </div>
                <p className="text-xs text-gray-500 ml-4 mb-1">{incident.description}</p>
                <div className="text-xs text-gray-500 ml-4 flex justify-between">
                  <span>{formatDate(incident.date)}</span>
                  <span>{incident.isResolved ? 'Resolved' : 'Ongoing'}</span>
                </div>
              </div>
            ))}
          </div>
        )}
        
        {/* Quick Stats */}
        <div className="border-t border-gray-100 grid grid-cols-3 gap-0">
          <div className="p-3 text-center border-r border-gray-100">
            <div className="text-2xl font-bold">
              {systemStatus.metrics?.activeUsers || 0}
            </div>
            <div className="text-xs text-gray-500">Active Users</div>
          </div>
          <div className="p-3 text-center border-r border-gray-100">
            <div className="text-2xl font-bold">
              {systemStatus.metrics?.responseTime || 0}ms
            </div>
            <div className="text-xs text-gray-500">Response Time</div>
          </div>
          <div className="p-3 text-center">
            <div className="text-2xl font-bold">
              {formatUptime(systemStatus.metrics?.uptime || 0)}
            </div>
            <div className="text-xs text-gray-500">Uptime</div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default SystemStatusPanel;
