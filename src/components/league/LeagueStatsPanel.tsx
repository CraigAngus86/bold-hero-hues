
import React from 'react';
import { motion } from 'framer-motion';
import { TeamStats } from './types';
import { Trophy, Calendar, TrendingUp, Shield } from 'lucide-react';
import FormIndicator from './FormIndicator';

interface LeagueStatsPanelProps {
  leagueData: TeamStats[];
}

const LeagueStatsPanel = ({ leagueData }: LeagueStatsPanelProps) => {
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
          <p className="font-bold text-lg">{leagueData[0]?.team || "Buckie Thistle"}</p>
        </div>
      </div>
      <div className="bg-white shadow-sm rounded-lg p-4 flex items-center">
        <Calendar className="w-10 h-10 text-team-blue mr-4" />
        <div>
          <p className="text-xs text-gray-500">Season</p>
          <p className="font-bold text-lg">2023-24</p>
        </div>
      </div>
      <div className="bg-white shadow-sm rounded-lg p-4 flex items-center">
        <TrendingUp className="w-10 h-10 text-team-blue mr-4" />
        <div>
          <p className="text-xs text-gray-500">Our Position</p>
          <p className="font-bold text-lg">
            {leagueData.find(t => t.team === "Banks o' Dee")?.position || 3}
            <span className="text-xs text-gray-500 ml-1">/ 17</span>
          </p>
        </div>
      </div>
      <div className="bg-white shadow-sm rounded-lg p-4 flex items-center">
        <Shield className="w-10 h-10 text-team-blue mr-4" />
        <div>
          <p className="text-xs text-gray-500">Our Form</p>
          <div className="flex items-center space-x-1 mt-1">
            {leagueData.find(t => t.team === "Banks o' Dee")?.form.map((result, idx) => (
              <FormIndicator key={idx} result={result} />
            )) || Array(5).fill("").map((_, idx) => (
              <FormIndicator key={idx} result={idx % 2 === 0 ? "W" : "D"} />
            ))}
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default LeagueStatsPanel;
