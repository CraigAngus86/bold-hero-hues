
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
