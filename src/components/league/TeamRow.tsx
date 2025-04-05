
import React from 'react';
import { motion } from 'framer-motion';
import { TableRow, TableCell } from '@/components/ui/Table';
import { TeamStats } from './types';
import FormIndicator from './FormIndicator';

interface TeamRowProps {
  team: TeamStats;
}

const TeamRow = ({ team }: TeamRowProps) => {
  // Check if the team is Banks o' Dee
  const isBanksODee = team.team.toLowerCase().includes("banks o' dee") || 
                      team.team.toLowerCase().includes("banks o dee");
  
  return (
    <motion.tr
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
      component={TableRow}
      className={isBanksODee ? "bg-team-lightBlue/20 hover:bg-team-lightBlue/30" : "hover:bg-gray-50"}
    >
      <TableCell className="py-2 text-center font-medium">
        {team.position}
      </TableCell>
      <TableCell className="py-2">
        <div className="flex items-center space-x-2">
          {team.logo ? (
            <img 
              src={team.logo} 
              alt={`${team.team} logo`} 
              className="w-5 h-5 object-contain"
            />
          ) : (
            <div className="w-5 h-5 bg-gray-100 rounded-full"></div>
          )}
          <span className={isBanksODee ? "font-semibold" : ""}>{team.team}</span>
        </div>
      </TableCell>
      <TableCell className="py-2 text-center">{team.played || 0}</TableCell>
      <TableCell className="py-2 text-center">{team.won || 0}</TableCell>
      <TableCell className="py-2 text-center">{team.drawn || 0}</TableCell>
      <TableCell className="py-2 text-center">{team.lost || 0}</TableCell>
      <TableCell className="py-2 text-center">{team.goalsFor || 0}</TableCell>
      <TableCell className="py-2 text-center">{team.goalsAgainst || 0}</TableCell>
      <TableCell className="py-2 text-center">
        <span className={team.goalDifference > 0 ? 'text-green-600' : team.goalDifference < 0 ? 'text-red-600' : ''}>
          {team.goalDifference > 0 ? '+' : ''}{team.goalDifference || 0}
        </span>
      </TableCell>
      <TableCell className="py-2 text-center font-bold">{team.points || 0}</TableCell>
      <TableCell className="py-2">
        <div className="flex space-x-1 justify-center">
          {team.form ? (
            team.form.map((result, idx) => (
              <FormIndicator key={idx} result={result} />
            ))
          ) : (
            <span className="text-gray-400 text-xs">-</span>
          )}
        </div>
      </TableCell>
    </motion.tr>
  );
};

export default TeamRow;
