
// Fixture types for the application
export interface Fixture {
  id: string;
  home_team: string;
  away_team: string;
  competition: string;
  date: string;
  time: string;
  venue?: string;
  season?: string;
  is_completed: boolean;
  home_score?: number;
  away_score?: number;
  created_at: string;
  updated_at?: string;
  import_date: string;
  source?: string;
  is_next_match?: boolean;
  is_latest_result?: boolean;
  date_passed?: boolean;
  ticket_link?: string;

  // For compatibility with Match type
  homeTeam?: string;
  awayTeam?: string;
  isCompleted?: boolean;
  homeScore?: number;
  awayScore?: number;
  ticketLink?: string;
}

// Type for extended fixture data with match details
export interface FixtureExtended extends Fixture {
  match_report?: string;
  attendance?: number;
  referee?: string;
  matchStats?: any;
}

// Team statistics in league table
export interface TeamStats {
  id: string;
  team: string;
  position: number;
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
  last_updated?: string; // Added this field
}

// Match data for frontend components
export interface Match {
  id: string;
  homeTeam: string;
  awayTeam: string;
  date: string;
  time: string;
  competition: string;
  venue: string;
  isCompleted: boolean;
  homeScore?: number;
  awayScore?: number;
  result?: string;
  ticketLink?: string;
}

// Helper function to convert database fixtures to UI match format
export const convertToMatches = (fixtures: Fixture[]): Match[] => {
  return fixtures.map(fixture => ({
    id: fixture.id,
    homeTeam: fixture.home_team,
    awayTeam: fixture.away_team,
    date: fixture.date,
    time: fixture.time,
    competition: fixture.competition,
    venue: fixture.venue || 'TBC',
    isCompleted: fixture.is_completed,
    homeScore: fixture.home_score,
    awayScore: fixture.away_score,
    ticketLink: fixture.ticket_link,
  }));
};

// Function to format match date
export const formatMatchDate = (dateString: string): string => {
  try {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-GB', {
      weekday: 'short',
      day: 'numeric',
      month: 'short',
      year: 'numeric'
    });
  } catch (error) {
    console.error('Error formatting date:', dateString, error);
    return dateString;
  }
};

// Function to get match time in readable format
export const formatMatchTime = (timeString: string): string => {
  return timeString || '15:00';
};
