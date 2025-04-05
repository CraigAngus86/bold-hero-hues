
// Team related types

export interface TeamMember {
  id: number;
  name: string;
  image?: string;
  number?: number;
  position?: string;
  role?: string;
  bio?: string;
  experience?: string;
  nationality?: string;
  previousClubs?: string[];
  type: 'player' | 'management' | 'official';
  stats?: {
    appearances?: number;
    goals?: number;
    assists?: number;
    cleanSheets?: number;
  };
}

// Types for Supabase database interactions
export interface DBTeamMember {
  id: string;
  name: string;
  image_url?: string | null;
  position?: string;
  role?: string;
  jersey_number?: number;
  member_type: 'player' | 'management' | 'official';
  bio?: string;
  experience?: string;
  nationality?: string;
  previous_clubs?: string[];
  created_at?: string;
  updated_at?: string;
  is_active?: boolean;
  stats?: {
    appearances?: number;
    goals?: number;
    assists?: number;
    clean_sheets?: number;
  };
}

// Conversion functions
export function convertToTeamMember(dbMember: DBTeamMember): TeamMember {
  return {
    id: parseInt(dbMember.id),
    name: dbMember.name,
    image: dbMember.image_url,
    number: dbMember.jersey_number,
    position: dbMember.position,
    role: dbMember.role,
    bio: dbMember.bio,
    experience: dbMember.experience,
    nationality: dbMember.nationality,
    previousClubs: dbMember.previous_clubs,
    type: dbMember.member_type as 'player' | 'management' | 'official',
    stats: dbMember.stats ? {
      appearances: dbMember.stats.appearances,
      goals: dbMember.stats.goals,
      assists: dbMember.stats.assists,
      cleanSheets: dbMember.stats.clean_sheets
    } : undefined
  };
}

export function convertToDBTeamMember(member: TeamMember): Partial<DBTeamMember> {
  return {
    name: member.name,
    image_url: member.image,
    position: member.position,
    role: member.role,
    jersey_number: member.number,
    member_type: member.type,
    bio: member.bio,
    experience: member.experience,
    nationality: member.nationality,
    previous_clubs: member.previousClubs,
    stats: member.stats ? {
      appearances: member.stats.appearances,
      goals: member.stats.goals,
      assists: member.stats.assists,
      clean_sheets: member.stats.cleanSheets
    } : undefined
  };
}
