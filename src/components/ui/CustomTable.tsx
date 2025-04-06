
import React from 'react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';

interface CustomTableColumn {
  key: string;
  title: string;
  sortable?: boolean;
  render?: (item: any) => React.ReactNode;
}

interface CustomTableProps {
  columns: CustomTableColumn[];
  data: any[];
  noDataMessage?: string;
}

const CustomTable: React.FC<CustomTableProps> = ({
  columns,
  data,
  noDataMessage = 'No data available'
}) => {
  return (
    <div className="w-full overflow-auto">
      <Table>
        <TableHeader>
          <TableRow>
            {columns.map((column) => (
              <TableHead
                key={column.key}
                className={column.sortable ? 'cursor-pointer' : ''}
              >
                {column.title}
              </TableHead>
            ))}
          </TableRow>
        </TableHeader>
        <TableBody>
          {data.length > 0 ? (
            data.map((item, index) => (
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
