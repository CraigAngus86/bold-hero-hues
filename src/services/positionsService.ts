
import { create } from 'zustand';
import { supabase } from '@/services/supabase/supabaseClient';
import { toast } from 'sonner';

export type PositionCategory = 'player' | 'management' | 'official';

export interface PositionItem {
  id: string;
  name: string;
  category: PositionCategory;
}

interface PositionsState {
  positions: PositionItem[];
  isLoading: boolean;
  getPositionsByCategory: (category: PositionCategory) => PositionItem[];
  loadPositions: () => Promise<void>;
  addPosition: (position: Omit<PositionItem, 'id'>) => Promise<void>;
  updatePosition: (id: string, position: Partial<PositionItem>) => Promise<void>;
  deletePosition: (id: string) => Promise<void>;
  savePositions: (positions: PositionItem[]) => Promise<void>;
}

export const usePositionsStore = create<PositionsState>((set, get) => ({
  positions: [],
  isLoading: false,

  getPositionsByCategory: (category) => {
    return get().positions.filter(position => position.category === category);
  },

  loadPositions: async () => {
    try {
      set({ isLoading: true });
      
      // For now, using local storage as a temporary solution
      // This would be replaced with actual database integration
      const storedPositions = localStorage.getItem('team_positions');
      
      if (storedPositions) {
        set({ positions: JSON.parse(storedPositions) });
      } else {
        // Default positions if none are stored
        const defaultPositions: PositionItem[] = [
          // Player positions
          { id: '1', name: 'Goalkeeper', category: 'player' },
          { id: '2', name: 'Right Back', category: 'player' },
          { id: '3', name: 'Left Back', category: 'player' },
          { id: '4', name: 'Center Back', category: 'player' },
          { id: '5', name: 'Defensive Midfielder', category: 'player' },
          { id: '6', name: 'Central Midfielder', category: 'player' },
          { id: '7', name: 'Attacking Midfielder', category: 'player' },
          { id: '8', name: 'Right Winger', category: 'player' },
          { id: '9', name: 'Left Winger', category: 'player' },
          { id: '10', name: 'Striker', category: 'player' },
          { id: '11', name: 'Forward', category: 'player' },
          
          // Management positions
          { id: '12', name: 'Head Coach', category: 'management' },
          { id: '13', name: 'Assistant Coach', category: 'management' },
          { id: '14', name: 'Goalkeeping Coach', category: 'management' },
          { id: '15', name: 'Fitness Coach', category: 'management' },
          { id: '16', name: 'Performance Analyst', category: 'management' },
          { id: '17', name: 'Youth Team Coach', category: 'management' },
          
          // Official positions
          { id: '18', name: 'Chairman', category: 'official' },
          { id: '19', name: 'President', category: 'official' },
          { id: '20', name: 'Director', category: 'official' },
          { id: '21', name: 'Secretary', category: 'official' },
          { id: '22', name: 'Commercial Director', category: 'official' },
          { id: '23', name: 'Club Doctor', category: 'official' },
          { id: '24', name: 'Physiotherapist', category: 'official' },
        ];
        
        set({ positions: defaultPositions });
        localStorage.setItem('team_positions', JSON.stringify(defaultPositions));
      }
    } catch (error) {
      console.error("Error loading positions:", error);
      toast.error("Failed to load positions");
    } finally {
      set({ isLoading: false });
    }
  },

  addPosition: async (position) => {
    try {
      set({ isLoading: true });
      
      const newPosition = {
        ...position,
        id: crypto.randomUUID()
      };
      
      set(state => ({
        positions: [...state.positions, newPosition]
      }));
      
      // Update local storage
      localStorage.setItem('team_positions', JSON.stringify(get().positions));
      
      toast.success(`Added ${position.name} position`);
    } catch (error) {
      console.error("Error adding position:", error);
      toast.error("Failed to add position");
    } finally {
      set({ isLoading: false });
    }
  },

  updatePosition: async (id, position) => {
    try {
      set({ isLoading: true });
      
      set(state => ({
        positions: state.positions.map(p => 
          p.id === id ? { ...p, ...position } : p
        )
      }));
      
      // Update local storage
      localStorage.setItem('team_positions', JSON.stringify(get().positions));
      
      toast.success("Position updated");
    } catch (error) {
      console.error("Error updating position:", error);
      toast.error("Failed to update position");
    } finally {
      set({ isLoading: false });
    }
  },

  deletePosition: async (id) => {
    try {
      set({ isLoading: true });
      
      set(state => ({
        positions: state.positions.filter(p => p.id !== id)
      }));
      
      // Update local storage
      localStorage.setItem('team_positions', JSON.stringify(get().positions));
      
      toast.success("Position deleted");
    } catch (error) {
      console.error("Error deleting position:", error);
      toast.error("Failed to delete position");
    } finally {
      set({ isLoading: false });
    }
  },
  
  savePositions: async (positions) => {
    try {
      set({ isLoading: true });
      set({ positions });
      
      // Update local storage
      localStorage.setItem('team_positions', JSON.stringify(positions));
      toast.success("Positions saved successfully");
    } catch (error) {
      console.error("Error saving positions:", error);
      toast.error("Failed to save positions");
    } finally {
      set({ isLoading: false });
    }
  },
}));
