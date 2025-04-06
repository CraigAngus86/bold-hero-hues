
import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import UpcomingFixtures from './fixtures/UpcomingFixtures';
import RecentResults from './fixtures/RecentResults';
import LeagueTablePreview from './fixtures/LeagueTablePreview';
import FixturesLoading from './fixtures/FixturesLoading';
import TicketButton from './fixtures/TicketButton';
import { useFixturesData } from './fixtures/hooks/useFixturesData';

const FixturesSection = () => {
  const { leagueData, isLoading, upcomingMatches, recentResults } = useFixturesData();
  
  // Find the next match that has tickets available
  const nextMatchWithTickets = upcomingMatches.find(match => match.ticketLink);

  return (
    <section className="py-12 bg-team-navy">
      <div className="container mx-auto px-3">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-3xl font-bold text-white">
              Results, Fixtures & League Table
            </h2>
            
            <TicketButton nextMatchWithTickets={nextMatchWithTickets} />
          </div>
          
          {isLoading ? (
            <FixturesLoading />
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="md:col-span-1">
                <div className="h-full">
                  <RecentResults matches={recentResults} />
                </div>
              </div>
              
              <div className="md:col-span-1">
                <div className="h-full">
                  <UpcomingFixtures matches={upcomingMatches} />
                </div>
              </div>
              
              <div className="md:col-span-1">
                <div className="h-full">
                  <LeagueTablePreview leagueData={leagueData} />
                </div>
              </div>
            </div>
          )}
        </motion.div>
      </div>
    </section>
  );
};

export default FixturesSection;
