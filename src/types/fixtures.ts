
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
  match_report?: string;
  attendance?: string;
  referee?: string;
}

export interface FixtureExtended extends Fixture {
  match_report?: string;
  attendance?: string;
  referee?: string;
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

// Add DBFixture interface for database records
export interface DBFixture extends Fixture {
  // Add any additional database-specific fields
}

// Add ScrapedFixture interface for scraped fixture data
export interface ScrapedFixture extends Partial<Fixture> {
  source: string;
  import_date: string;
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

// Import and re-export the conversion functions from the utility file
import { fixturesToMatches as convertFixturesToMatches } from '@/utils/fixtureUtils';
export const convertToMatches = convertFixturesToMatches;
