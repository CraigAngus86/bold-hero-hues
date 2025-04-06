
import React from 'react';
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from '@/components/ui/Table';

interface DataTableProps {
  children?: React.ReactNode;
  className?: string;
  caption?: string;
  [key: string]: any; // For other props
}

// Using proper Table component from shadcn/ui
const DataTable = ({ children, className, caption, ...props }: DataTableProps) => {
  // Filter out any props that aren't valid HTML attributes
  const validProps: Record<string, any> = {};
  const knownInvalidProps = ['onRowClick', 'emptyMessage'];
  
  Object.keys(props).forEach(key => {
    if (!knownInvalidProps.includes(key)) {
      validProps[key] = props[key];
    }
  });

  return <Table className={className} {...validProps}>{children}</Table>;
};

export default DataTable;
