
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
