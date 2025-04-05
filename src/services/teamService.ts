import { supabase } from '@/services/supabase/supabaseClient';
import { TeamMember, DBTeamMember, convertToTeamMember } from '@/types/team';
import { handleDbOperation, DbServiceResponse } from './utils/dbService';
import { create } from 'zustand';

/**
 * Get all team members
 */
export async function getAllTeamMembers(): Promise<DbServiceResponse<TeamMember[]>> {
  return handleDbOperation(
    async () => {
      const { data, error } = await supabase
        .from('team_members')
        .select('*')
        .eq('is_active', true)
        .order('name');

      if (error) throw error;

      // Convert from DB format to the TeamMember type
      const members: TeamMember[] = data.map(item => convertToTeamMember(item as DBTeamMember));

      return members;
    },
    'Failed to load team members'
  );
}

/**
 * Get team members by type (player, management, official)
 */
export async function getTeamMembersByType(type: 'player' | 'management' | 'official'): Promise<DbServiceResponse<TeamMember[]>> {
  return handleDbOperation(
    async () => {
      const { data, error } = await supabase
        .from('team_members')
        .select('*')
        .eq('member_type', type)
        .eq('is_active', true)
        .order('name');

      if (error) throw error;

      // Convert from DB format to the TeamMember type
      const members: TeamMember[] = data.map(item => convertToTeamMember(item as DBTeamMember));

      return members;
    },
    `Failed to load ${type} team members`
  );
}

/**
 * Get team member by ID
 */
export async function getTeamMemberById(id: string): Promise<DbServiceResponse<TeamMember>> {
  return handleDbOperation(
    async () => {
      const { data, error } = await supabase
        .from('team_members')
        .select('*')
        .eq('id', id)
        .single();

      if (error) throw error;

      return convertToTeamMember(data as DBTeamMember);
    },
    'Failed to load team member details'
  );
}

/**
 * Create team member
 */
export async function createTeamMember(member: Omit<DBTeamMember, 'id' | 'created_at' | 'updated_at'>): Promise<DbServiceResponse<TeamMemberType>> {
  return handleDbOperation(
    async () => {
      const { data, error } = await supabase
        .from('team_members')
        .insert([member])
        .select()
        .single();

      if (error) throw error;

      // Convert from DB format to the TeamMember type defined in types/team.ts
      const teamMember: TeamMemberType = {
        id: parseInt(data.id),
        name: data.name,
        image: data.image_url,
        number: data.number,
        position: data.position,
        role: data.role,
        bio: data.bio,
        experience: data.experience,
        nationality: data.nationality,
        previousClubs: data.previous_clubs,
        type: data.member_type,
        stats: data.stats
      };

      return teamMember;
    },
    'Failed to create team member'
  );
}

/**
 * Update team member
 */
export async function updateTeamMember(id: string, updates: Partial<DBTeamMember>): Promise<DbServiceResponse<TeamMemberType>> {
  return handleDbOperation(
    async () => {
      const { data, error } = await supabase
        .from('team_members')
        .update(updates)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;

      // Convert from DB format to the TeamMember type defined in types/team.ts
      const teamMember: TeamMemberType = {
        id: parseInt(data.id),
        name: data.name,
        image: data.image_url,
        number: data.number,
        position: data.position,
        role: data.role,
        bio: data.bio,
        experience: data.experience,
        nationality: data.nationality,
        previousClubs: data.previous_clubs,
        type: data.member_type,
        stats: data.stats
      };

      return teamMember;
    },
    'Failed to update team member'
  );
}

/**
 * Toggle team member active status
 */
export async function toggleTeamMemberStatus(id: string, isActive: boolean): Promise<DbServiceResponse<boolean>> {
  return handleDbOperation(
    async () => {
      const { error } = await supabase
        .from('team_members')
        .update({ is_active: isActive })
        .eq('id', id);

      if (error) throw error;

      return true;
    },
    'Failed to update team member status'
  );
}

/**
 * Delete team member
 */
export async function deleteTeamMember(id: string): Promise<DbServiceResponse<boolean>> {
  return handleDbOperation(
    async () => {
      const { error } = await supabase
        .from('team_members')
        .delete()
        .eq('id', id);

      if (error) throw error;

      return true;
    },
    'Failed to delete team member'
  );
}

/**
 * Update team member statistics
 */
export async function updateTeamMemberStats(id: string, stats: Record<string, number>): Promise<DbServiceResponse<boolean>> {
  return handleDbOperation(
    async () => {
      const { error } = await supabase
        .from('team_members')
        .update({ stats })
        .eq('id', id);

      if (error) throw error;

      return true;
    },
    'Failed to update team member statistics'
  );
}

// Create a function to convert TeamMember to DBTeamMember
export function convertToDBTeamMember(member: TeamMember): Partial<DBTeamMember> {
  return {
    name: member.name,
    image_url: member.image,
    position: member.position,
    number: member.number,
    member_type: member.type,
    role: member.role,
    bio: member.bio,
    experience: member.experience,
    nationality: member.nationality,
    previous_clubs: member.previousClubs,
    stats: member.stats
  };
}

// Create a Zustand store for team members
interface TeamState {
  teamMembers: TeamMember[];
  loading: boolean;
  error: Error | null;
  fetchTeamMembers: () => Promise<void>;
  getPlayersByPosition: (position: string) => TeamMember[];
  getManagementStaff: () => TeamMember[];
  addTeamMember: (member: TeamMember) => void;
  updateTeamMember: (member: TeamMember) => void;
  deleteTeamMember: (id: number) => void;
}

export const useTeamStore = create<TeamState>((set, get) => ({
  teamMembers: [],
  loading: false,
  error: null,
  fetchTeamMembers: async () => {
    set({ loading: true, error: null });
    try {
      const response = await getAllTeamMembers();
      if (response.success) {
        set({ teamMembers: response.data || [] });
      } else {
        set({ error: new Error(response.message || 'Failed to fetch team members') });
      }
    } catch (error) {
      set({ error: error instanceof Error ? error : new Error('Unknown error') });
    } finally {
      set({ loading: false });
    }
  },
  getPlayersByPosition: (position: string) => {
    const { teamMembers } = get();
    if (position === 'All') {
      return teamMembers.filter(member => member.type === 'player');
    }
    return teamMembers.filter(
      member => member.type === 'player' && member.position === position
    );
  },
  getManagementStaff: () => {
    const { teamMembers } = get();
    return teamMembers.filter(member => member.type === 'management');
  },
  addTeamMember: (member: TeamMember) => {
    const { teamMembers } = get();
    set({ teamMembers: [...teamMembers, member] });
  },
  updateTeamMember: (member: TeamMember) => {
    const { teamMembers } = get();
    set({
      teamMembers: teamMembers.map(m => m.id === member.id ? member : m)
    });
  },
  deleteTeamMember: (id: number) => {
    const { teamMembers } = get();
    set({
      teamMembers: teamMembers.filter(m => m.id !== id)
    });
  }
}));

// Export TeamMember type to be used in components that import from this file
export type { TeamMember };
