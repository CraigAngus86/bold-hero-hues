
import create from 'zustand';
import { devtools } from 'zustand/middleware';
import { TeamMember } from '@/types/team';
import { getTeamMembers, getTeamMember, createTeamMember, updateTeamMember, deleteTeamMember } from './teamDbService';
import { toast } from 'sonner';

interface TeamState {
  members: TeamMember[];
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
  setFilter: (filter: Partial<TeamState['filter']>) => void;
  clearFilters: () => void;
  selectMember: (member: TeamMember | null) => void;
}

export const useTeamStore = create<TeamState>()(
  devtools(
    (set, get) => ({
      members: [],
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
          const response = await getTeamMembers();
          
          if (response.success) {
            set({ members: response.data || [] });
            
            // Apply current filters to the newly loaded data
            const currentFilter = get().filter;
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
          const response = await getTeamMember(id);
          
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
      
      createTeamMember: async (member) => {
        set({ isLoading: true, error: null });
        try {
          const response = await createTeamMember(member);
          
          if (response.success) {
            await get().loadTeamMembers();
            toast.success('Team member created successfully');
            return true;
          } else {
            set({ error: response.error || 'Failed to create team member' });
            toast.error(response.error || 'Failed to create team member');
            return false;
          }
        } catch (error) {
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
            await get().loadTeamMembers();
            if (get().selectedMember?.id === id) {
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
        } catch (error) {
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
            await get().loadTeamMembers();
            if (get().selectedMember?.id === id) {
              set({ selectedMember: null });
            }
            toast.success('Team member deleted successfully');
            return true;
          } else {
            set({ error: response.error || 'Failed to delete team member' });
            toast.error(response.error || 'Failed to delete team member');
            return false;
          }
        } catch (error) {
          console.error('Error deleting team member:', error);
          set({ error: 'An unexpected error occurred' });
          toast.error('An unexpected error occurred');
          return false;
        } finally {
          set({ isLoading: false });
        }
      },
      
      setFilter: (filter) => {
        const newFilter = { ...get().filter, ...filter };
        set({ filter: newFilter });
        
        const members = get().members;
        let filtered = [...members];
        
        if (newFilter.memberType !== 'all') {
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
        set({ 
          filter: {
            memberType: 'all',
            searchQuery: '',
            activeOnly: false
          },
          filteredMembers: get().members
        });
      },
      
      selectMember: (member) => {
        set({ selectedMember: member });
      }
    }), 
    { name: 'team-store' }
  )
);
