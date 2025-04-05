import React, { useState, useEffect } from 'react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/Table';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Loader2, RefreshCw, AlertCircle, CheckCircle } from 'lucide-react';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';
import { format, parseISO } from 'date-fns';

interface ScraperLog {
  id: string;
  created_at: string;
  source: string;
  status: string;
  items_found: number;
  items_added: number;
  items_updated: number;
  error_message: string | null;
}

export const ScraperLogs: React.FC = () => {
  const [logs, setLogs] = useState<ScraperLog[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch logs
  const fetchLogs = async () => {
    setLoading(true);
    setError(null);
    
    try {
      const { data, error } = await supabase
        .from('scrape_logs')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(50);
      
      if (error) throw error;
      
      setLogs(data as ScraperLog[]);
    } catch (err) {
      console.error('Error fetching scraper logs:', err);
      setError('Failed to load scraper logs');
      toast.error('Failed to load scraper logs');
    } finally {
      setLoading(false);
    }
  };

  // Load logs on component mount
  useEffect(() => {
    fetchLogs();
  }, []);
  
  // Format date
  const formatDate = (dateStr: string) => {
    try {
      return format(parseISO(dateStr), 'dd MMM yyyy HH:mm:ss');
    } catch (e) {
      return dateStr;
    }
  };

  // Get status badge
  const getStatusBadge = (status: string) => {
    switch (status.toLowerCase()) {
      case 'completed':
        return <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">Completed</Badge>;
      case 'failed':
        return <Badge variant="outline" className="bg-red-50 text-red-700 border-red-200">Failed</Badge>;
      case 'running':
        return <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">Running</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };
  
  // Get source label
  const getSourceLabel = (source: string) => {
    switch (source.toLowerCase()) {
      case 'bbc':
      case 'bbc-sport':
        return 'BBC Sport';
      case 'hfl':
      case 'highland-league':
        return 'Highland League';
      case 'json_import':
        return 'JSON Import';
      case 'manual_import':
        return 'Manual Import';
      default:
        return source;
    }
  };

  return (
    <Card className="p-4">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-medium">Scraper Activity Logs</h3>
        <Button 
          variant="outline" 
          size="sm" 
          onClick={fetchLogs} 
          disabled={loading}
        >
          <RefreshCw className={`h-4 w-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
          Refresh Logs
        </Button>
      </div>
      
      {error && (
        <div className="bg-destructive/15 p-3 rounded-md mb-4">
          <div className="flex items-center gap-2 text-destructive">
            <AlertCircle className="h-4 w-4" />
            {error}
          </div>
        </div>
      )}
      
      {loading ? (
        <div className="flex justify-center items-center py-8">
          <Loader2 className="h-8 w-8 animate-spin text-primary mr-3" />
          <p>Loading logs...</p>
        </div>
      ) : (
        <div className="max-h-[500px] overflow-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Date & Time</TableHead>
                <TableHead>Source</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Found</TableHead>
                <TableHead>Added</TableHead>
                <TableHead>Updated</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {logs.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} className="text-center py-4 text-gray-500">
                    No logs found
                  </TableCell>
                </TableRow>
              ) : (
                logs.map((log) => (
                  <TableRow 
                    key={log.id}
                    className={log.status.toLowerCase() === 'failed' ? 'bg-red-50' : ''}
                  >
                    <TableCell>{formatDate(log.created_at)}</TableCell>
                    <TableCell>{getSourceLabel(log.source)}</TableCell>
                    <TableCell>{getStatusBadge(log.status)}</TableCell>
                    <TableCell>{log.items_found || 0}</TableCell>
                    <TableCell>
                      <span className="text-green-600 font-medium">{log.items_added || 0}</span>
                    </TableCell>
                    <TableCell>
                      <span className="text-blue-600 font-medium">{log.items_updated || 0}</span>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>
      )}
      
      {logs.length > 0 && logs.some(log => log.status.toLowerCase() === 'failed') && (
        <div className="mt-4 p-3 rounded-md border border-amber-200 bg-amber-50">
          <div className="flex items-start gap-2">
            <AlertCircle className="h-5 w-5 text-amber-500 mt-0.5" />
            <div>
              <p className="font-medium text-amber-800">Some scrapers have failed</p>
              <p className="text-sm text-amber-700 mt-1">
                Check the error messages in the logs for details on what went wrong.
                You may need to update your scraper configuration or check the source websites.
              </p>
            </div>
          </div>
        </div>
      )}
    </Card>
  );
};
