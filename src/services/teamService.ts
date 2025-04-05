import { supabase } from '@/services/supabase/supabaseClient';
import { DBTeamMember, TeamMember, convertToTeamMember } from '@/types/team';
import { handleDbOperation, DbServiceResponse } from './utils/dbService';
import { create } from 'zustand';

export interface TeamMember {
  id: number;
  name: string;
  position?: string;
  image: string;
  number?: number;
  age?: number;
  height?: string;
  nationality?: string;
  previousClubs?: string[];
  bio?: string;
  biography?: string;
  role?: string;
  experience?: string;
  type: 'player' | 'management' | 'official';
  stats?: {
    appearances?: number;
    goals?: number;
    assists?: number;
    cleanSheets?: number;
  };
}

interface TeamState {
  players: TeamMember[];
  teamMembers: TeamMember[];
  officials: TeamMember[];
  management: TeamMember[];
  isLoading: boolean;
  error: string | null;
  fetchTeam: () => Promise<void>;
  addTeamMember: (member: TeamMember) => void;
  updateTeamMember: (member: TeamMember) => void;
  deleteTeamMember: (id: number) => void;
  getPlayers: () => TeamMember[];
  getManagementStaff: () => TeamMember[];
  getClubOfficials: () => TeamMember[];
  getPlayersByPosition: (position: string) => TeamMember[];
}

