import { supabase } from '@/lib/supabase';
import { TeamStats } from '@/types/fixtures';

/**
 * Get all teams from the league table
 */
export async function getLeagueTable(): Promise<TeamStats[]> {
  try {
    const { data, error } = await supabase
      .from('highland_league_table')
      .select('*')
      .order('position', { ascending: true });

    if (error) {
      console.error('Error fetching league table:', error);
      throw error;
    }

    return data.map(team => ({
      id: team.id?.toString(),
      position: team.position,
      team: team.team,
      played: team.played,
      won: team.won,
      drawn: team.drawn,
      lost: team.lost,
      goalsFor: team.goalsFor,
      goalsAgainst: team.goalsAgainst,
      goalDifference: team.goalDifference,
      points: team.points,
      form: team.form || [],
      logo: team.logo || ''
    }));
  } catch (error) {
    console.error('Error in getLeagueTable:', error);
    return [];
  }
}

/**
 * Update a team's logo URL in the league table
 */
export async function updateTeamLogo(teamId: string, logoUrl: string): Promise<boolean> {
  try {
    const { error } = await supabase
      .from('highland_league_table')
      .update({ logo: logoUrl })
      .eq('id', parseInt(teamId));
      
    if (error) {
      console.error('Error updating team logo:', error);
      throw error;
    }
    
    return true;
  } catch (error) {
    console.error('Error in updateTeamLogo:', error);
    return false;
  }
}

/**
 * Get a team by ID
 */
export async function getTeamById(teamId: string): Promise<TeamStats | null> {
  try {
    const { data, error } = await supabase
      .from('highland_league_table')
      .select('*')
      .eq('id', parseInt(teamId))
      .single();

    if (error) {
      console.error('Error fetching team by ID:', error);
      return null;
    }

    if (!data) {
      return null;
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
    return null;
  }
}
