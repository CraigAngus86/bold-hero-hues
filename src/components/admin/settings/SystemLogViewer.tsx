
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { DataTable } from '@/components/admin/common/DataTable';
import { AlertCircle, AlertTriangle, Info, Bug, RefreshCw, Filter, Search, Download, CheckCircle } from 'lucide-react';
import { SystemLog } from '@/types/system/logs';
import { format, parseISO } from 'date-fns';
import { spacing, typography } from '@/styles/designTokens';

interface SystemLogViewerProps {
  initialLogs: SystemLog[];
  title?: string;
  description?: string;
  onRefresh?: () => void;
  isLoading?: boolean;
}

export const SystemLogViewer: React.FC<SystemLogViewerProps> = ({
  initialLogs,
  title = "System Logs",
  description = "View system events and errors",
  onRefresh,
  isLoading = false,
}) => {
  const [logs, setLogs] = useState<SystemLog[]>(initialLogs);
  const [searchTerm, setSearchTerm] = useState('');
  const [logTypeFilter, setLogTypeFilter] = useState<string>('all');

  const filteredLogs = logs.filter(log => {
    const matchesType = logTypeFilter === 'all' || log.type === logTypeFilter;
    const matchesSearch = log.message.toLowerCase().includes(searchTerm.toLowerCase()) ||
      log.source.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesType && matchesSearch;
  });

  const handleRefresh = () => {
    if (onRefresh) {
      onRefresh();
    }
  };

  const handleExport = () => {
    const dataStr = JSON.stringify(logs, null, 2);
    const dataUri = `data:application/json;charset=utf-8,${encodeURIComponent(dataStr)}`;
    
    const exportFileDefaultName = `system-logs-${new Date().toISOString().split('T')[0]}.json`;
    
    const linkElement = document.createElement('a');
    linkElement.setAttribute('href', dataUri);
    linkElement.setAttribute('download', exportFileDefaultName);
    linkElement.click();
  };

  const formatTimestamp = (timestamp: string) => {
    try {
      return format(parseISO(timestamp), 'MMM d, yyyy HH:mm:ss');
    } catch (e) {
      return timestamp;
    }
  };

  const getLogTypeIcon = (type: SystemLog['type']) => {
    switch (type) {
      case 'error':
        return <AlertCircle className="h-4 w-4 text-destructive" />;
      case 'warning':
        return <AlertTriangle className="h-4 w-4 text-amber-500" />;
      case 'info':
        return <Info className="h-4 w-4 text-blue-500" />;
      case 'success':
        return <CheckCircle className="h-4 w-4 text-green-500" />;
      case 'debug':
        return <Bug className="h-4 w-4 text-gray-500" />;
      default:
        return <Info className="h-4 w-4" />;
    }
  };

  const getLogTypeBadgeVariant = (type: SystemLog['type']): 'destructive' | 'secondary' | 'default' | 'outline' | 'success' => {
    switch (type) {
      case 'error':
        return 'destructive';
      case 'warning':
        return 'secondary';
      case 'info':
        return 'default';
      case 'success':
        return 'success';
      case 'debug':
        return 'outline';
      default:
        return 'secondary';
    }
  };

  const columns = [
    {
      key: 'type',
      header: 'Type',
      cell: (log: SystemLog) => (
        <Badge variant={getLogTypeBadgeVariant(log.type)} className="flex items-center gap-1">
          {getLogTypeIcon(log.type)}
          <span className="capitalize">{log.type}</span>
        </Badge>
      )
    },
    {
      key: 'message',
      header: 'Message',
      cell: (log: SystemLog) => <div className="font-medium">{log.message}</div>
    },
    {
      key: 'source',
      header: 'Source',
      cell: (log: SystemLog) => <div>{log.source}</div>
    },
    {
      key: 'timestamp',
      header: 'Timestamp',
      cell: (log: SystemLog) => (
        <div className="text-muted-foreground">{formatTimestamp(log.timestamp.toString())}</div>
      )
    }
  ];

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <div>
          <CardTitle className={typography.sectionHeader}>{title}</CardTitle>
          {description && <p className="text-sm text-muted-foreground mt-1">{description}</p>}
        </div>
        <div className="flex space-x-2">
          <Button onClick={handleExport} variant="outline" size="sm">
            <Download className="mr-2 h-4 w-4" />
            Export
          </Button>
          {onRefresh && (
            <Button onClick={handleRefresh} variant="outline" size="sm" disabled={isLoading}>
              <RefreshCw className={`mr-2 h-4 w-4 ${isLoading ? 'animate-spin' : ''}`} />
              Refresh
            </Button>
          )}
        </div>
      </CardHeader>
      <CardContent className="p-4">
        <div className="flex flex-col md:flex-row justify-between gap-4 mb-6">
          <div className="relative flex-1">
            <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search logs..."
              className="pl-8"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <div className="w-full md:w-48">
            <Select value={logTypeFilter} onValueChange={setLogTypeFilter}>
              <SelectTrigger>
                <SelectValue placeholder="Filter by type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Logs</SelectItem>
                <SelectItem value="error">Errors</SelectItem>
                <SelectItem value="warning">Warnings</SelectItem>
                <SelectItem value="info">Info</SelectItem>
                <SelectItem value="success">Success</SelectItem>
                <SelectItem value="debug">Debug</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <DataTable 
          columns={columns}
          data={filteredLogs}
          isLoading={isLoading}
          emptyMessage="No logs found"
        />

        <div className="mt-4 text-sm text-muted-foreground text-right">
          Showing {filteredLogs.length} of {logs.length} logs
        </div>
      </CardContent>
    </Card>
  );
};

export default SystemLogViewer;
