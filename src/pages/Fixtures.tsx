
import { useState } from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { motion } from 'framer-motion';
import FixturesFilter from '@/components/fixtures/FixturesFilter';
import MonthFixtures from '@/components/fixtures/MonthFixtures';
import NoFixturesFound from '@/components/fixtures/NoFixturesFound';
import { mockMatches, competitions } from '@/components/fixtures/fixturesMockData';
import { getAvailableMonths, groupMatchesByMonth } from '@/components/fixtures/types';

const Fixtures = () => {
  const [selectedCompetition, setSelectedCompetition] = useState("All Competitions");
  const [selectedMonth, setSelectedMonth] = useState("All Months");
  const [showPast, setShowPast] = useState(true);
  const [showUpcoming, setShowUpcoming] = useState(true);
  
  const availableMonths = getAvailableMonths(mockMatches);
  
  const filteredMatches = mockMatches.filter(match => {
    const competitionMatch = selectedCompetition === "All Competitions" || match.competition === selectedCompetition;
    const timeframeMatch = (showPast && match.isCompleted) || (showUpcoming && !match.isCompleted);
    
    const matchMonth = new Date(match.date).toLocaleDateString('en-GB', { month: 'long', year: 'numeric' });
    const monthMatch = selectedMonth === "All Months" || matchMonth === selectedMonth;
    
    return competitionMatch && timeframeMatch && monthMatch;
  });
  
  const groupedMatches = groupMatchesByMonth(filteredMatches);
  
  const clearFilters = () => {
    setSelectedCompetition("All Competitions");
    setSelectedMonth("All Months");
    setShowPast(true);
    setShowUpcoming(true);
  };
  
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
          
          <FixturesFilter
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
            onClearFilters={clearFilters}
          />
          
          <div className="space-y-10">
            {Object.keys(groupedMatches).length > 0 ? (
              Object.entries(groupedMatches).map(([month, matches]) => (
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
        </div>
      </div>
      
      <Footer />
    </div>
  );
};

export default Fixtures;
