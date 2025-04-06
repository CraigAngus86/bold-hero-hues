
import { create } from 'zustand';
import { TeamMember, MemberType } from '@/types/team';
import { persist } from 'zustand/middleware';

interface TeamStore {
  teamMembers: TeamMember[];
  loading: boolean;
  error: string | null;
  isLoading: boolean; // Added for compatibility with components
  // Add these methods to the interface
  addTeamMember: (member: Omit<TeamMember, 'id'>) => void;
  updateTeamMember: (member: TeamMember) => void;
  deleteTeamMember: (id: string) => void;
  // Add required methods for team components
  loadTeamMembers: () => void;
  getPlayersByPosition: (position: string) => TeamMember[];
  getManagementStaff: () => TeamMember[];
  getOfficials: () => TeamMember[];
  players: TeamMember[]; // For compatibility with components that use this property
}

// Generate a random ID for team members
const generateId = () => Math.random().toString(36).substring(2, 9);

export const useTeamStore = create<TeamStore>()(
  persist(
    (set, get) => ({
      teamMembers: [],
      loading: false,
      error: null,
      isLoading: false, // Added for compatibility
      players: [], // Initialize empty array

      loadTeamMembers: () => {
        // This would normally fetch from API - for now just marks as loaded
        set({ 
          loading: false, 
          isLoading: false,
          // Set players for backward compatibility
          players: get().teamMembers.filter(m => m.member_type === 'player')
        });
      },
      
      getPlayersByPosition: (position) => {
        const members = get().teamMembers;
        if (position === 'All') {
          return members.filter(m => m.member_type === 'player');
        }
        return members.filter(m => m.member_type === 'player' && m.position === position);
      },
      
      getManagementStaff: () => {
        return get().teamMembers.filter(m => m.member_type === 'management');
      },
      
      getOfficials: () => {
        return get().teamMembers.filter(m => m.member_type === 'official');
      },
      
      // Implement the existing methods
      addTeamMember: (member) => set((state) => {
        const newMember = { 
          ...member, 
          id: generateId(),
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        };
        const updatedMembers = [...state.teamMembers, newMember];
        return { 
          teamMembers: updatedMembers,
          // Update players array for components using it directly
          players: updatedMembers.filter(m => m.member_type === 'player')
        };
      }),
      
      updateTeamMember: (member) => set((state) => {
        const updatedMembers = state.teamMembers.map(m => 
          m.id === member.id ? { ...member, updated_at: new Date().toISOString() } : m
        );
        return { 
          teamMembers: updatedMembers,
          // Update players array for components using it directly
          players: updatedMembers.filter(m => m.member_type === 'player')
        };
      }),
      
      deleteTeamMember: (id) => set((state) => {
        const updatedMembers = state.teamMembers.filter(m => m.id !== id);
        return { 
          teamMembers: updatedMembers,
          // Update players array for components using it directly
          players: updatedMembers.filter(m => m.member_type === 'player')
        };
      }),
    }),
    {
      name: 'team-storage',
      version: 1,
    }
  )
);
