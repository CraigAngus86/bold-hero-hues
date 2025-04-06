
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { AlertCircle, AlertTriangle, CheckCircle, Database, Server, Users, Activity, RefreshCw } from 'lucide-react';
import { SystemStatusData } from '@/services/logs/systemLogsService';

interface SystemStatusPanelProps {
  data: SystemStatusData;
  isLoading: boolean;
  onRefresh: () => void;
}

const getStatusIcon = (status: string) => {
  switch (status) {
    case 'ok':
      return <CheckCircle className="h-4 w-4 text-green-500" />;
    case 'warning':
      return <AlertTriangle className="h-4 w-4 text-amber-500" />;
    case 'error':
      return <AlertCircle className="h-4 w-4 text-red-500" />;
    default:
      return <Activity className="h-4 w-4 text-gray-500" />;
  }
};

const getStatusBadgeColor = (status: string) => {
  switch (status) {
    case 'ok':
      return 'bg-green-100 text-green-800 hover:bg-green-200';
    case 'warning':
      return 'bg-amber-100 text-amber-800 hover:bg-amber-200';
    case 'error':
      return 'bg-red-100 text-red-800 hover:bg-red-200';
    default:
      return 'bg-gray-100 text-gray-800 hover:bg-gray-200';
  }
};

const SystemStatusPanel: React.FC<SystemStatusPanelProps> = ({ data, isLoading, onRefresh }) => {
  if (!data) return null;

  const statusItems = [
    {
      name: 'Database',
      status: data.supabase?.status || 'unknown',
      icon: <Database className="h-4 w-4" />,
      info: `Response time: ${data.supabase?.pingTime || '-'}ms`
    },
    {
      name: 'Fixtures Service',
      status: data.fixtures?.status || 'unknown',
      icon: <Activity className="h-4 w-4" />,
      info: `${data.fixtures?.count || 0} fixtures`
    },
    {
      name: 'Storage',
      status: data.storage?.status || 'unknown',
      icon: <Server className="h-4 w-4" />,
      info: `Usage: ${data.storage?.usage || '0%'}`
    },
    {
      name: 'League Table',
      status: data.leagueTable?.status || 'unknown',
      icon: <Users className="h-4 w-4" />,
      info: `${data.leagueTable?.teams || 0} teams`
    }
  ];

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-lg font-medium">System Status</CardTitle>
        <Button
          variant="ghost"
          size="sm"
          onClick={onRefresh}
          disabled={isLoading}
          className="h-8 w-8 p-0"
        >
          <RefreshCw className={`h-4 w-4 ${isLoading ? 'animate-spin' : ''}`} />
          <span className="sr-only">Refresh</span>
        </Button>
      </CardHeader>
      <CardContent className="space-y-3">
        {isLoading ? (
          <div className="space-y-2">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="flex items-center justify-between p-2 rounded-md border border-gray-100">
                <div className="flex items-center gap-2">
                  <div className="h-4 w-4 animate-pulse bg-gray-200 rounded-full"></div>
                  <div className="h-4 w-24 animate-pulse bg-gray-200 rounded"></div>
                </div>
                <div className="h-6 w-20 animate-pulse bg-gray-200 rounded-full"></div>
              </div>
            ))}
          </div>
        ) : (
          <div className="space-y-2">
            {statusItems.map((item, index) => (
              <div key={index} className="flex items-center justify-between p-2 rounded-md border border-gray-100 hover:bg-gray-50 transition-colors">
                <div className="flex items-center gap-2">
                  {item.icon}
                  <span className="font-medium">{item.name}</span>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-sm text-gray-500">{item.info}</span>
                  <Badge variant="outline" className={`${getStatusBadgeColor(item.status)}`}>
                    {getStatusIcon(item.status)}
                    <span className="ml-1 capitalize">{item.status}</span>
                  </Badge>
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default SystemStatusPanel;
