
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { CheckCircle, AlertCircle, RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useSystemStatus } from '@/hooks/useSystemStatus';
import { Progress } from '@/components/ui/progress';

const StatusIndicator = ({ status }: { status: 'healthy' | 'warning' | 'error' | 'unknown' }) => {
  const getStatusColor = () => {
    switch (status) {
      case 'healthy': return 'text-green-500';
      case 'warning': return 'text-yellow-500';
      case 'error': return 'text-red-500';
      default: return 'text-gray-500';
    }
  };

  const getStatusIcon = () => {
    switch (status) {
      case 'healthy': return <CheckCircle className={`h-5 w-5 ${getStatusColor()}`} />;
      case 'warning':
      case 'error': return <AlertCircle className={`h-5 w-5 ${getStatusColor()}`} />;
      default: return <AlertCircle className={`h-5 w-5 ${getStatusColor()}`} />;
    }
  };

  const getStatusText = () => {
    switch (status) {
      case 'healthy': return 'All Systems Operational';
      case 'warning': return 'Some Issues Detected';
      case 'error': return 'System Error';
      default: return 'Status Unknown';
    }
  };

  return (
    <div className={`flex items-center ${getStatusColor()}`}>
      {getStatusIcon()}
      <span className="ml-2 font-medium">{getStatusText()}</span>
    </div>
  );
};

const SystemStatusPanel = () => {
  const { status, isLoading, error, refreshStatus } = useSystemStatus();
  
  const formatTime = (timeString: string) => {
    try {
      const date = new Date(timeString);
      return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    } catch (e) {
      return 'Unknown';
    }
  };
  
  return (
    <Card>
      <CardHeader className="pb-3 flex flex-row items-center justify-between">
        <CardTitle>System Status</CardTitle>
        <Button variant="ghost" size="sm" onClick={refreshStatus} disabled={isLoading}>
          <RefreshCw className={`h-4 w-4 mr-1 ${isLoading ? 'animate-spin' : ''}`} />
          Refresh
        </Button>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="space-y-4 animate-pulse">
            <div className="h-5 bg-gray-200 rounded w-1/2"></div>
            <div className="space-y-2">
              <div className="h-4 bg-gray-200 rounded"></div>
              <div className="h-3 bg-gray-200 rounded w-3/4"></div>
              <div className="h-3 bg-gray-200 rounded w-1/2"></div>
            </div>
          </div>
        ) : error ? (
          <div className="text-red-500 text-sm bg-red-50 p-3 rounded">
            Error loading system status: {error}
          </div>
        ) : status ? (
          <div className="space-y-4">
            <StatusIndicator status={status.status} />
            
            <div className="text-xs text-gray-500 pb-2">
              Last updated: {formatTime(status.lastUpdated)}
            </div>
            
            <div className="space-y-3">
              <div>
                <div className="flex justify-between text-xs mb-1">
                  <span>CPU</span>
                  <span>{status.metrics.cpu}%</span>
                </div>
                <Progress value={status.metrics.cpu} className="h-1"/>
              </div>
              
              <div>
                <div className="flex justify-between text-xs mb-1">
                  <span>Memory</span>
                  <span>{status.metrics.memory}%</span>
                </div>
                <Progress value={status.metrics.memory} className="h-1"/>
              </div>
              
              <div>
                <div className="flex justify-between text-xs mb-1">
                  <span>Storage</span>
                  <span>{status.metrics.storage}%</span>
                </div>
                <Progress value={status.metrics.storage} className="h-1"/>
              </div>
            </div>
            
            <div className="mt-2 pt-2 border-t text-xs text-gray-700">
              <div className="flex justify-between pb-1">
                <span>Requests (24h)</span>
                <span>{status.metrics.requests}</span>
              </div>
              <div className="flex justify-between">
                <span>Message</span>
                <span>{status.message || 'No issues detected'}</span>
              </div>
            </div>
          </div>
        ) : (
          <div className="text-gray-500 text-sm">No system status available</div>
        )}
      </CardContent>
    </Card>
  );
};

export default SystemStatusPanel;
