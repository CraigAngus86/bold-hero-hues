
import React, { useState, useEffect } from 'react';
import { Container } from '@/components/ui';
import UpcomingMatchesCarousel from '@/components/fixtures/UpcomingMatchesCarousel';
import RecentResultsCarousel from '@/components/fixtures/RecentResultsCarousel';
import { useFixturesStats } from '@/hooks/useFixturesStats';
import { getAllFixtures } from '@/services/fixturesService';
import { Button } from '@/components/ui/button';
import { ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { toast } from 'sonner';

const MatchCenter: React.FC = () => {
  const [upcomingFixtures, setUpcomingFixtures] = useState([]);
  const [recentResults, setRecentResults] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const { data: fixturesStats } = useFixturesStats();

  useEffect(() => {
    const fetchFixtures = async () => {
      try {
        const { fixtures } = await getAllFixtures();
        
        // Filter for upcoming and recent matches
        const now = new Date();
        const upcoming = fixtures
          .filter(fixture => new Date(fixture.date) > now && !fixture.is_completed)
          .slice(0, 5);
          
        const results = fixtures
          .filter(fixture => fixture.is_completed)
          .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
          .slice(0, 5);
          
        setUpcomingFixtures(upcoming);
        setRecentResults(results);
      } catch (error) {
        console.error('Failed to fetch fixtures:', error);
        toast.error('Failed to load match information');
      } finally {
        setIsLoading(false);
      }
    };

    fetchFixtures();
  }, []);

  return (
    <section className="py-12 bg-gray-50">
      <Container>
        <div className="mb-8 flex justify-between items-center">
          <h2 className="text-3xl font-bold text-team-blue">Match Center</h2>
          <Link to="/fixtures">
            <Button variant="outline" className="flex items-center gap-2">
              View All Fixtures
              <ArrowRight className="h-4 w-4" />
            </Button>
          </Link>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="bg-white p-6 rounded-lg shadow-sm">
            <h3 className="text-xl font-semibold mb-4">Upcoming Matches</h3>
            {isLoading ? (
              <div className="flex justify-center items-center h-40">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-team-blue"></div>
              </div>
            ) : (
              <>
                {upcomingFixtures.length > 0 ? (
                  <UpcomingMatchesCarousel fixtures={upcomingFixtures} />
                ) : (
                  <p className="text-gray-500 text-center py-8">No upcoming matches scheduled</p>
                )}
              </>
            )}
          </div>
          
          <div className="bg-white p-6 rounded-lg shadow-sm">
            <h3 className="text-xl font-semibold mb-4">Recent Results</h3>
            {isLoading ? (
              <div className="flex justify-center items-center h-40">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-team-blue"></div>
              </div>
            ) : (
              <>
                {recentResults.length > 0 ? (
                  <RecentResultsCarousel fixtures={recentResults} />
                ) : (
                  <p className="text-gray-500 text-center py-8">No recent match results</p>
                )}
              </>
            )}
          </div>
        </div>
        
        {fixturesStats && (
          <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-white p-6 rounded-lg shadow-sm text-center">
              <p className="text-gray-500">Upcoming Fixtures</p>
              <p className="text-3xl font-bold">{fixturesStats.upcoming}</p>
            </div>
            
            {fixturesStats.nextMatch && (
              <div className="bg-white p-6 rounded-lg shadow-sm text-center md:col-span-2">
                <p className="text-gray-500">Next Match</p>
                <p className="text-xl font-semibold">vs {fixturesStats.nextMatch.opponent}</p>
                <p className="text-gray-600">
                  {new Date(fixturesStats.nextMatch.date).toLocaleDateString('en-GB', {
                    weekday: 'long',
                    day: 'numeric',
                    month: 'long'
                  })}
                </p>
              </div>
            )}
          </div>
        )}
      </Container>
    </section>
  );
};

export default MatchCenter;
