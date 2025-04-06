
import React, { useState, useEffect } from 'react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { ChevronDown, ChevronUp } from 'lucide-react';

export interface CustomTableColumn {
  key: string;
  title: string;
  sortable?: boolean;
  render?: (item: any) => React.ReactNode;
}

export interface CustomTableProps {
  columns: CustomTableColumn[];
  data: any[];
  noDataMessage?: string;
  initialSortKey?: string;
  initialSortDirection?: 'asc' | 'desc';
}

const CustomTable: React.FC<CustomTableProps> = ({
  columns,
  data,
  noDataMessage = 'No data available',
  initialSortKey,
  initialSortDirection = 'asc'
}) => {
  const [sortKey, setSortKey] = useState<string | null>(initialSortKey || null);
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>(initialSortDirection);
  const [sortedData, setSortedData] = useState<any[]>(data);

  useEffect(() => {
    if (sortKey) {
      const sorted = [...data].sort((a, b) => {
        if (a[sortKey] === null) return 1;
        if (b[sortKey] === null) return -1;
        
        if (typeof a[sortKey] === 'string' && typeof b[sortKey] === 'string') {
          return sortDirection === 'asc' 
            ? a[sortKey].localeCompare(b[sortKey])
            : b[sortKey].localeCompare(a[sortKey]);
        } 
        
        return sortDirection === 'asc' 
          ? a[sortKey] - b[sortKey]
          : b[sortKey] - a[sortKey];
      });
      setSortedData(sorted);
    } else {
      setSortedData(data);
    }
  }, [data, sortKey, sortDirection]);

  const handleSort = (key: string) => {
    if (sortKey === key) {
      // Toggle direction if already sorting by this column
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      // Set new sort column and default to ascending
      setSortKey(key);
      setSortDirection('asc');
    }
  };

  return (
    <div className="w-full overflow-auto">
      <Table>
        <TableHeader>
          <TableRow>
            {columns.map((column) => (
              <TableHead
                key={column.key}
                className={column.sortable ? 'cursor-pointer hover:bg-muted/50' : ''}
                onClick={() => column.sortable && handleSort(column.key)}
              >
                <div className="flex items-center gap-2">
                  {column.title}
                  {column.sortable && sortKey === column.key && (
                    sortDirection === 'asc' ? 
                      <ChevronUp className="h-4 w-4" /> : 
                      <ChevronDown className="h-4 w-4" />
                  )}
                </div>
              </TableHead>
            ))}
          </TableRow>
        </TableHeader>
        <TableBody>
          {sortedData.length > 0 ? (
            sortedData.map((item, index) => (
              <TableRow key={item.id || index}>
                {columns.map((column) => (
                  <TableCell key={`${item.id || index}-${column.key}`}>
                    {column.render 
                      ? column.render(item) 
                      : item[column.key]}
                  </TableCell>
                ))}
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell colSpan={columns.length} className="text-center py-6">
                {noDataMessage}
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  );
};

export default CustomTable;
