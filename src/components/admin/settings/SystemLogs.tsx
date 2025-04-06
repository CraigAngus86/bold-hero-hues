
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { getSystemLogs, SystemLog, exportLogsAsJson } from '@/services/logs/systemLogsService';
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { AlertCircle, AlertTriangle, Info, Bug, RefreshCw, Filter, Search, Download, CheckCircle } from 'lucide-react';
import { format, parseISO } from 'date-fns';

const SystemLogs = () => {
  const [logs, setLogs] = useState<SystemLog[]>([]);
  const [filteredLogs, setFilteredLogs] = useState<SystemLog[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [logTypeFilter, setLogTypeFilter] = useState<string>('all');
  
  // Load logs when component mounts
  useEffect(() => {
    loadLogs();
  }, []);

  // Filter logs when search term or type filter changes
  useEffect(() => {
    filterLogs();
  }, [logs, searchTerm, logTypeFilter]);

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

  const filterLogs = () => {
    let filtered = [...logs];
    
    // Apply type filter
    if (logTypeFilter !== 'all') {
      filtered = filtered.filter(log => log.type === logTypeFilter);
    }
    
    // Apply search filter
    if (searchTerm) {
      const search = searchTerm.toLowerCase();
      filtered = filtered.filter(log => 
        log.message.toLowerCase().includes(search) || 
        log.source.toLowerCase().includes(search)
      );
    }
    
    setFilteredLogs(filtered);
  };
  
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
      case 'debug':
        return 'outline';
      default:
        return 'outline';
    }
  };

  // Get icon for log type
  const getLogTypeIcon = (type: string) => {
    switch (type.toLowerCase()) {
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

  const handleExportLogs = async () => {
    try {
      // Get filtered logs for export
      let logsToExport;
      if (logTypeFilter !== 'all') {
        logsToExport = await exportLogsAsJson(logTypeFilter);
      } else {
        logsToExport = await exportLogsAsJson();
      }
      
      // Convert to JSON string and create download link
      const dataStr = JSON.stringify(logsToExport, null, 2);
      const dataUri = `data:application/json;charset=utf-8,${encodeURIComponent(dataStr)}`;
      
      const exportFileDefaultName = `system-logs-${new Date().toISOString().split('T')[0]}.json`;
      
      const linkElement = document.createElement('a');
      linkElement.setAttribute('href', dataUri);
      linkElement.setAttribute('download', exportFileDefaultName);
      linkElement.click();
    } catch (error) {
      console.error('Error exporting logs:', error);
    }
  };

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <div>
          <CardTitle>System Logs</CardTitle>
        </div>
        <div className="flex space-x-2">
          <Button 
            onClick={handleExportLogs} 
            variant="outline" 
            size="sm"
            disabled={logs.length === 0 || isLoading}
          >
            <Download className="mr-2 h-4 w-4" />
            Export
          </Button>
          <Button 
            onClick={loadLogs} 
            variant="outline" 
            size="sm" 
            disabled={isLoading}
          >
            <RefreshCw className={`mr-2 h-4 w-4 ${isLoading ? 'animate-spin' : ''}`} />
            Refresh
          </Button>
        </div>
      </CardHeader>
      <CardContent className="p-0">
        <div className="flex flex-col md:flex-row justify-between gap-4 p-4 border-b">
          <div className="relative flex-1">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
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
                <div className="flex items-center">
                  <Filter className="mr-2 h-4 w-4" />
                  <SelectValue placeholder="Filter by type" />
                </div>
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

        {isLoading ? (
          <div className="p-8 text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
            <p className="mt-2 text-muted-foreground">Loading logs...</p>
          </div>
        ) : filteredLogs.length === 0 ? (
          <div className="p-8 text-center text-muted-foreground">
            No system logs found matching your criteria.
          </div>
        ) : (
          <div className="divide-y">
            {filteredLogs.map((log) => (
              <div key={log.id} className="p-4 hover:bg-muted/50">
                <div className="flex items-start justify-between mb-1">
                  <div className="flex items-center gap-2">
                    <Badge variant={getBadgeVariant(log.type) as any} className="flex items-center gap-1">
                      {getLogTypeIcon(log.type)}
                      <span className="capitalize">{log.type}</span>
                    </Badge>
                    <span className="font-medium">{log.source}</span>
                  </div>
                  <span className="text-xs text-muted-foreground">
                    {format(parseISO(log.timestamp), 'MMM d, yyyy HH:mm:ss')}
                  </span>
                </div>
                <p className="text-sm">{log.message}</p>
                {log.metadata && (
                  <pre className="mt-2 p-2 text-xs bg-muted rounded overflow-x-auto">
                    {JSON.stringify(log.metadata, null, 2)}
                  </pre>
                )}
              </div>
            ))}
          </div>
        )}
        
        <div className="p-4 border-t text-sm text-muted-foreground text-right">
          Showing {filteredLogs.length} of {logs.length} logs
        </div>
      </CardContent>
    </Card>
  );
};

export default SystemLogs;
