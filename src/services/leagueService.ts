
import { TeamStats } from '@/types/fixtures';
import { fetchLeagueTableFromSupabase, triggerLeagueDataScrape } from '@/services/supabase/leagueDataService';
import { supabase } from '@/lib/supabase';

export const leagueService = {
  /**
   * Fetches the league table data
   */
  getLeagueTable: async (): Promise<TeamStats[]> => {
    try {
      const data = await fetchLeagueTableFromSupabase();
      return data;
    } catch (error) {
      console.error('Error in leagueService.getLeagueTable:', error);
      return [];
    }
  },

  /**
   * Wrapper function for getLeagueTable for backward compatibility
   */
  getLeagueTableData: async (): Promise<TeamStats[]> => {
    return leagueService.getLeagueTable();
  },

  /**
   * Updates a team's logo URL
   */
  updateTeamLogo: async (teamId: string, logoUrl: string): Promise<boolean> => {
    try {
      const { error } = await supabase
        .from('highland_league_table')
        .update({ logo: logoUrl })
        .eq('id', teamId);

      if (error) {
        console.error('Error updating team logo:', error);
        return false;
      }

      return true;
    } catch (error) {
      console.error('Exception in updateTeamLogo:', error);
      return false;
    }
  },

  /**
   * Gets a team by its ID
   */
  getTeamById: async (teamId: string): Promise<TeamStats> => {
    try {
      const { data, error } = await supabase
        .from('highland_league_table')
        .select('*')
        .eq('id', teamId)
        .single();

      if (error) {
        throw error;
      }

      return {
        id: data.id?.toString(),
        position: data.position,
        team: data.team,
        played: data.played,
        won: data.won,
        drawn: data.drawn,
        lost: data.lost,
        goalsFor: data.goalsFor,
        goalsAgainst: data.goalsAgainst,
        goalDifference: data.goalDifference,
        points: data.points,
        form: data.form || [],
        logo: data.logo || ''
      };
    } catch (error) {
      console.error('Error in getTeamById:', error);
      throw new Error('Failed to fetch team data');
    }
  },

  /**
   * Refreshes the league data from external sources
   */
  refreshLeagueData: async (): Promise<boolean> => {
    try {
      await triggerLeagueDataScrape();
      return true;
    } catch (error) {
      console.error('Error refreshing league data:', error);
      return false;
    }
  }
};

export default leagueService;
