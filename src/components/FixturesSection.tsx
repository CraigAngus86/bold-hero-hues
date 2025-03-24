
import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import UpcomingFixtures from './fixtures/UpcomingFixtures';
import RecentResults from './fixtures/RecentResults';
import LeagueTablePreview from './fixtures/LeagueTablePreview';
import { TeamStats } from './league/types';
import { fetchLeagueTableFromSupabase } from '@/services/supabase/leagueDataService';
import { mockMatches } from './fixtures/fixturesMockData';
import { Match } from './fixtures/types';

const FixturesSection = () => {
  const [leagueData, setLeagueData] = useState<TeamStats[] | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [upcomingMatches, setUpcomingMatches] = useState<Match[]>([]);
  const [recentResults, setRecentResults] = useState<Match[]>([]);

  useEffect(() => {
    const fetchLeagueData = async () => {
      try {
        setIsLoading(true);
        const data = await fetchLeagueTableFromSupabase();
        setLeagueData(data);
      } catch (error) {
        console.error('Error fetching league data:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchLeagueData();
    
    // Filter and prepare match data
    const today = new Date();
    
    // Get upcoming matches (not completed and in the future)
    const upcoming = mockMatches
      .filter(match => !match.isCompleted && new Date(match.date) >= today)
      .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
      .slice(0, 5); // Show only next 5 matches
    
    // Get recent results (completed)
    const recent = mockMatches
      .filter(match => match.isCompleted)
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
      .slice(0, 5); // Show only last 5 matches
    
    setUpcomingMatches(upcoming);
    setRecentResults(recent);
    
    console.info('Using mock fixtures data for now');
    console.info('Using mock results data for now');
  }, []);

  return (
    <section className="py-16 bg-team-gray">
      <div className="container mx-auto px-4">
        <motion.h2 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="text-2xl font-semibold text-team-blue mb-6"
        >
          Fixtures, Results & Table
        </motion.h2>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="md:col-span-1">
            <UpcomingFixtures matches={upcomingMatches} />
          </div>
          
          <div className="md:col-span-1">
            <RecentResults matches={recentResults} />
          </div>
          
          <div className="md:col-span-1">
            <LeagueTablePreview leagueData={leagueData} />
          </div>
        </div>
      </div>
    </section>
  );
};

export default FixturesSection;
