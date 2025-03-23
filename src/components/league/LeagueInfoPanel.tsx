
import React from 'react';
import { motion } from 'framer-motion';
import { CalendarRange, Trophy, Info } from 'lucide-react';

interface LeagueInfoPanelProps {
  currentSeason?: string;
}

const LeagueInfoPanel = ({ currentSeason = "2024-2025" }: LeagueInfoPanelProps) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: 0.3 }}
      className="mb-12 grid grid-cols-1 md:grid-cols-3 gap-6"
    >
      <div className="bg-white rounded-lg shadow-sm p-6">
        <div className="flex items-center mb-4">
          <CalendarRange className="h-6 w-6 text-team-blue mr-2" />
          <h3 className="text-xl font-semibold text-gray-800">Season Information</h3>
        </div>
        <p className="text-gray-600 mb-3">
          The {currentSeason} Highland Football League season runs from August 2024 through May 2025.
        </p>
        <ul className="space-y-2 text-gray-600">
          <li className="flex items-start">
            <span className="inline-block w-3 h-3 rounded-full bg-team-blue mt-1.5 mr-2"></span>
            <span>17 clubs compete in the league</span>
          </li>
          <li className="flex items-start">
            <span className="inline-block w-3 h-3 rounded-full bg-team-blue mt-1.5 mr-2"></span>
            <span>Each team plays 32 matches (home and away)</span>
          </li>
          <li className="flex items-start">
            <span className="inline-block w-3 h-3 rounded-full bg-team-blue mt-1.5 mr-2"></span>
            <span>3 points for a win, 1 point for a draw</span>
          </li>
        </ul>
      </div>
      
      <div className="bg-white rounded-lg shadow-sm p-6">
        <div className="flex items-center mb-4">
          <Trophy className="h-6 w-6 text-team-blue mr-2" />
          <h3 className="text-xl font-semibold text-gray-800">Promotion & Relegation</h3>
        </div>
        <p className="text-gray-600 mb-3">
          The Highland League champions may be promoted to Scottish League Two via playoffs.
        </p>
        <ul className="space-y-2 text-gray-600">
          <li className="flex items-start">
            <span className="inline-block w-3 h-3 rounded-full bg-team-blue mt-1.5 mr-2"></span>
            <span>Champions play in the pyramid playoffs</span>
          </li>
          <li className="flex items-start">
            <span className="inline-block w-3 h-3 rounded-full bg-team-blue mt-1.5 mr-2"></span>
            <span>Bottom club may face relegation playoffs</span>
          </li>
          <li className="flex items-start">
            <span className="inline-block w-3 h-3 rounded-full bg-team-blue mt-1.5 mr-2"></span>
            <span>No automatic relegation from the Highland League</span>
          </li>
        </ul>
      </div>
      
      <div className="bg-white rounded-lg shadow-sm p-6">
        <div className="flex items-center mb-4">
          <Info className="h-6 w-6 text-team-blue mr-2" />
          <h3 className="text-xl font-semibold text-gray-800">About the League</h3>
        </div>
        <p className="text-gray-600 mb-3">
          The Scottish Highland Football League is a senior league in the north of Scotland.
        </p>
        <ul className="space-y-2 text-gray-600">
          <li className="flex items-start">
            <span className="inline-block w-3 h-3 rounded-full bg-team-blue mt-1.5 mr-2"></span>
            <span>Founded in 1893, one of Scotland's oldest leagues</span>
          </li>
          <li className="flex items-start">
            <span className="inline-block w-3 h-3 rounded-full bg-team-blue mt-1.5 mr-2"></span>
            <span>Part of the Scottish football pyramid since 2014</span>
          </li>
          <li className="flex items-start">
            <span className="inline-block w-3 h-3 rounded-full bg-team-blue mt-1.5 mr-2"></span>
            <span>Covers the north and northeast of Scotland</span>
          </li>
        </ul>
      </div>
    </motion.div>
  );
};

export default LeagueInfoPanel;
