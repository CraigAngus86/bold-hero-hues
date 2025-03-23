
import React from 'react';
import { motion } from 'framer-motion';
import { Info } from 'lucide-react';

const LeagueInfoPanel = () => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: 0.3 }}
      className="bg-white rounded-lg shadow-sm p-6"
    >
      <div className="flex items-center mb-4">
        <Info className="w-5 h-5 text-team-blue mr-2" />
        <h2 className="text-xl font-bold text-team-blue">About the Highland League</h2>
      </div>
      <p className="text-gray-600 mb-4">
        The Scottish Highland Football League is a senior football league in Scotland, 
        catering for teams in the northern parts of the country. The league currently 
        consists of 17 teams and sits at level 5 in the Scottish football league system, 
        below the SPFL League Two.
      </p>
      <p className="text-gray-600 mb-4">
        Since the 2014–15 season, the Highland League champions have played against the 
        Lowland League champions for a chance to play against the bottom club in League Two, 
        with the winner earning a place in the SPFL.
      </p>
      <div className="mt-6">
        <h3 className="font-bold text-gray-700 mb-2">Key Dates</h3>
        <ul className="space-y-2">
          <li className="flex items-start">
            <span className="w-2 h-2 bg-team-blue rounded-full mr-2 mt-2"></span>
            <span>Season started: July 29, 2023</span>
          </li>
          <li className="flex items-start">
            <span className="w-2 h-2 bg-team-blue rounded-full mr-2 mt-2"></span>
            <span>Projected end date: April 27, 2024</span>
          </li>
          <li className="flex items-start">
            <span className="w-2 h-2 bg-team-blue rounded-full mr-2 mt-2"></span>
            <span>Play-off dates: May 2024</span>
          </li>
        </ul>
      </div>
    </motion.div>
  );
};

export default LeagueInfoPanel;
