
import React from 'react';
import { motion } from 'framer-motion';
import { ChevronRightIcon } from 'lucide-react';
import { cn } from '@/lib/utils';

interface TeamStats {
  id: number;
  position: number;
  team: string;
  played: number;
  won: number;
  drawn: number;
  lost: number;
  goalsFor: number;
  goalsAgainst: number;
  goalDifference: number;
  points: number;
  form: ('W' | 'D' | 'L')[];
}

interface LeagueTableProps {
  data: TeamStats[];
  highlightTeam?: string;
  showPositions?: number;
  className?: string;
}

const LeagueTable: React.FC<LeagueTableProps> = ({
  data,
  highlightTeam = "Banks o' Dee",
  showPositions = 5,
  className,
}) => {
  // Sort data by position
  const sortedData = [...data].sort((a, b) => a.position - b.position);
  const displayData = sortedData.slice(0, showPositions);
  
  // Find position of highlighted team
  const highlightedTeam = sortedData.find(team => team.team === highlightTeam);
  const maxPoints = Math.max(...sortedData.map(team => team.points));
  
  return (
    <motion.div
      className={cn(
        "card-premium rounded-lg bg-white shadow-card overflow-hidden",
        className
      )}
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ duration: 0.5 }}
    >
      <div className="bg-primary-gradient p-4 text-white">
        <h3 className="font-bold text-lg">League Table</h3>
        <p className="text-sm text-white/80">Highland League {new Date().getFullYear()}</p>
      </div>
      
      {highlightedTeam && (
        <div className="p-4 bg-accent-500/10 border-l-4 border-accent-500">
          <div className="flex items-center">
            <div className="bg-white shadow-md w-12 h-12 flex items-center justify-center rounded-full font-bold text-xl text-team-blue mr-4 animate-pulse">
              {highlightedTeam.position}
            </div>
            
            <div>
              <h4 className="font-bold text-lg text-team-blue">{highlightedTeam.team}</h4>
              <div className="flex items-center text-sm space-x-4 mt-1">
                <span className="text-gray-600">
                  Played: <strong>{highlightedTeam.played}</strong>
                </span>
                <span className="text-gray-600">
                  Points: <strong>{highlightedTeam.points}</strong>
                </span>
              </div>
            </div>
          </div>
          
          <div className="mt-3 flex space-x-1">
            {highlightedTeam.form.map((result, index) => (
              <span 
                key={index} 
                className={cn(
                  "form-item",
                  result === 'W' ? "win" : result === 'D' ? "draw" : "loss"
                )}
              >
                {result}
              </span>
            ))}
          </div>
        </div>
      )}
      
      <div className="p-4">
        <table className="w-full">
          <thead>
            <tr className="border-b border-gray-200">
              <th className="py-2 text-left text-xs font-semibold text-gray-500">Pos</th>
              <th className="py-2 text-left text-xs font-semibold text-gray-500">Team</th>
              <th className="py-2 text-right text-xs font-semibold text-gray-500">P</th>
              <th className="py-2 text-right text-xs font-semibold text-gray-500">GD</th>
              <th className="py-2 text-right text-xs font-semibold text-gray-500">Pts</th>
            </tr>
          </thead>
          <tbody>
            {displayData.map((team, index) => (
              <motion.tr 
                key={team.id}
                className={cn(
                  "border-b border-gray-100 hover:bg-gray-50",
                  team.team === highlightTeam ? "bg-accent-500/10" : ""
                )}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.3, delay: index * 0.1 }}
              >
                <td className="py-3 text-sm font-medium">
                  {team.position <= 3 ? (
                    <span className="bg-green-100 text-green-800 font-bold w-6 h-6 rounded-full flex items-center justify-center">
                      {team.position}
                    </span>
                  ) : (
                    team.position
                  )}
                </td>
                
                <td className={cn(
                  "py-3 text-sm",
                  team.team === highlightTeam ? "font-bold" : ""
                )}>
                  {team.team}
                </td>
                
                <td className="py-3 text-sm text-right">{team.played}</td>
                
                <td className={cn(
                  "py-3 text-sm text-right",
                  team.goalDifference > 0 ? "text-green-600" : 
                  team.goalDifference < 0 ? "text-red-600" : "text-gray-600"
                )}>
                  {team.goalDifference > 0 ? `+${team.goalDifference}` : team.goalDifference}
                </td>
                
                <td className="py-3 text-sm font-bold text-right">
                  <div className="relative">
                    <span>{team.points}</span>
                    <div
                      className="absolute bottom-0 left-0 h-1 bg-team-blue rounded-full opacity-25"
                      style={{ width: `${(team.points / maxPoints) * 100}%` }}
                    ></div>
                  </div>
                </td>
              </motion.tr>
            ))}
          </tbody>
        </table>
        
        <div className="mt-4">
          <a 
            href="/league-table"
            className="flex items-center justify-center w-full bg-gray-100 hover:bg-gray-200 text-team-blue font-medium px-4 py-2 rounded transition-colors"
          >
            View Full Table
            <ChevronRightIcon className="h-4 w-4 ml-1" />
          </a>
        </div>
      </div>
    </motion.div>
  );
};

export default LeagueTable;
