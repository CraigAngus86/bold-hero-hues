
import React from 'react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';

export interface DataTableProps<T> {
  columns: Array<{
    key: string;
    header: React.ReactNode;
    cell: (item: T) => React.ReactNode;
    width?: string;
    sortable?: boolean;
  }>;
  data: T[];
  isLoading?: boolean;
  emptyMessage?: string;
  rowClassName?: (item: T) => string;
}

function DataTable<T>({
  columns,
  data,
  isLoading = false,
  emptyMessage = 'No data available',
  rowClassName
}: DataTableProps<T>) {
  if (isLoading) {
    return (
      <div className="flex justify-center items-center py-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!data || data.length === 0) {
    return (
      <div className="text-center py-8 text-muted-foreground">
        {emptyMessage}
      </div>
    );
  }

  return (
    <div className="border rounded-md overflow-hidden">
      <Table>
        <TableHeader>
          <TableRow>
            {columns.map((column) => (
              <TableHead 
                key={column.key}
                className={column.width ? `w-[${column.width}]` : undefined}
              >
                {column.header}
              </TableHead>
            ))}
          </TableRow>
        </TableHeader>
        <TableBody>
          {data.map((item, index) => (
            <TableRow 
              key={index}
              className={rowClassName ? rowClassName(item) : undefined}
            >
              {columns.map((column) => (
                <TableCell key={`${index}-${column.key}`}>
                  {column.cell(item)}
                </TableCell>
              ))}
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}

export default DataTable;
