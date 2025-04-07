import { create } from 'zustand';
import { supabase } from '@/services/supabase/supabaseClient';
import { toast } from 'sonner';
import { Squad, PlayerSquad, FormationTemplate, PlayerStatistics } from '@/types/squad';
import { TeamMember } from '@/types/team';
import { useTeamStore } from './teamService';
import { MemberType } from '@/types/team';
import { getAllTeamMembers } from '@/services/teamDbService';

interface SquadState {
  squads: Squad[];
  playerSquads: PlayerSquad[];
  formationTemplates: FormationTemplate[];
  playerStatistics: PlayerStatistics[];
  isLoading: boolean;
  
  // Squad operations
  loadSquads: () => Promise<void>;
  addSquad: (squad: Omit<Squad, 'id'>) => Promise<Squad | null>;
  updateSquad: (id: string, updates: Partial<Squad>) => Promise<void>;
  deleteSquad: (id: string) => Promise<void>;
  
  // Player squad assignments
  assignPlayerToSquad: (playerId: string, squadId: string, order?: number) => Promise<void>;
  removePlayerFromSquad: (playerId: string, squadId: string) => Promise<void>;
  updatePlayerOrder: (playerId: string, squadId: string, order: number) => Promise<void>;
  getPlayersInSquad: (squadId: string) => TeamMember[];
  getSquadsByPlayer: (playerId: string) => Squad[];
  
  // Formation templates
  loadFormationTemplates: () => Promise<void>;
  saveFormationTemplate: (template: Omit<FormationTemplate, 'id'>) => Promise<FormationTemplate | null>;
  deleteFormationTemplate: (id: string) => Promise<void>;
  
  // Player statistics
  loadPlayerStatistics: () => Promise<void>;
  updatePlayerStatistics: (playerId: string, season: string, stats: Partial<PlayerStatistics>) => Promise<void>;
  getPlayerStatsByPlayerId: (playerId: string) => PlayerStatistics[];
  getPlayerStatsBySeason: (season: string) => PlayerStatistics[];
  bulkUpdateStatistics: (stats: Partial<PlayerStatistics>[]) => Promise<void>;
}

