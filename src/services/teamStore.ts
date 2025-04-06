
import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { TeamMember, MemberType } from '@/types/team';

interface TeamStore {
  teamMembers: TeamMember[];
  loading: boolean;
  error: string | null;
  isLoading: boolean; // Added for compatibility with components
  players: TeamMember[]; // For compatibility with components
  
  // Required methods for components
  loadTeamMembers: () => Promise<void>;
  getPlayersByPosition: (position: string) => TeamMember[];
  getManagementStaff: () => TeamMember[];
  getOfficials: () => TeamMember[];
  
  // CRUD operations
  addTeamMember: (member: Omit<TeamMember, 'id'>) => Promise<void>;
  updateTeamMember: (member: TeamMember) => Promise<void>;
  deleteTeamMember: (id: string) => Promise<void>;
}

// Generate a random ID for team members
const generateId = () => Math.random().toString(36).substring(2, 9);

export const useTeamStore = create<TeamStore>()(
  persist(
    (set, get) => ({
      teamMembers: [],
      loading: false,
      isLoading: false,
      error: null,
      players: [], // Initialize empty array
      
      loadTeamMembers: async () => {
        set({ loading: true, isLoading: true, error: null });
        try {
          // This would normally fetch from API or database
          // For now, we're just using the data that's already in the store
          const players = get().teamMembers.filter(m => m.member_type === 'player');
          set({ 
            loading: false, 
            isLoading: false,
            players
          });
          return Promise.resolve();
        } catch (error) {
          set({ error: 'Failed to load team members', loading: false, isLoading: false });
          return Promise.reject(error);
        }
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
      
      addTeamMember: async (member) => {
        set({ loading: true, isLoading: true });
        try {
          const newMember = { 
            ...member, 
            id: generateId(),
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString()
          };
          const updatedMembers = [...get().teamMembers, newMember];
          const players = updatedMembers.filter(m => m.member_type === 'player');
          
          set({ 
            teamMembers: updatedMembers,
            players,
            loading: false,
            isLoading: false
          });
          return Promise.resolve();
        } catch (error) {
          set({ error: 'Failed to add team member', loading: false, isLoading: false });
          return Promise.reject(error);
        }
      },
      
      updateTeamMember: async (member) => {
        set({ loading: true, isLoading: true });
        try {
          const updatedMembers = get().teamMembers.map(m => 
            m.id === member.id ? { ...member, updated_at: new Date().toISOString() } : m
          );
          const players = updatedMembers.filter(m => m.member_type === 'player');
          
          set({ 
            teamMembers: updatedMembers,
            players,
            loading: false,
            isLoading: false
          });
          return Promise.resolve();
        } catch (error) {
          set({ error: 'Failed to update team member', loading: false, isLoading: false });
          return Promise.reject(error);
        }
      },
      
      deleteTeamMember: async (id) => {
        set({ loading: true, isLoading: true });
        try {
          const updatedMembers = get().teamMembers.filter(m => m.id !== id);
          const players = updatedMembers.filter(m => m.member_type === 'player');
          
          set({ 
            teamMembers: updatedMembers,
            players,
            loading: false,
            isLoading: false
          });
          return Promise.resolve();
        } catch (error) {
          set({ error: 'Failed to delete team member', loading: false, isLoading: false });
          return Promise.reject(error);
        }
      }
    }),
    {
      name: 'team-storage',
      version: 1,
    }
  )
);

// Re-export TeamMember and MemberType for compatibility
export type { TeamMember, MemberType };
