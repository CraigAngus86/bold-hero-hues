
// Common types used across the application

export interface SystemLog {
  id: string;
  timestamp: string;
  type: string;
  source: string;
  message: string;
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

export interface MatchEvent {
  id: string;
  matchId: string;
  time: number; // Minutes into the match
  type: 'goal' | 'yellow-card' | 'red-card' | 'substitution' | 'other';
  player?: string;
  team: string;
  description?: string;
}

export interface MatchLineup {
  matchId: string;
  teamId: string;
  players: LineupPlayer[];
}

export interface LineupPlayer {
  id: string;
  name: string;
  position: string;
  number?: number;
  isStarting: boolean;
}

export interface MatchStats {
  matchId: string;
  possession?: [number, number]; // Home, Away percentages
  shots?: [number, number]; // Home, Away
  shotsOnTarget?: [number, number]; // Home, Away
  corners?: [number, number]; // Home, Away
  fouls?: [number, number]; // Home, Away
  offsides?: [number, number]; // Home, Away
}

// News related types
export interface NewsArticle {
  id: string;
  title: string;
  content: string;
  slug: string;
  image_url?: string;
  category: string;
  publish_date: string;
  created_at: string;
  updated_at: string;
  author?: string;
  is_featured: boolean;
}

export interface CreateNewsArticleData {
  title: string;
  content: string;
  slug: string;
  image_url?: string;
  category: string;
  publish_date: string;
  author?: string;
  is_featured: boolean;
}

export interface UpdateNewsArticleData {
  title?: string;
  content?: string;
  slug?: string;
  image_url?: string;
  category?: string;
  publish_date?: string;
  author?: string;
  is_featured?: boolean;
}

export interface NewsQueryOptions {
  limit?: number;
  category?: string;
  featured?: boolean;
  orderBy?: 'publish_date' | 'title' | 'created_at';
  orderDirection?: 'asc' | 'desc';
}

// Fixture/Match types
export interface Fixture {
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
}

export interface Match extends Omit<Fixture, 'venue'> {
  venue: string; // Make venue required in Match
}

// Team related types
export interface TeamStats {
  wins: number;
  draws: number;
  losses: number;
  goalsFor: number;
  goalsAgainst: number;
  cleanSheets: number;
}
