
import React from 'react';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { AlertTriangle, CheckCircle, Server, Activity, Clock, Users } from 'lucide-react';
import { Progress } from '@/components/ui/progress';
import { Button } from '@/components/ui/button';
import { SystemStatus } from '@/types/system';

interface SystemStatusPanelProps {
  data: SystemStatus;
  isLoading: boolean;
  onRefresh: () => void;
}

const SystemStatusPanel = ({ data, isLoading, onRefresh }: SystemStatusPanelProps) => {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-xl font-bold">System Status</CardTitle>
        <div className="flex items-center space-x-2">
          {data.isHealthy ? (
            <span className="flex items-center text-green-500 text-sm">
              <CheckCircle className="h-4 w-4 mr-1" />
              All Systems Operational
            </span>
          ) : (
            <span className="flex items-center text-amber-500 text-sm">
              <AlertTriangle className="h-4 w-4 mr-1" />
              Degraded Performance
            </span>
          )}
        </div>
      </CardHeader>
      <CardContent className="pb-2">
        <div className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <div>
              <h3 className="text-sm font-medium mb-2">Component Status</h3>
              <div className="space-y-2">
                {data.components.map((component) => (
                  <div key={component.id} className="flex items-center justify-between">
                    <div className="flex items-center">
                      <Server className="h-4 w-4 text-gray-500 mr-2" />
                      <span className="text-sm">{component.name}</span>
                    </div>
                    <div>
                      {component.isHealthy ? (
                        <span className="px-2 py-1 bg-green-100 text-green-800 text-xs rounded-full">
                          Operational
                        </span>
                      ) : (
                        <span className="px-2 py-1 bg-amber-100 text-amber-800 text-xs rounded-full">
                          {component.status}
                        </span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
            <div>
              <h3 className="text-sm font-medium mb-2">System Resource Usage</h3>
              <div className="space-y-3">
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-xs">CPU Usage</span>
                    <span className="text-xs font-medium">{data.metrics.cpuUsage}%</span>
                  </div>
                  <Progress value={data.metrics.cpuUsage} className="h-2" />
                </div>
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-xs">Memory Usage</span>
                    <span className="text-xs font-medium">{data.metrics.memoryUsage}%</span>
                  </div>
                  <Progress value={data.metrics.memoryUsage} className="h-2" />
                </div>
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-xs">Disk Usage</span>
                    <span className="text-xs font-medium">{data.metrics.diskUsage}%</span>
                  </div>
                  <Progress value={data.metrics.diskUsage} className="h-2" />
                </div>
              </div>
            </div>
          </div>

          {data.incidents.length > 0 && (
            <div>
              <h3 className="text-sm font-medium mb-2">Active Incidents</h3>
              <div className="space-y-2">
                {data.incidents.map((incident) => (
                  <div key={incident.id} className="bg-amber-50 border border-amber-200 rounded-md p-3">
                    <div className="flex items-start">
                      <AlertTriangle className="h-5 w-5 text-amber-500 mr-2 mt-0.5" />
                      <div>
                        <h4 className="font-medium text-amber-800">{incident.title}</h4>
                        <p className="text-sm text-amber-700 mt-1">{incident.description}</p>
                        <div className="flex items-center mt-2">
                          <span className="text-xs text-amber-600 bg-amber-100 px-2 py-0.5 rounded">
                            {incident.severity.toUpperCase()}
                          </span>
                          <span className="text-xs text-amber-600 ml-2">
                            {new Date(incident.date).toLocaleDateString()}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
            <div className="bg-gray-50 p-3 rounded-md">
              <div className="flex items-center text-gray-500 mb-1">
                <Users className="h-4 w-4 mr-1" />
                <span className="text-xs">Active Users</span>
              </div>
              <div className="text-2xl font-bold">{data.metrics.activeUsers}</div>
            </div>
            <div className="bg-gray-50 p-3 rounded-md">
              <div className="flex items-center text-gray-500 mb-1">
                <Activity className="h-4 w-4 mr-1" />
                <span className="text-xs">Response Time</span>
              </div>
              <div className="text-2xl font-bold">{data.metrics.responseTime}<span className="text-xs ml-1">ms</span></div>
            </div>
            <div className="bg-gray-50 p-3 rounded-md">
              <div className="flex items-center text-gray-500 mb-1">
                <Clock className="h-4 w-4 mr-1" />
                <span className="text-xs">Uptime</span>
              </div>
              <div className="text-2xl font-bold">{data.metrics.uptime.toFixed(2)}<span className="text-xs ml-1">%</span></div>
            </div>
          </div>
        </div>
      </CardContent>
      <CardFooter className="pt-2">
        <div className="flex items-center justify-between w-full text-xs text-gray-500">
          <span>Last updated: {new Date(data.lastUpdated).toLocaleString()}</span>
          <Button variant="ghost" size="sm" onClick={onRefresh} disabled={isLoading}>
            Refresh
          </Button>
        </div>
      </CardFooter>
    </Card>
  );
};

export default SystemStatusPanel;
