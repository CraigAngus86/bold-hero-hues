
import React from 'react';
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from '@/components/ui/table'; // Ensure lowercase 'table'
import { Loader2 } from 'lucide-react';

interface DataTableProps {
  children?: React.ReactNode;
  className?: string;
  caption?: string;
  columns?: any[];
  data?: any[];
  isLoading?: boolean;
  onRowClick?: (item: any) => void;
  emptyMessage?: string;
  [key: string]: any; // For other props
}

const DataTable = ({ 
  children, 
  className, 
  caption, 
  columns,
  data,
  isLoading,
  onRowClick,
  emptyMessage = "No data available",
  ...props 
}: DataTableProps) => {
  // Filter out any props that aren't valid HTML attributes
  const validProps: Record<string, any> = {};
  const knownInvalidProps = ['onRowClick', 'emptyMessage', 'columns', 'data', 'isLoading'];
  
  Object.keys(props).forEach(key => {
    if (!knownInvalidProps.includes(key)) {
      validProps[key] = props[key];
    }
  });

  if (children) {
    return <Table className={className} {...validProps}>
      {caption && <TableCaption>{caption}</TableCaption>}
      {children}
    </Table>;
  }

  if (isLoading) {
    return (
      <div className="w-full flex justify-center items-center py-12">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!data || data.length === 0) {
    return (
      <div className="w-full text-center py-12 border border-dashed rounded-md">
        <p className="text-gray-500">{emptyMessage}</p>
      </div>
    );
  }

  return (
    <Table className={className} {...validProps}>
      {caption && <TableCaption>{caption}</TableCaption>}
      <TableHeader>
        <TableRow>
          {columns && columns.map((column, index) => (
            <TableHead key={column.key || index} className={column.className}>
              {column.title}
            </TableHead>
          ))}
        </TableRow>
      </TableHeader>
      <TableBody>
        {data.map((item, rowIndex) => (
          <TableRow 
            key={rowIndex} 
            onClick={() => onRowClick && onRowClick(item)}
            className={onRowClick ? 'cursor-pointer hover:bg-gray-50' : ''}
          >
            {columns && columns.map((column, colIndex) => (
              <TableCell key={`${rowIndex}-${column.key || colIndex}`}>
                {column.render ? column.render(item) : item[column.key]}
              </TableCell>
            ))}
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
};

export default DataTable;
