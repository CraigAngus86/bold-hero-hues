
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

// Using proper Table component from shadcn/ui
const DataTable = (props) => {
  return <Table {...props} />;
};

export default DataTable;
