
export interface TeamMember {
  id: string;
  name: string;
  member_type: 'player' | 'staff' | 'coach' | 'official' | 'management';
  position?: string;
  image_url?: string;
  bio?: string;
  is_active: boolean;  // This is required in some usages
  created_at?: string;
  updated_at?: string;
  jersey_number?: number;
  nationality?: string;
  experience?: string;
  previous_clubs?: string[];
  stats?: {
    goals?: number;
    assists?: number;
    appearances?: number;
    [key: string]: any;
  };
}

export interface PlayerStats {
  playerId: string;
  season?: string;
  appearances: number;
  goals: number;
  assists: number;
  yellowCards: number;
  redCards: number;
  minutesPlayed: number;
  cleanSheets?: number; // For goalkeepers
  [key: string]: any;
}

export interface PlayerPosition {
  id: string;
  name: string;
  abbreviation: string;
  grouping?: 'goalkeeper' | 'defender' | 'midfielder' | 'forward';
}

export interface FormationPosition {
  id: string;
  x: number;
  y: number;
  positionName: string;
  playerId?: string;
}

export interface Formation {
  id: string;
  name: string;
  description?: string;
  positions: FormationPosition[];
  isDefault?: boolean;
}

// Add the MemberType enum
export enum MemberType {
  PLAYER = 'player',
  STAFF = 'staff',
  COACH = 'coach',
  OFFICIAL = 'official',
  MANAGEMENT = 'management',
}
