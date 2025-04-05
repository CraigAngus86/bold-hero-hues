
import { create } from 'zustand';
import { TeamMember, MemberType } from '@/types/team';
import { fetchTeamMembers, addTeamMember, updateTeamMember, deleteTeamMember } from './teamDbService';
import { toast } from 'sonner';

export { type TeamMember, type MemberType } from '@/types/team';

export interface TeamStore {
  players: TeamMember[];
  management: TeamMember[];
  officials: TeamMember[];
  teamMembers: TeamMember[];
  isLoading: boolean;
  getPlayersByPosition: (position: string) => TeamMember[];
  getManagementStaff: () => Promise<TeamMember[]>;
  getOfficials: () => Promise<TeamMember[]>;
  getPlayerById: (id: string) => TeamMember | undefined;
  addPlayer: (player: Omit<TeamMember, 'id'>) => Promise<void>;
  updatePlayer: (id: string, player: Partial<TeamMember>) => Promise<void>;
  deletePlayer: (id: string) => Promise<void>;
  loadTeamMembers: () => Promise<void>;
}

export const useTeamStore = create<TeamStore>((set, get) => ({
  players: [],
  management: [],
  officials: [],
  teamMembers: [],
  isLoading: false,

  getPlayersByPosition: (position) => {
    return get().players.filter(player => 
      player.position?.toLowerCase() === position.toLowerCase()
    );
  },

  getManagementStaff: async () => {
    try {
      const management = get().teamMembers.filter(member => member.member_type === 'management');
      return management;
    } catch (error) {
      console.error("Error fetching management staff:", error);
      return [];
    }
  },

  getOfficials: async () => {
    try {
      const officials = get().teamMembers.filter(member => member.member_type === 'official');
      return officials;
    } catch (error) {
      console.error("Error fetching officials:", error);
      return [];
    }
  },

  getPlayerById: (id) => {
    return get().players.find(player => player.id === id);
  },

  addPlayer: async (player) => {
    try {
      set({ isLoading: true });
      await addTeamMember({ ...player, member_type: 'player' });
      await get().loadTeamMembers();
      toast.success(`${player.name} added to the squad`);
    } catch (error) {
      console.error("Error adding player:", error);
      toast.error("Failed to add player");
    } finally {
      set({ isLoading: false });
    }
  },

  updatePlayer: async (id, player) => {
    try {
      set({ isLoading: true });
      await updateTeamMember(id, player);
      await get().loadTeamMembers();
      toast.success("Player updated successfully");
    } catch (error) {
      console.error("Error updating player:", error);
      toast.error("Failed to update player");
    } finally {
      set({ isLoading: false });
    }
  },

  deletePlayer: async (id) => {
    try {
      set({ isLoading: true });
      await deleteTeamMember(id);
      await get().loadTeamMembers();
      toast.success("Player removed from squad");
    } catch (error) {
      console.error("Error deleting player:", error);
      toast.error("Failed to delete player");
    } finally {
      set({ isLoading: false });
    }
  },

  loadTeamMembers: async () => {
    try {
      set({ isLoading: true });
      const members = await fetchTeamMembers();
      
      const players = members.filter(member => member.member_type === 'player');
      const management = members.filter(member => member.member_type === 'management');
      const officials = members.filter(member => member.member_type === 'official');
      
      set({ 
        players,
        management,
        officials,
        teamMembers: members
      });
    } catch (error) {
      console.error("Error loading team members:", error);
      toast.error("Failed to load team data");
    } finally {
      set({ isLoading: false });
    }
  },
}));
