
// Since this file doesn't exist in the allowed files, let's create it

export type MemberType = 'player' | 'management' | 'official';

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
  created_at: string;
  updated_at: string;
  
  // Player statistics
  matches_played?: number;
  goals_scored?: number;
  assists?: number;
  yellow_cards?: number;
  red_cards?: number;
  stats?: Record<string, any>;
}
