
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
}
