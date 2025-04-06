
import React, { useState } from 'react';
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { FileWarning, CheckCircle, XCircle, Check, RefreshCw } from 'lucide-react';
import { Alert, AlertTitle, AlertDescription } from '@/components/ui/alert';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { format } from 'date-fns';
import { parseISO } from 'date-fns/parseISO';
import { TeamDataRow } from './table-components/TeamDataRow';
import { TeamStats } from '@/types/fixtures';

interface ScrapedDataTableProps {
  data: any[];
  loading?: boolean;
  onRefresh?: () => void;
  onImport?: (data: any[]) => void;
  error?: string | null;
  lastScrape?: {
    timestamp: string;
    status: string;
    itemsFound?: number;
    source?: string;
  };
  dataType: 'league-table' | 'fixtures' | 'news' | 'generic';
}

export const ScrapedDataTable: React.FC<ScrapedDataTableProps> = ({
  data,
  loading = false,
  onRefresh,
  onImport,
  error = null,
  lastScrape,
  dataType,
}) => {
  const [selectedTab, setSelectedTab] = useState('data');

  // Get timestamp from last scrape with fallback
  const getTimestampDisplay = () => {
    if (!lastScrape?.timestamp) return 'Never';
    
    try {
      const date = parseISO(lastScrape.timestamp.toString());
      return format(date, 'MMM d, yyyy HH:mm:ss');
    } catch {
      return lastScrape.timestamp.toString();
    }
  };

  // Render table content based on dataType
  const renderTableContent = () => {
    if (loading) {
      return (
        <TableRow>
          <TableCell colSpan={getColumnCount()} className="text-center py-10">
            <div className="flex flex-col items-center justify-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
              <p className="mt-2 text-sm text-gray-500">Loading data...</p>
            </div>
          </TableCell>
        </TableRow>
      );
    }

    if (error) {
      return (
        <TableRow>
          <TableCell colSpan={getColumnCount()} className="text-center py-10">
            <Alert variant="destructive">
              <FileWarning className="h-5 w-5" />
              <AlertTitle>Scraping Error</AlertTitle>
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          </TableCell>
        </TableRow>
      );
    }

    if (!data || data.length === 0) {
      return (
        <TableRow>
          <TableCell colSpan={getColumnCount()} className="text-center py-10">
            <p className="text-gray-500">No data found</p>
            {onRefresh && (
              <Button variant="outline" size="sm" className="mt-2" onClick={onRefresh}>
                <RefreshCw className="mr-2 h-4 w-4" />
                Fetch Data
              </Button>
            )}
          </TableCell>
        </TableRow>
      );
    }

    if (dataType === 'league-table') {
      return (data as TeamStats[]).map((team) => <TeamDataRow key={team.id} team={team} />);
    }

    // Default table display for other data types
    return data.map((item, index) => (
      <TableRow key={index}>
        {getColumnsForDataType(dataType).map((column) => (
          <TableCell key={column}>{renderCell(item, column)}</TableCell>
        ))}
      </TableRow>
    ));
  };

  // Helper to determine column count
  const getColumnCount = (): number => {
    if (dataType === 'league-table') return 11;
    return getColumnsForDataType(dataType).length;
  };

  // Get appropriate columns based on data type
  const getColumnsForDataType = (type: string): string[] => {
    switch (type) {
      case 'league-table':
        return ['position', 'team', 'played', 'won', 'drawn', 'lost', 'goalsFor', 'goalsAgainst', 'goalDifference', 'points', 'form'];
      case 'fixtures':
        return ['date', 'time', 'home_team', 'away_team', 'competition', 'venue'];
      case 'news':
        return ['title', 'date', 'category', 'source'];
      default:
        return Object.keys(data[0] || {}).slice(0, 6);
    }
  };

  // Render individual cell based on column type
  const renderCell = (item: any, column: string): React.ReactNode => {
    const value = item[column];

    // Special rendering for date fields
    if (column.includes('date') && value) {
      try {
        return format(parseISO(value.toString()), 'MMM d, yyyy');
      } catch {
        return value;
      }
    }

    // Special rendering for form array
    if (column === 'form' && Array.isArray(value)) {
      return (
        <div className="flex space-x-1">
          {value.map((result, idx) => (
            <span
              key={idx}
              className={`inline-block w-5 h-5 text-xs flex items-center justify-center rounded-full ${
                result === 'W' ? 'bg-green-500 text-white' :
                result === 'D' ? 'bg-yellow-500 text-white' :
                result === 'L' ? 'bg-red-500 text-white' : 'bg-gray-200'
              }`}
            >
              {result}
            </span>
          ))}
        </div>
      );
    }

    return value;
  };

  // Custom header rendering
  const renderTableHeader = () => {
    if (dataType === 'league-table') {
      return (
        <TableRow>
          <TableHead>#</TableHead>
          <TableHead>Team</TableHead>
          <TableHead>P</TableHead>
          <TableHead>W</TableHead>
          <TableHead>D</TableHead>
          <TableHead>L</TableHead>
          <TableHead>GF</TableHead>
          <TableHead>GA</TableHead>
          <TableHead>GD</TableHead>
          <TableHead>Pts</TableHead>
          <TableHead>Form</TableHead>
        </TableRow>
      );
    }

    return (
      <TableRow>
        {getColumnsForDataType(dataType).map((column) => (
          <TableHead key={column} className="capitalize">
            {column.replace(/_/g, ' ')}
          </TableHead>
        ))}
      </TableRow>
    );
  };

  return (
    <div className="space-y-4">
      {/* Status Badge */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <Badge variant={lastScrape?.status === 'success' ? 'success' : lastScrape?.status === 'error' ? 'destructive' : 'outline'}>
            {lastScrape?.status === 'success' ? <CheckCircle className="h-3 w-3 mr-1" /> : 
             lastScrape?.status === 'error' ? <XCircle className="h-3 w-3 mr-1" /> : null}
            Last scrape: {getTimestampDisplay()}
          </Badge>
          {lastScrape?.itemsFound !== undefined && (
            <Badge variant="outline">{lastScrape.itemsFound} items found</Badge>
          )}
          {lastScrape?.source && (
            <Badge variant="secondary">Source: {lastScrape.source}</Badge>
          )}
        </div>
        <div className="flex space-x-2">
          {onRefresh && (
            <Button 
              variant="outline" 
              size="sm" 
              onClick={onRefresh} 
              disabled={loading}
            >
              <RefreshCw className={`mr-2 h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
              Refresh Data
            </Button>
          )}
          {onImport && data?.length > 0 && !loading && (
            <Button 
              size="sm" 
              onClick={() => onImport(data)} 
              disabled={loading}
            >
              <Check className="mr-2 h-4 w-4" />
              Import Data
            </Button>
          )}
        </div>
      </div>

      {/* Data Table */}
      <Tabs value={selectedTab} onValueChange={setSelectedTab}>
        <TabsList>
          <TabsTrigger value="data">Table View</TabsTrigger>
          <TabsTrigger value="raw">Raw Data</TabsTrigger>
        </TabsList>
        <TabsContent value="data">
          <div className="border rounded-md">
            <Table>
              <TableHeader>
                {renderTableHeader()}
              </TableHeader>
              <TableBody>
                {renderTableContent()}
              </TableBody>
            </Table>
          </div>
        </TabsContent>
        <TabsContent value="raw">
          <div className="border rounded-md p-4">
            <pre className="text-xs overflow-auto max-h-96">
              {JSON.stringify(data, null, 2)}
            </pre>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};