export const useTeamStore = create<TeamState>((set, get) => ({
  players: [
    {
      id: 1,
      name: 'Andy Shearer',
      position: 'Goalkeeper',
      image: '/lovable-uploads/940ac3a1-b89d-40c9-957e-217a64371120.png',
      number: 1,
      age: 28,
      nationality: 'Scottish',
      previousClubs: ['Cove Rangers', 'Formartine United'],
      type: 'player',
      height: '6\'2\"'
    },
    {
      id: 2,
      name: 'Sam Robertson',
      position: 'Defender',
      image: '/lovable-uploads/c653949f-4499-4e9b-a939-a95989689798.png',
      number: 3,
      age: 24,
      nationality: 'Scottish',
      previousClubs: ['Inverurie Loco Works'],
      type: 'player',
      height: '5\'11\"'
    },
    {
      id: 3,
      name: 'Ryan Mcintosh',
      position: 'Defender',
      image: '/lovable-uploads/c653949f-4499-4e9b-a939-a95989689798.png',
      number: 5,
      age: 26,
      nationality: 'Scottish',
      previousClubs: [],
      type: 'player',
      height: '6\'0\"'
    },
    {
      id: 4,
      name: 'Alex Willox',
      position: 'Defender',
      image: '/lovable-uploads/c653949f-4499-4e9b-a939-a95989689798.png',
      number: 6,
      age: 29,
      nationality: 'Scottish',
      previousClubs: [],
      type: 'player',
      height: '5\'10\"'
    },
    {
      id: 5,
      name: 'Kane Winton',
      position: 'Midfielder',
      image: '/lovable-uploads/c653949f-4499-4e9b-a939-a95989689798.png',
      number: 7,
      age: 22,
      nationality: 'Scottish',
      previousClubs: [],
      type: 'player',
      height: '5\'9\"'
    },
    {
      id: 6,
      name: 'Rob Ward',
      position: 'Forward',
      image: '/lovable-uploads/c653949f-4499-4e9b-a939-a95989689798.png',
      number: 9,
      age: 30,
      nationality: 'Scottish',
      previousClubs: [],
      type: 'player',
      height: '6\'1\"'
    },
    {
      id: 7,
      name: 'Chris Antoniazzi',
      position: 'Forward',
      image: '/lovable-uploads/c653949f-4499-4e9b-a939-a95989689798.png',
      number: 10,
      age: 27,
      nationality: 'Scottish',
      previousClubs: [],
      type: 'player',
      height: '5\'8\"'
    },
    {
      id: 8,
      name: 'Jack Brown',
      position: 'Forward',
      image: '/lovable-uploads/c653949f-4499-4e9b-a939-a95989689798.png',
      number: 11,
      age: 23,
      nationality: 'Scottish',
      previousClubs: [],
      type: 'player',
      height: '5\'11\"'
    },
    {
      id: 9,
      name: 'Michael Philipson',
      position: 'Midfielder',
      image: '/lovable-uploads/c653949f-4499-4e9b-a939-a95989689798.png',
      number: 14,
      age: 25,
      nationality: 'Scottish',
      previousClubs: [],
      type: 'player',
      height: '5\'10\"'
    },
    {
      id: 10,
      name: 'Kieran Gibbons',
      position: 'Midfielder',
      image: '/lovable-uploads/c653949f-4499-4e9b-a939-a95989689798.png',
      number: 16,
      age: 29,
      nationality: 'Scottish',
      previousClubs: [],
      type: 'player',
      height: '5\'11\"'
    },
    {
      id: 11,
      name: 'Dayle Robertson',
      position: 'Defender',
      image: '/lovable-uploads/c653949f-4499-4e9b-a939-a95989689798.png',
      number: 17,
      age: 28,
      nationality: 'Scottish',
      previousClubs: [],
      type: 'player',
      height: '6\'0\"'
    },
    {
      id: 12,
      name: 'Ethan Cairns',
      position: 'Forward',
      image: '/lovable-uploads/c653949f-4499-4e9b-a939-a95989689798.png',
      number: 18,
      age: 19,
      nationality: 'Scottish',
      previousClubs: [],
      type: 'player',
      height: '5\'8\"'
    },
    {
      id: 13,
      name: 'Kai Adams',
      position: 'Midfielder',
      image: '/lovable-uploads/c653949f-4499-4e9b-a939-a95989689798.png',
      number: 19,
      age: 20,
      nationality: 'Scottish',
      previousClubs: [],
      type: 'player',
      height: '5\'9\"'
    },
    {
      id: 14,
      name: 'Aidan Combe',
      position: 'Defender',
      image: '/lovable-uploads/c653949f-4499-4e9b-a939-a95989689798.png',
      number: 20,
      age: 21,
      nationality: 'Scottish',
      previousClubs: [],
      type: 'player',
      height: '5\'10\"'
    },
    {
      id: 15,
      name: 'Regan Stewart',
      position: 'Goalkeeper',
      image: '/lovable-uploads/c653949f-4499-4e9b-a939-a95989689798.png',
      number: 21,
      age: 18,
      nationality: 'Scottish',
      previousClubs: [],
      type: 'player',
      height: '6\'3\"'
    },
    {
      id: 16,
      name: 'Aaron Norris',
      position: 'Midfielder',
      image: '/lovable-uploads/c653949f-4499-4e9b-a939-a95989689798.png',
      number: 22,
      age: 24,
      nationality: 'Scottish',
      previousClubs: [],
      type: 'player',
      height: '5\'11\"'
    },
    {
      id: 17,
      name: 'Calvin Ramsay',
      position: 'Defender',
      image: '/lovable-uploads/c653949f-4499-4e9b-a939-a95989689798.png',
      number: 23,
      age: 20,
      nationality: 'Scottish',
      previousClubs: [],
      type: 'player',
      height: '6\'0\"'
    }
  ],
  management: [
    {
      id: 101,
      name: 'Josh Winton',
      role: 'First Team Manager',
      image: '/lovable-uploads/cb95b9fb-0f2d-42ef-9788-10509a80ed6e.png',
      bio: 'Joined in 2022 as Manager',
      experience: '10 years coaching experience',
      type: 'management'
    },
    {
      id: 102,
      name: 'Tommy Wilson',
      role: 'Assistant Manager',
      image: '/lovable-uploads/7f997ef4-9019-4660-9e9e-4e230d7b1eb3.png',
      bio: 'Former player who joined the coaching staff in 2019',
      experience: '15 years in Highland League',
      type: 'management'
    }
  ],
  officials: [
    {
      id: 201,
      name: 'Brian Winton',
      role: 'Club President',
      image: '/lovable-uploads/e2efc1b0-1c8a-4e98-9826-3030a5f5d247.png',
      experience: '25 years at Banks o\' Dee',
      type: 'official'
    },
    {
      id: 202,
      name: 'Tom McQuarrie',
      role: 'Club Secretary',
      image: '/lovable-uploads/b937e144-e94f-4e75-881f-1e560c6b520a.png',
      experience: '15 years of service',
      type: 'official'
    }
  ],
  teamMembers: [],
  isLoading: false,
  error: null,
  fetchTeam: async () => {
    set({ isLoading: true, error: null });
    
    try {
      await new Promise(resolve => setTimeout(resolve, 500));
      
      const players = get().players;
      const management = get().management;
      const officials = get().officials;
      
      set({ 
        teamMembers: [...players, ...management, ...officials],
        isLoading: false 
      });
    } catch (error) {
      console.error('Error fetching team data:', error);
      set({ 
        error: error instanceof Error ? error.message : 'An unknown error occurred', 
        isLoading: false 
      });
    }
  },
  getPlayers: () => get().players,
  getManagementStaff: () => get().management,
  getClubOfficials: () => get().officials,
  getPlayersByPosition: (position: string) => {
    const players = get().players;
    if (position === "All") {
      return players;
    }
    return players.filter(player => player.position === position);
  },
  addTeamMember: (member: TeamMember) => {
    set((state) => {
      if (member.type === 'player') {
        return { players: [...state.players, member], teamMembers: [...state.teamMembers, member] };
      } else if (member.type === 'management') {
        return { management: [...state.management, member], teamMembers: [...state.teamMembers, member] };
      } else if (member.type === 'official') {
        return { officials: [...state.officials, member], teamMembers: [...state.teamMembers, member] };
      }
      return state;
    });
  },
  updateTeamMember: (updatedMember: TeamMember) => {
    set((state) => {
      const updatedTeamMembers = state.teamMembers.map(member => 
        member.id === updatedMember.id ? updatedMember : member
      );
      
      if (updatedMember.type === 'player') {
        const updatedPlayers = state.players.map(player => 
          player.id === updatedMember.id ? updatedMember : player
        );
        return { players: updatedPlayers, teamMembers: updatedTeamMembers };
      } else if (updatedMember.type === 'management') {
        const updatedManagement = state.management.map(manager => 
          manager.id === updatedMember.id ? updatedMember : manager
        );
        return { management: updatedManagement, teamMembers: updatedTeamMembers };
      } else if (updatedMember.type === 'official') {
        const updatedOfficials = state.officials.map(official => 
          official.id === updatedMember.id ? updatedMember : official
        );
        return { officials: updatedOfficials, teamMembers: updatedTeamMembers };
      }
      return { teamMembers: updatedTeamMembers };
    });
  },
  deleteTeamMember: (id: number) => {
    set((state) => {
      const member = state.teamMembers.find(m => m.id === id);
      if (!member) return state;
      
      const updatedTeamMembers = state.teamMembers.filter(m => m.id !== id);
      
      if (member.type === 'player') {
        const updatedPlayers = state.players.filter(p => p.id !== id);
        return { players: updatedPlayers, teamMembers: updatedTeamMembers };
      } else if (member.type === 'management') {
        const updatedManagement = state.management.filter(m => m.id !== id);
        return { management: updatedManagement, teamMembers: updatedTeamMembers };
      } else if (member.type === 'official') {
        const updatedOfficials = state.officials.filter(o => o.id !== id);
        return { officials: updatedOfficials, teamMembers: updatedTeamMembers };
      }
      return { teamMembers: updatedTeamMembers };
    });
  }
}));

