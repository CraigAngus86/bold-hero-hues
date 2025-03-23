
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { motion } from 'framer-motion';
import FixturesFilter from '@/components/fixtures/FixturesFilter';
import MonthFixtures from '@/components/fixtures/MonthFixtures';
import NoFixturesFound from '@/components/fixtures/NoFixturesFound';
import { mockMatches, competitions } from '@/components/fixtures/fixturesMockData';
import { useFixturesFilter } from '@/hooks/useFixturesFilter';

const Fixtures = () => {
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
  } = useFixturesFilter({ matches: mockMatches, competitions });
  
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
        </div>
      </div>
      
      <Footer />
    </div>
  );
};

export default Fixtures;
