
export type MemberType = 'player' | 'staff' | 'coach' | 'official' | 'management';

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
  stats?: Record<string, any>;
  created_at?: string;
  updated_at?: string;
}

export interface TeamMembersManagerProps {
  memberType: string;
  members: TeamMember[];
}

export interface PlayersListProps {
  players: TeamMember[];
  isLoading?: boolean;
  onDeletePlayer?: (id: string) => void;
}

export interface StaffListProps {
  staff: TeamMember[];
  isLoading?: boolean;
  onDeleteStaff?: (id: string) => void;
}

export interface TeamPositionsManagerProps {
  memberType: string;
  members: TeamMember[];
}

export interface TeamStatsProps {
  memberType: string;
  members: TeamMember[];
}

export interface TeamSettingsProps {
  memberType: string;
  members: TeamMember[];
}
