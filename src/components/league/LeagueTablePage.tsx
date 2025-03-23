
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import LeagueTableContent from './LeagueTableContent';
import TableLegend from './TableLegend';
import LeagueStatsPanel from './LeagueStatsPanel';
import LeagueInfoPanel from './LeagueInfoPanel';
import { TeamStats, fullMockLeagueData } from './types';

const LeagueTablePage = () => {
  const [leagueData, setLeagueData] = useState<TeamStats[]>([]);
  
  // In a real app, this would fetch from an API
  useEffect(() => {
    // Sort by position
    const sortedData = [...fullMockLeagueData].sort((a, b) => a.position - b.position);
    setLeagueData(sortedData);
  }, []);
  
  return (
    <div className="container mx-auto px-4">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="mb-12 text-center"
      >
        <h1 className="text-4xl md:text-5xl font-bold text-team-blue mb-4">Highland League Table</h1>
        <p className="text-gray-600 max-w-2xl mx-auto">
          Current standings for the 2023-24 Scottish Highland Football League.
        </p>
      </motion.div>
      
      {/* Table Key/Legend */}
      <TableLegend />
      
      {/* League Stats Summary */}
      <LeagueStatsPanel leagueData={leagueData} />
      
      {/* Main League Table */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.2 }}
        className="bg-white rounded-lg shadow-md overflow-hidden mb-10"
      >
        <LeagueTableContent leagueData={leagueData} />
      </motion.div>
      
      {/* League Information */}
      <LeagueInfoPanel />
    </div>
  );
};

export default LeagueTablePage;
