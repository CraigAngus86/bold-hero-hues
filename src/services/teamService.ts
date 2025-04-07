
import { TeamMember } from '@/types/team';
import { supabase } from '@/integrations/supabase/client';

export const createTeamMember = async (data: Omit<TeamMember, 'id'>): Promise<boolean> => {
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
