
import { useState, useEffect } from 'react';
import { Fixture } from '@/types/fixtures';
import { getAllFixtures } from '@/services/fixturesService';
import { toast } from 'sonner';

export const useFixturesData = () => {
  const [upcomingFixtures, setUpcomingFixtures] = useState<Fixture[]>([]);
  const [recentResults, setRecentResults] = useState<Fixture[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  
  useEffect(() => {
    const fetchFixtures = async () => {
      setIsLoading(true);
      
      try {
        const response = await getAllFixtures();
        
        if (response.success && response.data) {
          const today = new Date();
          
          // Filter for upcoming fixtures (not completed and date is in the future)
          const upcoming = response.data
            .filter(fixture => !fixture.isCompleted && new Date(fixture.date) >= today)
            .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
            .slice(0, 4);
          
          // Filter for recent results (completed)
          const recent = response.data
            .filter(fixture => fixture.isCompleted)
            .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
            .slice(0, 3);
          
          setUpcomingFixtures(upcoming);
          setRecentResults(recent);
        }
      } catch (error) {
        console.error('Failed to fetch fixtures:', error);
        toast.error('Failed to load fixtures data');
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchFixtures();
  }, []);
  
  // Get next match (first upcoming fixture)
  const nextMatch = upcomingFixtures.length > 0 ? upcomingFixtures[0] : null;
  
  return {
    upcomingFixtures,
    recentResults,
    isLoading,
    nextMatch
  };
};
