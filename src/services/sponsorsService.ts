
import { create } from 'zustand';

export interface Sponsor {
  id: number;
  name: string;
  logoUrl: string;
  website?: string;
  tier?: 'platinum' | 'gold' | 'silver' | 'bronze';
  description?: string;
}

interface SponsorsState {
  sponsors: Sponsor[];
  isLoading: boolean;
  error: string | null;
  fetchSponsors: () => Promise<void>;
  addSponsor: (sponsor: Sponsor) => void;
  updateSponsor: (sponsor: Sponsor) => void;
  deleteSponsor: (id: number) => void;
}

export const useSponsorsStore = create<SponsorsState>((set) => ({
  sponsors: [
    {
      id: 1,
      name: 'McIntosh Plant Hire',
      logoUrl: '/lovable-uploads/sponsors/mcintosh.png',
      website: 'https://www.mcintoshplanthire.co.uk/',
      tier: 'gold'
    },
    {
      id: 2,
      name: 'Texo Group',
      logoUrl: '/lovable-uploads/sponsors/texo.png',
      website: 'https://www.texo.co.uk/',
      tier: 'gold'
    },
    {
      id: 3,
      name: 'Saltire Energy',
      logoUrl: '/lovable-uploads/sponsors/saltire.png',
      website: 'https://www.saltire.com/',
      tier: 'silver'
    },
    {
      id: 4,
      name: 'Anderson Construction',
      logoUrl: '/lovable-uploads/sponsors/anderson.png',
      website: 'https://www.andersonconstruction.co.uk/',
      tier: 'silver'
    },
    {
      id: 5,
      name: 'STATS Group',
      logoUrl: '/lovable-uploads/sponsors/stats.png',
      website: 'https://www.statsgroup.com/',
      tier: 'bronze'
    }
  ],
  isLoading: false,
  error: null,
  fetchSponsors: async () => {
    // This is a placeholder for when we eventually fetch sponsors from an API
    set({ isLoading: true, error: null });
    
    try {
      // In the future, this will be replaced with an actual API call
      // For now, we'll just simulate a delay
      await new Promise(resolve => setTimeout(resolve, 500));
      
      // The data is already set in the initial state, so we don't need to update it
      set({ isLoading: false });
    } catch (error) {
      console.error('Error fetching sponsors:', error);
      set({ 
        error: error instanceof Error ? error.message : 'An unknown error occurred', 
        isLoading: false 
      });
    }
  },
  addSponsor: (sponsor: Sponsor) => {
    set((state) => ({
      sponsors: [...state.sponsors, sponsor]
    }));
  },
  updateSponsor: (updatedSponsor: Sponsor) => {
    set((state) => ({
      sponsors: state.sponsors.map(sponsor => 
        sponsor.id === updatedSponsor.id ? updatedSponsor : sponsor
      )
    }));
  },
  deleteSponsor: (id: number) => {
    set((state) => ({
      sponsors: state.sponsors.filter(sponsor => sponsor.id !== id)
    }));
  }
}));
