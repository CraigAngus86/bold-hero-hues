
export interface TeamMember {
  id: string;
  name: string;
  member_type: 'player' | 'staff' | 'coach' | 'official' | 'management';
  position?: string;
  jersey_number?: number;
  image_url?: string;
  bio?: string;
  nationality?: string;
  experience?: string;
  previous_clubs?: string[];
  stats?: Record<string, any>;
  is_active: boolean;
  created_at?: string;
  updated_at?: string;
}

export type MemberType = 'player' | 'staff' | 'coach' | 'official' | 'management';

export interface TeamMemberResponse {
  data: TeamMember[];
  success: boolean;
  error?: string;
}
