import { useState, useEffect } from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { motion } from 'framer-motion';
import FixturesFilter from '@/components/fixtures/FixturesFilter';
import MonthFixtures from '@/components/fixtures/MonthFixtures';
import NoFixturesFound from '@/components/fixtures/NoFixturesFound';
import { fetchFixtures, fetchResults } from '@/services/leagueDataService';
import { useFixturesFilter } from '@/hooks/useFixturesFilter';
import { Match } from '@/components/fixtures/types';
import { toast } from "sonner";

const Fixtures = () => {
  const [allMatches, setAllMatches] = useState<Match[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [availableCompetitions, setAvailableCompetitions] = useState<string[]>(["All Competitions"]);
  
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
        setAllMatches([...fixtures, ...results]);
        
        // Extract unique competitions from matches
        const uniqueCompetitions = [...new Set([...fixtures, ...results].map(match => match.competition))];
        setAvailableCompetitions(["All Competitions", ...uniqueCompetitions.sort()]);
        
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
    filteredMatches,
    selectedCompetition,
    setSelectedCompetition,
    selectedMonth,
    setSelectedMonth,
    showPast,
    setShowPast,
    showUpcoming,
    setShowUpcoming,
    availableMonths,
    clearFilters
  } = useFixturesFilter({ matches: allMatches, competitions: availableCompetitions });
  
  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Navbar />
      
      <div className="pt-32 pb-20">
        <div className="container mx-auto px-4">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
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
              <FixturesFilter
                selectedCompetition={selectedCompetition}
                setSelectedCompetition={setSelectedCompetition}
                selectedMonth={selectedMonth}
                setSelectedMonth={setSelectedMonth}
                showPast={showPast}
                setShowPast={setShowPast}
                showUpcoming={showUpcoming}
                setShowUpcoming={setShowUpcoming}
                competitions={availableCompetitions}
                availableMonths={availableMonths}
                onClearFilters={clearFilters}
              />
              
              <div className="space-y-10">
                {Object.keys(filteredMatches).length > 0 ? (
                  Object.entries(filteredMatches).map(([month, matches]) => (
                    <MonthFixtures
                      key={month}
                      month={month}
                      matches={matches}
                    />
                  ))
                ) : (
                  <NoFixturesFound onClearFilters={clearFilters} />
                )}
              </div>
            </>
          )}
        </div>
      </div>
      
      <Footer />
    </div>
  );
};

export default Fixtures;
