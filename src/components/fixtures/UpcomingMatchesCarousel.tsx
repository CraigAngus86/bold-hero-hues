
import React from 'react';
import { Match } from '@/types/fixtures';

interface UpcomingMatchesCarouselProps {
  matches: Match[];
  loading?: boolean;
  error?: string | null;
}

const UpcomingMatchesCarousel: React.FC<UpcomingMatchesCarouselProps> = ({ 
  matches, 
  loading = false, 
  error = null 
}) => {
  if (loading) {
    return <div>Loading upcoming matches...</div>;
  }

  if (error) {
    return <div>Error loading upcoming matches: {error}</div>;
  }

  if (!matches || matches.length === 0) {
    return <div>No upcoming matches scheduled</div>;
  }

  return (
    <div className="upcoming-matches-carousel">
      <h3 className="text-lg font-bold mb-4">Upcoming Matches</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {matches.map((match) => (
          <div key={match.id} className="bg-white rounded shadow p-4">
            <div className="text-sm text-gray-600 mb-2">
              {new Date(match.date).toLocaleDateString()} - {match.time}
            </div>
            <div className="flex justify-between items-center">
              <div className="font-medium">{match.homeTeam}</div>
              <div className="text-xs bg-gray-100 px-2 py-1 rounded">vs</div>
              <div className="font-medium">{match.awayTeam}</div>
            </div>
            <div className="text-sm text-gray-500 mt-2">
              {match.competition} at {match.venue}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default UpcomingMatchesCarousel;
