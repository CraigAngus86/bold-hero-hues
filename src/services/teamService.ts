
import { create } from 'zustand';

// Types
interface Player {
  id: number;
  name: string;
  position: string;
  imageUrl: string;
  number: number;
  nationality: string;
  height?: string;
  dateOfBirth?: string;
  previousClubs?: string[];
  bio?: string;
}

interface StaffMember {
  id: number;
  name: string;
  role: string;
  imageUrl: string;
  bio?: string;
}

interface TeamState {
  players: Player[];
  staff: StaffMember[];
  isLoading: boolean;
  error: string | null;
  getPlayersByPosition: (position: string) => Player[];
  fetchTeamData: () => Promise<void>;
}

// Sample team data
const players: Player[] = [
  {
    id: 1,
    name: 'Lee Sweeney',
    position: 'Goalkeeper',
    imageUrl: '/lovable-uploads/players/goalkeeper1.jpg',
    number: 1,
    nationality: 'Scottish',
    height: '6\'2"',
    dateOfBirth: '1992-05-15'
  },
  {
    id: 2,
    name: 'Daniel Hoban',
    position: 'Goalkeeper',
    imageUrl: '/lovable-uploads/players/goalkeeper2.jpg',
    number: 13,
    nationality: 'Scottish',
    height: '6\'1"'
  },
  {
    id: 3,
    name: 'Jevan Anderson',
    position: 'Defender',
    imageUrl: '/lovable-uploads/players/defender1.jpg',
    number: 2,
    nationality: 'Scottish',
    previousClubs: ['Burton Albion', 'Formartine United']
  },
  {
    id: 4,
    name: 'Dayle Robertson',
    position: 'Forward',
    imageUrl: '/lovable-uploads/players/forward1.jpg',
    number: 9,
    nationality: 'Scottish',
    previousClubs: ['St. Johnstone']
  },
  {
    id: 5,
    name: 'Kane Winton',
    position: 'Midfielder',
    imageUrl: '/lovable-uploads/players/midfielder1.jpg',
    number: 8,
    nationality: 'Scottish'
  },
  {
    id: 6,
    name: 'Mark Gilmour',
    position: 'Midfielder',
    imageUrl: '/lovable-uploads/players/midfielder2.jpg',
    number: 6,
    nationality: 'Scottish'
  },
  {
    id: 7,
    name: 'Michael Philipson',
    position: 'Defender',
    imageUrl: '/lovable-uploads/players/defender2.jpg',
    number: 4,
    nationality: 'Scottish'
  }
];

const staff: StaffMember[] = [
  {
    id: 1,
    name: 'Josh Winton',
    role: 'Manager',
    imageUrl: '/lovable-uploads/staff/manager.jpg',
    bio: 'Former club captain who took over as manager in 2023.'
  },
  {
    id: 2,
    name: 'Paul Lawson',
    role: 'Assistant Manager',
    imageUrl: '/lovable-uploads/staff/assistant.jpg',
    bio: 'Former professional with Aberdeen and Ross County.'
  }
];

// Create the store
export const useTeamStore = create<TeamState>((set, get) => ({
  players,
  staff,
  isLoading: false,
  error: null,
  
  getPlayersByPosition: (position: string) => {
    const { players } = get();
    if (position === 'All') {
      return players;
    }
    return players.filter(player => player.position === position);
  },
  
  fetchTeamData: async () => {
    // This is a placeholder for when we eventually fetch team data from an API
    set({ isLoading: true, error: null });
    
    try {
      // In the future, this will be replaced with an actual API call
      // For now, we'll just simulate a delay
      await new Promise(resolve => setTimeout(resolve, 500));
      
      // The data is already set in the initial state, so we don't need to update it
      // When we implement the API, we would do something like:
      // set({ players: playerData, staff: staffData, isLoading: false });
      
      set({ isLoading: false });
    } catch (error) {
      console.error('Error fetching team data:', error);
      set({ 
        error: error instanceof Error ? error.message : 'An unknown error occurred', 
        isLoading: false 
      });
    }
  }
}));
