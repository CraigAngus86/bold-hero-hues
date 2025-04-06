
import { useState, useEffect } from 'react';
import { toast } from "sonner";
import { Match } from '../types';
import { TeamStats } from '@/components/league/types';
import { fetchLeagueTableFromSupabase } from '@/services/supabase/leagueDataService';
import { fetchFixturesFromSupabase, fetchResultsFromSupabase } from '@/services/supabase/fixturesService';
import { convertToMatches } from '@/types/fixtures';
import { checkMatchPhotosExist } from '../utils/matchPhotosUtil';

export const useFixturesData = () => {
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

  return {
    leagueData,
    isLoading,
    upcomingMatches,
    recentResults
  };
};
