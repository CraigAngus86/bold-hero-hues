
import React from 'react';
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import {
  CheckCircle,
  AlertCircle,
  AlertTriangle,
  RotateCw,
  Server,
  Database,
  HardDrive,
  Mail,
  CreditCard,
} from "lucide-react";
import { SystemStatus, Service, SystemStatusName } from "@/types/system/status";

interface SystemStatusPanelProps {
  status?: SystemStatus;
  isLoading?: boolean;
  onRefresh?: () => Promise<void>;
  error?: Error;
}

const SystemStatusPanel: React.FC<SystemStatusPanelProps> = ({ 
  status, 
  isLoading = false, 
  onRefresh, 
  error 
}) => {
  const getStatusIcon = (statusType: SystemStatusName) => {
    switch(statusType) {
      case 'healthy':
        return <CheckCircle className="h-6 w-6 text-green-500" />;
      case 'warning':
      case 'degraded':
        return <AlertTriangle className="h-6 w-6 text-amber-500" />;
      case 'error':
      case 'critical':
        return <AlertCircle className="h-6 w-6 text-red-500" />;
      case 'unknown':
      default:
        return <CheckCircle className="h-6 w-6 text-gray-500" />;
    }
  };

  const getServiceIcon = (serviceName: string) => {
    switch(serviceName.toLowerCase()) {
      case 'web server':
        return <Server className="h-5 w-5 text-gray-500" />;
      case 'database':
        return <Database className="h-5 w-5 text-gray-500" />;
      case 'storage service':
        return <HardDrive className="h-5 w-5 text-gray-500" />;
      case 'email service':
        return <Mail className="h-5 w-5 text-gray-500" />;
      case 'payment gateway':
        return <CreditCard className="h-5 w-5 text-gray-500" />;
      default:
        return <Server className="h-5 w-5 text-gray-500" />;
    }
  };
  
  // If no status is provided, show loading or error state
  if (!status) {
    if (error) {
      return (
        <div className="flex flex-col items-center justify-center h-40 bg-red-50 rounded-lg border border-red-200 p-4">
          <AlertCircle className="h-12 w-12 text-red-500 mb-2" />
          <h3 className="text-red-700 font-medium text-lg">Error Loading System Status</h3>
          <p className="text-red-600 text-sm mt-1 mb-3">{error.message}</p>
          {onRefresh && (
            <Button variant="outline" size="sm" onClick={onRefresh} disabled={isLoading}>
              <RotateCw className="h-4 w-4 mr-2" />
              Try Again
            </Button>
          )}
        </div>
      );
    }
    
    if (isLoading) {
      return (
        <div className="flex flex-col items-center justify-center h-40">
          <div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full mb-3"></div>
          <p className="text-muted-foreground">Loading system status...</p>
        </div>
      );
    }
    
    return null;
  }
  
  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          {getStatusIcon(status.overall_status)}
          <div>
            <h3 className="text-xl font-semibold">{status.message || "System Status"}</h3>
            <p className="text-muted-foreground text-sm">{status.uptime}% uptime</p>
          </div>
        </div>
        <Badge variant={status.overall_status === 'healthy' ? "outline" : "secondary"} className="px-3 py-0.5">
          {status.overall_status === 'healthy' ? 'Operational' : status.overall_status}
        </Badge>
      </div>
      
      <div className="grid gap-4 md:grid-cols-3 mb-6">
        {/* Performance Metrics */}
        <Card>
          <CardContent className="pt-6">
            <h4 className="text-sm font-medium mb-2 text-muted-foreground">Performance</h4>
            <dl className="space-y-2">
              {status.metrics.performance.map((metric) => (
                <div key={metric.name} className="flex justify-between items-center">
                  <dt className="text-sm">{metric.name}</dt>
                  <dd className="font-medium">{metric.value} {metric.unit}</dd>
                </div>
              ))}
            </dl>
          </CardContent>
        </Card>
        
        {/* Storage Metrics */}
        <Card>
          <CardContent className="pt-6">
            <h4 className="text-sm font-medium mb-2 text-muted-foreground">Storage</h4>
            <dl className="space-y-2">
              {status.metrics.storage.map((metric) => (
                <div key={metric.name} className="flex justify-between items-center">
                  <dt className="text-sm">{metric.name}</dt>
                  <dd className="font-medium">{metric.value} {metric.unit}</dd>
                </div>
              ))}
            </dl>
          </CardContent>
        </Card>
        
        {/* Usage Metrics */}
        <Card>
          <CardContent className="pt-6">
            <h4 className="text-sm font-medium mb-2 text-muted-foreground">Usage</h4>
            <dl className="space-y-2">
              {status.metrics.usage.map((metric) => (
                <div key={metric.name} className="flex justify-between items-center">
                  <dt className="text-sm">{metric.name}</dt>
                  <dd className="font-medium">{metric.value} {metric.unit}</dd>
                </div>
              ))}
            </dl>
          </CardContent>
        </Card>
      </div>
      
      {/* Services List */}
      <div className="space-y-3 mb-6">
        <h4 className="font-medium mb-2">Services</h4>
        
        {status.services.map((service: Service) => (
          <div key={service.name} className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
            <div className="flex items-center gap-3">
              {getServiceIcon(service.name)}
              <div>
                <div className="font-medium">{service.name}</div>
                <div className="text-sm text-muted-foreground">{service.message}</div>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="text-right">
                <div className="text-sm">{service.uptime}% uptime</div>
                <div className="text-xs text-muted-foreground">
                  Last checked: {new Date(service.lastChecked).toLocaleTimeString()}
                </div>
              </div>
              {getStatusIcon(service.status)}
            </div>
          </div>
        ))}
      </div>
      
      <CardFooter className="border-t pt-4 flex justify-between px-0">
        <div className="text-sm text-muted-foreground">
          Last updated: {new Date(status.last_updated).toLocaleTimeString()}
        </div>
        {onRefresh && (
          <Button variant="outline" size="sm" onClick={onRefresh} disabled={isLoading}>
            <RotateCw className={`h-3 w-3 mr-1 ${isLoading ? 'animate-spin' : ''}`} />
            Refresh
          </Button>
        )}
      </CardFooter>
    </div>
  );
};

export default SystemStatusPanel;
