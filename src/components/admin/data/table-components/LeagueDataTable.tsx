
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
    <div className="border rounded-md overflow-auto max-h-96">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-12">Pos</TableHead>
            <TableHead>Team</TableHead>
            <TableHead className="w-12">P</TableHead>
            <TableHead className="w-12">W</TableHead>
            <TableHead className="w-12">D</TableHead>
            <TableHead className="w-12">L</TableHead>
            <TableHead className="w-12">GF</TableHead>
            <TableHead className="w-12">GA</TableHead>
            <TableHead className="w-12">GD</TableHead>
            <TableHead className="w-12">Pts</TableHead>
            <TableHead className="w-24">Form</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {leagueTable.map((team, index) => (
            <TeamDataRow key={index} team={team} />
          ))}
          {leagueTable.length === 0 && (
            <TableRow>
              <TableCell colSpan={11} className="text-center py-4">No data found. Try refreshing.</TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  );
};
