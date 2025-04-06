
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
