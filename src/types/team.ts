
export interface TeamMember {
  id: string;
  name: string;
  member_type: 'player' | 'management' | 'official';
  position: string;
  image_url: string;
  bio: string;
  nationality: string;
  experience: string;
  is_active: boolean;
  created_at: string;
  updated_at: string;
  jersey_number?: number;
  previous_clubs?: string[];
  stats?: any;
}

export interface TeamMemberStats {
  appearances?: number;
  goals?: number;
  assists?: number;
  cleanSheets?: number;
  yellowCards?: number;
  redCards?: number;
  minutesPlayed?: number;
  [key: string]: any;
}

export interface TeamFilter {
  memberType?: 'player' | 'management' | 'official';
  position?: string;
  active?: boolean;
  search?: string;
}

// Add the missing MemberType
export type MemberType = 'player' | 'management' | 'official';
