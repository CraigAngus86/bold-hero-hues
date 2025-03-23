
import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { toast } from "sonner";
import RecentResults from './fixtures/RecentResults';
import UpcomingFixtures from './fixtures/UpcomingFixtures';
import LeagueTablePreview from './fixtures/LeagueTablePreview';
import { Match } from './fixtures/types';
import { TeamStats } from './league/types';
import { fetchLeagueTable, fetchFixtures, fetchResults } from '@/services/leagueDataService';
import { RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { clearLeagueDataCache } from '@/services/leagueDataService';

const FixturesSection = () => {
  const [recentMatches, setRecentMatches] = useState<Match[]>([]);
  const [upcomingMatches, setUpcomingMatches] = useState<Match[]>([]);
  const [leagueData, setLeagueData] = useState<TeamStats[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isRefreshing, setIsRefreshing] = useState<boolean>(false);
  
  const fetchData = async (refresh = false) => {
    try {
      if (refresh) {
        setIsRefreshing(true);
        // Clear the cache if refreshing
        clearLeagueDataCache();
      } else {
        setIsLoading(true);
      }
      
      // Fetch all data in parallel
      const [tableData, fixtures, results] = await Promise.all([
        fetchLeagueTable(),
        fetchFixtures(),
        fetchResults()
      ]);
      
      // Update state with the fetched data, with null checks
      setLeagueData(tableData || []);
      
      // Get the 3 most recent results, with null checks
      if (results && Array.isArray(results)) {
        const recent = [...results]
          .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
          .slice(0, 3);
        setRecentMatches(recent);
      }
      
      // Get the 3 upcoming fixtures, with null checks
      if (fixtures && Array.isArray(fixtures)) {
        const upcoming = [...fixtures]
          .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
          .slice(0, 3);
        setUpcomingMatches(upcoming);
      }
      
      if (refresh) {
        toast.success("Fixtures and results refreshed");
      }
    } catch (error) {
      console.error('Error loading fixtures data:', error);
      if (refresh) {
        toast.error('Failed to refresh data');
      }
    } finally {
      setIsLoading(false);
      setIsRefreshing(false);
    }
  };
  
  useEffect(() => {
    fetchData();
  }, []);
  
  const handleRefresh = () => {
    fetchData(true);
  };

  return (
    <section className="py-10 bg-team-gray">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-semibold text-team-blue">Fixtures, Results & Table</h2>
          <Button 
            onClick={handleRefresh} 
            size="sm" 
            variant="outline" 
            disabled={isRefreshing || isLoading}
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
        
        {isLoading ? (
          <div className="h-64 flex items-center justify-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-team-blue"></div>
            <p className="ml-3 text-gray-600">Loading data...</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <RecentResults matches={recentMatches} />
            <UpcomingFixtures matches={upcomingMatches} />
            <LeagueTablePreview leagueData={leagueData} />
          </div>
        )}
      </div>
    </section>
  );
};

export default FixturesSection;
