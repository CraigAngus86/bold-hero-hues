import React from 'react';
import { TableHeader, TableRow, TableHead } from '@/components/ui/table';

/**
 * League table header component displaying column titles
 * Memoized to prevent unnecessary re-renders
 */
const LeagueTableHeader: React.FC = React.memo(() => {
  return (
    <TableHeader className="bg-team-blue text-white">
      <TableRow>
        <TableHead className="text-white w-12">Pos</TableHead>
        <TableHead className="text-white text-left">Team</TableHead>
        <TableHead className="text-white text-center w-12">P</TableHead>
        <TableHead className="text-white text-center w-12">W</TableHead>
        <TableHead className="text-white text-center w-12">D</TableHead>
        <TableHead className="text-white text-center w-12">L</TableHead>
        <TableHead className="text-white text-center w-12">GF</TableHead>
        <TableHead className="text-white text-center w-12">GA</TableHead>
        <TableHead className="text-white text-center w-12">GD</TableHead>
        <TableHead className="text-white text-center w-12">Pts</TableHead>
        <TableHead className="text-white text-center">Form</TableHead>
      </TableRow>
    </TableHeader>
  );
});

LeagueTableHeader.displayName = 'LeagueTableHeader';

export default LeagueTableHeader;
