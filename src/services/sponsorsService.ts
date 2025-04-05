
import { create } from 'zustand';
import { createSponsor, deleteSponsor, fetchSponsors, fetchSponsorsByTier, updateSponsor } from './sponsorsDbService';
import { toast } from 'sonner';

export interface Sponsor {
  id: number;
  name: string;
  logoUrl: string;
  website: string;
  tier: 'platinum' | 'gold' | 'silver' | 'bronze';
  description: string;
}

interface SponsorsStore {
  sponsors: Sponsor[];
  loading: boolean;
  fetchSponsors: () => Promise<void>;
  addSponsor: (sponsor: Omit<Sponsor, 'id'>) => Promise<void>;
  updateSponsor: (sponsor: Sponsor) => Promise<void>;
  deleteSponsor: (id: number) => Promise<void>;
}

// Adapter to convert from DB model to UI model
const toUiModel = (dbModel: any): Sponsor => ({
  id: dbModel.id,
  name: dbModel.name,
  logoUrl: dbModel.logo_url || '',
  website: dbModel.website_url || '',
  tier: dbModel.tier || 'bronze',
  description: dbModel.description || ''
});

// Adapter to convert from UI model to DB model
const toDbModel = (uiModel: Omit<Sponsor, 'id'>) => ({
  name: uiModel.name,
  logo_url: uiModel.logoUrl,
  website_url: uiModel.website,
  tier: uiModel.tier,
  description: uiModel.description,
  is_active: true
});

export const useSponsorsStore = create<SponsorsStore>((set) => ({
  sponsors: [],
  loading: false,
  
  fetchSponsors: async () => {
    set({ loading: true });
    try {
      const result = await fetchSponsors();
      if (result.success && result.data) {
        set({ sponsors: result.data.map(toUiModel) });
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
      const result = await createSponsor(toDbModel(sponsor));
      if (result.success && result.data) {
        set((state) => ({
          sponsors: [...state.sponsors, toUiModel(result.data)]
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
      const result = await updateSponsor(String(sponsor.id), toDbModel(sponsor));
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
      const result = await deleteSponsor(String(id));
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
