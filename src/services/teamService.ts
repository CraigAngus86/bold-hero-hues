
import { create } from 'zustand';
import { persist } from 'zustand/middleware';

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

// Initial team members data (empty array)
const initialTeamMembers: TeamMember[] = [];

interface TeamStore {
  teamMembers: TeamMember[];
  addTeamMember: (member: TeamMember) => void;
  updateTeamMember: (member: TeamMember) => void;
  deleteTeamMember: (id: number) => void;
  getPlayersByPosition: (position: string) => TeamMember[];
  getManagementStaff: () => TeamMember[];
  getClubOfficials: () => TeamMember[];
  clearAllTeamMembers: () => void;
}

export const useTeamStore = create<TeamStore>()(
  persist(
    (set, get) => ({
      teamMembers: initialTeamMembers,
      
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
      },
      
      clearAllTeamMembers: () => set({ teamMembers: [] })
    }),
    {
      name: 'team-storage'
    }
  )
);
