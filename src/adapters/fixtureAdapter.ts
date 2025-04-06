
import { Fixture, Match } from '@/types/fixtures';

/**
 * Adapter function to convert a Fixture database object to a Match view model
 */
export const adaptFixtureToMatch = (fixture: Fixture): Match => {
  return {
    id: fixture.id || '',
    date: fixture.date,
    time: fixture.time,
    homeTeam: fixture.home_team,
    awayTeam: fixture.away_team,
    competition: fixture.competition,
    venue: fixture.venue || '',
    isCompleted: fixture.is_completed || false,
    homeScore: fixture.home_score !== null ? fixture.home_score : undefined,
    awayScore: fixture.away_score !== null ? fixture.away_score : undefined,
    ticketLink: fixture.ticket_link,
    season: fixture.season,
    // Add additional properties as needed
    hasMatchPhotos: false // Default value, update if you have data for this
  };
};

/**
 * Adapter function to convert a Match view model back to a Fixture database object
 */
export const adaptMatchToFixture = (match: Match): Fixture => {
  return {
    id: match.id,
    date: match.date,
    time: match.time,
    home_team: match.homeTeam,
    away_team: match.awayTeam,
    competition: match.competition,
    venue: match.venue,
    is_completed: match.isCompleted,
    home_score: match.homeScore,
    away_score: match.awayScore,
    ticket_link: match.ticketLink,
    season: match.season
  };
};

/**
 * Converts an array of Fixtures to an array of Matches
 */
export const adaptFixturesToMatches = (fixtures: Fixture[]): Match[] => {
  return fixtures.map(adaptFixtureToMatch);
};

/**
 * Converts an array of Matches to an array of Fixtures
 */
export const adaptMatchesToFixtures = (matches: Match[]): Fixture[] => {
  return matches.map(adaptMatchToFixture);
};
