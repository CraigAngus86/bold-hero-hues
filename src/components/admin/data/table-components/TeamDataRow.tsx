
import React from 'react';
import { TableCell, TableRow } from "@/components/ui/table";
import { TeamStats } from '@/types/fixtures';
import { AlertTriangle } from "lucide-react";
import { FormDisplay } from './FormDisplay';

interface TeamDataRowProps {
  team: TeamStats;
}

/**
 * Component displaying a single team's data row in the league table
 */
export const TeamDataRow: React.FC<TeamDataRowProps> = ({ team }) => {
  const isInvalidTeam = !isNaN(Number(team.team));
  
  // Ensure form is always an array
  const formArray = React.useMemo(() => {
    if (Array.isArray(team.form)) {
      return team.form;
    }
    
    if (typeof team.form === 'string') {
      return team.form.toString().split('');
    }
    
    return [];
  }, [team.form]);
  
  return (
    <TableRow className={isInvalidTeam ? "bg-yellow-50" : ""}>
      <TableCell>{team.position}</TableCell>
      <TableCell className="font-medium">
        {isInvalidTeam ? (
          <span className="text-yellow-600 flex items-center">
            <AlertTriangle className="h-4 w-4 mr-1" />
            {team.team} (Invalid)
          </span>
        ) : (
          team.team
        )}
      </TableCell>
      <TableCell>{team.played}</TableCell>
      <TableCell>{team.won}</TableCell>
      <TableCell>{team.drawn}</TableCell>
      <TableCell>{team.lost}</TableCell>
      <TableCell>{team.goalsFor}</TableCell>
      <TableCell>{team.goalsAgainst}</TableCell>
      <TableCell>{team.goalDifference}</TableCell>
      <TableCell className="font-bold">{team.points}</TableCell>
      <TableCell>
        <FormDisplay form={formArray} />
      </TableCell>
    </TableRow>
  );
};
