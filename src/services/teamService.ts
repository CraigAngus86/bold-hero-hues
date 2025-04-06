
import { create } from 'zustand';
import { TeamMember, MemberType } from '@/types/team';

interface TeamStore {
  teamMembers: TeamMember[];
  loading: boolean;
  error: string | null;
  fetchTeamMembers: () => Promise<void>;
  addTeamMember: (member: Omit<TeamMember, 'id'>) => Promise<void>;
  updateTeamMember: (member: TeamMember) => Promise<void>;
  deleteTeamMember: (id: string) => Promise<void>;
  getTeamMembersByType: (type: MemberType) => TeamMember[];
}

export const useTeamStore = create<TeamStore>((set, get) => ({
  teamMembers: [],
  loading: false,
  error: null,
  
  fetchTeamMembers: async () => {
    set({ loading: true, error: null });
    try {
      // Mock data for now
      const mockTeamMembers: TeamMember[] = [
        {
          id: '1',
          name: 'John Smith',
          member_type: 'player',
          position: 'Goalkeeper',
          image_url: '/lovable-uploads/player1.jpg',
          bio: 'Experienced goalkeeper with strong leadership skills.',
          nationality: 'Scotland',
          experience: '10 years',
          is_active: true,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
          jersey_number: 1,
          previous_clubs: ['Aberdeen FC', 'Inverness CT'],
          stats: {
            appearances: 45,
            cleanSheets: 20
          }
        },
        {
          id: '2',
          name: 'Manager Name',
          member_type: 'management',
          position: 'Head Coach',
          image_url: '/lovable-uploads/coach.jpg',
          bio: 'Experienced coach with a strong track record.',
          nationality: 'Scotland',
          experience: '15 years',
          is_active: true,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        }
      ];
      
      set({ teamMembers: mockTeamMembers, loading: false });
    } catch (error) {
      set({ error: 'Failed to fetch team members', loading: false });
    }
  },
  
  addTeamMember: async (member) => {
    set({ loading: true, error: null });
    try {
      // Mock adding a member
      const newMember: TeamMember = {
        ...member,
        id: Math.random().toString(36).substring(2, 9),
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      };
      
      set(state => ({ 
        teamMembers: [...state.teamMembers, newMember], 
        loading: false 
      }));
    } catch (error) {
      set({ error: 'Failed to add team member', loading: false });
    }
  },
  
  updateTeamMember: async (updatedMember) => {
    set({ loading: true, error: null });
    try {
      // Mock updating a member
      set(state => ({ 
        teamMembers: state.teamMembers.map(member => 
          member.id === updatedMember.id ? { ...updatedMember, updated_at: new Date().toISOString() } : member
        ), 
        loading: false 
      }));
    } catch (error) {
      set({ error: 'Failed to update team member', loading: false });
    }
  },
  
  deleteTeamMember: async (id) => {
    set({ loading: true, error: null });
    try {
      // Mock deleting a member
      set(state => ({ 
        teamMembers: state.teamMembers.filter(member => member.id !== id), 
        loading: false 
      }));
    } catch (error) {
      set({ error: 'Failed to delete team member', loading: false });
    }
  },
  
  getTeamMembersByType: (type) => {
    return get().teamMembers.filter(member => member.member_type === type);
  }
}));
