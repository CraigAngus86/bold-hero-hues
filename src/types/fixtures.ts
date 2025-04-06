
export interface Fixture {
  id?: string;
  date: string;
  time: string;
  home_team: string;
  away_team: string;
  home_score?: number | null;
  away_score?: number | null;
  competition: string;
  venue?: string;
  is_completed?: boolean;
  is_next_match?: boolean;
  is_latest_result?: boolean;
  date_passed?: boolean;
  ticket_link?: string;
  created_at?: string;
  updated_at?: string;
  import_date?: string;
  season?: string;
  source?: string;
  import_source?: string;
  match_report?: string;
  attendance?: string;
  referee?: string;
}

export interface FixtureExtended extends Fixture {
  match_report: string;
  attendance: string;
  referee: string;
  matchEvents?: any[];
  lineups?: { homeTeam: any[]; awayTeam: any[] };
  matchStats?: Record<string, any>;
}

export interface TeamStats {
  id: string | number;
  position: number;
  team: string;
  played: number;
  won: number;
  drawn: number;
  lost: number;
  goalsFor: number;
  goalsAgainst: number;
  goalDifference: number;
  points: number;
  form: string[];
  logo?: string;
  last_updated?: string;
}

// ScrapedFixture interface for scraped fixture data
export interface ScrapedFixture extends Partial<Fixture> {
  source: string;
  import_date: string;
  success?: boolean;
}

// Match interface for front-end representation
export interface Match {
  id: string;
  date: string;
  time: string;
  homeTeam: string;
  awayTeam: string;
  competition: string;
  venue: string;
  isCompleted: boolean;
  homeScore?: number;
  awayScore?: number;
  ticketLink?: string;
  season?: string;
  hasMatchPhotos?: boolean;
}

// Helper function to convert DB fixtures to Match objects for UI
export const dbFixturesToMatches = (fixtures: Fixture[]): Match[] => {
  return fixtures.map(fixture => ({
    id: fixture.id || '',
    date: fixture.date,
    time: fixture.time,
    homeTeam: fixture.home_team,
    awayTeam: fixture.away_team,
    competition: fixture.competition,
    venue: fixture.venue || '',
    isCompleted: fixture.is_completed || false,
    homeScore: fixture.home_score !== undefined ? fixture.home_score : undefined,
    awayScore: fixture.away_score !== undefined ? fixture.away_score : undefined,
    ticketLink: fixture.ticket_link,
    season: fixture.season
  }));
};

// Alternative conversion function
export const fixturesToMatches = dbFixturesToMatches;

// Alias for backward compatibility
export const convertToMatches = dbFixturesToMatches;
