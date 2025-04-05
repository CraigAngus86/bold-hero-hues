
import { create } from 'zustand';
import { toast } from 'sonner';
import { TeamMember, MemberType } from '@/types/team';
import {
  fetchAllTeamMembers,
  fetchTeamMembersByType,
  createTeamMember as dbCreateTeamMember,
  updateTeamMember as dbUpdateTeamMember,
  deleteTeamMember as dbDeleteTeamMember,
  fetchManagementTeam as dbFetchManagementTeam,
  getAllTeamMembers as dbGetAllTeamMembers
} from './teamDbService';

// Re-export database functions for direct use
export const createTeamMember = dbCreateTeamMember;
export const updateTeamMember = dbUpdateTeamMember;
export const deleteTeamMember = dbDeleteTeamMember;
export const getAllTeamMembers = dbGetAllTeamMembers;

interface TeamStore {
  players: TeamMember[];
  managementStaff: TeamMember[];
  officials: TeamMember[];
  loading: boolean;
  fetchTeamMembers: () => Promise<void>;
  fetchPlayersByPosition: (position: string) => TeamMember[];
  getManagementStaff: () => Promise<TeamMember[]>;
  addTeamMember: (member: Omit<TeamMember, 'id'>) => Promise<void>;
  updateTeamMember: (member: TeamMember) => Promise<void>;
  deleteTeamMember: (id: string) => Promise<void>;
}

export const useTeamStore = create<TeamStore>((set, get) => ({
  players: [],
  managementStaff: [],
  officials: [],
  loading: false,
  
  fetchTeamMembers: async () => {
    set({ loading: true });
    try {
      // Fetch players
      const playersResult = await fetchTeamMembersByType('player');
      // Fetch management
      const managementResult = await fetchTeamMembersByType('management');
      // Fetch officials
      const officialsResult = await fetchTeamMembersByType('official');
      
      if (playersResult.success && managementResult.success && officialsResult.success) {
        set({ 
          players: playersResult.data || [],
          managementStaff: managementResult.data || [],
          officials: officialsResult.data || []
        });
      } else {
        toast.error('Failed to fetch team data');
      }
    } catch (error) {
      console.error('Error fetching team data:', error);
      toast.error('Failed to fetch team data');
    } finally {
      set({ loading: false });
    }
  },
  
  fetchPlayersByPosition: (position: string) => {
    const { players } = get();
    return players.filter(player => player.position === position);
  },
  
  getManagementStaff: async () => {
    const { managementStaff } = get();
    if (managementStaff.length > 0) {
      return managementStaff;
    }
    
    // If not loaded yet, fetch from DB
    const result = await dbFetchManagementTeam();
    if (result.success && result.data) {
      set({ managementStaff: result.data });
      return result.data;
    }
    return [];
  },
  
  addTeamMember: async (member) => {
    try {
      const result = await dbCreateTeamMember(member);
      if (result.success && result.data) {
        // Update the appropriate state array based on member type
        set((state) => {
          const newMember = result.data;
          if (newMember.member_type === 'player') {
            return { players: [...state.players, newMember] };
          } else if (newMember.member_type === 'management') {
            return { managementStaff: [...state.managementStaff, newMember] };
          } else if (newMember.member_type === 'official') {
            return { officials: [...state.officials, newMember] };
          }
          return state;
        });
        toast.success('Team member added successfully');
      } else {
        toast.error('Failed to add team member');
      }
    } catch (error) {
      console.error('Error adding team member:', error);
      toast.error('Failed to add team member');
    }
  },
  
  updateTeamMember: async (member) => {
    try {
      const { id, ...memberData } = member;
      const result = await dbUpdateTeamMember(id, memberData);
      if (result.success) {
        // Update the appropriate state array based on member type
        set((state) => {
          if (member.member_type === 'player') {
            return { players: state.players.map(p => p.id === member.id ? member : p) };
          } else if (member.member_type === 'management') {
            return { managementStaff: state.managementStaff.map(m => m.id === member.id ? member : m) };
          } else if (member.member_type === 'official') {
            return { officials: state.officials.map(o => o.id === member.id ? member : o) };
          }
          return state;
        });
        toast.success('Team member updated successfully');
      } else {
        toast.error('Failed to update team member');
      }
    } catch (error) {
      console.error('Error updating team member:', error);
      toast.error('Failed to update team member');
    }
  },
  
  deleteTeamMember: async (id) => {
    try {
      const result = await dbDeleteTeamMember(id);
      if (result.success) {
        // Remove from all arrays since we don't know which type it was
        set((state) => ({
          players: state.players.filter(p => p.id !== id),
          managementStaff: state.managementStaff.filter(m => m.id !== id),
          officials: state.officials.filter(o => o.id !== id)
        }));
        toast.success('Team member deleted successfully');
      } else {
        toast.error('Failed to delete team member');
      }
    } catch (error) {
      console.error('Error deleting team member:', error);
      toast.error('Failed to delete team member');
    }
  }
}));
