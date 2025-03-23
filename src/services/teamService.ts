
import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { PlayerPosition } from '@/components/player/PlayerCardDialog';

export interface Player {
  id: number;
  name: string;
  number: number;
  position: PlayerPosition;
  height: string;
  weight: string;
  age: number;
  nationality: string;
  previousClubs: string[];
  image: string;
  stats: {
    appearances: number;
    goals: number;
    assists: number;
    cleanSheets?: number;
    tackles?: number;
    yellowCards: number;
    redCards: number;
  };
  bio: string;
}

export interface StaffMember {
  id: number;
  name: string;
  role: string;
  image: string;
  bio: string;
  experience: string;
}

export interface ClubOfficial {
  id: number;
  name: string;
  role: string;
  image: string;
}

export interface TeamMember {
  id: number;
  name: string;
  image: string;
  position?: PlayerPosition;
  role?: string;
  type: 'player' | 'staff' | 'official';
  // Additional fields for players
  number?: number;
  height?: string;
  weight?: string;
  age?: number;
  nationality?: string;
  previousClubs?: string[];
  stats?: {
    appearances: number;
    goals: number;
    assists: number;
    cleanSheets?: number;
    tackles?: number;
    yellowCards: number;
    redCards: number;
  };
  bio?: string;
  // Additional fields for staff
  experience?: string;
}

// Initial data for players
const initialPlayers: Player[] = [
  {
    id: 1,
    name: "Daniel Armstrong",
    number: 1,
    position: "goalkeeper",
    height: "6'2\"",
    weight: "85kg",
    age: 28,
    nationality: "Scotland",
    previousClubs: ["Aberdeen FC Youth", "Inverurie Locos"],
    image: "/lovable-uploads/b937e144-e94f-4e75-881f-1e560c6b520a.png",
    stats: {
      appearances: 34,
      goals: 0,
      assists: 2,
      cleanSheets: 15,
      yellowCards: 1,
      redCards: 0
    },
    bio: "An experienced shot-stopper who has been with Banks o' Dee since 2019. Known for his exceptional reflexes and commanding presence in the box."
  },
  // ... Add more players here
];

// Initial data for staff
const initialStaff: StaffMember[] = [
  {
    id: 101,
    name: "Josh Winton",
    role: "Manager",
    image: "/lovable-uploads/73ac703f-7365-4abb-811e-159280ad234b.png",
    bio: "Former professional player who joined Banks o' Dee as manager in 2020. Has led the team to multiple cup successes and improved league positions each season.",
    experience: "10+ years in coaching, UEFA Pro License"
  },
  {
    id: 102,
    name: "Emma Robertson",
    role: "Assistant Manager",
    image: "/lovable-uploads/73ac703f-7365-4abb-811e-159280ad234b.png",
    bio: "Former Scottish international who brings vast experience to the coaching team. Focuses on attacking strategy and player development.",
    experience: "15 years professional playing career, UEFA A License"
  },
  {
    id: 103,
    name: "Craig Peterson",
    role: "Goalkeeping Coach",
    image: "/lovable-uploads/73ac703f-7365-4abb-811e-159280ad234b.png",
    bio: "Specialized in goalkeeper development with experience at youth and senior levels. Has improved the team's defensive record significantly.",
    experience: "Former professional goalkeeper, SFA Advanced Goalkeeping License"
  },
  {
    id: 104,
    name: "Dr. Sarah Mitchell",
    role: "Team Physician",
    image: "/lovable-uploads/73ac703f-7365-4abb-811e-159280ad234b.png",
    bio: "Sports medicine specialist who ensures players receive the best medical care and rehabilitation support.",
    experience: "MD with specialization in Sports Medicine, 12 years experience"
  }
];

// Initial data for club officials
const initialOfficials: ClubOfficial[] = [
  {
    id: 201,
    name: "Brian Winton",
    role: "Club President",
    image: "/lovable-uploads/73ac703f-7365-4abb-811e-159280ad234b.png"
  },
  {
    id: 202,
    name: "Margaret Davidson",
    role: "Club Secretary",
    image: "/lovable-uploads/73ac703f-7365-4abb-811e-159280ad234b.png"
  },
  {
    id: 203,
    name: "Robert MacKenzie",
    role: "Treasurer",
    image: "/lovable-uploads/73ac703f-7365-4abb-811e-159280ad234b.png"
  },
  {
    id: 204,
    name: "Ian Stewart",
    role: "Director of Football",
    image: "/lovable-uploads/73ac703f-7365-4abb-811e-159280ad234b.png"
  },
  {
    id: 205,
    name: "Jennifer Thomson",
    role: "Commercial Director",
    image: "/lovable-uploads/73ac703f-7365-4abb-811e-159280ad234b.png"
  },
  {
    id: 206,
    name: "David Anderson",
    role: "Facilities Manager",
    image: "/lovable-uploads/73ac703f-7365-4abb-811e-159280ad234b.png"
  }
];

// Define the team store
interface TeamStore {
  players: Player[];
  staff: StaffMember[];
  officials: ClubOfficial[];
  addPlayer: (player: Omit<Player, 'id'>) => void;
  updatePlayer: (player: Player) => void;
  deletePlayer: (id: number) => void;
  addStaffMember: (staffMember: Omit<StaffMember, 'id'>) => void;
  updateStaffMember: (staffMember: StaffMember) => void;
  deleteStaffMember: (id: number) => void;
  addOfficial: (official: Omit<ClubOfficial, 'id'>) => void;
  updateOfficial: (official: ClubOfficial) => void;
  deleteOfficial: (id: number) => void;
}

// Create Zustand store
export const useTeamStore = create<TeamStore>()(
  persist(
    (set) => ({
      players: initialPlayers,
      staff: initialStaff,
      officials: initialOfficials,
      
      addPlayer: (player) => set((state) => {
        const newId = Math.max(0, ...state.players.map(p => p.id)) + 1;
        return { players: [...state.players, { ...player, id: newId }] };
      }),
      
      updatePlayer: (player) => set((state) => ({
        players: state.players.map(p => p.id === player.id ? player : p)
      })),
      
      deletePlayer: (id) => set((state) => ({
        players: state.players.filter(p => p.id !== id)
      })),
      
      addStaffMember: (staffMember) => set((state) => {
        const newId = Math.max(0, ...state.staff.map(s => s.id)) + 1;
        return { staff: [...state.staff, { ...staffMember, id: newId }] };
      }),
      
      updateStaffMember: (staffMember) => set((state) => ({
        staff: state.staff.map(s => s.id === staffMember.id ? staffMember : s)
      })),
      
      deleteStaffMember: (id) => set((state) => ({
        staff: state.staff.filter(s => s.id !== id)
      })),
      
      addOfficial: (official) => set((state) => {
        const newId = Math.max(0, ...state.officials.map(o => o.id)) + 1;
        return { officials: [...state.officials, { ...official, id: newId }] };
      }),
      
      updateOfficial: (official) => set((state) => ({
        officials: state.officials.map(o => o.id === official.id ? official : o)
      })),
      
      deleteOfficial: (id) => set((state) => ({
        officials: state.officials.filter(o => o.id !== id)
      })),
    }),
    {
      name: 'banks-o-dee-team-storage'
    }
  )
);
