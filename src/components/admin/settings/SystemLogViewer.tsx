
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/Table';
import { toast } from 'sonner';
import { AlertCircle, Loader2, RefreshCw, Trash2, Filter, Download, ArrowDown, ArrowUp } from 'lucide-react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { supabase } from '@/integrations/supabase/client';

interface SystemLog {
  id: number | string;
  timestamp: string;
  type: 'error' | 'warning' | 'info' | 'debug';
  source: string;
  message: string;
}

interface SystemLogViewerProps {
  initialLogs?: SystemLog[];
  fetchFromDatabase?: boolean;
  maxEntries?: number;
  showFilters?: boolean;
  title?: string;
  description?: string;
}

export const SystemLogViewer = ({
  initialLogs = [],
  fetchFromDatabase = false,
  maxEntries = 100,
  showFilters = true,
  title = "System Logs",
  description = "View and manage system logs"
}: SystemLogViewerProps) => {
  const [logs, setLogs] = useState<SystemLog[]>(initialLogs);
  const [filteredLogs, setFilteredLogs] = useState<SystemLog[]>(initialLogs);
  const [isLoading, setIsLoading] = useState(false);
  const [typeFilter, setTypeFilter] = useState<string>("all");
  const [sourceFilter, setSourceFilter] = useState<string>("all");
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('desc');
  
  // Extract unique sources for filtering
  const sources = Array.from(new Set(logs.map(log => log.source || 'unknown')));
  
  // Fetch logs from database if needed
  useEffect(() => {
    if (fetchFromDatabase) {
      refreshLogs();
    } else {
      setFilteredLogs(initialLogs);
    }
  }, [fetchFromDatabase, initialLogs]);

  // Function for filtering logs
  useEffect(() => {
    let result = [...logs];
    
    if (typeFilter !== "all") {
      result = result.filter(log => log.type === typeFilter);
    }
    
    if (sourceFilter !== "all") {
      result = result.filter(log => log.source === sourceFilter);
    }
    
    // Sort logs by timestamp
    result.sort((a, b) => {
      const dateA = new Date(a.timestamp).getTime();
      const dateB = new Date(b.timestamp).getTime();
      return sortDirection === 'asc' ? dateA - dateB : dateB - dateA;
    });
    
    setFilteredLogs(result);
  }, [logs, typeFilter, sourceFilter, sortDirection]);
  
  // Function for refreshing logs
  const refreshLogs = async () => {
    setIsLoading(true);
    
    if (fetchFromDatabase) {
      try {
        // Fetch logs from the database
        const { data, error } = await supabase
          .from('scrape_logs')
          .select('*')
          .order('created_at', { ascending: false })
          .limit(maxEntries);
        
        if (error) throw error;
        
        // Map database logs to SystemLog format
        const mappedLogs: SystemLog[] = (data || []).map(log => ({
          id: log.id,
          timestamp: log.created_at,
          type: getLogType(log),
          source: log.source || 'system',
          message: log.error_message || `${log.items_found || 0} items found, ${log.items_added || 0} added, ${log.items_updated || 0} updated`
        }));
        
        setLogs(mappedLogs);
        toast.success('Logs refreshed');
      } catch (error) {
        console.error('Error fetching logs:', error);
        toast.error('Failed to fetch logs');
      }
    } else {
      // Simulate API call for mock data
      setTimeout(() => {
        const newLog = {
          id: logs.length + 1,
          timestamp: new Date().toISOString(),
          type: Math.random() > 0.7 ? 'error' : Math.random() > 0.5 ? 'warning' : 'info',
          source: 'system',
          message: `Log entry at ${new Date().toLocaleTimeString()}`
        } as SystemLog;
        
        setLogs([newLog, ...logs]);
        toast.success('Logs refreshed');
      }, 600);
    }
    
    setIsLoading(false);
  };
  
  // Function for determining log type from database record
  const getLogType = (log: any): 'error' | 'warning' | 'info' | 'debug' => {
    if (log.error_message) return 'error';
    if (log.status === 'warning') return 'warning';
    return 'info';
  };

  // Function for clearing logs by type
  const clearLogsByType = (type: string) => () => {
    setLogs(logs.filter(log => log.type !== type));
    toast.success(`Cleared ${type} logs`);
  };

  // Function for formatting timestamp
  const formatTimestamp = (timestamp: string) => {
    const date = new Date(timestamp);
    return date.toLocaleString();
  };

  // Function for exporting logs
  const exportLogs = () => {
    try {
      const data = JSON.stringify(filteredLogs, null, 2);
      const blob = new Blob([data], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `system-logs-${new Date().toISOString().slice(0,10)}.json`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
      toast.success('Logs exported successfully');
    } catch (error) {
      toast.error('Failed to export logs');
    }
  };

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <div>
          <CardTitle className="text-lg">{title}</CardTitle>
          {description && <p className="text-sm text-muted-foreground">{description}</p>}
        </div>
        <div className="flex space-x-2">
          <Button 
            variant="outline" 
            size="sm"
            onClick={refreshLogs}
            disabled={isLoading}
          >
            {isLoading ? (
              <Loader2 className="h-4 w-4 mr-1 animate-spin" />
            ) : (
              <RefreshCw className="h-4 w-4 mr-1" />
            )}
            Refresh
          </Button>
          <Button 
            variant="outline" 
            size="sm"
            onClick={exportLogs}
          >
            <Download className="h-4 w-4 mr-1" />
            Export
          </Button>
          <Button 
            variant="destructive" 
            size="sm"
            onClick={() => {
              setLogs([]);
              toast.success('All logs cleared');
            }}
          >
            <Trash2 className="h-4 w-4 mr-1" />
            Clear All
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        {showFilters && (
          <div className="mb-4 flex flex-wrap items-center gap-4">
            <div className="flex items-center space-x-2">
              <span className="text-sm font-medium">Type:</span>
              <Select
                value={typeFilter}
                onValueChange={setTypeFilter}
              >
                <SelectTrigger className="w-[120px]">
                  <SelectValue placeholder="Filter type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Types</SelectItem>
                  <SelectItem value="error">Errors</SelectItem>
                  <SelectItem value="warning">Warnings</SelectItem>
                  <SelectItem value="info">Info</SelectItem>
                  <SelectItem value="debug">Debug</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            {sources.length > 1 && (
              <div className="flex items-center space-x-2">
                <span className="text-sm font-medium">Source:</span>
                <Select
                  value={sourceFilter}
                  onValueChange={setSourceFilter}
                >
                  <SelectTrigger className="w-[150px]">
                    <SelectValue placeholder="Filter source" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Sources</SelectItem>
                    {sources.map((source) => (
                      <SelectItem key={source} value={source}>
                        {source}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            )}
            
            <Button 
              variant="ghost" 
              size="sm"
              onClick={() => setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc')}
              className="ml-auto"
            >
              {sortDirection === 'asc' ? (
                <><ArrowUp className="h-4 w-4 mr-1" /> Oldest First</>
              ) : (
                <><ArrowDown className="h-4 w-4 mr-1" /> Newest First</>
              )}
            </Button>
          </div>
        )}
        
        <div className="mb-4 flex justify-end space-x-2">
          <Button 
            variant="outline" 
            size="sm"
            onClick={clearLogsByType('error')}
            className="bg-red-50 border-red-200 hover:bg-red-100"
          >
            <AlertCircle className="h-4 w-4 mr-1 text-red-500" />
            Clear Errors
          </Button>
          <Button 
            variant="outline" 
            size="sm"
            onClick={clearLogsByType('warning')}
            className="bg-amber-50 border-amber-200 hover:bg-amber-100"
          >
            <AlertCircle className="h-4 w-4 mr-1 text-amber-500" />
            Clear Warnings
          </Button>
        </div>
        
        <div className="border rounded-md">
          {filteredLogs.length === 0 ? (
            <div className="p-4 text-center text-gray-500">
              No system logs to display
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[200px]">Timestamp</TableHead>
                  <TableHead className="w-[100px]">Type</TableHead>
                  {sources.length > 1 && <TableHead className="w-[100px]">Source</TableHead>}
                  <TableHead>Message</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredLogs.map((log) => (
                  <TableRow key={log.id}>
                    <TableCell className="font-mono text-sm">
                      {formatTimestamp(log.timestamp)}
                    </TableCell>
                    <TableCell>
                      <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium
                        ${log.type === 'error' ? 'bg-red-100 text-red-800' : 
                          log.type === 'warning' ? 'bg-amber-100 text-amber-800' : 
                          log.type === 'debug' ? 'bg-purple-100 text-purple-800' :
                          'bg-blue-100 text-blue-800'}`}>
                        {log.type}
                      </span>
                    </TableCell>
                    {sources.length > 1 && <TableCell>{log.source}</TableCell>}
                    <TableCell>{log.message}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default SystemLogViewer;
