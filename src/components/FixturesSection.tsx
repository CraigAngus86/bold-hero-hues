
import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import RecentResults from './fixtures/RecentResults';
import UpcomingFixtures from './fixtures/UpcomingFixtures';
import LeagueTablePreview from './fixtures/LeagueTablePreview';
import { mockMatches, mockLeagueData } from './fixtures/mockData';
import { Match, TeamStats } from './fixtures/types';

const FixturesSection = () => {
  const [recentMatches, setRecentMatches] = useState<Match[]>([]);
  const [upcomingMatches, setUpcomingMatches] = useState<Match[]>([]);
  const [leagueData, setLeagueData] = useState<TeamStats[]>([]);
  
  useEffect(() => {
    const recent = mockMatches
      .filter(match => match.isCompleted)
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
      .slice(0, 3);
    
    const upcoming = mockMatches
      .filter(match => !match.isCompleted)
      .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
      .slice(0, 3);
    
    setRecentMatches(recent);
    setUpcomingMatches(upcoming);
    setLeagueData(mockLeagueData);
  }, []);

  return (
    <section className="py-10 bg-team-gray">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl font-bold text-[#00105a] mb-8 text-center">Fixtures, Results & Table</h2>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <RecentResults matches={recentMatches} />
          <UpcomingFixtures matches={upcomingMatches} />
          <LeagueTablePreview leagueData={leagueData} />
        </div>
      </div>
    </section>
  );
};

export default FixturesSection;
