
// This file contains all the types for the fixtures feature
// to ensure consistent typing across the application

export interface TeamStats {
  id: string;
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
  form: string | string[];
  logo?: string;
  last_updated?: string;
}

export interface Fixture {
  id: string;
  date: string;
  time: string;
  home_team: string;
  away_team: string;
  competition: string;
  venue: string;
  season: string;
  is_completed: boolean;
  home_score?: number;
  away_score?: number;
  ticket_link?: string;
  import_date: string;
  created_at: string;
  updated_at: string;
  is_next_match?: boolean;
  is_latest_result?: boolean;
  date_passed: boolean;
  match_report?: string;
  attendance?: number;
  referee?: string;
}

export interface FixtureExtended extends Fixture {
  matchStats?: Record<string, any>;
  media?: FixtureMedia[];
}

export interface FixtureMedia {
  id: string;
  fixture_id: string;
  url: string;
  type: 'image' | 'video';
  caption?: string;
  credit?: string;
  is_featured?: boolean;
  created_at: string;
  updated_at: string;
}

export interface ScrapedFixture {
  date: string;
  time?: string;
  home_team: string;
  away_team: string;
  competition: string;
  venue?: string;
  is_completed: boolean;
  home_score?: number;
  away_score?: number;
  season?: string;
  source?: string;
}

export interface ImportResult {
  success: boolean;
  message: string;
  added: number;
  updated: number;
  valid?: boolean;
  validFixtures?: ScrapedFixture[];
}

export interface DBFixture {
  id: string;
  date: string;
  time: string;
  home_team: string;
  away_team: string;
  competition: string;
  venue: string;
  is_completed: boolean;
  home_score?: number;
  away_score?: number;
  season: string;
  ticket_link?: string;
  import_date: string;
  created_at: string;
  updated_at: string;
  is_next_match?: boolean;
  is_latest_result?: boolean;
  date_passed: boolean;
  match_report?: string;
  attendance?: number;
  referee?: string;
}

// Helper functions for conversion between different formats
export function convertToMatches(fixtures: DBFixture[] | ScrapedFixture[]): any[] {
  return fixtures.map(fixture => ({
    id: 'id' in fixture ? fixture.id : `temp-${Math.random().toString(36).substr(2, 9)}`,
    date: fixture.date,
    time: 'time' in fixture ? fixture.time : '',
    homeTeam: fixture.home_team,
    awayTeam: fixture.away_team,
    competition: fixture.competition,
    venue: fixture.venue || 'TBD',
    isCompleted: fixture.is_completed,
    homeScore: fixture.home_score,
    awayScore: fixture.away_score,
    season: 'season' in fixture ? fixture.season : '',
    ticketLink: 'ticket_link' in fixture ? fixture.ticket_link : undefined
  }));
}
