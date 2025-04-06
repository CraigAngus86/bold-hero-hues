
import { Match } from '@/components/fixtures/types';
import { Fixture } from '@/types/fixtures';

/**
 * Adapts a Fixture to Match type for compatibility between components
 */
export function adaptFixtureToMatch(fixture: Fixture): Match {
  return {
    id: fixture.id,
    date: fixture.date,
    time: fixture.time,
    homeTeam: fixture.home_team,
    awayTeam: fixture.away_team,
    competition: fixture.competition,
    venue: fixture.venue || '',
    season: fixture.season || '',
    isCompleted: fixture.is_completed,
    homeScore: fixture.home_score || 0,
    awayScore: fixture.away_score || 0,
    ticketLink: fixture.ticket_link || ''
  };
}

/**
 * Adapts multiple Fixtures to Match array
 */
export function adaptFixturesToMatches(fixtures: Fixture[]): Match[] {
  return fixtures.map(adaptFixtureToMatch);
}
