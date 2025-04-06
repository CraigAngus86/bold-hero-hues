
import { useState, useEffect } from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { motion } from 'framer-motion';
import EnhancedFixturesFilter from '@/components/fixtures/EnhancedFixturesFilter';
import MonthFixtures from '@/components/fixtures/MonthFixtures';
import NoFixturesFound from '@/components/fixtures/NoFixturesFound';
import { CalendarView } from '@/components/fixtures/CalendarView';
import { fetchFixtures, fetchResults } from '@/services/leagueDataService';
import { useFixturesFilter } from '@/hooks/useFixturesFilter';
import { Match } from '@/components/fixtures/types';
import { DateRange } from 'react-day-picker';
import { toast } from "sonner";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { CalendarDays, List } from 'lucide-react';

const Fixtures = () => {
  const [allMatches, setAllMatches] = useState<Match[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [availableCompetitions, setAvailableCompetitions] = useState<string[]>(["All Competitions"]);
  const [availableVenues, setAvailableVenues] = useState<string[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [dateRange, setDateRange] = useState<DateRange | undefined>(undefined);
  const [viewMode, setViewMode] = useState<'list' | 'calendar'>('list');
  
  useEffect(() => {
    const loadData = async () => {
      setIsLoading(true);
      try {
        // Fetch both fixtures and results
        const [fixtures, results] = await Promise.all([
          fetchFixtures(),
          fetchResults()
        ]);
        
        // Combine them into a single array
        const allFixtures = [...fixtures, ...results];
        setAllMatches(allFixtures);
        
        // Extract unique competitions from matches
        const uniqueCompetitions = [...new Set(allFixtures.map(match => match.competition))];
        setAvailableCompetitions(["All Competitions", ...uniqueCompetitions.sort()]);
        
        // Extract unique venues from matches
        const uniqueVenues = [...new Set(allFixtures
          .filter(match => match.venue && match.venue.trim() !== '')
          .map(match => match.venue!))];
        setAvailableVenues(uniqueVenues.sort());
        
      } catch (error) {
        console.error('Error loading fixtures data:', error);
        toast.error('Failed to load fixtures and results');
      } finally {
        setIsLoading(false);
      }
    };
    
    loadData();
  }, []);

  const {
    competitions,
    months,
    selectedCompetition,
    setSelectedCompetition,
    selectedMonth,
    setSelectedMonth,
    showPast,
    setShowPast,
    showUpcoming,
    setShowUpcoming,
    availableMonths,
    clearFilters,
    filteredMatches,
    groupedMatches
  } = useFixturesFilter({ 
    allMatches, 
    initialCompetition: 'All Competitions',
    initialMonth: 'All Months'
  });
  
  // Apply additional filters (search, date range, venue)
  const applyAdditionalFilters = (matches: Match[]) => {
    return matches.filter(match => {
      // Apply search filter
      if (searchQuery) {
        const query = searchQuery.toLowerCase();
        const homeTeam = match.homeTeam.toLowerCase();
        const awayTeam = match.awayTeam.toLowerCase();
        const competition = match.competition.toLowerCase();
        const venue = match.venue?.toLowerCase() || '';
        
        if (!homeTeam.includes(query) && 
            !awayTeam.includes(query) && 
            !competition.includes(query) && 
            !venue.includes(query)) {
          return false;
        }
      }
      
      // Apply date range filter
      if (dateRange?.from) {
        const matchDate = new Date(match.date);
        if (matchDate < dateRange.from) {
          return false;
        }
      }
      
      if (dateRange?.to) {
        const matchDate = new Date(match.date);
        if (matchDate > dateRange.to) {
          return false;
        }
      }
      
      return true;
    });
  };
  
  const finalFilteredMatches = applyAdditionalFilters(filteredMatches);
  
  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Navbar />
      
      <div className="pt-32 pb-20">
        <div className="container mx-auto px-4">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, ease: "easeOut" }}
            className="mb-12 text-center"
          >
            <h1 className="text-4xl md:text-5xl font-bold text-team-blue mb-4">Fixtures & Results</h1>
            <p className="text-gray-600 max-w-2xl mx-auto">
              View all upcoming matches and past results for Banks o' Dee FC.
            </p>
          </motion.div>
          
          {isLoading ? (
            <div className="h-48 flex items-center justify-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-team-blue"></div>
              <p className="ml-4 text-gray-600">Loading fixtures and results...</p>
            </div>
          ) : (
            <>
              <EnhancedFixturesFilter
                selectedCompetition={selectedCompetition}
                setSelectedCompetition={setSelectedCompetition}
                selectedMonth={selectedMonth}
                setSelectedMonth={setSelectedMonth}
                showPast={showPast}
                setShowPast={setShowPast}
                showUpcoming={showUpcoming}
                setShowUpcoming={setShowUpcoming}
                competitions={competitions}
                availableMonths={availableMonths}
                venues={availableVenues}
                onClearFilters={clearFilters}
                searchQuery={searchQuery}
                setSearchQuery={setSearchQuery}
                dateRange={dateRange}
                setDateRange={setDateRange}
              />
              
              <Tabs value={viewMode} onValueChange={(value) => setViewMode(value as 'list' | 'calendar')} className="mb-6">
                <div className="flex justify-center">
                  <TabsList>
                    <TabsTrigger value="list" className="flex items-center gap-1">
                      <List className="h-4 w-4" />
                      List View
                    </TabsTrigger>
                    <TabsTrigger value="calendar" className="flex items-center gap-1">
                      <CalendarDays className="h-4 w-4" />
                      Calendar View
                    </TabsTrigger>
                  </TabsList>
                </div>
              </Tabs>
              
              <TabsContent value="list" className="mt-0">
                <div className="space-y-10">
                  {groupedMatches.length > 0 ? (
                    groupedMatches.map((group) => (
                      <MonthFixtures
                        key={group.month}
                        month={group.month}
                        matches={applyAdditionalFilters(group.matches)}
                      />
                    )).filter(group => {
                      // Remove empty groups after filtering
                      const contentExists = React.Children.toArray(group.props.children).some(
                        child => React.isValidElement(child) && child.props.matches && child.props.matches.length > 0
                      );
                      return contentExists;
                    })
                  ) : (
                    <NoFixturesFound onClearFilters={() => {
                      clearFilters();
                      setSearchQuery('');
                      setDateRange(undefined);
                    }} />
                  )}
                  
                  {groupedMatches.length > 0 && applyAdditionalFilters(filteredMatches).length === 0 && (
                    <NoFixturesFound onClearFilters={() => {
                      clearFilters();
                      setSearchQuery('');
                      setDateRange(undefined);
                    }} />
                  )}
                </div>
              </TabsContent>
              
              <TabsContent value="calendar" className="mt-0">
                <CalendarView 
                  matches={finalFilteredMatches} 
                  onFilterChange={(range) => setDateRange(range)}
                  isLoading={false}
                />
              </TabsContent>
            </>
          )}
        </div>
      </div>
      
      <Footer />
    </div>
  );
};

export default Fixtures;
