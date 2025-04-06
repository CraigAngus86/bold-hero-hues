
export interface Fixture {
  id: string;
  date: string;
  time: string;
  home_team: string;
  away_team: string;
  competition: string;
  venue?: string;
  season?: string;
  is_completed: boolean;
  home_score?: number;
  away_score?: number;
  ticket_link?: string;
  import_date: string;
  created_at: string;
  updated_at: string;
  date_passed: boolean;
  source?: string;
  match_report?: string;
  attendance?: number;
  referee?: string;
  is_next_match?: boolean;
  is_latest_result?: boolean;
  
  // For compatibility with frontend components
  homeTeam?: string;
  awayTeam?: string;
  isCompleted?: boolean;
  homeScore?: number;
  awayScore?: number;
  ticketLink?: string;
}

export type DBFixture = Fixture;

export interface FixtureExtended extends Fixture {
  matchReport?: string;
  matchEvents?: any[];
  lineups?: any;
  matchStats?: any;
  attendance?: number;
  referee?: string;
}

export interface ScrapedFixture {
  id?: string;
  date: string;
  time?: string;
  home_team: string;
  away_team: string;
  competition: string;
  venue?: string;
  season?: string;
  is_completed?: boolean;
  home_score?: number;
  away_score?: number;
  source?: string;
}

export interface TeamStats {
  id?: string;
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
  form: string[] | string;
  logo?: string;
  last_updated?: string;
}

// Helper function to convert database fixtures to frontend match format
export function convertToMatches(fixtures: Fixture[]): any[] {
  return fixtures.map(fixture => ({
    id: fixture.id,
    date: fixture.date,
    time: fixture.time,
    homeTeam: fixture.home_team,
    awayTeam: fixture.away_team,
    competition: fixture.competition,
    venue: fixture.venue || '',
    isCompleted: fixture.is_completed,
    homeScore: fixture.home_score,
    awayScore: fixture.away_score,
    ticketLink: fixture.ticket_link,
    season: fixture.season,
    source: fixture.source,
    match_report: fixture.match_report,
    attendance: fixture.attendance,
    referee: fixture.referee
  }));
}

export interface ImportResult {
  success: boolean;
  message: string;
  added: number;
  updated: number;
  valid?: boolean;
  validFixtures?: ScrapedFixture[];
}
