
import React from 'react';
import { TeamStats } from '@/types/fixtures';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { cn } from '@/lib/utils';

interface LeagueTableProps {
  teams: TeamStats[];
  className?: string;
  simplified?: boolean;
}

export const LeagueTable: React.FC<LeagueTableProps> = ({ 
  teams, 
  className,
  simplified = false
}) => {
  if (!teams || teams.length === 0) {
    return <div className="text-center py-4">No league data available</div>;
  }

  return (
    <div className={cn("overflow-auto", className)}>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-10 font-bold">#</TableHead>
            <TableHead className="min-w-[120px] font-bold">Team</TableHead>
            <TableHead className="w-10 font-bold">P</TableHead>
            {!simplified && (
              <>
                <TableHead className="w-10 font-bold">W</TableHead>
                <TableHead className="w-10 font-bold">D</TableHead>
                <TableHead className="w-10 font-bold">L</TableHead>
              </>
            )}
            {!simplified && (
              <>
                <TableHead className="w-10 font-bold">GF</TableHead>
                <TableHead className="w-10 font-bold">GA</TableHead>
              </>
            )}
            <TableHead className="w-10 font-bold">GD</TableHead>
            <TableHead className="w-10 font-bold">Pts</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {teams.map((team) => (
            <TableRow key={team.id}>
              <TableCell className="font-medium">{team.position}</TableCell>
              <TableCell className="font-medium truncate" title={team.team}>
                {team.team}
              </TableCell>
              <TableCell>{team.played}</TableCell>
              {!simplified && (
                <>
                  <TableCell>{team.won}</TableCell>
                  <TableCell>{team.drawn}</TableCell>
                  <TableCell>{team.lost}</TableCell>
                </>
              )}
              {!simplified && (
                <>
                  <TableCell>{team.goalsFor}</TableCell>
                  <TableCell>{team.goalsAgainst}</TableCell>
                </>
              )}
              <TableCell>{team.goalDifference}</TableCell>
              <TableCell className="font-bold">{team.points}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};

export default LeagueTable;
