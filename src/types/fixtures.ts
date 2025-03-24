/**
 * Represents a fixture scraped from external sources
 */
export interface ScrapedFixture {
  id: string | number; // Required field to match Match interface
  homeTeam: string;
  awayTeam: string;
  date: string;
  time: string;
  competition: string;
  venue: string;
  isCompleted?: boolean;
  homeScore?: number | null;
  awayScore?: number | null;
}

// Function to convert ScrapedFixture to Match type
export function convertToMatch(fixture: ScrapedFixture): import('@/components/fixtures/types').Match {
  // Generate a unique ID if not already present
  const id = fixture.id || `fixture-${fixture.homeTeam}-${fixture.awayTeam}-${fixture.date}-${Math.random().toString(36).substring(2, 9)}`;
  
  return {
    id: id,
    homeTeam: fixture.homeTeam,
    awayTeam: fixture.awayTeam,
    date: fixture.date,
    time: fixture.time,
    competition: fixture.competition,
    venue: fixture.venue,
    isCompleted: !!fixture.isCompleted,
    homeScore: fixture.homeScore || undefined,
    awayScore: fixture.awayScore || undefined
  };
}

// Function to convert an array of ScrapedFixtures to Matches
export function convertToMatches(fixtures: ScrapedFixture[]): import('@/components/fixtures/types').Match[] {
  return fixtures.map(convertToMatch);
}
