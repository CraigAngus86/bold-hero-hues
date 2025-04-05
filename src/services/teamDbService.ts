
import { supabase } from '@/services/supabase/supabaseClient';
import { DBTeamMember, TeamMember, convertToTeamMember } from '@/types/team';
import { showErrorToUser, createAppError, ErrorType } from '@/utils/errorHandling';

/**
 * Get all team members
 */
export async function getAllTeamMembers(): Promise<TeamMember[]> {
  try {
    // Cast supabase.from to any to bypass type checking until Supabase types are updated
    const { data, error } = await (supabase.from('team_members') as any)
      .select('*')
      .order('name');

    if (error) throw error;

    return (data as DBTeamMember[]).map(convertToTeamMember);
  } catch (error) {
    console.error('Error fetching team members:', error);
    showErrorToUser(error, 'Failed to load team members');
    return [];
  }
}

/**
 * Get team members by type
 */
export async function getTeamMembersByType(type: 'player' | 'management' | 'official'): Promise<TeamMember[]> {
  try {
    // Cast supabase.from to any to bypass type checking until Supabase types are updated
    const { data, error } = await (supabase.from('team_members') as any)
      .select('*')
      .eq('member_type', type)
      .order('name');

    if (error) throw error;

    return (data as DBTeamMember[]).map(convertToTeamMember);
  } catch (error) {
    console.error(`Error fetching ${type} members:`, error);
    showErrorToUser(error, `Failed to load ${type} members`);
    return [];
  }
}

/**
 * Get team member by ID
 */
export async function getTeamMemberById(id: string): Promise<TeamMember | null> {
  try {
    // Cast supabase.from to any to bypass type checking until Supabase types are updated
    const { data, error } = await (supabase.from('team_members') as any)
      .select('*')
      .eq('id', id)
      .single();

    if (error) throw error;

    return convertToTeamMember(data as DBTeamMember);
  } catch (error) {
    console.error('Error fetching team member:', error);
    showErrorToUser(error, 'Failed to load team member details');
    return null;
  }
}

/**
 * Create team member
 */
export async function createTeamMember(member: Omit<DBTeamMember, 'id' | 'created_at' | 'updated_at'>): Promise<TeamMember | null> {
  try {
    // Cast supabase.from to any to bypass type checking until Supabase types are updated
    const { data, error } = await (supabase.from('team_members') as any)
      .insert([member])
      .select()
      .single();

    if (error) throw error;

    return convertToTeamMember(data as DBTeamMember);
  } catch (error) {
    console.error('Error creating team member:', error);
    showErrorToUser(error, 'Failed to create team member');
    return null;
  }
}

/**
 * Update team member
 */
export async function updateTeamMember(id: string, updates: Partial<DBTeamMember>): Promise<TeamMember | null> {
  try {
    // Cast supabase.from to any to bypass type checking until Supabase types are updated
    const { data, error } = await (supabase.from('team_members') as any)
      .update(updates)
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;

    return convertToTeamMember(data as DBTeamMember);
  } catch (error) {
    console.error('Error updating team member:', error);
    showErrorToUser(error, 'Failed to update team member');
    return null;
  }
}

/**
 * Delete team member
 */
export async function deleteTeamMember(id: string): Promise<boolean> {
  try {
    // Cast supabase.from to any to bypass type checking until Supabase types are updated
    const { error } = await (supabase.from('team_members') as any)
      .delete()
      .eq('id', id);

    if (error) throw error;

    return true;
  } catch (error) {
    console.error('Error deleting team member:', error);
    showErrorToUser(error, 'Failed to delete team member');
    return false;
  }
}
