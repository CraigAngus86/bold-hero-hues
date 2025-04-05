
import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import UpcomingFixtures from './fixtures/UpcomingFixtures';
import RecentResults from './fixtures/RecentResults';
import LeagueTablePreview from './fixtures/LeagueTablePreview';
import { TeamStats } from './league/types';
import { fetchLeagueTableFromSupabase } from '@/services/supabase/leagueDataService';
import { Match } from './fixtures/types';
import { toast } from "sonner";
import { fetchFixturesFromSupabase, fetchResultsFromSupabase } from '@/services/supabase/fixturesService';
import { convertToMatches } from '@/types/fixtures';
import { supabase } from '@/integrations/supabase/client';
import { Button } from './ui/button';
import { Ticket } from 'lucide-react';

const checkMatchPhotosExist = async (match: Match): Promise<boolean> => {
  const matchDate = new Date(match.date);
  const formattedDate = `${matchDate.getFullYear()}-${String(matchDate.getMonth() + 1).padStart(2, '0')}-${String(matchDate.getDate()).padStart(2, '0')}`;
  
  const awayTeam = match.awayTeam.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '');
  const folderPath = `highland-league-matches/${awayTeam}-${formattedDate}`;
  
  try {
    const { data, error } = await supabase
      .storage
      .from('images')
      .list(folderPath);
    
    if (error) throw error;
    
    return data && data.filter(item => !item.name.endsWith('.folder')).length > 0;
  } catch (error) {
    console.log('No match photos found:', error);
    return false;
  }
};

const FixturesSection = () => {
  const [leagueData, setLeagueData] = useState<TeamStats[] | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [upcomingMatches, setUpcomingMatches] = useState<Match[]>([]);
  const [recentResults, setRecentResults] = useState<Match[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        
        const [leagueTable, fixturesData, resultsData] = await Promise.all([
          fetchLeagueTableFromSupabase(),
          fetchFixturesFromSupabase(),
          fetchResultsFromSupabase()
        ]);
        
        setLeagueData(leagueTable);
        
        const fixtures = convertToMatches(fixturesData);
        const results = convertToMatches(resultsData);
        
        console.log('Fixtures from API:', fixtures.length);
        console.log('Results from API:', results.length);
        
        const today = new Date();
        console.log('Today is:', today.toISOString());
        
        const getUpcomingMatches = (matches: Match[]) => {
          console.log('Filtering upcoming matches, total to filter:', matches.length);
          
          const upcoming = matches
            .filter(match => {
              const matchDate = new Date(match.date);
              const isUpcoming = !match.isCompleted && matchDate >= today;
              console.log(`${match.homeTeam} vs ${match.awayTeam}: isCompleted=${match.isCompleted}, date=${matchDate.toISOString()}, isUpcoming=${isUpcoming}`);
              return isUpcoming;
            })
            .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
            .slice(0, 4); // Showing 4 upcoming matches instead of 3
          
          console.log('Filtered upcoming matches:', upcoming.length);
          return upcoming;
        };
        
        const getRecentResults = (matches: Match[]) => {
          return matches
            .filter(match => match.isCompleted)
            .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
            .slice(0, 4); // Showing 4 recent results instead of 3
        };
        
        if (fixtures.length > 0) {
          const upcoming = getUpcomingMatches(fixtures);
          const recent = getRecentResults(results);
          
          const recentWithPhotos = await Promise.all(
            recent.map(async (match) => {
              const hasPhotos = await checkMatchPhotosExist(match);
              return { ...match, hasMatchPhotos: hasPhotos };
            })
          );
          
          if (upcoming.length > 0) {
            setUpcomingMatches(upcoming);
            setRecentResults(recentWithPhotos);
            console.log('Using real data for fixtures and results');
            return;
          }
        }
        
        console.log('Using mock data for fixtures and results');
        const { mockMatches } = await import('@/components/fixtures/fixturesMockData');
        
        setUpcomingMatches(getUpcomingMatches(mockMatches));
        setRecentResults(getRecentResults(mockMatches));
      } catch (error) {
        console.error('Error fetching data:', error);
        toast.error('Failed to load fixtures and results data');
        
        const { mockMatches } = await import('@/components/fixtures/fixturesMockData');
        const today = new Date();
        
        const upcoming = mockMatches
          .filter(match => !match.isCompleted && new Date(match.date) >= today)
          .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
          .slice(0, 4); // Showing 4 upcoming matches instead of 3
        
        const recent = mockMatches
          .filter(match => match.isCompleted)
          .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
          .slice(0, 4); // Showing 4 recent results instead of 3
        
        setUpcomingMatches(upcoming);
        setRecentResults(recent);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  const nextMatchWithTickets = upcomingMatches.find(match => match.ticketLink);

  return (
    <section className="py-10 bg-team-gray">
      <div className="container mx-auto px-3">
        <div className="flex justify-between items-center mb-5">
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className="text-2xl font-semibold text-team-blue"
          >
            Results, Fixtures & League Table
          </motion.h2>
          
          {nextMatchWithTickets && (
            <Button 
              asChild
              size="sm"
              className="bg-team-blue hover:bg-team-navy text-white"
            >
              <a 
                href={nextMatchWithTickets.ticketLink} 
                target="_blank" 
                rel="noopener noreferrer" 
                className="inline-flex items-center"
              >
                <Ticket className="w-4 h-4 mr-1" /> Buy Tickets
              </a>
            </Button>
          )}
        </div>
        
        {isLoading ? (
          <div className="h-48 flex items-center justify-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-team-blue"></div>
            <p className="ml-3 text-gray-600">Loading data...</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
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
