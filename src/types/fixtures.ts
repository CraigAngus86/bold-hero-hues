
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
