
import { Fixture, FixtureExtended } from '@/types/fixtures';
import { Match } from '@/components/fixtures/types';

/**
 * Converts a Fixture or FixtureExtended object to Match format
 */
export const fixtureToMatch = (fixture: Fixture | FixtureExtended): Match => {
  return {
    id: fixture.id,
    date: fixture.date,
    time: fixture.time,
    homeTeam: fixture.home_team,
    awayTeam: fixture.away_team,
    competition: fixture.competition,
    venue: fixture.venue || '',
    isCompleted: fixture.is_completed || false,
    homeScore: fixture.home_score !== undefined && fixture.home_score !== null 
      ? Number(fixture.home_score) 
      : null,
    awayScore: fixture.away_score !== undefined && fixture.away_score !== null 
      ? Number(fixture.away_score) 
      : null,
    ticketLink: fixture.ticket_link,
    season: fixture.season,
    match_report: fixture.match_report,
    attendance: fixture.attendance !== undefined ? String(fixture.attendance) : undefined,
    referee: fixture.referee,
    hasMatchPhotos: false, // Default value
  };
};

/**
 * Converts an array of Fixtures to Match format
 */
export const fixturesToMatches = (fixtures: (Fixture | FixtureExtended)[]): Match[] => {
  return fixtures.map(fixtureToMatch);
};

/**
 * Converts a Match object to Fixture format
 */
export const matchToFixture = (match: Match): Fixture => {
  return {
    id: match.id,
    date: match.date,
    time: match.time,
    home_team: match.homeTeam,
    away_team: match.awayTeam,
    competition: match.competition,
    venue: match.venue,
    season: match.season || '',
    is_completed: match.isCompleted,
    home_score: match.homeScore !== null ? Number(match.homeScore) : null,
    away_score: match.awayScore !== null ? Number(match.awayScore) : null,
    ticket_link: match.ticketLink,
    import_date: new Date().toISOString(),
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    date_passed: new Date(match.date) < new Date(),
    match_report: match.match_report,
    attendance: match.attendance,
    referee: match.referee
  };
};
