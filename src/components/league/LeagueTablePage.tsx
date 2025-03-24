
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { toast } from "sonner";
import LeagueTableContent from './LeagueTableContent';
import LeagueStatsPanel from './LeagueStatsPanel';
import LeagueInfoPanel from './LeagueInfoPanel';
import { TeamStats } from './types';
import { fetchLeagueTableFromSupabase, getLastUpdateTime } from '@/services/supabase/leagueDataService';

const LeagueTablePage = () => {
  const [leagueData, setLeagueData] = useState<TeamStats[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [dataSeason, setDataSeason] = useState<string>("2024-2025");
  const [lastUpdated, setLastUpdated] = useState<string>("");
  
  const loadLeagueData = async (refresh = false) => {
    try {
      setIsLoading(true);
      
      // Fetch from Supabase
      const data = await fetchLeagueTableFromSupabase();
      
      // Sort by position
      const sortedData = [...data].sort((a, b) => a.position - b.position);
      setLeagueData(sortedData);
      
      // Get last updated time from Supabase
      const lastUpdate = await getLastUpdateTime();
      if (lastUpdate) {
        setLastUpdated(new Date(lastUpdate).toLocaleString());
      } else {
        setLastUpdated(new Date().toLocaleString());
      }
      
      if (refresh) {
        toast.success("League table refreshed from Supabase");
      }
    } catch (error) {
      console.error('Error loading league data:', error);
      toast.error('Failed to load league table data');
    } finally {
      setIsLoading(false);
    }
  };
  
  useEffect(() => {
    loadLeagueData();
    
    // Set up auto-refresh every 30 minutes (1800000 ms)
    const autoRefreshInterval = setInterval(() => {
      console.log('Auto-refreshing league table data');
      loadLeagueData(true);
    }, 1800000);
    
    // Clean up interval on component unmount
    return () => clearInterval(autoRefreshInterval);
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
          Current standings for the {dataSeason} Scottish Highland Football League.
        </p>
        {lastUpdated && (
          <p className="text-sm text-gray-500 mt-2">
            Data last updated: {lastUpdated}
          </p>
        )}
      </motion.div>
      
      {/* League Stats Summary */}
      <LeagueStatsPanel leagueData={leagueData} season={dataSeason} />
      
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
      <LeagueInfoPanel currentSeason={dataSeason} />
    </div>
  );
};

export default LeagueTablePage;
