
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { AlertTriangle, CheckCircle, Info, RefreshCw, XCircle, Trash2 } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import { getSystemLogs, clearSystemLogs } from '@/services/logs/systemLogsService';
import { SystemLog } from '@/types/system/logs';

const SystemLogs = () => {
  const [logs, setLogs] = useState<SystemLog[]>([]);
  const [filter, setFilter] = useState<'all' | 'info' | 'warning' | 'error' | 'success' | 'debug'>('all');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchLogs = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const logType = filter !== 'all' ? filter : undefined;
      const response = await getSystemLogs(100, logType);
      if (response.success) {
        setLogs(response.data || []);
      } else {
        throw new Error(response.error || 'Failed to fetch logs');
      }
    } catch (err) {
      console.error('Error fetching logs:', err);
      setError(err instanceof Error ? err.message : 'An unknown error occurred');
    } finally {
      setIsLoading(false);
    }
  };

  const handleClearLogs = async () => {
    if (window.confirm('Are you sure you want to clear all logs? This action cannot be undone.')) {
      setIsLoading(true);
      try {
        const logType = filter !== 'all' ? filter : undefined;
        const result = await clearSystemLogs(logType);
        if (result.success) {
          setLogs([]);
        } else {
          throw new Error(result.error || 'Failed to clear logs');
        }
      } catch (err) {
        console.error('Error clearing logs:', err);
        setError(err instanceof Error ? err.message : 'An unknown error occurred');
      } finally {
        setIsLoading(false);
      }
    }
  };

  useEffect(() => {
    fetchLogs();
  }, [filter]);

  const getLogIcon = (logType: string) => {
    switch (logType) {
      case 'info':
        return <Info className="h-4 w-4 text-blue-500" />;
      case 'warning':
        return <AlertTriangle className="h-4 w-4 text-yellow-500" />;
      case 'error':
        return <XCircle className="h-4 w-4 text-red-500" />;
      case 'success':
        return <CheckCircle className="h-4 w-4 text-green-500" />;
      default:
        return <Info className="h-4 w-4 text-gray-500" />;
    }
  };

  const getRelativeTime = (timestamp: string) => {
    try {
      return formatDistanceToNow(new Date(timestamp), { addSuffix: true });
    } catch (error) {
      return 'Unknown time';
    }
  };

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>System Logs</CardTitle>
        <div className="flex space-x-2">
          <Select value={filter} onValueChange={(value: any) => setFilter(value)}>
            <SelectTrigger className="w-32">
              <SelectValue placeholder="Filter" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Logs</SelectItem>
              <SelectItem value="info">Info</SelectItem>
              <SelectItem value="warning">Warning</SelectItem>
              <SelectItem value="error">Error</SelectItem>
              <SelectItem value="success">Success</SelectItem>
              <SelectItem value="debug">Debug</SelectItem>
            </SelectContent>
          </Select>
          <Button variant="outline" onClick={fetchLogs} disabled={isLoading}>
            <RefreshCw className={`h-4 w-4 mr-2 ${isLoading ? 'animate-spin' : ''}`} />
            Refresh
          </Button>
          <Button variant="destructive" onClick={handleClearLogs} disabled={isLoading || logs.length === 0}>
            <Trash2 className="h-4 w-4 mr-2" />
            Clear
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded mb-4">
            {error}
          </div>
        )}
        
        {logs.length === 0 ? (
          <div className="text-center py-12 text-gray-500">
            No logs found. System logs will appear here when they are generated.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[100px]">Type</TableHead>
                  <TableHead>Message</TableHead>
                  <TableHead>Source</TableHead>
                  <TableHead className="text-right">Time</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {logs.map((log) => (
                  <TableRow key={log.id}>
                    <TableCell className="whitespace-nowrap">
                      <div className="flex items-center space-x-2">
                        {getLogIcon(log.type)}
                        <span className="capitalize">{log.type}</span>
                      </div>
                    </TableCell>
                    <TableCell>{log.message}</TableCell>
                    <TableCell>{log.source}</TableCell>
                    <TableCell className="text-right text-xs">
                      <span title={new Date(log.timestamp).toLocaleString()}>
                        {getRelativeTime(log.timestamp)}
                      </span>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default SystemLogs;
