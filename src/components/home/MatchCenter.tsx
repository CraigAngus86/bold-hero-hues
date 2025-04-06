import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { useQuery } from '@tanstack/react-query';
import { Skeleton } from '@/components/ui/skeleton';
import { useNavigate } from 'react-router-dom';
import { 
  ArrowRight, 
  Calendar, 
  ChevronLeft, 
  ChevronRight, 
  Dot, 
  Ticket 
} from 'lucide-react';
import { adaptFixturesToMatches } from '@/adapters/fixtureAdapter';
import { fetchFixtures } from '@/services/fixturesService';
import { Match } from '@/components/fixtures/types';
import { formatDistanceToNow, format, parseISO, isToday, addDays } from 'date-fns';

const MatchCenter: React.FC = () => {
  const [activeTab, setActiveTab] = useState('upcoming');
  const [page, setPage] = useState(1);
  const [itemsPerPage] = useState(3);

  const navigate = useNavigate();

  const { 
    data: upcomingFixtures, 
    isLoading: upcomingLoading
  } = useQuery({
    queryKey: ['fixtures', 'upcoming'],
    queryFn: async () => {
      const response = await fetchFixtures({ upcoming: true, limit: 6 });
      if (!response.success) {
        throw new Error(response.error || 'Failed to fetch upcoming fixtures');
      }
      return adaptFixturesToMatches(response.data || []);
    },
  });

  const {
    data: results,
    isLoading: resultsLoading
  } = useQuery({
    queryKey: ['fixtures', 'results'],
    queryFn: async () => {
      const response = await fetchFixtures({ results: true, limit: 6 });
      if (!response.success) {
        throw new Error(response.error || 'Failed to fetch results');
      }
      return adaptFixturesToMatches(response.data || []);
    },
  });

  const getPaginatedData = (data: Match[] | undefined) => {
    if (!data) return [];
    const startIndex = (page - 1) * itemsPerPage;
    return data.slice(startIndex, startIndex + itemsPerPage);
  };

  const upcoming = getPaginatedData(upcomingFixtures);
  const recent = getPaginatedData(results);

  const totalUpcomingPages = upcomingFixtures ? Math.ceil(upcomingFixtures.length / itemsPerPage) : 0;
  const totalResultPages = results ? Math.ceil(results.length / itemsPerPage) : 0;

  const navigateToTickets = (match: Match) => {
    if (match.ticketLink) {
      window.open(match.ticketLink, '_blank');
    } else {
      navigate('/tickets');
    }
  };

  const formatDate = (dateString: string) => {
    try {
      const date = parseISO(dateString);
      if (isToday(date)) {
        return `Today, ${format(date, 'HH:mm')}`;
      }
      return formatDistanceToNow(date, { addSuffix: true });
    } catch (error) {
      console.error("Error formatting date", error);
      return 'Unknown date';
    }
  };

  const renderMatchCard = (match: Match) => (
    <Card key={match.id} className="shadow-md">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">
          {match.homeTeam} vs {match.awayTeam}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col space-y-2">
          <p className="text-xs text-muted-foreground">
            <Calendar className="mr-2 inline-block h-4 w-4 align-middle" />
            {formatDate(match.date)}
          </p>
          <p className="text-sm text-gray-600">
            {match.competition} at {match.venue}
          </p>
        </div>
        <div className="flex justify-end mt-4">
          <Button size="sm" onClick={() => navigateToTickets(match)}>
            Get Tickets <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
        </div>
      </CardContent>
    </Card>
  );

  const renderPagination = (active: string) => {
    const totalPages = active === 'upcoming' ? totalUpcomingPages : totalResultPages;
    const setPageNumber = (newPage: number) => {
      setPage(newPage);
    };

    return (
      <div className="flex items-center justify-between px-4 py-3 sm:px-6">
        <div className="sm:flex sm:items-center sm:justify-between">
          <div className="flex w-full justify-between sm:w-auto">
            <Button
              className="inline-flex items-center justify-center rounded-md border bg-background text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 sm:hidden"
              onClick={() => setPageNumber(page - 1)}
              disabled={page <= 1}
            >
              <ChevronLeft className="mr-2 h-4 w-4" />
              Previous
            </Button>
            <Button
              className="inline-flex items-center justify-center rounded-md border bg-background text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 sm:hidden"
              onClick={() => setPageNumber(page + 1)}
              disabled={page >= totalPages}
            >
              Next
              <ChevronRight className="ml-2 h-4 w-4" />
            </Button>
          </div>
          <div className="hidden sm:flex sm:items-center sm:gap-6">
            <Button
              className="inline-flex items-center justify-center rounded-md border bg-background text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50"
              onClick={() => setPageNumber(page - 1)}
              disabled={page <= 1}
            >
              <ChevronLeft className="mr-2 h-4 w-4" />
              Previous
            </Button>
            <div className="text-sm text-muted-foreground">
              Page <span className="font-semibold">{page}</span> of{" "}
              <span className="font-semibold">{totalPages}</span>
            </div>
            <Button
              className="inline-flex items-center justify-center rounded-md border bg-background text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50"
              onClick={() => setPageNumber(page + 1)}
              disabled={page >= totalPages}
            >
              Next
              <ChevronRight className="ml-2 h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>
    );
  };

  return (
    <section className="py-16 bg-white">
      <div className="container mx-auto px-4">
        <Tabs defaultValue="upcoming" className="space-y-4" onValueChange={setActiveTab}>
          <TabsList>
            <TabsTrigger value="upcoming">Upcoming Matches</TabsTrigger>
            <TabsTrigger value="results">Recent Results</TabsTrigger>
          </TabsList>
          <TabsContent value="upcoming" className="space-y-4">
            {upcomingLoading ? (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {[...Array(3)].map((_, i) => (
                  <Card key={i} className="shadow-md">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                      <CardTitle className="text-sm font-medium">
                        <Skeleton className="h-4 w-32" />
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <Skeleton className="h-40" />
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : upcoming && upcoming.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {upcoming.map(renderMatchCard)}
              </div>
            ) : (
              <div className="text-center py-8 text-gray-500">
                <p className="text-lg">No upcoming matches</p>
              </div>
            )}
            {upcomingFixtures && upcomingFixtures.length > 3 && renderPagination('upcoming')}
          </TabsContent>
          <TabsContent value="results" className="space-y-4">
            {resultsLoading ? (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {[...Array(3)].map((_, i) => (
                  <Card key={i} className="shadow-md">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                      <CardTitle className="text-sm font-medium">
                        <Skeleton className="h-4 w-32" />
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <Skeleton className="h-40" />
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : results && results.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {recent.map(renderMatchCard)}
              </div>
            ) : (
              <div className="text-center py-8 text-gray-500">
                <p className="text-lg">No recent results</p>
              </div>
            )}
            {results && results.length > 3 && renderPagination('results')}
          </TabsContent>
        </Tabs>
      </div>
    </section>
  );
};

export default MatchCenter;
