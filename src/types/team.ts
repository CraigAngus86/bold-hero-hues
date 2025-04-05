
// Team related types
export interface TeamMember {
  id: number;
  name: string;
  image?: string;
  number?: number;
  position?: string;
  age?: number;
  nationality?: string;
  previousClubs?: string[];
  bio?: string;
  biography?: string;
  role?: string;
  experience?: string;
  type: 'player' | 'management' | 'official';
  stats?: {
    appearances?: number;
    goals?: number;
    assists?: number;
    cleanSheets?: number;
  };
}

export interface Coach {
  id: number;
  name: string;
  role: string;
  image?: string;
  bio?: string;
}

export interface Official {
  id: number;
  name: string;
  role: string;
  image?: string;
  bio?: string;
}

export interface Player {
  id: number;
  name: string;
  position: string;
  imageUrl: string;
  number: number;
}

// Types for Supabase database interactions
export interface DBTeamMember {
  id: string;
  name: string;
  image_url?: string;
  position?: string;
  number?: number;
  age?: number;
  nationality?: string;
  previous_clubs?: string[];
  bio?: string;
  role?: string;
  experience?: string;
  member_type: 'player' | 'management' | 'official';
  appearances?: number;
  goals?: number;
  assists?: number;
  clean_sheets?: number;
  created_at?: string;
  updated_at?: string;
}

// Conversion function for team members from DB format to UI format
export function convertToTeamMember(dbMember: DBTeamMember): TeamMember {
  return {
    id: parseInt(dbMember.id),
    name: dbMember.name,
    image: dbMember.image_url,
    number: dbMember.number,
    position: dbMember.position,
    age: dbMember.age,
    nationality: dbMember.nationality,
    previousClubs: dbMember.previous_clubs,
    bio: dbMember.bio,
    role: dbMember.role,
    experience: dbMember.experience,
    type: dbMember.member_type,
    stats: {
      appearances: dbMember.appearances,
      goals: dbMember.goals,
      assists: dbMember.assists,
      cleanSheets: dbMember.clean_sheets
    }
  };
}
