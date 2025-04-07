
import { TeamMember as TeamMemberType } from '@/types/team';
import { supabase } from '@/lib/supabase';
import { create } from 'zustand';

// Export the MemberType enum for use in other files
export enum MemberType {
  PLAYER = 'player',
  STAFF = 'staff',
  COACH = 'coach',
  OFFICIAL = 'official',
  MANAGEMENT = 'management',
}

export interface TeamState {
  members: TeamMemberType[];
  teamMembers: TeamMemberType[];
  players: TeamMemberType[];
  staff: TeamMemberType[];
  isLoading: boolean;
  loading: boolean;
  error: string | null;
  
  fetchTeamMembers: () => Promise<void>;
  getPlayerById: (id: string) => TeamMemberType | undefined;
  getStaffById: (id: string) => TeamMemberType | undefined;
  getMembersByType: (type: MemberType | string) => TeamMemberType[];
  getPlayersByPosition: (position: string) => TeamMemberType[];
  getManagementStaff: () => TeamMemberType[];
  loadTeamMembers: () => Promise<void>;
  addTeamMember: (member: Omit<TeamMemberType, 'id'>) => Promise<{ success: boolean; data?: TeamMemberType; error?: string }>;
  updateTeamMember: (id: string, updates: Partial<TeamMemberType>) => Promise<{ success: boolean; error?: string }>;
  deleteTeamMember: (id: string) => Promise<{ success: boolean; error?: string }>;
}

// Create the store
export const useTeamStore = create<TeamState>((set, get) => ({
  members: [],
  teamMembers: [],
  players: [],
  staff: [],
  loading: false,
  isLoading: false,
  error: null,
  
  loadTeamMembers: async () => {
    return get().fetchTeamMembers();
  },
  
  fetchTeamMembers: async () => {
    set({ loading: true, isLoading: true, error: null });
    
    try {
      const { data, error } = await supabase
        .from('team_members')
        .select('*')
        .order('name');
      
      if (error) throw error;
      
      const allMembers = data || [];
      
      // Filter players and staff
      const players = allMembers.filter(m => m.member_type === 'player');
      const staff = allMembers.filter(m => 
        m.member_type === 'staff' || 
        m.member_type === 'coach' || 
        m.member_type === 'official' || 
        m.member_type === 'management'
      );
      
      set({ 
        members: allMembers, 
        teamMembers: allMembers,
        players: players,
        staff: staff,
        loading: false,
        isLoading: false
      });
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to fetch team members';
      console.error('Error fetching team members:', error);
      set({ error: errorMessage, loading: false, isLoading: false });
    }
  },
  
  getPlayerById: (id: string) => {
    return get().members.find(m => m.id === id && m.member_type === 'player');
  },
  
  getStaffById: (id: string) => {
    return get().members.find(m => m.id === id && m.member_type !== 'player');
  },
  
  getMembersByType: (type: MemberType | string) => {
    return get().members.filter(m => m.member_type === type);
  },
  
  getPlayersByPosition: (position: string) => {
    if (position === "All") {
      return get().members.filter(m => m.member_type === 'player');
    }
    return get().members.filter(m => m.member_type === 'player' && m.position === position);
  },
  
  getManagementStaff: () => {
    return get().members.filter(m => m.member_type === 'management' || m.member_type === 'coach' || m.member_type === 'staff');
  },
  
  addTeamMember: async (member: Omit<TeamMemberType, 'id'>) => {
    try {
      // Ensure the member has is_active property
      const memberWithDefaults: Omit<TeamMemberType, 'id'> = {
        ...member,
        is_active: member.is_active !== undefined ? member.is_active : true,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      };
      
      const { data, error } = await supabase.from('team_members').insert(memberWithDefaults);
      
      if (error) throw error;
      
      // Refresh team members list
      get().fetchTeamMembers();
      
      return { success: true, data: data as TeamMemberType };
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to add team member';
      console.error('Error adding team member:', error);
      return { success: false, error: errorMessage };
    }
  },
  
  updateTeamMember: async (id: string, updates: Partial<TeamMemberType>) => {
    try {
      const { error } = await supabase
        .from('team_members')
        .update({
          ...updates,
          updated_at: new Date().toISOString()
        })
        .eq('id', id);
      
      if (error) throw error;
      
      // Refresh team members list
      get().fetchTeamMembers();
      
      return { success: true };
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to update team member';
      console.error('Error updating team member:', error);
      return { success: false, error: errorMessage };
    }
  },
  
  deleteTeamMember: async (id: string) => {
    try {
      const { error } = await supabase
        .from('team_members')
        .delete()
        .eq('id', id);
      
      if (error) throw error;
      
      // Update local state by filtering out the deleted member
      set(state => ({
        members: state.members.filter(m => m.id !== id),
        teamMembers: state.teamMembers.filter(m => m.id !== id),
        players: state.players.filter(p => p.id !== id),
        staff: state.staff.filter(s => s.id !== id),
      }));
      
      return { success: true };
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to delete team member';
      console.error('Error deleting team member:', error);
      return { success: false, error: errorMessage };
    }
  }
}));

// Explicitly export the TeamMember type from types/team
export { TeamMemberType as TeamMember };

export const getTeamMembers = async (): Promise<TeamMemberType[]> => {
  try {
    const { data, error } = await supabase
      .from('team_members')
      .select('*');
    
    if (error) throw error;
    
    // Make sure each member has is_active property
    const members = (data || []).map(member => ({
      ...member,
      is_active: member.is_active !== undefined ? member.is_active : true
    }));
    
    return members;
  } catch (error) {
    console.error('Error fetching team members:', error);
    return [];
  }
};

export const getTeamMember = async (id: string): Promise<TeamMemberType | null> => {
  try {
    const { data, error } = await supabase
      .from('team_members')
      .select('*')
      .eq('id', id)
      .single();
    
    if (error) throw error;
    
    return {
      ...data,
      is_active: data.is_active !== undefined ? data.is_active : true
    };
  } catch (error) {
    console.error(`Error fetching team member ${id}:`, error);
    return null;
  }
};

export const createTeamMember = async (member: Omit<TeamMemberType, 'id'>): Promise<{ success: boolean; data?: TeamMemberType; error?: string }> => {
  return useTeamStore.getState().addTeamMember(member);
};

export const updateTeamMember = async (id: string, updates: Partial<TeamMemberType>): Promise<{ success: boolean; error?: string }> => {
  return useTeamStore.getState().updateTeamMember(id, updates);
};

export const deleteTeamMember = async (id: string): Promise<{ success: boolean; error?: string }> => {
  return useTeamStore.getState().deleteTeamMember(id);
};
