
import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { DialogContent, Dialog, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { RefreshCw, Search, Filter, AlertTriangle, Info, CheckCircle, AlertCircle, Trash2 } from 'lucide-react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { format } from 'date-fns';
import { toast } from 'sonner';
import { getSystemLogs, SystemLog } from '@/services/logs/systemLogsService';

export interface SystemLogsProps {
  limit?: number;
}

export default function SystemLogs({ limit = 100 }: SystemLogsProps) {
  const [logs, setLogs] = useState<SystemLog[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [levelFilter, setLevelFilter] = useState<string | undefined>(undefined);
  const [selectedLog, setSelectedLog] = useState<SystemLog | null>(null);
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);
  const [isClearDialogOpen, setIsClearDialogOpen] = useState(false);
  
  const fetchLogs = async () => {
    setIsLoading(true);
    try {
      const result = await getSystemLogs(limit, levelFilter);
      if (result.data) {
        setLogs(result.data);
      } else {
        toast.error('Failed to fetch logs');
      }
    } catch (error) {
      toast.error('Error loading logs');
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };
  
  useEffect(() => {
    fetchLogs();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [levelFilter]);
  
  const handleClearLogs = async () => {
    try {
      // In a real application, this would call an API
      console.log("Clearing logs (mock implementation)");
      toast.success('Logs cleared successfully');
      setLogs([]);
      setIsClearDialogOpen(false);
    } catch (error) {
      toast.error('Error clearing logs');
    }
  };
  
  const filteredLogs = logs.filter(log => 
    log.message.toLowerCase().includes(searchTerm.toLowerCase()) ||
    log.source.toLowerCase().includes(searchTerm.toLowerCase())
  );
  
  const getLevelIcon = (level: string) => {
    switch (level) {
      case 'error':
        return <AlertTriangle className="h-4 w-4" />;
      case 'warning':
        return <AlertCircle className="h-4 w-4" />;
      case 'info':
        return <Info className="h-4 w-4" />;
      case 'success':
        return <CheckCircle className="h-4 w-4" />;
      case 'debug':
        return <Info className="h-4 w-4" />;
      default:
        return <Info className="h-4 w-4" />;
    }
  };
  
  const getLevelColor = (level: string) => {
    switch (level) {
      case 'error':
        return 'text-red-500 bg-red-100';
      case 'warning':
        return 'text-amber-500 bg-amber-100';
      case 'info':
        return 'text-blue-500 bg-blue-100';
      case 'success':
        return 'text-green-500 bg-green-100';
      case 'debug':
        return 'text-purple-500 bg-purple-100';
      default:
        return 'text-gray-500 bg-gray-100';
    }
  };
  
  const showLogDetails = (log: SystemLog) => {
    setSelectedLog(log);
    setIsDetailsOpen(true);
  };
  
  const formatLogDate = (dateString: string) => {
    try {
      return format(new Date(dateString), 'MMM dd, yyyy HH:mm:ss');
    } catch (e) {
      return dateString;
    }
  };
  
  return (
    <Card className="shadow-md border-gray-200">
      <CardHeader className="border-b pb-3">
        <div className="flex justify-between items-center">
          <CardTitle>System Logs</CardTitle>
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={fetchLogs}
              disabled={isLoading}
            >
              <RefreshCw className={`h-4 w-4 mr-2 ${isLoading ? 'animate-spin' : ''}`} />
              Refresh
            </Button>
            <Button
              variant="destructive"
              size="sm"
              onClick={() => setIsClearDialogOpen(true)}
            >
              <Trash2 className="h-4 w-4 mr-2" />
              Clear
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent className="p-0">
        <div className="p-4 border-b flex flex-col md:flex-row gap-3">
          <div className="relative flex-grow">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
            <Input
              placeholder="Search logs..."
              className="pl-9"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <div className="flex items-center">
            <Filter className="h-4 w-4 mr-2 text-gray-500" />
            <Select value={levelFilter} onValueChange={setLevelFilter}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Filter by level" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value={undefined}>All Levels</SelectItem>
                <SelectItem value="error">Errors</SelectItem>
                <SelectItem value="warning">Warnings</SelectItem>
                <SelectItem value="info">Info</SelectItem>
                <SelectItem value="success">Success</SelectItem>
                <SelectItem value="debug">Debug</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
        
        <div className="max-h-96 overflow-y-auto">
          {isLoading ? (
            <div className="flex items-center justify-center py-10">
              <RefreshCw className="h-6 w-6 animate-spin text-gray-400" />
              <span className="ml-2 text-gray-500">Loading logs...</span>
            </div>
          ) : filteredLogs.length === 0 ? (
            <div className="text-center py-10 text-gray-500">
              No logs found
            </div>
          ) : (
            <div className="divide-y">
              {filteredLogs.map((log) => (
                <div 
                  key={log.id} 
                  className="px-4 py-3 hover:bg-gray-50 cursor-pointer"
                  onClick={() => showLogDetails(log)}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <Badge className={`mr-3 ${getLevelColor(log.type)}`} variant="outline">
                        <span className="flex items-center">
                          {getLevelIcon(log.type)}
                          <span className="ml-1 uppercase text-xs">{log.type}</span>
                        </span>
                      </Badge>
                      <span className="text-sm font-medium truncate max-w-[400px]">
                        {log.message}
                      </span>
                    </div>
                    
                    <div className="flex items-center gap-3">
                      <Badge variant="outline" className="bg-gray-100">
                        {log.source}
                      </Badge>
                      <span className="text-xs text-gray-500">
                        {typeof log.timestamp === 'string' 
                          ? formatLogDate(log.timestamp) 
                          : formatLogDate(log.timestamp.toISOString())
                        }
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </CardContent>
      
      {/* Log details dialog */}
      <Dialog open={isDetailsOpen} onOpenChange={setIsDetailsOpen}>
        <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              {selectedLog && (
                <>
                  <Badge className={getLevelColor(selectedLog.type)} variant="outline">
                    {selectedLog.type.toUpperCase()}
                  </Badge>
                  <span>{selectedLog.source}</span>
                </>
              )}
            </DialogTitle>
          </DialogHeader>
          
          {selectedLog && (
            <div className="space-y-4">
              <div>
                <h3 className="text-sm font-medium text-gray-500">Message</h3>
                <p className="mt-1">{selectedLog.message}</p>
              </div>
              
              <div>
                <h3 className="text-sm font-medium text-gray-500">Timestamp</h3>
                <p className="mt-1">
                  {typeof selectedLog.timestamp === 'string' 
                    ? formatLogDate(selectedLog.timestamp) 
                    : formatLogDate(selectedLog.timestamp.toISOString())
                  }
                </p>
              </div>
              
              {selectedLog.metadata && (
                <div>
                  <h3 className="text-sm font-medium text-gray-500">Metadata</h3>
                  <pre className="mt-1 p-3 bg-gray-100 rounded-md overflow-x-auto text-xs">
                    {JSON.stringify(selectedLog.metadata, null, 2)}
                  </pre>
                </div>
              )}
            </div>
          )}
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDetailsOpen(false)}>
              Close
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      
      {/* Clear logs confirmation dialog */}
      <Dialog open={isClearDialogOpen} onOpenChange={setIsClearDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="text-red-600">Clear All System Logs</DialogTitle>
          </DialogHeader>
          <div className="py-4">
            <p>Are you sure you want to clear all system logs? This action cannot be undone.</p>
          </div>
          <DialogFooter className="flex space-x-2">
            <Button variant="outline" onClick={() => setIsClearDialogOpen(false)}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={handleClearLogs}>
              Clear All Logs
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </Card>
  );
}
