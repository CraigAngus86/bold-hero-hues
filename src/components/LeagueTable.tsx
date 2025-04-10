
import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import LeagueTableContent from './league/LeagueTableContent';
import { fetchLeagueTableFromSupabase, clearSupabaseCache } from '@/services/supabase/leagueDataService';
import { toast } from "sonner";
import { TeamStats } from '@/types/fixtures';

const LeagueTable = () => {
  const [leagueData, setLeagueData] = useState<TeamStats[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [currentSeason, setCurrentSeason] = useState<string>("2024-2025");
  
  const loadLeagueData = async (refresh = false) => {
    try {
      if (refresh) {
        // Clear the cache if refreshing
        await clearSupabaseCache();
      } else {
        setIsLoading(true);
      }
      
      const data = await fetchLeagueTableFromSupabase();
      const sortedData = [...data].sort((a, b) => a.position - b.position);
      
      // For the homepage, only show the top 10 teams
      const topTeams = sortedData.slice(0, 10);
      setLeagueData(topTeams);
      
      if (refresh) {
        toast.success("League table refreshed automatically");
      }
    } catch (error) {
      console.error('Error loading league data:', error);
      if (refresh) {
        toast.error("Failed to refresh league table");
      }
    } finally {
      setIsLoading(false);
    }
  };
  
  useEffect(() => {
    loadLeagueData();
    
    // Set up auto-refresh every 30 minutes (1800000 ms)
    const autoRefreshInterval = setInterval(() => {
      console.log('Auto-refreshing homepage league table data');
      loadLeagueData(true);
    }, 1800000);
    
    // Clean up interval on component unmount
    return () => clearInterval(autoRefreshInterval);
  }, []);
  
  return (
    <section className="py-12 bg-team-gray">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-semibold text-team-blue">Highland League Table {currentSeason}</h2>
        </div>
        
        <div className="flex justify-end mb-4">
          <Link 
            to="/table" 
            className="px-5 py-2 bg-team-blue text-white rounded-md hover:bg-team-navy transition-colors text-sm font-medium"
          >
            View Full Table
          </Link>
        </div>
        
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="bg-white rounded-lg shadow-sm overflow-hidden"
        >
          {isLoading ? (
            <div className="p-8 text-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-team-blue mx-auto"></div>
              <p className="mt-2 text-gray-600">Loading league table...</p>
            </div>
          ) : (
            <LeagueTableContent leagueData={leagueData as any} />
          )}
        </motion.div>
      </div>
    </section>
  );
};

export default LeagueTable;
