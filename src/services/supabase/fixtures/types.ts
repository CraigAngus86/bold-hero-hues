
import { Match } from '@/components/fixtures/types';

export interface SupabaseMatch {
  id: string;
  home_team: string;
  away_team: string;
  date: string;
  time: string;
  competition: string;
  venue: string;
  is_completed: boolean;
  home_score?: number | null;
  away_score?: number | null;
  status: string;
  visible: boolean;
  created_at: string;
  updated_at: string;
}

// Convert Supabase match to our frontend Match format
export const convertToMatchFormat = (match: SupabaseMatch): Match => {
  return {
    id: match.id,
    homeTeam: match.home_team,
    awayTeam: match.away_team,
    date: match.date,
    time: match.time,
    competition: match.competition,
    venue: match.venue,
    isCompleted: match.is_completed,
    homeScore: match.home_score || 0,
    awayScore: match.away_score || 0
  };
};

// Convert frontend Match to Supabase format for single match
export const convertToSupabaseFormat = (match: Partial<Match>): Partial<SupabaseMatch> => {
  // Make sure required fields are present
  if (!match.homeTeam || !match.awayTeam || !match.date || !match.time || !match.competition || !match.venue) {
    console.error('Missing required fields for match conversion');
    throw new Error('Missing required fields for match conversion');
  }

  const supabaseMatch: Partial<SupabaseMatch> = {
    home_team: match.homeTeam,
    away_team: match.awayTeam,
    date: match.date,
    time: match.time,
    competition: match.competition,
    venue: match.venue,
    is_completed: match.isCompleted || false,
    status: match.isCompleted ? 'completed' : 'upcoming'
  };

  if (match.isCompleted && match.homeScore !== undefined && match.awayScore !== undefined) {
    supabaseMatch.home_score = match.homeScore;
    supabaseMatch.away_score = match.awayScore;
  }

  return supabaseMatch;
};
