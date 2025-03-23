
import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { players as initialPlayers } from '@/data/players';

export interface TeamMember {
  id: number;
  name: string;
  position?: string;
  role?: string;
  number?: number;
  image: string;
  biography?: string;
  bio?: string;
  type: 'player' | 'management' | 'official';
  stats?: {
    appearances?: number;
    goals?: number;
    assists?: number;
    cleanSheets?: number;
  };
  experience?: string;
}

// Convert initial players to team members
const initialTeamMembers: TeamMember[] = initialPlayers.map(player => ({
  ...player,
  type: 'player',
  biography: player.biography || '',
}));

// Add initial management staff
const initialManagement: TeamMember[] = [
  {
    id: 1001,
    name: "David Wilson",
    role: "Head Coach",
    bio: "Former professional player with over 10 years of coaching experience",
    image: "/lovable-uploads/46e4429e-478d-4098-9cf9-fb6444adfc3b.png",
    type: 'management',
    experience: "15 years"
  },
  {
    id: 1002,
    name: "Sarah Johnson",
    role: "Assistant Coach",
    bio: "Specializes in player development and tactical analysis",
    image: "/lovable-uploads/122628af-86b4-4d7f-bfe3-01d4bf03d053.png",
    type: 'management',
    experience: "8 years"
  },
  {
    id: 1003,
    name: "Michael Thompson",
    role: "Goalkeeping Coach",
    bio: "Former professional goalkeeper with expertise in modern goalkeeping techniques",
    image: "/lovable-uploads/9cecca5c-daf2-4f52-a6ca-06e02ca9ea44.png",
    type: 'management',
    experience: "12 years"
  }
];

// Add initial club officials
const initialOfficials: TeamMember[] = [
  {
    id: 2001,
    name: "Robert Anderson",
    role: "Chairman",
    bio: "Leading the club since 2015 with a focus on sustainable growth",
    image: "/lovable-uploads/46e4429e-478d-4098-9cf9-fb6444adfc3b.png",
    type: 'official',
    experience: "7 years"
  },
  {
    id: 2002,
    name: "Elizabeth Murray",
    role: "Secretary",
    bio: "Handles all administrative matters with efficiency and precision",
    image: "/lovable-uploads/122628af-86b4-4d7f-bfe3-01d4bf03d053.png",
    type: 'official',
    experience: "5 years"
  }
];

interface TeamStore {
  teamMembers: TeamMember[];
  addTeamMember: (member: TeamMember) => void;
  updateTeamMember: (member: TeamMember) => void;
  deleteTeamMember: (id: number) => void;
  getPlayersByPosition: (position: string) => TeamMember[];
  getManagementStaff: () => TeamMember[];
  getClubOfficials: () => TeamMember[];
}

export const useTeamStore = create<TeamStore>()(
  persist(
    (set, get) => ({
      teamMembers: [...initialTeamMembers, ...initialManagement, ...initialOfficials],
      
      addTeamMember: (member) => {
        set((state) => ({
          teamMembers: [...state.teamMembers, member]
        }));
      },
      
      updateTeamMember: (member) => {
        set((state) => ({
          teamMembers: state.teamMembers.map((m) => 
            m.id === member.id ? member : m
          )
        }));
      },
      
      deleteTeamMember: (id) => {
        set((state) => ({
          teamMembers: state.teamMembers.filter((m) => m.id !== id)
        }));
      },
      
      getPlayersByPosition: (position) => {
        const players = get().teamMembers.filter(m => m.type === 'player');
        return position === "All" 
          ? players 
          : players.filter(p => p.position === position);
      },
      
      getManagementStaff: () => {
        return get().teamMembers.filter(m => m.type === 'management');
      },
      
      getClubOfficials: () => {
        return get().teamMembers.filter(m => m.type === 'official');
      }
    }),
    {
      name: 'team-storage'
    }
  )
);
