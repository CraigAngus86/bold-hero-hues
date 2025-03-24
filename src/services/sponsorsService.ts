
import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface Sponsor {
  id: number;
  name: string;
  logoUrl: string;
  website?: string;
  tier?: 'platinum' | 'gold' | 'silver' | 'bronze';
  description?: string;
}

// Initial sponsors data (empty array)
const initialSponsors: Sponsor[] = [];

interface SponsorsStore {
  sponsors: Sponsor[];
  addSponsor: (sponsor: Sponsor) => void;
  updateSponsor: (sponsor: Sponsor) => void;
  deleteSponsor: (id: number) => void;
  clearAllSponsors: () => void;
}

export const useSponsorsStore = create<SponsorsStore>()(
  persist(
    (set) => ({
      sponsors: initialSponsors,
      
      addSponsor: (sponsor) => {
        set((state) => ({
          sponsors: [...state.sponsors, sponsor]
        }));
      },
      
      updateSponsor: (sponsor) => {
        set((state) => ({
          sponsors: state.sponsors.map((s) => 
            s.id === sponsor.id ? sponsor : s
          )
        }));
      },
      
      deleteSponsor: (id) => {
        set((state) => ({
          sponsors: state.sponsors.filter((s) => s.id !== id)
        }));
      },
      
      clearAllSponsors: () => set({ sponsors: [] })
    }),
    {
      name: 'sponsors-storage'
    }
  )
);
