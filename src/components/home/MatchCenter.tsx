
import React from 'react';
import { Link } from 'react-router-dom';
import { useHeroSlides } from '@/hooks/useHeroSlides';

const MatchCenter: React.FC = () => {
  const { nextMatch, recentResults } = useHeroSlides();
  
  // Check if we have data from our hook
  const hasNextMatch = nextMatch !== null;
  const hasRecentResults = recentResults && recentResults.length > 0;

  return (
    <section className="bg-gray-50 py-8">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Fixtures */}
          <div className="bg-white rounded-lg shadow-md overflow-hidden">
            <div className="bg-[#00105A] text-white py-3 px-4 flex justify-between items-center">
              <h2 className="text-xl font-bold">Upcoming Fixtures</h2>
              <Link to="/fixtures" className="text-sm text-white hover:underline">
                View All
              </Link>
            </div>
            <div className="divide-y divide-gray-200">
              {!hasNextMatch ? (
                <div className="p-4 flex items-center justify-center h-48">
                  <p className="text-gray-500">No upcoming fixtures</p>
                </div>
              ) : (
                <div>
                  {[nextMatch, nextMatch, nextMatch, nextMatch].slice(0, 4).map((fixture, index) => {
                    const fixtureDate = new Date(fixture.date);
                    const isBanksHome = fixture.home_team?.includes('Banks o\' Dee');
                    
                    return (
                      <div key={`${fixture.id}-${index}`} className="p-4 hover:bg-gray-50">
                        <div className="text-sm text-gray-500 mb-1">
                          {fixtureDate.toLocaleDateString('en-GB', { weekday: 'short', day: 'numeric', month: 'short' })} | 
                          {fixture.time ? ` ${fixture.time}` : ' 15:00'} | 
                          {` ${fixture.competition || 'Highland League'}`}
                        </div>
                        
                        <div className="flex items-center justify-between">
                          <div className="flex-1">
                            <div className={`font-semibold ${isBanksHome ? 'text-[#00105A]' : ''}`}>
                              {fixture.home_team}
                            </div>
                          </div>
                          
                          <div className="mx-2 bg-[#C5E7FF] text-[#00105A] font-bold py-1 px-3 rounded text-sm">
                            VS
                          </div>
                          
                          <div className="flex-1 text-right">
                            <div className={`font-semibold ${!isBanksHome ? 'text-[#00105A]' : ''}`}>
                              {fixture.away_team}
                            </div>
                          </div>
                        </div>
                        
                        <div className="mt-2 text-sm text-gray-600">
                          {fixture.venue || 'Spain Park'}
                          {fixture.ticket_link && (
                            <Link 
                              to={fixture.ticket_link} 
                              className="float-right bg-[#FFD700] hover:bg-[#FFD700]/90 text-[#00105A] px-2 py-1 rounded text-xs font-semibold"
                            >
                              Buy Tickets
                            </Link>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </div>
          
          {/* Results */}
          <div className="bg-white rounded-lg shadow-md overflow-hidden">
            <div className="bg-[#00105A] text-white py-3 px-4 flex justify-between items-center">
              <h2 className="text-xl font-bold">Recent Results</h2>
              <Link to="/fixtures" className="text-sm text-white hover:underline">
                View All
              </Link>
            </div>
            <div className="divide-y divide-gray-200">
              {!hasRecentResults ? (
                <div className="p-4 flex items-center justify-center h-48">
                  <p className="text-gray-500">No recent results</p>
                </div>
              ) : (
                <div>
                  {recentResults.slice(0, 4).map((result) => {
                    const resultDate = new Date(result.date);
                    const isBanksHome = result.home_team.includes('Banks o\' Dee');
                    const isBanksWin = (isBanksHome && result.home_score > result.away_score) || 
                                      (!isBanksHome && result.away_score > result.home_score);
                    const isDraw = result.home_score === result.away_score;
                    
                    return (
                      <div key={result.id} className="p-4 hover:bg-gray-50">
                        <div className="text-sm text-gray-500 mb-1">
                          {resultDate.toLocaleDateString('en-GB', { weekday: 'short', day: 'numeric', month: 'short' })} | 
                          {` ${result.competition || 'Highland League'}`}
                        </div>
                        
                        <div className="flex items-center justify-between">
                          <div className="flex-1">
                            <div className={`font-semibold ${isBanksHome ? 'text-[#00105A]' : ''}`}>
                              {result.home_team}
                            </div>
                          </div>
                          
                          <div className="mx-2 flex items-center space-x-1">
                            <span className={`py-1 px-2 rounded font-bold text-white ${
                              (isBanksHome && isBanksWin) || (!isBanksHome && !isBanksWin && !isDraw) 
                                ? 'bg-green-500' 
                                : isDraw 
                                  ? 'bg-yellow-500' 
                                  : 'bg-red-500'
                            }`}>
                              {result.home_score}
                            </span>
                            <span className="text-gray-500">-</span>
                            <span className={`py-1 px-2 rounded font-bold text-white ${
                              (!isBanksHome && isBanksWin) || (isBanksHome && !isBanksWin && !isDraw) 
                                ? 'bg-green-500' 
                                : isDraw 
                                  ? 'bg-yellow-500' 
                                  : 'bg-red-500'
                            }`}>
                              {result.away_score}
                            </span>
                          </div>
                          
                          <div className="flex-1 text-right">
                            <div className={`font-semibold ${!isBanksHome ? 'text-[#00105A]' : ''}`}>
                              {result.away_team}
                            </div>
                          </div>
                        </div>
                        
                        <div className="mt-2 text-sm text-gray-600">
                          {result.venue || 'Spain Park'}
                          <Link 
                            to={`/fixtures/${result.id}`} 
                            className="float-right bg-[#C5E7FF] hover:bg-[#C5E7FF]/90 text-[#00105A] px-2 py-1 rounded text-xs font-semibold"
                          >
                            Match Report
                          </Link>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default MatchCenter;
