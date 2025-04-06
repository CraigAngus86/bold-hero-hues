
import React from 'react';
import { Table } from '@/components/ui/Table';

// If you were using CustomTable before, now we need to use the regular Table component
const DataTable = (props) => {
  return <Table {...props} />;
};

export default DataTable;
