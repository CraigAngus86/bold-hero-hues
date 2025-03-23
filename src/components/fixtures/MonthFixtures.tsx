
import { Calendar } from 'lucide-react';
import { motion } from 'framer-motion';
import MatchCard from './MatchCard';
import { Match } from './types';

interface MonthFixturesProps {
  month: string;
  matches: Match[];
}

const MonthFixtures = ({ month, matches }: MonthFixturesProps) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
    >
      <h2 className="text-2xl font-bold text-team-blue mb-4 flex items-center">
        <Calendar className="w-5 h-5 mr-2" />
        {month}
      </h2>
      
      <div className="space-y-4">
        {matches.map((match) => (
          <MatchCard key={match.id} match={match} />
        ))}
      </div>
    </motion.div>
  );
};

export default MonthFixtures;
