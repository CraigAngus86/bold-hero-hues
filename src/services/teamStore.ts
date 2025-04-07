
import { create } from 'zustand';
import { devtools } from 'zustand/middleware';
import { TeamMember } from '@/types/team';
import { getAllTeamMembers, fetchTeamMemberById, createTeamMember, updateTeamMember, deleteTeamMember } from './teamDbService';
import { toast } from 'sonner';

export type MemberType = 'player' | 'staff' | 'coach' | 'official' | 'management';

interface TeamState {
  members: TeamMember[];
  teamMembers: TeamMember[]; // Added this property
  players: TeamMember[]; // Added this property
  isLoading: boolean;
  error: string | null;
  selectedMember: TeamMember | null;
  filteredMembers: TeamMember[];
  filter: {
    memberType: string;
    searchQuery: string;
    activeOnly: boolean;
  };
  loadTeamMembers: () => Promise<void>;
  getTeamMember: (id: string) => Promise<void>;
  createTeamMember: (member: Omit<TeamMember, 'id'>) => Promise<boolean>;
  updateTeamMember: (id: string, updates: Partial<TeamMember>) => Promise<boolean>;
  deleteTeamMember: (id: string) => Promise<boolean>;
  getPlayersByPosition: (position: string) => TeamMember[]; // Added this method
  getManagementStaff: () => TeamMember[]; // Added this method
  setFilter: (filter: Partial<TeamState['filter']>) => void;
  clearFilters: () => void;
  selectMember: (member: TeamMember | null) => void;
  addTeamMember: (member: Omit<TeamMember, 'id'>, callback?: () => void) => Promise<boolean>; // Added this method
}

