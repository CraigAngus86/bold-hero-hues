
import { create } from 'zustand';
import { supabase } from '@/integrations/supabase/client';

export type MemberType = 'player' | 'staff' | 'coach' | 'official' | 'management';

export interface TeamMember {
  id: string;
  name: string;
  member_type: MemberType;
  position?: string;
  image_url?: string;
  bio?: string;
  is_active?: boolean;
  created_at?: string;
  updated_at?: string;
  jersey_number?: number;
  nationality?: string;
  experience?: string;
  stats?: {
    goals?: number;
    assists?: number;
    appearances?: number;
    [key: string]: any;
  };
}

interface TeamState {
  teamMembers: TeamMember[];
  isLoading: boolean;
  error: string | null;
  loadTeamMembers: () => Promise<void>;
  getPlayersByPosition: (position: string) => TeamMember[];
  getManagementStaff: () => Promise<TeamMember[]>;
  getStaffByType: (type: MemberType) => TeamMember[];
}

export const useTeamStore = create<TeamState>((set, get) => ({
  teamMembers: [],
  isLoading: false,
  error: null,
  
  loadTeamMembers: async () => {
    set({ isLoading: true, error: null });
    try {
      const { data, error } = await supabase
        .from('team_members')
        .select('*')
        .order('name');
      
      if (error) throw error;
      set({ teamMembers: data || [], isLoading: false });
    } catch (error) {
      console.error('Error loading team members:', error);
      set({ error: 'Failed to load team members', isLoading: false });
    }
  },
  
  getPlayersByPosition: (position: string) => {
    const members = get().teamMembers;
    if (position === 'All') {
      return members.filter(m => m.member_type === 'player');
    }
    return members.filter(m => 
      m.member_type === 'player' && m.position === position
    );
  },
  
  getManagementStaff: async () => {
    const members = get().teamMembers;
    return members.filter(m => 
      m.member_type === 'management' || 
      m.member_type === 'coach' || 
      m.member_type === 'staff'
    );
  },
  
  getStaffByType: (type: MemberType) => {
    const members = get().teamMembers;
    return members.filter(m => m.member_type === type);
  },
}));

// Export the team service functions
export const createTeamMember = async (data: Omit<TeamMember, "id">): Promise<boolean> => {
  try {
    const { error } = await supabase
      .from('team_members')
      .insert(data);
    
    if (error) throw error;
    return true;
  } catch (error) {
    console.error('Error creating team member:', error);
    return false;
  }
};

export const updateTeamMember = async (id: string, data: Partial<TeamMember>): Promise<boolean> => {
  try {
    const { error } = await supabase
      .from('team_members')
      .update(data)
      .eq('id', id);
    
    if (error) throw error;
    return true;
  } catch (error) {
    console.error('Error updating team member:', error);
    return false;
  }
};

export const getTeamMembers = async (type?: string): Promise<TeamMember[]> => {
  try {
    let query = supabase
      .from('team_members')
      .select('*')
      .order('name');

    if (type) {
      query = query.eq('member_type', type);
    }

    const { data, error } = await query;

    if (error) throw error;
    return data || [];
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
    return data;
  } catch (error) {
    console.error('Error fetching team member:', error);
    return null;
  }
};

export const deleteTeamMember = async (id: string): Promise<boolean> => {
  try {
    const { error } = await supabase
      .from('team_members')
      .delete()
      .eq('id', id);

    if (error) throw error;
    return true;
  } catch (error) {
    console.error('Error deleting team member:', error);
    return false;
  }
};
