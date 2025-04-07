
export interface TeamMember {
  id: string;
  name: string;
  member_type: 'player' | 'staff' | 'coach' | 'official' | 'management';
  position?: string;
  image_url?: string;
  bio?: string;
  nationality?: string;
  jersey_number?: number;
  previous_clubs?: string[];
  experience?: string;
  is_active: boolean;
  stats?: Record<string, any>;
  created_at?: string;
  updated_at?: string;
}

export type MemberType = 'player' | 'staff' | 'coach' | 'official' | 'management';
