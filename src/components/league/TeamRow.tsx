
import React from 'react';
import { TableRow, TableCell } from '@/components/ui/table';
import FormIndicator from './FormIndicator';
import { TeamStats } from './types';

interface TeamRowProps {
  team: TeamStats;
}

const TeamRow = ({ team }: TeamRowProps) => {
  // Ensure we have valid data for display
  const position = team.position || 0;
  const played = team.played || 0;
  const won = team.won || 0;
  const drawn = team.drawn || 0;
  const lost = team.lost || 0;
  const goalsFor = team.goalsFor || 0;
  const goalsAgainst = team.goalsAgainst || 0;
  const goalDifference = team.goalDifference || 0;
  const points = team.points || 0;
  const form = team.form || [];

  console.log('Rendering team row:', team);

  return (
    <TableRow 
      className={team.team === "Banks o' Dee" ? "bg-team-lightBlue/30" : ""}
    >
      <TableCell className="font-medium text-center">{position}</TableCell>
      <TableCell className="font-medium">
        <div className="flex items-center">
          <div className="w-10 h-10 flex items-center justify-center mr-2">
            {team.team === "Banks o' Dee" ? (
              <img 
                src="/lovable-uploads/8f2cd33f-1e08-494a-9aaa-65792ee9418a.png" 
                alt="Banks o' Dee logo"
                className="w-9 h-9 object-contain"
              />
            ) : (
              <img 
                src={team.logo || "https://placehold.co/60x60/gray/white?text=Logo"} 
                alt={`${team.team} logo`}
                className="w-8 h-8 object-contain"
              />
            )}
          </div>
          <span>{team.team}</span>
        </div>
      </TableCell>
      <TableCell className="text-center">{played}</TableCell>
      <TableCell className="text-center">{won}</TableCell>
      <TableCell className="text-center">{drawn}</TableCell>
      <TableCell className="text-center">{lost}</TableCell>
      <TableCell className="text-center">{goalsFor}</TableCell>
      <TableCell className="text-center">{goalsAgainst}</TableCell>
      <TableCell className="text-center">{goalDifference}</TableCell>
      <TableCell className="text-center font-bold">{points}</TableCell>
      <TableCell>
        <div className="flex items-center justify-center space-x-1">
          {form.length > 0 ? (
            form.map((result, idx) => (
              <FormIndicator key={idx} result={result} />
            ))
          ) : (
            <span className="text-xs text-gray-400">-</span>
          )}
        </div>
      </TableCell>
    </TableRow>
  );
};

export default TeamRow;
