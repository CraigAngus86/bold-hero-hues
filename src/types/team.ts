
/**
 * Team related type definitions
 */

// Original TeamMember interface needed by existing components
export interface TeamMember {
  id: string;
  name: string;
  member_type: MemberType;
  position?: string;
  image_url?: string;
  bio?: string;
  nationality?: string;
  jersey_number?: number;
  previous_clubs?: string[];
  experience?: string;
  is_active?: boolean;
  stats?: Record<string, any>;
  created_at?: string;
  updated_at?: string;
}

// Original MemberType type needed by existing components
export type MemberType = 'player' | 'management' | 'official';

// New interfaces for expanded functionality
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
