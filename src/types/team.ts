
export interface TeamMember {
  id: string;
  name: string;
  member_type: 'player' | 'management' | 'official';
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

export type MemberType = 'player' | 'management' | 'official';
