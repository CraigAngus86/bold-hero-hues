
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import LeagueTableContent from './LeagueTableContent';
import TableLegend from './TableLegend';
import LeagueStatsPanel from './LeagueStatsPanel';
import LeagueInfoPanel from './LeagueInfoPanel';
import { TeamStats } from './types';
import { fetchLeagueTable } from '@/services/leagueDataService';

const LeagueTablePage = () => {
  const [leagueData, setLeagueData] = useState<TeamStats[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  
  useEffect(() => {
    const getLeagueData = async () => {
      try {
        setIsLoading(true);
        // Fetch the full league table data
        const data = await fetchLeagueTable();
        
        // Sort by position
        const sortedData = [...data].sort((a, b) => a.position - b.position);
        setLeagueData(sortedData);
      } catch (error) {
        console.error('Error loading league data:', error);
      } finally {
        setIsLoading(false);
      }
    };
    
    getLeagueData();
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
        {isLoading ? (
          <div className="p-12 text-center">
            <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-team-blue mx-auto"></div>
            <p className="mt-3 text-gray-600">Loading league table...</p>
          </div>
        ) : (
          <LeagueTableContent leagueData={leagueData} />
        )}
      </motion.div>
      
      {/* League Information */}
      <LeagueInfoPanel />
    </div>
  );
};

export default LeagueTablePage;
