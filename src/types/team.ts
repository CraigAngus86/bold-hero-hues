
export interface TeamMember {
  id: string;
  name: string;
  position?: string;
  image_url?: string;
  bio?: string;
  member_type: 'player' | 'staff' | 'management';
  is_active: boolean;
  jersey_number?: number;
  nationality?: string;
  previous_clubs?: string[];
  stats?: PlayerStats;
  experience?: string;
  created_at: string;
  updated_at: string;
}

export interface PlayerStats {
  appearances?: number;
  goals?: number;
  assists?: number;
  yellow_cards?: number;
  red_cards?: number;
  clean_sheets?: number;
  minutes_played?: number;
  [key: string]: number | undefined;
}

export interface TeamPosition {
  id: string;
  name: string;
  abbreviation: string;
  sort_order: number;
}

export interface Squad {
  id: string;
  name: string;
  description?: string;
  season_id?: string;
  is_active: boolean;
  players: string[]; // Array of player IDs
}