export const useSquadStore = create<SquadState>((set, get) => ({
  squads: [
    { id: '1', name: 'First Team', description: 'Main squad' },
    { id: '2', name: 'Reserves', description: 'Reserve squad' },
    { id: '3', name: 'Under 21s', description: 'Development squad' }
  ],
  playerSquads: [],
  formationTemplates: [
    {
      id: '1',
      name: '4-4-2',
      formation: '4-4-2',
      positions: [
        { id: '1', x: 50, y: 90, position: 'Goalkeeper' },
        { id: '2', x: 20, y: 70, position: 'Right Back' },
        { id: '3', x: 40, y: 70, position: 'Center Back' },
        { id: '4', x: 60, y: 70, position: 'Center Back' },
        { id: '5', x: 80, y: 70, position: 'Left Back' },
        { id: '6', x: 20, y: 50, position: 'Right Midfielder' },
        { id: '7', x: 40, y: 50, position: 'Central Midfielder' },
        { id: '8', x: 60, y: 50, position: 'Central Midfielder' },
        { id: '9', x: 80, y: 50, position: 'Left Midfielder' },
        { id: '10', x: 40, y: 30, position: 'Striker' },
        { id: '11', x: 60, y: 30, position: 'Striker' },
      ]
    },
    {
      id: '2',
      name: '4-3-3',
      formation: '4-3-3',
      positions: [
        { id: '1', x: 50, y: 90, position: 'Goalkeeper' },
        { id: '2', x: 20, y: 70, position: 'Right Back' },
        { id: '3', x: 40, y: 70, position: 'Center Back' },
        { id: '4', x: 60, y: 70, position: 'Center Back' },
        { id: '5', x: 80, y: 70, position: 'Left Back' },
        { id: '6', x: 30, y: 50, position: 'Defensive Midfielder' },
        { id: '7', x: 50, y: 50, position: 'Central Midfielder' },
        { id: '8', x: 70, y: 50, position: 'Central Midfielder' },
        { id: '9', x: 20, y: 30, position: 'Right Winger' },
        { id: '10', x: 50, y: 30, position: 'Striker' },
        { id: '11', x: 80, y: 30, position: 'Left Winger' },
      ]
    }
  ],
  playerStatistics: [],
  isLoading: false,
  
  loadSquads: async () => {
    try {
      set({ isLoading: true });
      // In a real implementation, we'd fetch from Supabase
      // const { data, error } = await supabase.from('squads').select('*');
      // if (error) throw error;
      // set({ squads: data || [] });
      
      // Also load player squad assignments
      // const { data: playerSquadData, error: playerSquadError } = await supabase.from('player_squads').select('*');
      // if (playerSquadError) throw playerSquadError;
      // set({ playerSquads: playerSquadData || [] });
      
    } catch (error) {
      console.error("Error loading squads:", error);
      toast.error("Failed to load team squads");
    } finally {
      set({ isLoading: false });
    }
  },
  
  addSquad: async (squad) => {
    try {
      set({ isLoading: true });
      // In a real implementation, we'd insert into Supabase
      // const { data, error } = await supabase.from('squads').insert(squad).select().single();
      // if (error) throw error;
      
      const newSquad = {
        ...squad,
        id: Math.random().toString(36).substring(2, 9),
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      };
      
      set(state => ({
        squads: [...state.squads, newSquad as Squad]
      }));
      
      toast.success("Squad added successfully");
      return newSquad as Squad;
    } catch (error) {
      console.error("Error adding squad:", error);
      toast.error("Failed to add squad");
      return null;
    } finally {
      set({ isLoading: false });
    }
  },
  
  updateSquad: async (id, updates) => {
    try {
      set({ isLoading: true });
      // In a real implementation, we'd update in Supabase
      // const { error } = await supabase.from('squads').update(updates).eq('id', id);
      // if (error) throw error;
      
      set(state => ({
        squads: state.squads.map(squad => 
          squad.id === id ? { ...squad, ...updates, updated_at: new Date().toISOString() } : squad
        )
      }));
      
      toast.success("Squad updated successfully");
    } catch (error) {
      console.error("Error updating squad:", error);
      toast.error("Failed to update squad");
    } finally {
      set({ isLoading: false });
    }
  },
  
  deleteSquad: async (id) => {
    try {
      set({ isLoading: true });
      // In a real implementation, we'd delete from Supabase
      // const { error } = await supabase.from('squads').delete().eq('id', id);
      // if (error) throw error;
      
      set(state => ({
        squads: state.squads.filter(squad => squad.id !== id),
        playerSquads: state.playerSquads.filter(ps => ps.squad_id !== id)
      }));
      
      toast.success("Squad deleted successfully");
    } catch (error) {
      console.error("Error deleting squad:", error);
      toast.error("Failed to delete squad");
    } finally {
      set({ isLoading: false });
    }
  },
  
  assignPlayerToSquad: async (playerId, squadId, order) => {
    try {
      set({ isLoading: true });
      // In a real implementation, we'd insert into Supabase
      // const { error } = await supabase.from('player_squads').insert({ player_id: playerId, squad_id: squadId, order });
      // if (error) throw error;
      
      // First, remove existing assignment if it exists
      const existing = get().playerSquads.find(ps => ps.player_id === playerId && ps.squad_id === squadId);
      let updatedPlayerSquads = get().playerSquads.filter(ps => !(ps.player_id === playerId && ps.squad_id === squadId));
      
      // Then add the new assignment
      updatedPlayerSquads.push({
        player_id: playerId,
        squad_id: squadId,
        order: order || updatedPlayerSquads.filter(ps => ps.squad_id === squadId).length + 1,
        created_at: existing?.created_at || new Date().toISOString(),
        updated_at: new Date().toISOString()
      });
      
      set({ playerSquads: updatedPlayerSquads });
      
      toast.success("Player added to squad");
    } catch (error) {
      console.error("Error assigning player to squad:", error);
      toast.error("Failed to add player to squad");
    } finally {
      set({ isLoading: false });
    }
  },
  
  removePlayerFromSquad: async (playerId, squadId) => {
    try {
      set({ isLoading: true });
      // In a real implementation, we'd delete from Supabase
      // const { error } = await supabase.from('player_squads').delete().eq('player_id', playerId).eq('squad_id', squadId);
      // if (error) throw error;
      
      set(state => ({
        playerSquads: state.playerSquads.filter(ps => !(ps.player_id === playerId && ps.squad_id === squadId))
      }));
      
      toast.success("Player removed from squad");
    } catch (error) {
      console.error("Error removing player from squad:", error);
      toast.error("Failed to remove player from squad");
    } finally {
      set({ isLoading: false });
    }
  },
  
  updatePlayerOrder: async (playerId, squadId, order) => {
    try {
      set({ isLoading: true });
      // In a real implementation, we'd update in Supabase
      // const { error } = await supabase.from('player_squads').update({ order }).eq('player_id', playerId).eq('squad_id', squadId);
      // if (error) throw error;
      
      set(state => ({
        playerSquads: state.playerSquads.map(ps => 
          ps.player_id === playerId && ps.squad_id === squadId
            ? { ...ps, order, updated_at: new Date().toISOString() }
            : ps
        )
      }));
    } catch (error) {
      console.error("Error updating player order:", error);
      toast.error("Failed to update player order");
    } finally {
      set({ isLoading: false });
    }
  },
  
  getPlayersInSquad: (squadId) => {
    const { playerSquads } = get();
    const { teamMembers } = useTeamStore.getState();
    
    const playerIds = playerSquads
      .filter(ps => ps.squad_id === squadId)
      .sort((a, b) => (a.order || 0) - (b.order || 0))
      .map(ps => ps.player_id);
    
    return playerIds
      .map(id => teamMembers.find(player => player.id === id))
      .filter(player => player !== undefined) as TeamMember[];
  },
  
  getSquadsByPlayer: (playerId) => {
    const { playerSquads, squads } = get();
    
    const squadIds = playerSquads
      .filter(ps => ps.player_id === playerId)
      .map(ps => ps.squad_id);
    
    return squadIds
      .map(id => squads.find(squad => squad.id === id))
      .filter(squad => squad !== undefined) as Squad[];
  },
  
  loadFormationTemplates: async () => {
    try {
      set({ isLoading: true });
      // In a real implementation, we'd fetch from Supabase
      // const { data, error } = await supabase.from('formation_templates').select('*');
      // if (error) throw error;
      // set({ formationTemplates: data || [] });
    } catch (error) {
      console.error("Error loading formation templates:", error);
      toast.error("Failed to load formation templates");
    } finally {
      set({ isLoading: false });
    }
  },
  
  saveFormationTemplate: async (template) => {
    try {
      set({ isLoading: true });
      // In a real implementation, we'd insert into Supabase
      // const { data, error } = await supabase.from('formation_templates').insert(template).select().single();
      // if (error) throw error;
      
      const newTemplate = {
        ...template,
        id: Math.random().toString(36).substring(2, 9),
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      };
      
      set(state => ({
        formationTemplates: [...state.formationTemplates, newTemplate as FormationTemplate]
      }));
      
      toast.success("Formation template saved");
      return newTemplate as FormationTemplate;
    } catch (error) {
      console.error("Error saving formation template:", error);
      toast.error("Failed to save formation template");
      return null;
    } finally {
      set({ isLoading: false });
    }
  },
  
  deleteFormationTemplate: async (id) => {
    try {
      set({ isLoading: true });
      // In a real implementation, we'd delete from Supabase
      // const { error } = await supabase.from('formation_templates').delete().eq('id', id);
      // if (error) throw error;
      
      set(state => ({
        formationTemplates: state.formationTemplates.filter(template => template.id !== id)
      }));
      
      toast.success("Formation template deleted");
    } catch (error) {
      console.error("Error deleting formation template:", error);
      toast.error("Failed to delete formation template");
    } finally {
      set({ isLoading: false });
    }
  },
  
  loadPlayerStatistics: async () => {
    try {
      set({ isLoading: true });
      // In a real implementation, we'd fetch from Supabase
      // const { data, error } = await supabase.from('player_statistics').select('*');
      // if (error) throw error;
      
      // For now, let's create some mock data
      const { players } = useTeamStore.getState();
      const mockStats: PlayerStatistics[] = players.slice(0, 5).flatMap(player => [
        {
          player_id: player.id,
          season: '2023-2024',
          appearances: Math.floor(Math.random() * 30) + 5,
          goals: Math.floor(Math.random() * 15),
          assists: Math.floor(Math.random() * 10),
          yellow_cards: Math.floor(Math.random() * 5),
          red_cards: Math.floor(Math.random() * 2),
          minutes_played: Math.floor(Math.random() * 2000) + 500,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        },
        {
          player_id: player.id,
          season: '2022-2023',
          appearances: Math.floor(Math.random() * 30) + 5,
          goals: Math.floor(Math.random() * 15),
          assists: Math.floor(Math.random() * 10),
          yellow_cards: Math.floor(Math.random() * 5),
          red_cards: Math.floor(Math.random() * 2),
          minutes_played: Math.floor(Math.random() * 2000) + 500,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        }
      ]);
      
      set({ playerStatistics: mockStats });
    } catch (error) {
      console.error("Error loading player statistics:", error);
      toast.error("Failed to load player statistics");
    } finally {
      set({ isLoading: false });
    }
  },
  
  updatePlayerStatistics: async (playerId, season, stats) => {
    try {
      set({ isLoading: true });
      // In a real implementation, we'd upsert into Supabase
      // const { error } = await supabase.from('player_statistics').upsert({
      //   player_id: playerId,
      //   season,
      //   ...stats,
      //   updated_at: new Date().toISOString()
      // });
      // if (error) throw error;
      
      const existing = get().playerStatistics.find(
        ps => ps.player_id === playerId && ps.season === season
      );
      
      if (existing) {
        set(state => ({
          playerStatistics: state.playerStatistics.map(ps => 
            ps.player_id === playerId && ps.season === season
              ? { ...ps, ...stats, updated_at: new Date().toISOString() }
              : ps
          )
        }));
      } else {
        set(state => ({
          playerStatistics: [
            ...state.playerStatistics,
            {
              player_id: playerId,
              season,
              appearances: 0,
              goals: 0,
              assists: 0,
              ...stats,
              created_at: new Date().toISOString(),
              updated_at: new Date().toISOString()
            }
          ]
        }));
      }
      
      toast.success("Player statistics updated");
    } catch (error) {
      console.error("Error updating player statistics:", error);
      toast.error("Failed to update player statistics");
    } finally {
      set({ isLoading: false });
    }
  },
  
  getPlayerStatsByPlayerId: (playerId) => {
    return get().playerStatistics.filter(ps => ps.player_id === playerId);
  },
  
  getPlayerStatsBySeason: (season) => {
    return get().playerStatistics.filter(ps => ps.season === season);
  },
  
  bulkUpdateStatistics: async (stats) => {
    try {
      set({ isLoading: true });
      // In a real implementation, we'd upsert into Supabase
      // const { error } = await supabase.from('player_statistics').upsert(stats);
      // if (error) throw error;
      
      for (const stat of stats) {
        const { player_id, season, ...updates } = stat;
        if (!player_id || !season) continue;
        
        await get().updatePlayerStatistics(player_id, season, updates);
      }
      
      toast.success("Statistics updated successfully");
    } catch (error) {
      console.error("Error bulk updating statistics:", error);
      toast.error("Failed to update statistics");
    } finally {
      set({ isLoading: false });
    }
  }
}));
