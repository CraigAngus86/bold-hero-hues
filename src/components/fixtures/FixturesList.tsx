
import React from 'react';
import { Match } from '@/types/fixtures';
import MatchCard from './MatchCard';

interface FixturesListProps {
  fixtures: Match[];
  emptyMessage?: string;
  showScores?: boolean;
}

const FixturesList: React.FC<FixturesListProps> = ({ 
  fixtures, 
  emptyMessage = "No fixtures available", 
  showScores = false 
}) => {
  if (!fixtures || fixtures.length === 0) {
    return (
      <div className="text-center py-4 text-gray-500">
        {emptyMessage}
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {fixtures.map((match) => (
        <MatchCard 
          key={match.id} 
          match={{
            ...match,
            isCompleted: match.isCompleted || showScores
          }} 
          showTicketButton={!showScores}
        />
      ))}
    </div>
  );
};

export default FixturesList;
