
import { Fixture, Match } from '@/types/fixtures';

/**
 * Convert database fixtures to frontend Match objects
 */
export const fixturesToMatches = (fixtures: Fixture[]): Match[] => {
  return fixtures.map(fixture => ({
    id: fixture.id,
    date: fixture.date,
    time: fixture.time,
    homeTeam: fixture.home_team,
    awayTeam: fixture.away_team,
    competition: fixture.competition,
    venue: fixture.venue,
    isCompleted: fixture.is_completed || false,
    homeScore: fixture.home_score !== null && fixture.home_score !== undefined ? Number(fixture.home_score) : undefined,
    awayScore: fixture.away_score !== null && fixture.away_score !== undefined ? Number(fixture.away_score) : undefined,
    ticketLink: fixture.ticket_link
  }));
};

/**
 * Convert frontend Match objects to database Fixtures
 */
export const matchesToFixtures = (matches: Match[]): Fixture[] => {
  return matches.map(match => ({
    id: match.id,
    date: match.date,
    time: match.time,
    home_team: match.homeTeam,
    away_team: match.awayTeam,
    competition: match.competition,
    venue: match.venue,
    is_completed: match.isCompleted,
    home_score: match.homeScore !== undefined ? match.homeScore : null,
    away_score: match.awayScore !== undefined ? match.awayScore : null,
    ticket_link: match.ticketLink
  }));
};

/**
 * Check if a fixture date has passed
 */
export const hasFixtureDatePassed = (fixture: Fixture): boolean => {
  if (!fixture.date) return false;
  
  const fixtureDate = new Date(fixture.date);
  
  // If there's a time, add it to the fixture date
  if (fixture.time) {
    const [hours, minutes] = fixture.time.split(':').map(Number);
    fixtureDate.setHours(hours || 0);
    fixtureDate.setMinutes(minutes || 0);
  }
  
  const now = new Date();
  return fixtureDate < now;
};
