
import { useState, useEffect } from 'react';
import { useFixturesData } from '@/components/home/fixtures/useFixturesData';
import { fetchLeagueTableFromSupabase } from '@/services/supabase/leagueDataService';
import { TeamStats } from '@/types/fixtures';

export const useFixturesDisplay = () => {
  // Renamed to match what's expected in the components
  const { upcomingMatches, recentMatches, isLoading, nextMatch } = useFixturesData();
  const [leagueData, setLeagueData] = useState<TeamStats[]>([]);
  const [isLeagueLoading, setIsLeagueLoading] = useState(true);
  const [nextMatchWithTickets, setNextMatchWithTickets] = useState<any>(null);
  
  // Fetch league table data
  useEffect(() => {
    const getLeagueData = async () => {
      setIsLeagueLoading(true);
      try {
        const data = await fetchLeagueTableFromSupabase();
        if (data) {
          setLeagueData(data);
        }
      } catch (error) {
        console.error('Error loading league table:', error);
      } finally {
        setIsLeagueLoading(false);
      }
    };
    
    getLeagueData();
  }, []);
  
  // Set next match with tickets info
  useEffect(() => {
    if (nextMatch && nextMatch.ticket_link) {
      setNextMatchWithTickets({
        ...nextMatch,
        hasTickets: true
      });
    } else if (nextMatch) {
      setNextMatchWithTickets({
        ...nextMatch,
        hasTickets: false
      });
    }
  }, [nextMatch]);
  
  return {
    upcomingMatches,
    recentMatches,
    leagueData,
    isLoading: isLoading || isLeagueLoading,
    nextMatchWithTickets
  };
};
