
import React from 'react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { TeamStats } from '@/types/fixtures';
import { formatDistanceToNow } from 'date-fns';

interface LeagueDataTableProps {
  leagueTable: TeamStats[];
}

const LeagueDataTable: React.FC<LeagueDataTableProps> = ({ leagueTable }) => {
  // Format form data for display
  const formatForm = (form: string[] | string) => {
    if (typeof form === 'string') {
      try {
        // Try to parse if it's a JSON string
        const formArray = JSON.parse(form);
        if (Array.isArray(formArray)) {
          return formArray;
        }
        // Return the original string if parsing didn't yield an array
        return form.split('').slice(-5);
      } catch {
        // If parsing failed, split the string
        return form.split('').slice(-5);
      }
    }
    // It's already an array
    return form.slice(-5);
  };

  // Render form icons
  const renderFormIcon = (result: string) => {
    switch (result.toLowerCase()) {
      case 'w':
        return <span className="inline-block w-5 h-5 rounded-full bg-green-500 text-white text-xs font-bold flex items-center justify-center">W</span>;
      case 'l':
        return <span className="inline-block w-5 h-5 rounded-full bg-red-500 text-white text-xs font-bold flex items-center justify-center">L</span>;
      case 'd':
        return <span className="inline-block w-5 h-5 rounded-full bg-yellow-500 text-white text-xs font-bold flex items-center justify-center">D</span>;
      default:
        return <span className="inline-block w-5 h-5 rounded-full bg-gray-300 text-white text-xs font-bold flex items-center justify-center">-</span>;
    }
  };

  // Get last update time
  const getLastUpdateTime = (team: TeamStats) => {
    if (!team.last_updated) return 'Unknown';
    try {
      return formatDistanceToNow(new Date(team.last_updated), { addSuffix: true });
    } catch (error) {
      return 'Invalid date';
    }
  };

  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-12">Pos</TableHead>
            <TableHead>Team</TableHead>
            <TableHead className="text-center">P</TableHead>
            <TableHead className="text-center">W</TableHead>
            <TableHead className="text-center">D</TableHead>
            <TableHead className="text-center">L</TableHead>
            <TableHead className="text-center">GF</TableHead>
            <TableHead className="text-center">GA</TableHead>
            <TableHead className="text-center">GD</TableHead>
            <TableHead className="text-center">Pts</TableHead>
            <TableHead className="text-center">Form</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {leagueTable.length === 0 ? (
            <TableRow>
              <TableCell colSpan={11} className="text-center py-10 text-gray-500">
                No league table data available
              </TableCell>
            </TableRow>
          ) : (
            leagueTable.map((team) => (
              <TableRow key={team.position} className={team.team === 'Banks o\' Dee' ? 'bg-blue-50' : undefined}>
                <TableCell className="font-medium">{team.position}</TableCell>
                <TableCell className="font-medium">
                  <div className="flex items-center">
                    {team.logo && (
                      <img 
                        src={team.logo} 
                        alt={`${team.team} logo`} 
                        className="w-5 h-5 mr-2 object-contain"
                      />
                    )}
                    {team.team}
                  </div>
                </TableCell>
                <TableCell className="text-center">{team.played}</TableCell>
                <TableCell className="text-center">{team.won}</TableCell>
                <TableCell className="text-center">{team.drawn}</TableCell>
                <TableCell className="text-center">{team.lost}</TableCell>
                <TableCell className="text-center">{team.goalsFor}</TableCell>
                <TableCell className="text-center">{team.goalsAgainst}</TableCell>
                <TableCell className="text-center">{team.goalDifference}</TableCell>
                <TableCell className="text-center font-bold">{team.points}</TableCell>
                <TableCell className="text-center">
                  <div className="flex space-x-1 justify-center">
                    {formatForm(team.form).map((result, index) => (
                      <div key={index}>{renderFormIcon(result)}</div>
                    ))}
                  </div>
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </div>
  );
};

export default LeagueDataTable;
