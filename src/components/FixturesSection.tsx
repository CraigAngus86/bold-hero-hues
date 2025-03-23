
import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import RecentResults from './fixtures/RecentResults';
import UpcomingFixtures from './fixtures/UpcomingFixtures';
import LeagueTablePreview from './fixtures/LeagueTablePreview';
import { Match } from './fixtures/types';
import { TeamStats } from './league/types';
import { fetchLeagueTable, fetchFixtures, fetchResults } from '@/services/leagueDataService';

const FixturesSection = () => {
  const [recentMatches, setRecentMatches] = useState<Match[]>([]);
  const [upcomingMatches, setUpcomingMatches] = useState<Match[]>([]);
  const [leagueData, setLeagueData] = useState<TeamStats[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  
  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        
        // Fetch the league table data
        const tableData = await fetchLeagueTable();
        setLeagueData(tableData);
        
        // Fetch the results
        const results = await fetchResults();
        
        // Get the 3 most recent results
        const recent = results
          .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
          .slice(0, 3);
        setRecentMatches(recent);
        
        // Fetch the fixtures
        const fixtures = await fetchFixtures();
        
        // Get the 3 upcoming fixtures
        const upcoming = fixtures
          .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
          .slice(0, 3);
        setUpcomingMatches(upcoming);
      } catch (error) {
        console.error('Error loading fixtures data:', error);
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchData();
  }, []);

  return (
    <section className="py-10 bg-team-gray">
      <div className="container mx-auto px-4">
        <h2 className="text-2xl font-semibold text-team-blue mb-6 text-center">Fixtures, Results & Table</h2>
        
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
