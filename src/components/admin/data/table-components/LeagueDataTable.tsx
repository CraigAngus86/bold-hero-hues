
import React from 'react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/Table";
import { TeamStats } from '@/components/league/types';
import { TeamDataRow } from './TeamDataRow';

interface LeagueDataTableProps {
  leagueTable: TeamStats[];
}

/**
 * Component displaying the league data in a table format
 */
export const LeagueDataTable: React.FC<LeagueDataTableProps> = ({ leagueTable }) => {
  return (
    <div className="border rounded-md overflow-auto max-h-96 shadow-sm">
      <Table>
        <TableHeader className="bg-gray-50 sticky top-0 z-10">
          <TableRow>
            <TableHead className="w-12 font-semibold">Pos</TableHead>
            <TableHead className="font-semibold">Team</TableHead>
            <TableHead className="w-12 font-semibold">P</TableHead>
            <TableHead className="w-12 font-semibold">W</TableHead>
            <TableHead className="w-12 font-semibold">D</TableHead>
            <TableHead className="w-12 font-semibold">L</TableHead>
            <TableHead className="w-12 font-semibold">GF</TableHead>
            <TableHead className="w-12 font-semibold">GA</TableHead>
            <TableHead className="w-12 font-semibold">GD</TableHead>
            <TableHead className="w-12 font-semibold">Pts</TableHead>
            <TableHead className="w-24 font-semibold">Form</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {leagueTable.map((team, index) => (
            <TeamDataRow key={index} team={team} />
          ))}
          {leagueTable.length === 0 && (
            <TableRow>
              <TableCell colSpan={11} className="text-center py-6 text-gray-500">
                No data found. Try refreshing.
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  );
};
