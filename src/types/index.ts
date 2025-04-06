
// Add or ensure these type definitions are in place
export interface NewsArticle {
  id: string;
  title: string;
  content: string;
  image_url?: string;
  category: string;
  slug: string;
  publish_date: string;
  is_featured: boolean;
  created_at: string;
  updated_at: string;
  author?: string;
}

// Add other necessary type definitions
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
}

export interface Fixture {
  id: string;
  date: string;
  time?: string;
  homeTeam: string;
  awayTeam: string;
  competition: string;
  venue?: string;
  isCompleted?: boolean;
  homeScore?: number;
  awayScore?: number;
  ticketLink?: string;
  source?: string;
}

export interface Match extends Omit<Fixture, 'venue'> {
  venue: string;
}
