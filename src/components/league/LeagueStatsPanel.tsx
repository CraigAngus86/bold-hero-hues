
import React from 'react';
import { motion } from 'framer-motion';
import { TeamStats } from './types';
import { Trophy, Calendar, TrendingUp, Shield } from 'lucide-react';
import FormIndicator from './FormIndicator';

interface LeagueStatsPanelProps {
  leagueData: TeamStats[];
  season?: string;
}

const LeagueStatsPanel = ({ leagueData, season = "2024-2025" }: LeagueStatsPanelProps) => {
  // Get the leader (team at position 1)
  const leader = leagueData.find(team => team.position === 1);
  
  // Find Banks o' Dee position and data
  const ourTeam = leagueData.find(team => 
    team.team.toLowerCase().includes("banks o' dee") || 
    team.team.toLowerCase().includes("banks o dee")
  );
  
  // Get total number of teams
  const totalTeams = leagueData.length;
  
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: 0.1 }}
      className="mb-8 grid grid-cols-1 md:grid-cols-4 gap-4"
    >
      <div className="bg-white shadow-sm rounded-lg p-4 flex items-center">
        <Trophy className="w-10 h-10 text-team-blue mr-4" />
        <div>
          <p className="text-xs text-gray-500">Current Leaders</p>
          <p className="font-bold text-lg">{leader?.team || "No data available"}</p>
        </div>
      </div>
      <div className="bg-white shadow-sm rounded-lg p-4 flex items-center">
        <Calendar className="w-10 h-10 text-team-blue mr-4" />
        <div>
          <p className="text-xs text-gray-500">Season</p>
          <p className="font-bold text-lg">{season}</p>
        </div>
      </div>
      <div className="bg-white shadow-sm rounded-lg p-4 flex items-center">
        <TrendingUp className="w-10 h-10 text-team-blue mr-4" />
        <div>
          <p className="text-xs text-gray-500">Our Position</p>
          <p className="font-bold text-lg">
            {ourTeam?.position || "N/A"}
            {totalTeams > 0 && <span className="text-xs text-gray-500 ml-1">/ {totalTeams}</span>}
          </p>
        </div>
      </div>
      <div className="bg-white shadow-sm rounded-lg p-4 flex items-center">
        <Shield className="w-10 h-10 text-team-blue mr-4" />
        <div>
          <p className="text-xs text-gray-500">Our Form</p>
          <div className="flex items-center space-x-1 mt-1">
            {ourTeam?.form && ourTeam.form.length > 0 ? (
              ourTeam.form.map((result, idx) => (
                <FormIndicator key={idx} result={result} />
              ))
            ) : (
              <span className="text-xs text-gray-500">No form data available</span>
            )}
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default LeagueStatsPanel;
