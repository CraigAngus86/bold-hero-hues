
import { create } from 'zustand';
import { toast } from 'sonner';
import { Sponsor } from '@/types/sponsors';
import { 
  fetchSponsors, 
  createSponsor as dbCreateSponsor, 
  updateSponsor as dbUpdateSponsor, 
  deleteSponsor as dbDeleteSponsor,
  getAllSponsors as dbGetAllSponsors
} from './sponsorsDbService';

// Re-export database functions for direct use
export const createSponsor = dbCreateSponsor;
export const updateSponsor = dbUpdateSponsor;
export const deleteSponsor = dbDeleteSponsor;
export const getAllSponsors = dbGetAllSponsors;

interface SponsorsStore {
  sponsors: Sponsor[];
  loading: boolean;
  fetchSponsors: () => Promise<void>;
  addSponsor: (sponsor: Omit<Sponsor, 'id'>) => Promise<void>;
  updateSponsor: (sponsor: Sponsor) => Promise<void>;
  deleteSponsor: (id: string) => Promise<void>;
}

export const useSponsorsStore = create<SponsorsStore>((set) => ({
  sponsors: [],
  loading: false,
  
  fetchSponsors: async () => {
    set({ loading: true });
    try {
      const result = await fetchSponsors();
      if (result.success && result.data) {
        set({ sponsors: result.data });
      } else {
        toast.error('Failed to fetch sponsors');
      }
    } catch (error) {
      console.error('Error fetching sponsors:', error);
      toast.error('Failed to fetch sponsors');
    } finally {
      set({ loading: false });
    }
  },
  
  addSponsor: async (sponsor) => {
    try {
      const result = await dbCreateSponsor(sponsor);
      if (result.success && result.data) {
        set((state) => ({
          sponsors: [...state.sponsors, result.data]
        }));
        toast.success('Sponsor added successfully');
      } else {
        toast.error('Failed to add sponsor');
      }
    } catch (error) {
      console.error('Error adding sponsor:', error);
      toast.error('Failed to add sponsor');
    }
  },
  
  updateSponsor: async (sponsor) => {
    try {
      const { id, ...sponsorData } = sponsor;
      const result = await dbUpdateSponsor(id, sponsorData);
      if (result.success) {
        set((state) => ({
          sponsors: state.sponsors.map((s) => 
            s.id === sponsor.id ? sponsor : s
          )
        }));
        toast.success('Sponsor updated successfully');
      } else {
        toast.error('Failed to update sponsor');
      }
    } catch (error) {
      console.error('Error updating sponsor:', error);
      toast.error('Failed to update sponsor');
    }
  },
  
  deleteSponsor: async (id) => {
    try {
      const result = await dbDeleteSponsor(id);
      if (result.success) {
        set((state) => ({
          sponsors: state.sponsors.filter((s) => s.id !== id)
        }));
        toast.success('Sponsor deleted successfully');
      } else {
        toast.error('Failed to delete sponsor');
      }
    } catch (error) {
      console.error('Error deleting sponsor:', error);
      toast.error('Failed to delete sponsor');
    }
  }
}));
