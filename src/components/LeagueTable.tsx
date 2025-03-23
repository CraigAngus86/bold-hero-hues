
import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import LeagueTableContent from './league/LeagueTableContent';
import { TeamStats } from './league/types';
import { fetchLeagueTable } from '@/services/leagueDataService';
import { RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { clearLeagueDataCache } from '@/services/leagueDataService';
import { toast } from "sonner";

const LeagueTable = () => {
  const [leagueData, setLeagueData] = useState<TeamStats[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isRefreshing, setIsRefreshing] = useState<boolean>(false);
  const [currentSeason, setCurrentSeason] = useState<string>("2024-2025");
  
  const loadLeagueData = async (refresh = false) => {
    try {
      if (refresh) {
        setIsRefreshing(true);
        // Clear the cache if refreshing
        clearLeagueDataCache();
      } else {
        setIsLoading(true);
      }
      
      const data = await fetchLeagueTable();
      const sortedData = [...data].sort((a, b) => a.position - b.position);
      setLeagueData(sortedData);
      
      if (refresh) {
        toast.success("League table refreshed");
      }
    } catch (error) {
      console.error('Error loading league data:', error);
      if (refresh) {
        toast.error("Failed to refresh league table");
      }
    } finally {
      setIsLoading(false);
      setIsRefreshing(false);
    }
  };
  
  useEffect(() => {
    loadLeagueData();
  }, []);
  
  const handleRefresh = () => {
    loadLeagueData(true);
  };
  
  return (
    <section className="py-12 bg-team-gray">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-semibold text-team-blue">Highland League Table {currentSeason}</h2>
          <Button 
            onClick={handleRefresh} 
            size="sm" 
            variant="outline" 
            disabled={isRefreshing}
            className="text-team-blue border-team-blue hover:bg-team-lightBlue"
          >
            {isRefreshing ? (
              <>
                <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                Refreshing...
              </>
            ) : (
              <>
                <RefreshCw className="w-4 h-4 mr-2" />
                Refresh
              </>
            )}
          </Button>
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
            <LeagueTableContent leagueData={leagueData} />
          )}
        </motion.div>
      </div>
    </section>
  );
};

export default LeagueTable;
