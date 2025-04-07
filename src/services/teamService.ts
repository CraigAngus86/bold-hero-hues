
import { supabase } from '@/integrations/supabase/client';
import { executeQuery } from '@/lib/supabase';
import { DbServiceResponse } from '@/services/utils/dbService';
import { TeamMember as TeamMemberType } from '@/types/team';

// Export the MemberType as a type
export type MemberType = 'player' | 'staff' | 'coach' | 'official' | 'management';

/**
 * Creates a new team member in the database
 */
export const createTeamMember = async (teamMember: Omit<TeamMemberType, 'id'>): Promise<DbServiceResponse<TeamMemberType>> => {
  try {
    const { data, error } = await supabase
      .from('team_members')
      .insert(teamMember)
      .select('*')
      .single();

    if (error) {
      console.error('Error creating team member:', error);
      return {
        success: false,
        error: error.message
      };
    }

    return {
      success: true,
      data: data as TeamMemberType
    };
  } catch (error) {
    console.error('Exception creating team member:', error);
    return {
      success: false,
      error: 'An unexpected error occurred while creating the team member'
    };
  }
};

/**
 * Updates an existing team member in the database
 */
export const updateTeamMember = async (id: string, teamMember: Partial<TeamMemberType>): Promise<DbServiceResponse<TeamMemberType>> => {
  try {
    const { data, error } = await supabase
      .from('team_members')
      .update(teamMember)
      .eq('id', id)
      .select('*')
      .single();

    if (error) {
      console.error('Error updating team member:', error);
      return {
        success: false,
        error: error.message
      };
    }

    return {
      success: true,
      data: data as TeamMemberType
    };
  } catch (error) {
    console.error('Exception updating team member:', error);
    return {
      success: false,
      error: 'An unexpected error occurred while updating the team member'
    };
  }
};

/**
 * Deletes a team member from the database
 */
export const deleteTeamMember = async (id: string): Promise<DbServiceResponse<null>> => {
  try {
    const { error } = await supabase
      .from('team_members')
      .delete()
      .eq('id', id);

    if (error) {
      console.error('Error deleting team member:', error);
      return {
        success: false,
        error: error.message
      };
    }

    return {
      success: true,
      data: null
    };
  } catch (error) {
    console.error('Exception deleting team member:', error);
    return {
      success: false,
      error: 'An unexpected error occurred while deleting the team member'
    };
  }
};

/**
 * Fetches a single team member by ID
 */
export const getTeamMember = async (id: string): Promise<DbServiceResponse<TeamMemberType>> => {
  try {
    const { data, error } = await supabase
      .from('team_members')
      .select('*')
      .eq('id', id)
      .single();

    if (error) {
      console.error('Error fetching team member:', error);
      return {
        success: false,
        error: error.message
      };
    }

    return {
      success: true,
      data: data as TeamMemberType
    };
  } catch (error) {
    console.error('Exception fetching team member:', error);
    return {
      success: false,
      error: 'An unexpected error occurred while fetching the team member'
    };
  }
};

// Export TeamMember type explicitly using export type
export type { TeamMemberType as TeamMember };

export const getTeamMembers = async (): Promise<TeamMemberType[]> => {
  try {
    const { data, error } = await supabase.from('team_members').select('*');
    
    if (error) {
      console.error('Error fetching team members:', error);
      return [];
    }
    
    return data as TeamMemberType[];
  } catch (error) {
    console.error('Exception fetching team members:', error);
    return [];
  }
};

export const getTeamMembersByType = async (memberType: MemberType): Promise<TeamMemberType[]> => {
  try {
    const { data, error } = await supabase
      .from('team_members')
      .select('*')
      .eq('member_type', memberType);
      
    if (error) {
      console.error(`Error fetching ${memberType}s:`, error);
      return [];
    }
    
    return data as TeamMemberType[];
  } catch (error) {
    console.error(`Exception fetching ${memberType}s:`, error);
    return [];
  }
};

// Define the team store state interface
export interface TeamState {
  teamMembers: TeamMemberType[];
  isLoading: boolean;
  error: string | null;
  getPlayersByPosition: (position: string) => TeamMemberType[];
  getManagementStaff: () => TeamMemberType[];
  loadTeamMembers: () => Promise<void>;
}
