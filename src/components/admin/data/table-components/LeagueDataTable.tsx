
import React from 'react';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { Card, CardContent } from "@/components/ui/card";
import DataWarningAlert from './DataWarningAlert';
import LastUpdatedInfo from './LastUpdatedInfo';

interface LeagueDataTableProps {
  data: any[];
  columns: {
    title: string;
    field: string;
    className?: string;
    render?: (row: any) => React.ReactNode;
  }[];
  highlightTeam?: string;
  isLoading?: boolean;
  lastUpdated?: Date | string | null;
  emptyMessage?: string;
  error?: string;
}

const LeagueDataTable: React.FC<LeagueDataTableProps> = ({
  data,
  columns,
  highlightTeam,
  isLoading = false,
  lastUpdated = null,
  emptyMessage = "No data available",
  error
}) => {
  if (isLoading) {
    return (
      <Card>
        <CardContent className="p-0">
          <div className="flex justify-center items-center py-16">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (error) {
    return (
      <DataWarningAlert
        title="Unable to load data"
        description={error}
      />
    );
  }

  return (
    <div>
      <Card className="overflow-hidden">
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                {columns.map((column, i) => (
                  <TableHead key={i} className={column.className}>
                    {column.title}
                  </TableHead>
                ))}
              </TableRow>
            </TableHeader>
            <TableBody>
              {data.length > 0 ? (
                data.map((row, i) => (
                  <TableRow 
                    key={i}
                    className={
                      highlightTeam && 
                      row.team?.toLowerCase() === highlightTeam.toLowerCase() 
                        ? "bg-primary/10" 
                        : undefined
                    }
                  >
                    {columns.map((column, j) => (
                      <TableCell key={j} className={column.className}>
                        {column.render ? column.render(row) : row[column.field]}
                      </TableCell>
                    ))}
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={columns.length} className="h-24 text-center">
                    {emptyMessage}
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      </Card>
      {lastUpdated && (
        <div className="mt-2 flex justify-end">
          <LastUpdatedInfo date={lastUpdated} />
        </div>
      )}
    </div>
  );
};

export default LeagueDataTable;
