
import { TeamMember, MemberType } from '@/types/team';
import { supabase } from '@/lib/supabase';
import { create } from 'zustand';

export interface TeamState {
  members: TeamMember[];
  players: TeamMember[];
  staff: TeamMember[];
  loading: boolean;
  error: string | null;
  
  fetchTeamMembers: () => Promise<void>;
  getPlayerById: (id: string) => TeamMember | undefined;
  getStaffById: (id: string) => TeamMember | undefined;
  getMembersByType: (type: MemberType | string) => TeamMember[];
  addTeamMember: (member: Omit<TeamMember, 'id'>) => Promise<{ success: boolean; data?: TeamMember; error?: string }>;
  updateTeamMember: (id: string, updates: Partial<TeamMember>) => Promise<{ success: boolean; error?: string }>;
  deleteTeamMember: (id: string) => Promise<{ success: boolean; error?: string }>;
}

// Create the store
export const useTeamStore = create<TeamState>((set, get) => ({
  members: [],
  players: [],
  staff: [],
  loading: false,
  error: null,
  
  fetchTeamMembers: async () => {
    set({ loading: true, error: null });
    
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
        players: players,
        staff: staff,
        loading: false 
      });
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to fetch team members';
      console.error('Error fetching team members:', error);
      set({ error: errorMessage, loading: false });
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
  
  addTeamMember: async (member: Omit<TeamMember, 'id'>) => {
    try {
      // Ensure the member has is_active property
      const memberWithDefaults: Omit<TeamMember, 'id'> = {
        ...member,
        is_active: member.is_active !== undefined ? member.is_active : true,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      };
      
      const { data, error } = await supabase.from('team_members').insert(memberWithDefaults);
      
      if (error) throw error;
      
      // Refresh team members list
      get().fetchTeamMembers();
      
      return { success: true, data: data as TeamMember };
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to add team member';
      console.error('Error adding team member:', error);
      return { success: false, error: errorMessage };
    }
  },
  
  updateTeamMember: async (id: string, updates: Partial<TeamMember>) => {
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

export const getTeamMembers = async (): Promise<TeamMember[]> => {
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

export const getTeamMember = async (id: string): Promise<TeamMember | null> => {
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

export const createTeamMember = async (member: Omit<TeamMember, 'id'>): Promise<{ success: boolean; data?: TeamMember; error?: string }> => {
  return useTeamStore.getState().addTeamMember(member);
};

export const updateTeamMember = async (id: string, updates: Partial<TeamMember>): Promise<{ success: boolean; error?: string }> => {
  return useTeamStore.getState().updateTeamMember(id, updates);
};

export const deleteTeamMember = async (id: string): Promise<{ success: boolean; error?: string }> => {
  return useTeamStore.getState().deleteTeamMember(id);
};
