
import React from 'react';
import { TableRow, TableCell } from '@/components/ui/table';
import FormIndicator from './FormIndicator';
import { TeamStats } from './types';

interface TeamRowProps {
  team: TeamStats;
}

const TeamRow = ({ team }: TeamRowProps) => {
  return (
    <TableRow 
      className={team.team === "Banks o' Dee" ? "bg-team-lightBlue/30" : ""}
    >
      <TableCell className="font-medium text-center">{team.position}</TableCell>
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
      <TableCell className="text-center">{team.played}</TableCell>
      <TableCell className="text-center">{team.won}</TableCell>
      <TableCell className="text-center">{team.drawn}</TableCell>
      <TableCell className="text-center">{team.lost}</TableCell>
      <TableCell className="text-center">{team.goalsFor}</TableCell>
      <TableCell className="text-center">{team.goalsAgainst}</TableCell>
      <TableCell className="text-center">{team.goalDifference}</TableCell>
      <TableCell className="text-center font-bold">{team.points}</TableCell>
      <TableCell>
        <div className="flex items-center justify-center space-x-1">
          {team.form && team.form.length > 0 ? (
            team.form.map((result, idx) => (
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
