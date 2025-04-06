
// The conflicting Match import should be removed and adapted to use our own Match type
import { Match as OriginalMatch } from '@/components/fixtures/types';

export interface Fixture {
  id: string;
  home_team: string;
  away_team: string;
  date: string;
  time: string;
  venue: string;
  competition: string;
  season: string;
  is_completed: boolean;
  home_score?: number;
  away_score?: number;
  ticket_link?: string;
  source?: string;
  import_date: string;
  created_at: string;
  updated_at: string;
  match_report?: string;
  attendance?: number;
  referee?: string;
}

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
  form?: string[];
  logo?: string;
}

export interface Competition {
  id: string;
  name: string;
  abbreviation?: string;
  type: 'league' | 'cup' | 'friendly';
  season_id?: string;
}

export interface Venue {
  id: string;
  name: string;
  address?: string;
  capacity?: number;
  coordinates?: {
    latitude: number;
    longitude: number;
  };
}

export interface Season {
  id: string;
  name: string;
  start_date: string;
  end_date: string;
  is_current: boolean;
}

export interface FixtureFilter {
  season?: string;
  competition?: string;
  team?: string;
  dateFrom?: string;
  dateTo?: string;
  status?: 'all' | 'upcoming' | 'completed';
}

// Define the database fixture type
export interface DBFixture {
  id: string;
  home_team: string;
  away_team: string;
  date: string;
  time: string;
  venue: string;
  competition: string;
  season: string;
  is_completed: boolean;
  home_score?: number;
  away_score?: number;
  ticket_link?: string;
  source?: string;
  import_date: string;
  created_at: string;
  updated_at: string;
  match_report?: string;
  attendance?: number;
  referee?: string;
}

// Define the frontend Match type as used in components
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
  season?: string;
  ticketLink?: string;
  source?: string;
  match_report?: string;
  attendance?: number;
  referee?: string;
  media?: MatchMedia[];
  hasMatchPhotos?: boolean;
}

export interface MatchMedia {
  id: string;
  matchId: string;
  type: 'image' | 'video';
  url: string;
  caption?: string;
  isFeatured?: boolean;
  dateAdded: string;
  addedBy?: string;
  credit?: string;
  tags?: string[];
}

// Define scraped fixture interface for external data sources
export interface ScrapedFixture {
  home_team: string;
  away_team: string;
  date: string;
  time: string;
  venue?: string;
  competition: string;
  is_completed: boolean;
  home_score?: number;
  away_score?: number;
  source?: string;
  match_report_url?: string;
  season?: string;
  external_id?: string;
}

/**
 * Converts database fixtures to frontend Match format
 */
export function convertToMatches(fixtures: (DBFixture | ScrapedFixture)[]): OriginalMatch[] {
  return fixtures.map(fixture => ({
    id: 'id' in fixture ? fixture.id : `temp-${Math.random().toString(36).substring(2, 11)}`,
    date: fixture.date,
    time: fixture.time,
    homeTeam: fixture.home_team,
    awayTeam: fixture.away_team,
    competition: fixture.competition,
    venue: fixture.venue || 'Unknown',
    isCompleted: fixture.is_completed,
    homeScore: fixture.home_score,
    awayScore: fixture.away_score,
    season: 'season' in fixture ? fixture.season : undefined,
    ticketLink: 'ticket_link' in fixture ? fixture.ticket_link : undefined,
    source: fixture.source,
    match_report: 'match_report' in fixture ? fixture.match_report : undefined,
    attendance: 'attendance' in fixture ? fixture.attendance : undefined,
    referee: 'referee' in fixture ? fixture.referee : undefined,
  }));
}
