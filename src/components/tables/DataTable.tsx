
import React from 'react';
import Table from '@/components/ui/Table';
import type { TableColumn } from '@/components/ui/Table';

interface DataTableProps<T> {
  data: T[];
  columns: TableColumn<T>[];
  isLoading?: boolean;
  onRowClick?: (item: T) => void;
  title?: string;
  description?: string;
  className?: string;
  emptyMessage?: string;
}

function DataTable<T extends Record<string, any>>({
  data,
  columns,
  isLoading = false,
  onRowClick,
  title,
  description,
  className,
  emptyMessage = "No data available",
}: DataTableProps<T>) {
  return (
    <div className={className}>
      {(title || description) && (
        <div className="mb-4">
          {title && <h2 className="text-xl font-semibold">{title}</h2>}
          {description && <p className="text-sm text-gray-500">{description}</p>}
        </div>
      )}
      <div className="rounded-md border">
        <Table
          data={data}
          columns={columns}
          isLoading={isLoading}
          onRowClick={onRowClick}
          noDataMessage={emptyMessage}
        />
      </div>
    </div>
  );
}

export default DataTable;
