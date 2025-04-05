
import { create } from 'zustand';
import { createTeamMember, deleteTeamMember, fetchTeamMembers, fetchTeamMembersByType, updateTeamMember } from './teamDbService';
import { toast } from 'sonner';

export interface TeamMember {
  id: number;
  name: string;
  type: 'player' | 'management' | 'official';
  position?: string;
  role?: string;
  number?: number;
  image: string;
  bio: string;
  stats?: {
    appearances: number;
    goals: number;
    assists: number;
  };
  experience?: string;
}

interface TeamStore {
  teamMembers: TeamMember[];
  loading: boolean;
  fetchTeamMembers: () => Promise<void>;
  addTeamMember: (member: Omit<TeamMember, 'id'>) => Promise<void>;
  updateTeamMember: (member: TeamMember) => Promise<void>;
  deleteTeamMember: (id: number) => Promise<void>;
  getPlayersByPosition: (position: string) => TeamMember[];
  getManagementTeam: () => TeamMember[];
  getClubOfficials: () => TeamMember[];
}

// Adapter to convert from DB model to UI model
const toUiModel = (dbModel: any): TeamMember => ({
  id: dbModel.id,
  name: dbModel.name,
  type: dbModel.member_type,
  position: dbModel.position,
  role: dbModel.member_type !== 'player' ? dbModel.position : undefined,
  number: dbModel.jersey_number,
  image: dbModel.image_url || '',
  bio: dbModel.bio || '',
  stats: dbModel.stats,
  experience: dbModel.experience
});

// Adapter to convert from UI model to DB model
const toDbModel = (uiModel: Omit<TeamMember, 'id'>) => ({
  name: uiModel.name,
  member_type: uiModel.type,
  position: uiModel.type === 'player' ? uiModel.position : uiModel.role,
  jersey_number: uiModel.number,
  image_url: uiModel.image,
  bio: uiModel.bio,
  stats: uiModel.stats,
  experience: uiModel.experience,
  is_active: true
});

export const useTeamStore = create<TeamStore>((set, get) => ({
  teamMembers: [],
  loading: false,
  
  fetchTeamMembers: async () => {
    set({ loading: true });
    try {
      const result = await fetchTeamMembers();
      if (result.success && result.data) {
        set({ teamMembers: result.data.map(toUiModel) });
      } else {
        toast.error('Failed to fetch team members');
      }
    } catch (error) {
      console.error('Error fetching team members:', error);
      toast.error('Failed to fetch team members');
    } finally {
      set({ loading: false });
    }
  },
  
  addTeamMember: async (member) => {
    try {
      const result = await createTeamMember(toDbModel(member));
      if (result.success && result.data) {
        set((state) => ({
          teamMembers: [...state.teamMembers, toUiModel(result.data)]
        }));
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
      const result = await updateTeamMember(String(member.id), toDbModel(member));
      if (result.success) {
        set((state) => ({
          teamMembers: state.teamMembers.map((m) => 
            m.id === member.id ? member : m
          )
        }));
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
      const result = await deleteTeamMember(String(id));
      if (result.success) {
        set((state) => ({
          teamMembers: state.teamMembers.filter((m) => m.id !== id)
        }));
        toast.success('Team member deleted successfully');
      } else {
        toast.error('Failed to delete team member');
      }
    } catch (error) {
      console.error('Error deleting team member:', error);
      toast.error('Failed to delete team member');
    }
  },
  
  getPlayersByPosition: (position) => {
    const { teamMembers } = get();
    if (position === "All") {
      return teamMembers.filter(member => member.type === 'player');
    }
    return teamMembers.filter(
      member => member.type === 'player' && member.position === position
    );
  },
  
  getManagementTeam: () => {
    const { teamMembers } = get();
    return teamMembers.filter(member => member.type === 'management');
  },
  
  getClubOfficials: () => {
    const { teamMembers } = get();
    return teamMembers.filter(member => member.type === 'official');
  }
}));
