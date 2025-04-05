
import { supabase } from '@/services/supabase/supabaseClient';
import { handleDbOperation, DbServiceResponse } from './utils/dbService';

export interface TeamMember {
  id?: string;
  name: string;
  member_type: 'player' | 'management' | 'official';
  position?: string;
  jersey_number?: number;
  image_url?: string;
  bio?: string;
  nationality?: string;
  previous_clubs?: string[];
  experience?: string;
  is_active?: boolean;
  stats?: {
    appearances?: number;
    goals?: number;
    assists?: number;
    clean_sheets?: number;
  };
}

/**
 * Fetch all team members
 */
export async function fetchTeamMembers(): Promise<DbServiceResponse<TeamMember[]>> {
  return handleDbOperation(
    async () => {
      const { data, error } = await supabase
        .from('team_members')
        .select('*')
        .eq('is_active', true);

      if (error) throw error;
      return data || [];
    },
    'Failed to fetch team members'
  );
}

/**
 * Fetch team members by type
 */
export async function fetchTeamMembersByType(type: 'player' | 'management' | 'official'): Promise<DbServiceResponse<TeamMember[]>> {
  return handleDbOperation(
    async () => {
      const { data, error } = await supabase
        .from('team_members')
        .select('*')
        .eq('member_type', type)
        .eq('is_active', true);

      if (error) throw error;
      return data || [];
    },
    `Failed to fetch team members with type ${type}`
  );
}

/**
 * Fetch a team member by id
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
      return data;
    },
    `Failed to fetch team member with id ${id}`
  );
}

/**
 * Create a team member
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
      return data;
    },
    'Failed to create team member'
  );
}

/**
 * Update a team member
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
      return data;
    },
    `Failed to update team member with id ${id}`
  );
}

/**
 * Delete a team member
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
 * Fetch players by position
 */
export async function fetchPlayersByPosition(position: string): Promise<DbServiceResponse<TeamMember[]>> {
  return handleDbOperation(
    async () => {
      const { data, error } = await supabase
        .from('team_members')
        .select('*')
        .eq('member_type', 'player')
        .eq('position', position)
        .eq('is_active', true);

      if (error) throw error;
      return data || [];
    },
    `Failed to fetch players with position ${position}`
  );
}
