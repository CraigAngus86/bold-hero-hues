
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { getSystemLogs } from '@/services/logs/systemLogsService';
import { SystemLog } from '@/types';
import { Badge } from "@/components/ui/badge";
import { formatDistanceToNow } from 'date-fns';

const SystemLogs = () => {
  const [logs, setLogs] = useState<SystemLog[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  
  useEffect(() => {
    const loadLogs = async () => {
      setIsLoading(true);
      try {
        const logsData = await getSystemLogs();
        setLogs(logsData);
      } catch (error) {
        console.error('Error loading system logs:', error);
      } finally {
        setIsLoading(false);
      }
    };
    
    loadLogs();
  }, []);
  
  // Get badge color based on log type
  const getBadgeVariant = (type: string) => {
    switch (type.toLowerCase()) {
      case 'error':
        return 'destructive';
      case 'warning':
        return 'warning';
      case 'info':
        return 'secondary';
      case 'success':
        return 'success';
      default:
        return 'outline';
    }
  };
  
  return (
    <Card>
      <CardHeader>
        <CardTitle>System Logs</CardTitle>
      </CardHeader>
      <CardContent className="p-0">
        {isLoading ? (
          <div className="p-6 text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-team-blue mx-auto"></div>
            <p className="mt-2 text-gray-500">Loading logs...</p>
          </div>
        ) : logs.length === 0 ? (
          <div className="p-6 text-center text-gray-500">
            No system logs found.
          </div>
        ) : (
          <div className="divide-y">
            {logs.map((log) => (
              <div key={log.id} className="p-4 hover:bg-gray-50">
                <div className="flex items-start justify-between mb-1">
                  <div className="flex items-center gap-2">
                    <Badge variant={getBadgeVariant(log.type) as any}>
                      {log.type}
                    </Badge>
                    <span className="font-medium text-gray-700">{log.source}</span>
                  </div>
                  <span className="text-xs text-gray-500">
                    {formatDistanceToNow(new Date(log.timestamp), { addSuffix: true })}
                  </span>
                </div>
                <p className="text-gray-600 text-sm">{log.message}</p>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default SystemLogs;
