
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
  
  // Check for invalid team name
  let teamName = team.team || '';
  const isInvalidTeamName = !team.team || !isNaN(Number(team.team)) || team.team.length <= 2;
  
  // Map numeric team names to real team names if possible
  if (isInvalidTeamName && !isNaN(Number(team.team))) {
    const teamMap = {
      '1': 'Brechin City',
      '2': 'Buckie Thistle',
      '3': "Banks o' Dee",
      '4': 'Fraserburgh',
      '5': 'Formartine United',
      '6': 'Brora Rangers',
      '7': 'Huntly',
      '8': 'Inverurie Loco Works',
      '9': 'Keith',
      '10': 'Lossiemouth',
      '11': 'Nairn County',
      '12': 'Rothes',
      '13': 'Clachnacuddin',
      '14': 'Deveronvale',
      '15': 'Forres Mechanics',
      '16': 'Strathspey Thistle',
      '17': 'Turriff United',
      '18': 'Wick Academy'
    };
    
    if (teamMap[teamName]) {
      teamName = teamMap[teamName];
    } else {
      teamName = `Team ${teamName}`;
    }
  }
  
  // If we detect an invalid team name, log it for debugging
  if (isInvalidTeamName) {
    console.warn('Invalid team name detected:', team.team, team);
  }

  return (
    <TableRow 
      className={teamName === "Banks o' Dee" ? "bg-team-lightBlue/30" : ""}
    >
      <TableCell className="font-medium text-center">{position}</TableCell>
      <TableCell className="font-medium">
        <div className="flex items-center">
          <div className="w-10 h-10 flex items-center justify-center mr-2">
            {teamName === "Banks o' Dee" ? (
              <img 
                src="/lovable-uploads/8f2cd33f-1e08-494a-9aaa-65792ee9418a.png" 
                alt="Banks o' Dee logo"
                className="w-9 h-9 object-contain"
              />
            ) : (
              <img 
                src={team.logo || "https://placehold.co/60x60/gray/white?text=Logo"} 
                alt={`${teamName} logo`}
                className="w-8 h-8 object-contain"
              />
            )}
          </div>
          <span className={isInvalidTeamName ? "text-amber-600" : ""}>{teamName}</span>
          {isInvalidTeamName && !isNaN(Number(team.team)) && (
            <span className="ml-1 text-xs text-amber-600">(from position {position})</span>
          )}
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
