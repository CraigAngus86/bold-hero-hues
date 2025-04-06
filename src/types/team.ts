
/**
 * Team related type definitions
 */

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
  wins?: number;
  losses?: number;
  draws?: number;
  goalsScored?: number;
  goalsConceded?: number;
}

export interface Player {
  id: string;
  name: string;
  position: string;
  imageUrl?: string;
  number?: number;
  dateOfBirth?: string;
  nationality?: string;
  height?: string;
  weight?: string;
  // Add other player properties as needed
}

// Add other team-related interfaces here as needed
