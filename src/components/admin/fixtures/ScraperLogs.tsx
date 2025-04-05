import React, { useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/Table';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Loader2, Search, RefreshCcw, ChevronLeft, ChevronRight, Eye, DownloadCloud } from 'lucide-react';
import { format } from 'date-fns';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

interface ScraperLog {
  id: string;
  timestamp: string;
  source: string;
  status: 'success' | 'error' | 'warning';
  itemsFound?: number;
  itemsAdded?: number;
  itemsUpdated?: number;
  errorMessage?: string;
}

export const ScraperLogs: React.FC = () => {
  const [logs, setLogs] = useState<ScraperLog[]>([
    {
      id: '1',
      timestamp: '2023-10-15T09:00:00Z',
      source: 'bbc-sport',
      status: 'success',
      itemsFound: 12,
      itemsAdded: 4,
      itemsUpdated: 2,
    },
    {
      id: '2',
      timestamp: '2023-10-14T09:00:00Z',
      source: 'bbc-sport',
      status: 'success',
      itemsFound: 8,
      itemsAdded: 2,
      itemsUpdated: 0,
    },
    {
      id: '3',
      timestamp: '2023-10-13T09:00:00Z',
      source: 'bbc-sport',
      status: 'error',
      itemsFound: 0,
      itemsAdded: 0,
      itemsUpdated: 0,
      errorMessage: 'Failed to connect to BBC Sport website: timeout after 30 seconds',
    },
    {
      id: '4',
      timestamp: '2023-10-12T09:00:00Z',
      source: 'bbc-sport',
      status: 'warning',
      itemsFound: 10,
      itemsAdded: 0,
      itemsUpdated: 0,
      errorMessage: 'All fixtures already exist in the database',
    },
    {
      id: '5',
      timestamp: '2023-10-11T09:00:00Z',
      source: 'bbc-sport',
      status: 'success',
      itemsFound: 15,
      itemsAdded: 7,
      itemsUpdated: 3,
    },
  ]);
  
  const [isLoading, setIsLoading] = useState(false);
  const [selectedLog, setSelectedLog] = useState<ScraperLog | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  
  const filteredLogs = logs.filter(log => {
    const matchesSearch = 
      log.source.toLowerCase().includes(searchQuery.toLowerCase()) || 
      (log.errorMessage && log.errorMessage.toLowerCase().includes(searchQuery.toLowerCase()));
      
    const matchesStatus = statusFilter === 'all' || log.status === statusFilter;
    
    return matchesSearch && matchesStatus;
  });
  
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentLogs = filteredLogs.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(filteredLogs.length / itemsPerPage);
  
  const handleViewLog = (log: ScraperLog) => {
    setSelectedLog(log);
    setIsDialogOpen(true);
  };
  
  const handleRefreshLogs = async () => {
    setIsLoading(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 1000));
      setLogs([...logs].reverse());
    } catch (error) {
      console.error('Error refreshing logs:', error);
    } finally {
      setIsLoading(false);
    }
  };
  
  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'success':
        return <Badge variant="success">Success</Badge>;
      case 'error':
        return <Badge variant="destructive">Error</Badge>;
      case 'warning':
        return <Badge variant="outline">Warning</Badge>;
      default:
        return <Badge>{status}</Badge>;
    }
  };
  
  const formatTimestamp = (timestamp: string) => {
    try {
      const date = new Date(timestamp);
      return format(date, 'MMM d, yyyy - h:mm a');
    } catch (e) {
      return timestamp;
    }
  };
  
  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row gap-2 sm:items-center sm:justify-between">
        <div className="flex gap-2">
          <div className="relative w-full sm:w-[300px]">
            <Search className="absolute left-2 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search logs..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-8"
            />
          </div>
          
          <Select
            value={statusFilter}
            onValueChange={setStatusFilter}
          >
            <SelectTrigger className="w-[150px]">
              <SelectValue placeholder="Filter by status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Statuses</SelectItem>
              <SelectItem value="success">Success</SelectItem>
              <SelectItem value="error">Error</SelectItem>
              <SelectItem value="warning">Warning</SelectItem>
            </SelectContent>
          </Select>
        </div>
        
        <Button
          variant="outline"
          onClick={handleRefreshLogs}
          disabled={isLoading}
        >
          {isLoading ? (
            <Loader2 className="h-4 w-4 animate-spin mr-2" />
          ) : (
            <RefreshCcw className="h-4 w-4 mr-2" />
          )}
          Refresh Logs
        </Button>
      </div>
      
      <Card>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Time</TableHead>
                <TableHead>Source</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-center">Items Found</TableHead>
                <TableHead className="text-center">Added</TableHead>
                <TableHead className="text-center">Updated</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {currentLogs.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={7} className="text-center py-6 text-muted-foreground">
                    {isLoading ? 'Loading logs...' : 'No logs found'}
                  </TableCell>
                </TableRow>
              ) : (
                currentLogs.map((log) => (
                  <TableRow key={log.id}>
                    <TableCell className="whitespace-nowrap">
                      {formatTimestamp(log.timestamp)}
                    </TableCell>
                    <TableCell>{log.source}</TableCell>
                    <TableCell>{getStatusBadge(log.status)}</TableCell>
                    <TableCell className="text-center">{log.itemsFound ?? '—'}</TableCell>
                    <TableCell className="text-center">{log.itemsAdded ?? '—'}</TableCell>
                    <TableCell className="text-center">{log.itemsUpdated ?? '—'}</TableCell>
                    <TableCell className="text-right">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleViewLog(log)}
                        title="View log details"
                      >
                        <Eye className="h-4 w-4" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
      
      {filteredLogs.length > itemsPerPage && (
        <div className="flex items-center justify-between">
          <div className="text-sm text-muted-foreground">
            Showing <span className="font-medium">{indexOfFirstItem + 1}</span> to{" "}
            <span className="font-medium">
              {Math.min(indexOfLastItem, filteredLogs.length)}
            </span>{" "}
            of <span className="font-medium">{filteredLogs.length}</span> logs
          </div>
          
          <div className="flex items-center space-x-2">
            <Button
              variant="outline"
              size="icon"
              onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
              disabled={currentPage === 1}
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <Button
              variant="outline"
              size="icon"
              onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
              disabled={currentPage === totalPages}
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
      )}
      
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Log Details</DialogTitle>
          </DialogHeader>
          
          {selectedLog && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <p className="text-sm text-muted-foreground">Time</p>
                  <p>{formatTimestamp(selectedLog.timestamp)}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Source</p>
                  <p>{selectedLog.source}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Status</p>
                  <p>{getStatusBadge(selectedLog.status)}</p>
                </div>
              </div>
              
              <div className="grid grid-cols-3 gap-2">
                <div>
                  <p className="text-sm text-muted-foreground">Items Found</p>
                  <p>{selectedLog.itemsFound ?? '—'}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Items Added</p>
                  <p>{selectedLog.itemsAdded ?? '—'}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Items Updated</p>
                  <p>{selectedLog.itemsUpdated ?? '—'}</p>
                </div>
              </div>
              
              {selectedLog.errorMessage && (
                <div>
                  <p className="text-sm text-muted-foreground">Error Message</p>
                  <p className="text-destructive">{selectedLog.errorMessage}</p>
                </div>
              )}
              
              <div className="flex justify-end">
                <Button variant="outline" onClick={() => window.navigator.clipboard.writeText(JSON.stringify(selectedLog, null, 2))}>
                  <DownloadCloud className="h-4 w-4 mr-2" />
                  Export Log
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};
