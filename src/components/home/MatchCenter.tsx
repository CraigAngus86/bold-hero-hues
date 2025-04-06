
import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import UpcomingMatchesCarousel from '@/components/fixtures/UpcomingMatchesCarousel';
import RecentResultsCarousel from '@/components/fixtures/RecentResultsCarousel';
import { Button } from '@/components/ui/button';
import { ExternalLink } from 'lucide-react';
import { Match } from '@/components/fixtures/types';
import { getAllFixtures } from '@/services/fixturesService'; // Updated import

export const MatchCenter: React.FC = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [fixtures, setFixtures] = useState<Match[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function loadFixtures() {
      try {
        setIsLoading(true);
        const result = await getAllFixtures(); // Updated function call
        if (result.error) {
          throw new Error(result.error);
        }
        
        // Convert fixtures to Match type
        const matches: Match[] = (result.data || []).map(fixture => ({
          id: fixture.id,
          date: fixture.date,
          time: fixture.time,
          homeTeam: fixture.home_team,
          awayTeam: fixture.away_team,
          competition: fixture.competition,
          venue: fixture.venue || '',
          isCompleted: fixture.is_completed,
          homeScore: fixture.home_score,
          awayScore: fixture.away_score,
          season: fixture.season,
          ticketLink: fixture.ticket_link,
          source: fixture.source,
        }));
        
        setFixtures(matches);
      } catch (err) {
        console.error('Failed to load fixtures:', err);
        setError('Failed to load fixtures');
      } finally {
        setIsLoading(false);
      }
    }

    loadFixtures();
  }, []);

  const upcomingMatches = fixtures.filter(
    (match) => !match.isCompleted && match.date
  ).sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

  const recentResults = fixtures
    .filter((match) => match.isCompleted && match.date)
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

  return (
    <Card className="w-full bg-card">
      <CardHeader className="pb-3">
        <div className="flex justify-between items-center">
          <CardTitle>Match Center</CardTitle>
          <Button variant="outline" size="sm" asChild>
            <a href="/fixtures">
              <span>Full Schedule</span>
              <ExternalLink className="ml-2 h-4 w-4" />
            </a>
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="upcoming" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="upcoming">Upcoming Fixtures</TabsTrigger>
            <TabsTrigger value="results">Recent Results</TabsTrigger>
          </TabsList>
          <TabsContent value="upcoming" className="pt-4">
            <UpcomingMatchesCarousel
              matches={upcomingMatches.slice(0, 5)}
              isLoading={isLoading}
              error={error}
            />
          </TabsContent>
          <TabsContent value="results" className="pt-4">
            <RecentResultsCarousel
              results={recentResults.slice(0, 5)}
              isLoading={isLoading}
              error={error}
            />
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};

export default MatchCenter;
