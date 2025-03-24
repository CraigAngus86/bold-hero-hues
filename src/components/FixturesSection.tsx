
import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import UpcomingFixtures from './fixtures/UpcomingFixtures';
import RecentResults from './fixtures/RecentResults';
import LeagueTablePreview from './fixtures/LeagueTablePreview';
import { TeamStats } from './league/types';
import { fetchLeagueTableFromSupabase } from '@/services/supabase/leagueDataService';
import { Match } from './fixtures/types';
import { toast } from 'sonner';
import { fetchFixturesFromSupabase, fetchResultsFromSupabase } from '@/services/supabase/fixturesService';
import { convertToMatches } from '@/types/fixtures';

const FixturesSection = () => {
  const [leagueData, setLeagueData] = useState<TeamStats[] | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [upcomingMatches, setUpcomingMatches] = useState<Match[]>([]);
  const [recentResults, setRecentResults] = useState<Match[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        
        // Fetch all data in parallel
        const [leagueTable, fixturesData, resultsData] = await Promise.all([
          fetchLeagueTableFromSupabase(),
          fetchFixturesFromSupabase(),
          fetchResultsFromSupabase()
        ]);
        
        setLeagueData(leagueTable);
        
        // Convert fixtures and results to Match format
        const fixtures = convertToMatches(fixturesData);
        const results = convertToMatches(resultsData);
        
        // Get upcoming matches (next 3)
        setUpcomingMatches(fixtures.slice(0, 3));
        
        // Get recent results (last 3)
        setRecentResults(results.slice(0, 3));
        
        console.log('Data loaded successfully');
      } catch (error) {
        console.error('Error fetching data:', error);
        toast.error('Failed to load fixtures and results data');
        
        // Fall back to mock data if needed
        const { mockMatches } = await import('@/components/fixtures/fixturesMockData');
        
        // Filter and prepare match data
        const today = new Date();
        
        // Get upcoming matches (not completed and in the future)
        const upcoming = mockMatches
          .filter(match => !match.isCompleted && new Date(match.date) >= today)
          .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
          .slice(0, 3); // Show only next 3 matches
        
        // Get recent results (completed)
        const recent = mockMatches
          .filter(match => match.isCompleted)
          .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
          .slice(0, 3); // Show only last 3 matches
        
        setUpcomingMatches(upcoming);
        setRecentResults(recent);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  return (
    <section className="py-8 bg-team-gray">
      <div className="container mx-auto px-2">
        <motion.h2 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="text-2xl font-semibold text-team-blue mb-3"
        >
          Results, Fixtures & League Table
        </motion.h2>
        
        {isLoading ? (
          <div className="h-48 flex items-center justify-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-team-blue"></div>
            <p className="ml-3 text-gray-600">Loading data...</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            <div className="md:col-span-1">
              <RecentResults matches={recentResults} />
            </div>
            
            <div className="md:col-span-1">
              <UpcomingFixtures matches={upcomingMatches} />
            </div>
            
            <div className="md:col-span-1">
              <LeagueTablePreview leagueData={leagueData} />
            </div>
          </div>
        )}
      </div>
    </section>
  );
};

export default FixturesSection;
