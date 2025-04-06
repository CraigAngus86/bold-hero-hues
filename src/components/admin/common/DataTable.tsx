
import React from 'react';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '@/components/ui/table';
import { Loader2 } from 'lucide-react';

export interface ColumnDef<T> {
  key: string;
  header: string;
  cell: (item: T) => React.ReactNode;
  sortable?: boolean;
}

export interface DataTableProps<T> {
  columns: ColumnDef<T>[];
  data: T[];
  isLoading?: boolean;
  emptyMessage?: string;
  noDataMessage?: string; // Added for backward compatibility
  onRowClick?: (item: T) => void;
}

export const DataTable = <T,>({ 
  columns, 
  data, 
  isLoading = false, 
  emptyMessage = 'No data available',
  noDataMessage, // For backward compatibility
  onRowClick
}: DataTableProps<T>) => {
  const displayMessage = noDataMessage || emptyMessage;
  
  if (isLoading) {
    return (
      <div className="w-full flex flex-col items-center justify-center py-8">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground mb-2" />
        <p className="text-muted-foreground text-sm">Loading data...</p>
      </div>
    );
  }

  return (
    <div className="w-full overflow-auto">
      <Table>
        <TableHeader>
          <TableRow>
            {columns.map((column) => (
              <TableHead key={column.key.toString()}>
                {column.header}
              </TableHead>
            ))}
          </TableRow>
        </TableHeader>
        <TableBody>
          {data.length > 0 ? (
            data.map((row, rowIndex) => (
              <TableRow 
                key={rowIndex} 
                onClick={() => onRowClick && onRowClick(row)}
                className={onRowClick ? 'cursor-pointer' : ''}
              >
                {columns.map((column, colIndex) => (
                  <TableCell key={`${rowIndex}-${colIndex}`}>
                    {column.cell(row)}
                  </TableCell>
                ))}
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell colSpan={columns.length} className="text-center p-4">
                {displayMessage}
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  );
};

export default DataTable;
