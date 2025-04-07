import { create } from 'zustand';
import { 
  Sponsor, 
  SponsorshipTier, 
  SponsorDisplaySettings,
  SponsorContact,
  SponsorCommunication,
  SponsorDocument
} from '@/types/sponsors';
import { 
  fetchSponsors, 
  getAllSponsors, 
  fetchSponsorById, 
  createSponsor, 
  updateSponsor, 
  deleteSponsor,
  fetchSponsorshipTiers,
  createSponsorshipTier,
  updateSponsorshipTier,
  deleteSponsorshipTier,
  fetchSponsorDisplaySettings,
  updateSponsorDisplaySettings,
  fetchSponsorContacts,
  createSponsorContact,
  updateSponsorContact,
  deleteSponsorContact,
  fetchSponsorCommunications,
  createSponsorCommunication,
  deleteSponsorCommunication,
  fetchSponsorDocuments,
  createSponsorDocument,
  deleteSponsorDocument
} from './sponsorsDbService';
import { toast } from 'sonner';

export interface SponsorsStore {
  sponsors: Sponsor[];
  tiers: SponsorshipTier[];
  displaySettings: SponsorDisplaySettings | null;
  isLoading: boolean;
  error: string | null;
  loadSponsors: () => Promise<void>;
  loadTiers: () => Promise<void>;
  loadDisplaySettings: () => Promise<void>;
  getActiveSponsors: () => Promise<Sponsor[]>;
  getSponsorsByTier: () => Record<string, Sponsor[]>;
  updateDisplaySettings: (settings: Partial<SponsorDisplaySettings>) => Promise<void>;
  updateSponsorshipTier: (id: string, tierData: Partial<SponsorshipTier>) => Promise<void>;
  addSponsorshipTier: (tierData: Omit<SponsorshipTier, 'id'>) => Promise<void>;
}

export const useSponsorsStore = create<SponsorsStore>((set, get) => ({
  sponsors: [],
  tiers: [],
  displaySettings: null,
  isLoading: false,
  error: null,
  
  loadSponsors: async () => {
    try {
      set({ isLoading: true, error: null });
      const response = await fetchSponsors();
      if (response.success) {
        set({ sponsors: response.data });
      } else {
        set({ error: "Failed to load sponsors data" });
        toast.error("Failed to load sponsors");
      }
    } catch (error) {
      console.error("Error loading sponsors:", error);
      set({ error: "Error loading sponsors" });
      toast.error("Error loading sponsors");
    } finally {
      set({ isLoading: false });
    }
  },
  
  loadTiers: async () => {
    try {
      set({ isLoading: true, error: null });
      const response = await fetchSponsorshipTiers();
      if (response.success) {
        set({ tiers: response.data });
      } else {
        set({ error: "Failed to load sponsorship tiers" });
        toast.error("Failed to load sponsorship tiers");
      }
    } catch (error) {
      console.error("Error loading sponsorship tiers:", error);
      set({ error: "Error loading sponsorship tiers" });
      toast.error("Error loading sponsorship tiers");
    } finally {
      set({ isLoading: false });
    }
  },
  
  loadDisplaySettings: async () => {
    try {
      set({ isLoading: true, error: null });
      const response = await fetchSponsorDisplaySettings();
      if (response.success) {
        set({ displaySettings: response.data });
      } else {
        set({ error: "Failed to load display settings" });
        toast.error("Failed to load display settings");
      }
    } catch (error) {
      console.error("Error loading display settings:", error);
      set({ error: "Error loading display settings" });
      toast.error("Error loading display settings");
    } finally {
      set({ isLoading: false });
    }
  },
  
  getActiveSponsors: async () => {
    // Load sponsors if not already loaded
    if (get().sponsors.length === 0) {
      await get().loadSponsors();
    }
    
    // Filter for only active sponsors
    return get().sponsors.filter(sponsor => sponsor.is_active);
  },
  
  getSponsorsByTier: () => {
    const sponsors = get().sponsors;
    const tierGroups: Record<string, Sponsor[]> = {};
    
    sponsors.forEach(sponsor => {
      if (!tierGroups[sponsor.tier]) {
        tierGroups[sponsor.tier] = [];
      }
      tierGroups[sponsor.tier].push(sponsor);
    });
    
    return tierGroups;
  },
  
  updateDisplaySettings: async (settings: Partial<SponsorDisplaySettings>) => {
    try {
      if (!get().displaySettings?.id) {
        toast.error("Display settings not loaded");
        return;
      }
      
      const response = await updateSponsorDisplaySettings(get().displaySettings.id, settings);
      if (response.success) {
        set({ displaySettings: response.data });
        toast.success("Display settings updated");
      } else {
        toast.error("Failed to update display settings");
      }
    } catch (error) {
      console.error("Error updating display settings:", error);
      toast.error("Error updating display settings");
    }
  },
  
  updateSponsorshipTier: async (id: string, tierData: Partial<SponsorshipTier>) => {
    try {
      set({ isLoading: true, error: null });
      const response = await updateSponsorshipTier(id, tierData);
      if (response.success) {
        set(state => ({
          tiers: state.tiers.map(tier => 
            tier.id === id ? { ...tier, ...tierData } : tier
          )
        }));
        toast.success("Tier updated successfully");
      } else {
        set({ error: "Failed to update tier" });
        toast.error("Failed to update tier");
      }
    } catch (error) {
      console.error("Error updating tier:", error);
      set({ error: "Error updating tier" });
      toast.error("Error updating tier");
    } finally {
      set({ isLoading: false });
    }
  },
  
  addSponsorshipTier: async (tierData: Omit<SponsorshipTier, 'id'>) => {
    try {
      set({ isLoading: true, error: null });
      const response = await createSponsorshipTier(tierData);
      if (response.success) {
        set(state => ({
          tiers: [...state.tiers, response.data]
        }));
        toast.success("New tier created");
      } else {
        set({ error: "Failed to create tier" });
        toast.error("Failed to create tier");
      }
    } catch (error) {
      console.error("Error creating tier:", error);
      set({ error: "Error creating tier" });
      toast.error("Error creating tier");
    } finally {
      set({ isLoading: false });
    }
  },
}));

// Add this function to the existing sponsorsService.ts
export const getSponsorCategories = async () => {
  try {
    // Mock sponsor categories
    const categories = [
      { id: '1', name: 'Match Day Sponsor' },
      { id: '2', name: 'Kit Sponsor' },
      { id: '3', name: 'Stand Sponsor' },
      { id: '4', name: 'Youth Development Sponsor' }
    ];

    return { success: true, data: categories, error: null };
  } catch (error) {
    console.error('Error fetching sponsor categories:', error);
    return { success: false, data: [], error: 'Failed to fetch sponsor categories' };
  }
};

// Re-export the required function to avoid import issues
export { getAllSponsors as getSponsors } from './sponsorsDbService';

// Re-export functions from sponsorsDbService for easier access
export {
  fetchSponsorById, 
  createSponsor, 
  updateSponsor, 
  deleteSponsor,
  fetchSponsorshipTiers,
  createSponsorshipTier,
  updateSponsorshipTier,
  deleteSponsorshipTier,
  fetchSponsorDisplaySettings,
  updateSponsorDisplaySettings,
  fetchSponsorContacts,
  createSponsorContact,
  updateSponsorContact,
  deleteSponsorContact,
  fetchSponsorCommunications,
  createSponsorCommunication,
  deleteSponsorCommunication,
  fetchSponsorDocuments,
  createSponsorDocument,
  deleteSponsorDocument
};

// For backward compatibility 
export const useSponsorStore = useSponsorsStore;
