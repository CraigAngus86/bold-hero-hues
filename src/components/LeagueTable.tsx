
import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import LeagueTableContent from './league/LeagueTableContent';
import { mockLeagueData, TeamStats } from './league/types';

const LeagueTable = () => {
  const [leagueData, setLeagueData] = useState<TeamStats[]>([]);
  
  useEffect(() => {
    setLeagueData(mockLeagueData);
  }, []);
  
  return (
    <section className="py-12 bg-team-gray">
      <div className="container mx-auto px-4">
        <h2 className="text-2xl font-semibold text-team-blue mb-6 text-center">Highland League Table</h2>
        
        <div className="flex justify-end mb-4">
          <a 
            href="/table" 
            className="px-5 py-2 bg-team-blue text-white rounded-md hover:bg-team-navy transition-colors text-sm font-medium"
          >
            View Full Table
          </a>
        </div>
        
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="bg-white rounded-lg shadow-sm overflow-hidden"
        >
          <LeagueTableContent leagueData={leagueData} />
        </motion.div>
      </div>
    </section>
  );
};

export default LeagueTable;
