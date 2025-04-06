
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Server, Database, Shield, AlertCircle, CheckCircle } from 'lucide-react';
import { useSystemStatus } from '@/hooks/useSystemStatus';

export const EnhancedSystemStatus: React.FC = () => {
  const { data, isLoading } = useSystemStatus();

  if (isLoading) {
    return (
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium">System Status</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex justify-center py-4">
            <div className="h-4 w-4 animate-spin rounded-full border-2 border-primary border-t-transparent"></div>
          </div>
        </CardContent>
      </Card>
    );
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'online': 
        return <CheckCircle className="h-4 w-4 text-green-500" />;
      case 'degraded': 
        return <AlertCircle className="h-4 w-4 text-amber-500" />;
      case 'offline':
        return <AlertCircle className="h-4 w-4 text-red-500" />;
      default:
        return <AlertCircle className="h-4 w-4 text-gray-400" />;
    }
  };

  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-sm font-medium">System Status</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-2">
          <div className="grid grid-cols-2 gap-1">
            <div className="flex items-center gap-2">
              <Server className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm">Server</span>
            </div>
            <div className="flex justify-end">{getStatusIcon('online')}</div>
          </div>
          
          <div className="grid grid-cols-2 gap-1">
            <div className="flex items-center gap-2">
              <Database className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm">Database</span>
            </div>
            <div className="flex justify-end">
              {getStatusIcon(data?.databaseStatus || 'unknown')}
            </div>
          </div>
          
          <div className="grid grid-cols-2 gap-1">
            <div className="flex items-center gap-2">
              <Shield className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm">Auth</span>
            </div>
            <div className="flex justify-end">
              {getStatusIcon(data?.authStatus || 'unknown')}
            </div>
          </div>
          
          <div className="mt-3 text-xs text-muted-foreground">
            v{data?.version || '1.0.0'} • Last backup: {data?.lastBackup ? new Date(data.lastBackup).toLocaleDateString() : 'None'}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default EnhancedSystemStatus;
