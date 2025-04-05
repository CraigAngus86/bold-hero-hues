
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
    <div className="border rounded-lg overflow-auto max-h-[600px] shadow-sm hover:shadow-md transition-shadow duration-200">
      <Table>
        <TableHeader className="bg-gradient-to-r from-gray-50 to-gray-100 sticky top-0 z-10">
          <TableRow>
            <TableHead className="w-12 font-semibold text-team-blue">Pos</TableHead>
            <TableHead className="font-semibold text-team-blue">Team</TableHead>
            <TableHead className="w-12 font-semibold text-team-blue">P</TableHead>
            <TableHead className="w-12 font-semibold text-team-blue">W</TableHead>
            <TableHead className="w-12 font-semibold text-team-blue">D</TableHead>
            <TableHead className="w-12 font-semibold text-team-blue">L</TableHead>
            <TableHead className="w-12 font-semibold text-team-blue">GF</TableHead>
            <TableHead className="w-12 font-semibold text-team-blue">GA</TableHead>
            <TableHead className="w-12 font-semibold text-team-blue">GD</TableHead>
            <TableHead className="w-12 font-semibold text-team-blue">Pts</TableHead>
            <TableHead className="w-24 font-semibold text-team-blue">Form</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {leagueTable.map((team, index) => (
            <TeamDataRow key={index} team={team} />
          ))}
          {leagueTable.length === 0 && (
            <TableRow>
              <TableCell colSpan={11} className="text-center py-8 text-gray-500">
                No data found. Try refreshing.
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  );
};
