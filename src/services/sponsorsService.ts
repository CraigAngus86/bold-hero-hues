
import { create } from 'zustand';
import { Sponsor } from '@/types/sponsors';
import { fetchSponsors, getAllSponsors, fetchSponsorById, createSponsor, updateSponsor, deleteSponsor } from './sponsorsDbService';
import { toast } from 'sonner';

export interface SponsorsStore {
  sponsors: Sponsor[];
  isLoading: boolean;
  error: string | null;
  loadSponsors: () => Promise<void>;
  getActiveSponsors: () => Promise<Sponsor[]>;
}

export const useSponsorsStore = create<SponsorsStore>((set, get) => ({
  sponsors: [],
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
  
  getActiveSponsors: async () => {
    // Load sponsors if not already loaded
    if (get().sponsors.length === 0) {
      await get().loadSponsors();
    }
    
    // Filter for only active sponsors
    return get().sponsors.filter(sponsor => sponsor.is_active);
  },
}));

// Re-export functions from sponsorsDbService for easier access
export { getAllSponsors, fetchSponsorById, createSponsor, updateSponsor, deleteSponsor } from './sponsorsDbService';

// For backward compatibility 
export const useSponsorStore = useSponsorsStore;
