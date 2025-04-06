
import { create } from 'zustand';
import { TeamMember } from '@/types/team';
import { persist } from 'zustand/middleware';

interface TeamState {
  teamMembers: TeamMember[];
  loading: boolean;
  error: string | null;
  // Add these methods to the interface
  addTeamMember: (member: Omit<TeamMember, 'id'>) => void;
  updateTeamMember: (member: TeamMember) => void;
  deleteTeamMember: (id: string) => void;
}

// Generate a random ID for team members
const generateId = () => Math.random().toString(36).substring(2, 9);

export const useTeamStore = create<TeamState>()(
  persist(
    (set) => ({
      teamMembers: [],
      loading: false,
      error: null,
      
      // Implement the missing methods
      addTeamMember: (member) => set((state) => {
        const newMember = { 
          ...member, 
          id: generateId(),
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        };
        return { teamMembers: [...state.teamMembers, newMember] };
      }),
      
      updateTeamMember: (member) => set((state) => ({
        teamMembers: state.teamMembers.map(m => 
          m.id === member.id ? { ...member, updated_at: new Date().toISOString() } : m
        )
      })),
      
      deleteTeamMember: (id) => set((state) => ({
        teamMembers: state.teamMembers.filter(m => m.id !== id)
      })),
    }),
    {
      name: 'team-storage',
      version: 1,
    }
  )
);