export const useTeamStore = create<TeamState>()(
  devtools(
    (set, get) => ({
      members: [],
      teamMembers: [], // Initialize teamMembers
      players: [], // Initialize players
      isLoading: false,
      error: null,
      selectedMember: null,
      filteredMembers: [],
      filter: {
        memberType: 'all',
        searchQuery: '',
        activeOnly: false
      },
      
      loadTeamMembers: async () => {
        set({ isLoading: true, error: null });
        try {
          const response = await getAllTeamMembers();
          
          if (response.success) {
            const allMembers = response.data || [];
            set({ 
              members: allMembers,
              teamMembers: allMembers, // Set teamMembers to all members
              players: allMembers.filter(member => member.member_type === 'player') // Set players
            });
            
            // Apply current filters to the newly loaded data
            const state = get();
            const currentFilter = state.filter;
            const members = response.data || [];
            
            let filtered = [...members];
            
            if (currentFilter.memberType !== 'all') {
              filtered = filtered.filter(member => member.member_type === currentFilter.memberType);
            }
            
            if (currentFilter.searchQuery) {
              const query = currentFilter.searchQuery.toLowerCase();
              filtered = filtered.filter(member => 
                member.name.toLowerCase().includes(query) || 
                member.position?.toLowerCase().includes(query)
              );
            }
            
            if (currentFilter.activeOnly) {
              filtered = filtered.filter(member => member.is_active);
            }
            
            set({ filteredMembers: filtered });
          } else {
            set({ error: response.error || 'Failed to load team members' });
          }
        } catch (error) {
          console.error('Error loading team members:', error);
          set({ error: 'An unexpected error occurred' });
        } finally {
          set({ isLoading: false });
        }
      },
      
      getTeamMember: async (id: string) => {
        set({ isLoading: true, error: null });
        try {
          const response = await fetchTeamMemberById(id);
          
          if (response.success && response.data) {
            set({ selectedMember: response.data });
          } else {
            set({ error: response.error || 'Failed to load team member' });
          }
        } catch (error) {
          console.error('Error loading team member:', error);
          set({ error: 'An unexpected error occurred' });
        } finally {
          set({ isLoading: false });
        }
      },

      // Add method to get players by position
      getPlayersByPosition: (position: string) => {
        const { members } = get();
        if (position === "All") {
          return members.filter(m => m.member_type === 'player');
        }
        return members.filter(m => m.member_type === 'player' && m.position === position);
      },

      // Add method to get management staff
      getManagementStaff: () => {
        const { members } = get();
        return members.filter(m => m.member_type === 'management' || m.member_type === 'coach' || m.member_type === 'staff');
      },

      // Add addTeamMember method
      addTeamMember: async (member: Omit<TeamMember, 'id'>, callback?: () => void) => {
        return await get().createTeamMember(member);
      },
      
      createTeamMember: async (member) => {
        set({ isLoading: true, error: null });
        try {
          const response = await createTeamMember(member);
          
          if (response.success) {
            const state = get();
            await state.loadTeamMembers();
            toast.success('Team member created successfully');
            return true;
          } else {
            set({ error: response.error || 'Failed to create team member' });
            toast.error(response.error || 'Failed to create team member');
            return false;
          }
        } catch (error: any) {
          console.error('Error creating team member:', error);
          set({ error: 'An unexpected error occurred' });
          toast.error('An unexpected error occurred');
          return false;
        } finally {
          set({ isLoading: false });
        }
      },
      
      updateTeamMember: async (id, updates) => {
        set({ isLoading: true, error: null });
        try {
          const response = await updateTeamMember(id, updates);
          
          if (response.success) {
            const state = get();
            await state.loadTeamMembers();
            if (state.selectedMember?.id === id) {
              set(state => ({
                selectedMember: { ...state.selectedMember!, ...updates }
              }));
            }
            toast.success('Team member updated successfully');
            return true;
          } else {
            set({ error: response.error || 'Failed to update team member' });
            toast.error(response.error || 'Failed to update team member');
            return false;
          }
        } catch (error: any) {
          console.error('Error updating team member:', error);
          set({ error: 'An unexpected error occurred' });
          toast.error('An unexpected error occurred');
          return false;
        } finally {
          set({ isLoading: false });
        }
      },
      
      deleteTeamMember: async (id) => {
        set({ isLoading: true, error: null });
        try {
          const response = await deleteTeamMember(id);
          
          if (response.success) {
            const state = get();
            await state.loadTeamMembers();
            if (state.selectedMember?.id === id) {
              set({ selectedMember: null });
            }
            toast.success('Team member deleted successfully');
            return true;
          } else {
            set({ error: response.error || 'Failed to delete team member' });
            toast.error(response.error || 'Failed to delete team member');
            return false;
          }
        } catch (error: any) {
          console.error('Error deleting team member:', error);
          set({ error: 'An unexpected error occurred' });
          toast.error('An unexpected error occurred');
          return false;
        } finally {
          set({ isLoading: false });
        }
      },
      
      setFilter: (filter) => {
        const state = get();
        const newFilter = { ...state.filter, ...filter };
        set({ filter: newFilter });
        
        const members = state.members;
        let filtered = [...members];
        
        if (newFilter.memberType !== 'all' && newFilter.memberType !== 'management') {
          filtered = filtered.filter(member => member.member_type === newFilter.memberType);
        }
        
        if (newFilter.searchQuery) {
          const query = newFilter.searchQuery.toLowerCase();
          filtered = filtered.filter(member => 
            member.name.toLowerCase().includes(query) || 
            member.position?.toLowerCase().includes(query)
          );
        }
        
        if (newFilter.activeOnly) {
          filtered = filtered.filter(member => member.is_active);
        }
        
        set({ filteredMembers: filtered });
      },
      
      clearFilters: () => {
        const state = get();
        set({ 
          filter: {
            memberType: 'all',
            searchQuery: '',
            activeOnly: false
          },
          filteredMembers: state.members
        });
      },
      
      selectMember: (member) => {
        set({ selectedMember: member });
      }
    }), 
    { name: 'team-store' }
  )
);
