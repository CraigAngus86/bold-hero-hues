
export interface Fixture {
  id: string;
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
  import_source?: string; // Added this property
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
  form: string[]; // Make form required to match component expectations
  logo?: string;
  last_updated?: string;
}

// Use Fixture as DBFixture for backward compatibility
export type DBFixture = Fixture;

// Add ScrapedFixture interface for scraped fixture data
export interface ScrapedFixture extends Partial<Fixture> {
  source: string;
  import_date: string;
  success?: boolean;
}

// Add ImportResult interface for fixture import operations
export interface ImportResult {
  success: boolean;
  message: string;
  added: number;
  updated: number;
  valid?: boolean;
  validFixtures?: ScrapedFixture[];
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
}

// Import and re-export the conversion functions from the utility file
import { fixturesToMatches } from '@/utils/fixtureUtils';
export { fixturesToMatches as convertToMatches };
