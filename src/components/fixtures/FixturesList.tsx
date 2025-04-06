
import React from 'react';
import { Match } from '@/types/fixtures';
import MatchCard from './MatchCard';
import { motion } from 'framer-motion';

interface FixturesListProps {
  fixtures: Match[];
  emptyMessage?: string;
  showScores?: boolean;
  compact?: boolean;
}

const FixturesList: React.FC<FixturesListProps> = ({ 
  fixtures, 
  emptyMessage = "No fixtures available", 
  showScores = false,
  compact = false
}) => {
  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };
  
  const itemVariants = {
    hidden: { opacity: 0, y: 10 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.3 }
    }
  };

  if (!fixtures || fixtures.length === 0) {
    return (
      <div className="text-center py-8 text-gray-500 bg-gray-50 rounded-md">
        <p className="text-lg">{emptyMessage}</p>
      </div>
    );
  }

  return (
    <motion.div 
      className="space-y-4"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      {fixtures.map((match) => (
        <motion.div key={match.id} variants={itemVariants}>
          <MatchCard 
            key={match.id} 
            match={{
              ...match,
              isCompleted: match.isCompleted || showScores
            }} 
            showTicketButton={!showScores && !match.isCompleted}
            className={compact ? "max-w-full" : ""}
          />
        </motion.div>
      ))}
    </motion.div>
  );
};

export default FixturesList;
