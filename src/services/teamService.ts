
import { supabase } from '@/services/supabase/supabaseClient';
import { TeamMember as TeamMemberType } from '@/types/team';
import { handleDbOperation, DbServiceResponse } from './utils/dbService';

// Use a different name to avoid conflict with imported type
export type DBTeamMember = {
  id: string;
  name: string;
  image_url?: string | null;
  position?: string;
  number?: number;
  member_type: 'player' | 'management' | 'official';
  role?: string;
  bio?: string;
  experience?: string;
  nationality?: string;
  previous_clubs?: string[];
  created_at?: string;
  updated_at?: string;
  is_active?: boolean;
  stats?: {
    appearances?: number;
    goals?: number;
    assists?: number;
    clean_sheets?: number;
  };
};

/**
 * Get all team members
 */
export async function getAllTeamMembers(): Promise<DbServiceResponse<TeamMemberType[]>> {
  return handleDbOperation(
    async () => {
      const { data, error } = await supabase
        .from('team_members')
        .select('*')
        .order('name');

      if (error) throw error;

      // Convert from DB format to the TeamMember type defined in types/team.ts
      const teamMembers: TeamMemberType[] = data.map(item => ({
        id: parseInt(item.id),
        name: item.name,
        image: item.image_url,
        number: item.number,
        position: item.position,
        role: item.role,
        bio: item.bio,
        experience: item.experience,
        nationality: item.nationality,
        previousClubs: item.previous_clubs,
        type: item.member_type,
        stats: item.stats
      }));

      return teamMembers;
    },
    'Failed to load team members'
  );
}

/**
 * Get team members by type
 */
export async function getTeamMembersByType(type: 'player' | 'management' | 'official'): Promise<DbServiceResponse<TeamMemberType[]>> {
  return handleDbOperation(
    async () => {
      const { data, error } = await supabase
        .from('team_members')
        .select('*')
        .eq('member_type', type)
        .eq('is_active', true)
        .order('name');

      if (error) throw error;

      // Convert from DB format to the TeamMember type defined in types/team.ts
      const teamMembers: TeamMemberType[] = data.map(item => ({
        id: parseInt(item.id),
        name: item.name,
        image: item.image_url,
        number: item.number,
        position: item.position,
        role: item.role,
        bio: item.bio,
        experience: item.experience,
        nationality: item.nationality,
        previousClubs: item.previous_clubs,
        type: item.member_type,
        stats: item.stats
      }));

      return teamMembers;
    },
    `Failed to load ${type} members`
  );
}

/**
 * Get team member by ID
 */
export async function getTeamMemberById(id: string): Promise<DbServiceResponse<TeamMemberType>> {
  return handleDbOperation(
    async () => {
      const { data, error } = await supabase
        .from('team_members')
        .select('*')
        .eq('id', id)
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
export function convertToDBTeamMember(member: TeamMemberType): Partial<DBTeamMember> {
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
