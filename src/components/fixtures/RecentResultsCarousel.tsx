
import React from 'react';
import { Match } from '@/types/fixtures';

interface RecentResultsCarouselProps {
  matches: Match[];
  loading?: boolean;
  error?: string | null;
}

const RecentResultsCarousel: React.FC<RecentResultsCarouselProps> = ({ 
  matches, 
  loading = false, 
  error = null 
}) => {
  if (loading) {
    return <div>Loading recent results...</div>;
  }

  if (error) {
    return <div>Error loading recent results: {error}</div>;
  }

  if (!matches || matches.length === 0) {
    return <div>No recent results available</div>;
  }

  return (
    <div className="recent-results-carousel">
      <h3 className="text-lg font-bold mb-4">Recent Results</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {matches.map((match) => (
          <div key={match.id} className="bg-white rounded shadow p-4">
            <div className="text-sm text-gray-600 mb-2">
              {new Date(match.date).toLocaleDateString()}
            </div>
            <div className="flex justify-between items-center">
              <div className="font-medium">{match.homeTeam}</div>
              <div className="text-lg font-bold">
                {match.homeScore} - {match.awayScore}
              </div>
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

export default RecentResultsCarousel;