/**
 * Get all team members
 */
export async function getAllTeamMembers(): Promise<DbServiceResponse<TeamMember[]>> {
  return handleDbOperation(
    async () => {
      const { data, error } = await supabase
        .from('team_members')
        .select('*')
        .order('name');

      if (error) throw error;

      return (data as DBTeamMember[]).map(convertToTeamMember);
    },
    'Failed to load team members'
  );
}

/**
 * Get team members by type
 */
export async function getTeamMembersByType(type: 'player' | 'management' | 'official'): Promise<DbServiceResponse<TeamMember[]>> {
  return handleDbOperation(
    async () => {
      const { data, error } = await supabase
        .from('team_members')
        .select('*')
        .eq('member_type', type)
        .order('name');

      if (error) throw error;

      return (data as DBTeamMember[]).map(convertToTeamMember);
    },
    `Failed to load ${type} members`
  );
}

/**
 * Get active players by position
 */
export async function getPlayersByPosition(position: string): Promise<DbServiceResponse<TeamMember[]>> {
  return handleDbOperation(
    async () => {
      const { data, error } = await supabase
        .from('team_members')
        .select('*')
        .eq('member_type', 'player')
        .eq('position', position)
        .eq('is_active', true)
        .order('jersey_number');

      if (error) throw error;

      return (data as DBTeamMember[]).map(convertToTeamMember);
    },
    `Failed to load players with position: ${position}`
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
export async function createTeamMember(member: Omit<DBTeamMember, 'id' | 'created_at' | 'updated_at'>): Promise<DbServiceResponse<TeamMember>> {
  return handleDbOperation(
    async () => {
      const { data, error } = await supabase
        .from('team_members')
        .insert([member])
        .select()
        .single();

      if (error) throw error;

      return convertToTeamMember(data as DBTeamMember);
    },
    'Failed to create team member'
  );
}

/**
 * Update team member
 */
export async function updateTeamMember(id: string, updates: Partial<DBTeamMember>): Promise<DbServiceResponse<TeamMember>> {
  return handleDbOperation(
    async () => {
      const { data, error } = await supabase
        .from('team_members')
        .update(updates)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;

      return convertToTeamMember(data as DBTeamMember);
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
 * Get all available positions
 */
export async function getPositions(): Promise<DbServiceResponse<string[]>> {
  return handleDbOperation(
    async () => {
      const { data, error } = await supabase
        .from('team_members')
        .select('position')
        .eq('member_type', 'player');

      if (error) throw error;

      const positions = [...new Set(data.map(item => item.position).filter(Boolean))];
      return positions as string[];
    },
    'Failed to load positions'
  );
}
