
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

// Mock sponsors data
const initialSponsors: Sponsor[] = [
  {
    id: 1,
    name: "Aberdeen Energy Partners",
    logoUrl: "/lovable-uploads/9cecca5c-daf2-4f52-a6ca-06e02ca9ea44.png",
    website: "https://example.com/aep",
    tier: "platinum",
    description: "Leading energy company supporting local sports and community initiatives."
  },
  {
    id: 2,
    name: "Highland Construction",
    logoUrl: "/lovable-uploads/9cecca5c-daf2-4f52-a6ca-06e02ca9ea44.png",
    website: "https://example.com/highland",
    tier: "gold",
    description: "Building the future of Aberdeen while supporting local clubs."
  },
  {
    id: 3,
    name: "North Sea Solutions",
    logoUrl: "/lovable-uploads/9cecca5c-daf2-4f52-a6ca-06e02ca9ea44.png",
    website: "https://example.com/nss",
    tier: "gold",
    description: "Offshore engineering firm with strong community values."
  },
  {
    id: 4,
    name: "Aberdeen Motors",
    logoUrl: "/lovable-uploads/9cecca5c-daf2-4f52-a6ca-06e02ca9ea44.png",
    website: "https://example.com/motors",
    tier: "silver",
    description: "Your local automotive dealership serving the community for over 20 years."
  },
  {
    id: 5,
    name: "Dee Valley Brewery",
    logoUrl: "/lovable-uploads/9cecca5c-daf2-4f52-a6ca-06e02ca9ea44.png",
    website: "https://example.com/brewery",
    tier: "silver",
    description: "Craft beers from the heart of Aberdeenshire."
  },
  {
    id: 6,
    name: "Granite City Catering",
    logoUrl: "/lovable-uploads/9cecca5c-daf2-4f52-a6ca-06e02ca9ea44.png",
    website: "https://example.com/catering",
    tier: "bronze",
    description: "Providing food services for all club events and functions."
  },
  {
    id: 7,
    name: "Aberdeen Tech Solutions",
    logoUrl: "/lovable-uploads/9cecca5c-daf2-4f52-a6ca-06e02ca9ea44.png",
    website: "https://example.com/tech",
    tier: "bronze",
    description: "Local IT support and digital solutions for businesses."
  },
  {
    id: 8,
    name: "Highland Sports Equipment",
    logoUrl: "/lovable-uploads/9cecca5c-daf2-4f52-a6ca-06e02ca9ea44.png",
    website: "https://example.com/sports",
    tier: "bronze",
    description: "Quality sporting equipment for teams and individuals."
  }
];

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
