
export interface Fixture {
  id: string;
  date: string;
  time: string;
  home_team: string;
  away_team: string;
  competition: string;
  venue?: string;
  is_completed: boolean;
  home_score?: number | null;
  away_score?: number | null;
  season?: string;
  ticket_link?: string;
  source?: string;
  is_next_match?: boolean;
  is_latest_result?: boolean;
  date_passed?: boolean;
  import_date?: string;
  match_report?: string;
}
