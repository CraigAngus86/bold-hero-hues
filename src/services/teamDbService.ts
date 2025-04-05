
import { supabase } from '@/services/supabase/supabaseClient';
import { handleDbOperation, DbServiceResponse } from './utils/dbService';
import { TeamMember, MemberType } from '@/types/team';

/**
 * Fetch all team members by type
 */
export async function fetchTeamMembersByType(memberType: MemberType): Promise<DbServiceResponse<TeamMember[]>> {
  return handleDbOperation(
    async () => {
      const { data, error } = await supabase
        .from('team_members')
        .select('*')
        .eq('member_type', memberType)
        .eq('is_active', true)
        .order('jersey_number', { ascending: true })
        .order('name', { ascending: true });

      if (error) throw error;
      return data as TeamMember[] || [];
    },
    `Failed to fetch ${memberType}s`
  );
}

/**
 * Fetch all team members (active)
 */
export async function fetchTeamMembers(): Promise<DbServiceResponse<TeamMember[]>> {
  return handleDbOperation(
    async () => {
      const { data, error } = await supabase
        .from('team_members')
        .select('*')
        .eq('is_active', true)
        .order('member_type', { ascending: true })
        .order('name', { ascending: true });

      if (error) throw error;
      return data as TeamMember[] || [];
    },
    'Failed to fetch team members'
  );
}

/**
 * Fetch team member by id
 */
export async function fetchTeamMemberById(id: string): Promise<DbServiceResponse<TeamMember>> {
  return handleDbOperation(
    async () => {
      const { data, error } = await supabase
        .from('team_members')
        .select('*')
        .eq('id', id)
        .single();

      if (error) throw error;
      return data as TeamMember;
    },
    `Failed to fetch team member with id ${id}`
  );
}

/**
 * Create team member
 */
export async function createTeamMember(member: Omit<TeamMember, 'id'>): Promise<DbServiceResponse<TeamMember>> {
  return handleDbOperation(
    async () => {
      const { data, error } = await supabase
        .from('team_members')
        .insert(member)
        .select()
        .single();

      if (error) throw error;
      return data as TeamMember;
    },
    'Failed to create team member'
  );
}

/**
 * Update team member
 */
export async function updateTeamMember(id: string, member: Partial<TeamMember>): Promise<DbServiceResponse<TeamMember>> {
  return handleDbOperation(
    async () => {
      const { data, error } = await supabase
        .from('team_members')
        .update(member)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      return data as TeamMember;
    },
    `Failed to update team member with id ${id}`
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
    `Failed to delete team member with id ${id}`
  );
}

/**
 * Fetch management team members specifically
 */
export async function fetchManagementTeam(): Promise<DbServiceResponse<TeamMember[]>> {
  return handleDbOperation(
    async () => {
      const { data, error } = await supabase
        .from('team_members')
        .select('*')
        .eq('member_type', 'management')
        .eq('is_active', true)
        .order('name', { ascending: true });

      if (error) throw error;
      return data as TeamMember[] || [];
    },
    'Failed to fetch management team'
  );
}

// Function to get all team members (for admin management)
export async function getAllTeamMembers(): Promise<DbServiceResponse<TeamMember[]>> {
  return handleDbOperation(
    async () => {
      const { data, error } = await supabase
        .from('team_members')
        .select('*')
        .order('member_type', { ascending: true })
        .order('name', { ascending: true });

      if (error) throw error;
      return data as TeamMember[] || [];
    },
    'Failed to fetch all team members'
  );
}

// Add alias for compatibility
export const addTeamMember = createTeamMember;
export const fetchAllTeamMembers = getAllTeamMembers;
