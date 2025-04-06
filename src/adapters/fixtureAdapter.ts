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

/**
 * Adapts a Match to Fixture type
 */
export function adaptMatchToFixture(match: Match): Fixture {
  return {
    id: match.id,
    date: match.date,
    time: match.time,
    home_team: match.homeTeam,
    away_team: match.awayTeam,
    competition: match.competition,
    venue: match.venue,
    season: match.season,
    is_completed: match.isCompleted,
    home_score: match.homeScore,
    away_score: match.awayScore,
    ticket_link: match.ticketLink,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    date_passed: new Date(match.date) < new Date(),
    import_date: new Date().toISOString(),
    import_source: 'manual',
    location: match.venue,
    source_id: ''
  };
}

/**
 * Adapts multiple Matches to Fixture array
 */
export function adaptMatchesToFixtures(matches: Match[]): Fixture[] {
  return matches.map(adaptMatchToFixture);
}

