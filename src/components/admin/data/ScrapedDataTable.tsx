
import React, { useState, useEffect } from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { RefreshCw, Download } from 'lucide-react';
import { format } from 'date-fns';
import { toast } from 'sonner';
import { 
  ScrapeLog,
  fetchScrapingLogs, 
  downloadScrapeData 
} from '@/services/scrapingService';

// Define ScrapingSource type if not exported by scrapingService
type ScrapingSource = "highland_league" | "club_website" | "other";

export const ScrapedDataTable: React.FC = () => {
  const [logs, setLogs] = useState<ScrapeLog[]>([]);
  const [filteredLogs, setFilteredLogs] = useState<ScrapeLog[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [activeSource, setActiveSource] = useState<ScrapingSource | 'all'>('all');
  const [activeTab, setActiveTab] = useState('recent');

  const fetchLogs = async () => {
    setIsLoading(true);
    try {
      const result = await fetchScrapingLogs();
      setLogs(result);
      filterLogs(result, activeSource);
    } catch (error) {
      toast.error('Error fetching scraping logs');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchLogs();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const filterLogs = (logsToFilter: ScrapeLog[], source: ScrapingSource | 'all') => {
    if (source === 'all') {
      setFilteredLogs(logsToFilter);
    } else {
      setFilteredLogs(logsToFilter.filter(log => log.source === source));
    }
  };

  const handleSourceChange = (source: string) => {
    setActiveSource(source as ScrapingSource | 'all');
    filterLogs(logs, source as ScrapingSource | 'all');
  };

  const handleDownload = async (source: string) => {
    try {
      const result = await downloadScrapeData(source as ScrapingSource);
      
      // Create a download for the blob data
      const blob = new Blob([JSON.stringify(result, null, 2)], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `scrape-data-${source}.json`;
      a.click();
      URL.revokeObjectURL(url);
      
      toast.success(`Downloaded data from ${source}`);
    } catch (error) {
      toast.error('Error downloading data');
    }
  };

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'success':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'partial':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'failed':
        return 'bg-red-100 text-red-800 border-red-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const formatDate = (dateString: string) => {
    try {
      return format(new Date(dateString), 'MMM dd, yyyy HH:mm');
    } catch (e) {
      return dateString;
    }
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex justify-between items-center">
          <div>
            <CardTitle>Scraped Data History</CardTitle>
            <CardDescription>View and manage data scraped from external sources</CardDescription>
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={fetchLogs}
            disabled={isLoading}
          >
            <RefreshCw className={`h-4 w-4 mr-2 ${isLoading ? 'animate-spin' : ''}`} />
            Refresh
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-2">
            <Tabs defaultValue="recent" onValueChange={setActiveTab} className="w-full sm:w-auto">
              <TabsList>
                <TabsTrigger value="recent">Recent</TabsTrigger>
                <TabsTrigger value="all">All History</TabsTrigger>
              </TabsList>
            </Tabs>
            
            <div className="w-full sm:w-48">
              <Select value={activeSource} onValueChange={(val: any) => handleSourceChange(val)}>
                <SelectTrigger>
                  <SelectValue placeholder="Filter by source" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Sources</SelectItem>
                  <SelectItem value="league_table">League Table</SelectItem>
                  <SelectItem value="fixtures">Fixtures</SelectItem>
                  <SelectItem value="results">Results</SelectItem>
                  <SelectItem value="news">News</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          
          <div className="border rounded-md">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Source</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead>Items</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {isLoading ? (
                  <TableRow>
                    <TableCell colSpan={5} className="text-center py-10">
                      <RefreshCw className="h-6 w-6 animate-spin mx-auto text-gray-400" />
                      <p className="mt-2 text-gray-500">Loading data...</p>
                    </TableCell>
                  </TableRow>
                ) : filteredLogs.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={5} className="text-center py-10">
                      <p className="text-gray-500">No scraping logs found</p>
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredLogs
                    .filter(log => activeTab === 'recent' ? true : true) // Filter based on tab if needed
                    .slice(0, activeTab === 'recent' ? 5 : undefined)
                    .map(log => (
                      <TableRow key={log.id}>
                        <TableCell>
                          <div className="font-medium capitalize">
                            {log.source.replace('_', ' ')}
                          </div>
                        </TableCell>
                        <TableCell>{formatDate(log.created_at)}</TableCell>
                        <TableCell>{log.items_found || 0}</TableCell>
                        <TableCell>
                          <Badge className={`${getStatusColor(log.status)}`}>
                            {log.status}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-right">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleDownload(log.source)}
                            disabled={log.status === 'failed' || (log.items_found || 0) === 0}
                          >
                            <Download className="h-4 w-4 mr-1" />
                            Export
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))
                )}
              </TableBody>
            </Table>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default ScrapedDataTable;
