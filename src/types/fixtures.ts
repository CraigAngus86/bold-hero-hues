
/**
 * Represents a fixture scraped from external sources
 */
export interface ScrapedFixture {
  id?: string | number; // Optional as it might not be present in scraped data
  homeTeam: string;
  awayTeam: string;
  date: string;
  time: string;
  competition: string;
  venue?: string;
  isCompleted?: boolean;
  homeScore?: number | null;
  awayScore?: number | null;
  season?: string;
  source?: string;
}

// Database representation of a fixture 
export interface DBFixture {
  id: string;
  home_team: string;
  away_team: string;
  date: string;
  time: string;
  competition: string;
  venue?: string;
  is_completed: boolean;
  home_score?: number | null;
  away_score?: number | null;
  season?: string;
  source?: string;
  import_date?: string;
  created_at?: string;
  updated_at?: string;
}

// Function to convert ScrapedFixture to Match type
export function convertToMatch(fixture: ScrapedFixture | DBFixture): import('@/components/fixtures/types').Match {
  // Generate a unique ID if not already present
  const id = 'id' in fixture && fixture.id 
    ? fixture.id 
    : `fixture-${fixture.homeTeam || fixture.home_team}-${fixture.awayTeam || fixture.away_team}-${fixture.date}-${Math.random().toString(36).substring(2, 9)}`;
  
  // Handle both ScrapedFixture and DBFixture formats
  const isDBFixture = 'home_team' in fixture;
  
  return {
    id: id,
    homeTeam: isDBFixture ? fixture.home_team : fixture.homeTeam,
    awayTeam: isDBFixture ? fixture.away_team : fixture.awayTeam,
    date: fixture.date,
    time: fixture.time,
    competition: fixture.competition,
    venue: fixture.venue || '',
    isCompleted: isDBFixture ? fixture.is_completed : !!fixture.isCompleted,
    homeScore: isDBFixture ? fixture.home_score : fixture.homeScore,
    awayScore: isDBFixture ? fixture.away_score : fixture.awayScore
  };
}

// Function to convert an array of fixtures to Matches
export function convertToMatches(fixtures: (ScrapedFixture | DBFixture)[]): import('@/components/fixtures/types').Match[] {
  return fixtures.map(convertToMatch);
}

// Convert DBFixture to ScrapedFixture format (for API compatibility)
export function convertDBToScraped(fixture: DBFixture): ScrapedFixture {
  return {
    id: fixture.id,
    homeTeam: fixture.home_team,
    awayTeam: fixture.away_team,
    date: fixture.date,
    time: fixture.time,
    competition: fixture.competition,
    venue: fixture.venue,
    isCompleted: fixture.is_completed,
    homeScore: fixture.home_score,
    awayScore: fixture.away_score,
    season: fixture.season,
    source: fixture.source
  };
}
