
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

// Initial sponsors data
const initialSponsors: Sponsor[] = [
  { id: 1, name: "Cala Group", logoUrl: "https://placehold.co/300x100/team-lightBlue/white?text=Cala+Group", tier: "platinum" },
  { id: 2, name: "Aberdeen Drilling School", logoUrl: "https://placehold.co/300x100/team-white/team-blue?text=Aberdeen+Drilling+School", tier: "gold" },
  { id: 3, name: "EnerMech", logoUrl: "https://placehold.co/300x100/team-lightBlue/white?text=EnerMech", tier: "gold" },
  { id: 4, name: "Scott Electrical", logoUrl: "https://placehold.co/300x100/team-white/team-blue?text=Scott+Electrical", tier: "silver" },
  { id: 5, name: "ADS Energy", logoUrl: "https://placehold.co/300x100/team-lightBlue/white?text=ADS+Energy", tier: "silver" },
  { id: 6, name: "SureVoIP", logoUrl: "https://placehold.co/300x100/team-white/team-blue?text=SureVoIP", tier: "bronze" },
  { id: 7, name: "TechSolutions", logoUrl: "https://placehold.co/300x100/team-lightBlue/white?text=TechSolutions", tier: "bronze" },
  { id: 8, name: "North Sea Services", logoUrl: "https://placehold.co/300x100/team-white/team-blue?text=North+Sea+Services", tier: "bronze" },
  { id: 9, name: "Aberdeen Digital", logoUrl: "https://placehold.co/300x100/team-lightBlue/white?text=Aberdeen+Digital", tier: "bronze" },
  { id: 10, name: "Highland Engineering", logoUrl: "https://placehold.co/300x100/team-white/team-blue?text=Highland+Engineering", tier: "bronze" },
];

interface SponsorsStore {
  sponsors: Sponsor[];
  addSponsor: (sponsor: Sponsor) => void;
  updateSponsor: (sponsor: Sponsor) => void;
  deleteSponsor: (id: number) => void;
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
    }),
    {
      name: 'sponsors-storage'
    }
  )
);
