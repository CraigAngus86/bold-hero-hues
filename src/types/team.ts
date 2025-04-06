
export type MemberType = 'player' | 'staff' | 'management' | 'official';

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
  is_active: boolean;
  stats?: any;
  created_at: string;
  updated_at: string;
}

export interface PlayerStats {
  appearances?: number;
  goals?: number;
  assists?: number;
  yellowCards?: number;
  redCards?: number;
  cleanSheets?: number;
  minutesPlayed?: number;
  [key: string]: number | undefined;
}

export interface TeamPosition {
  id: string;
  name: string;
  category: 'goalkeeper' | 'defender' | 'midfielder' | 'forward' | 'coaching' | 'medical' | 'management'; 
  description?: string;
}

export interface Squad {
  id: string;
  name: string;
  members: string[]; // Array of TeamMember IDs
  season?: string;
  is_active: boolean;
}

export type TeamCategory = 'senior' | 'youth' | 'women' | 'reserve';
