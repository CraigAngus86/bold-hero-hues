
import { supabase } from '@/lib/supabase';
import { TeamStats } from '@/types/fixtures';

// Fetches the league table data from the database
export async function getLeagueTableData(): Promise<TeamStats[]> {
  try {
    const { data, error } = await supabase
      .from('highland_league_table')
      .select('*')
      .order('position', { ascending: true });
      
    if (error) throw error;
    
    return data.map((team) => ({
      id: team.id.toString(),
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
      logo: team.logo || '',
      last_updated: team.last_updated || new Date().toISOString()
    }));
  } catch (error) {
    console.error('Error fetching league table:', error);
    return [];
  }
}

// Updates a team's logo URL
export async function updateTeamLogo(teamId: string, logoUrl: string): Promise<boolean> {
  try {
    const { error } = await supabase
      .from('highland_league_table')
      .update({ logo: logoUrl })
      .eq('id', teamId);
      
    if (error) throw error;
    return true;
  } catch (error) {
    console.error('Error updating team logo:', error);
    return false;
  }
}

// Manually refresh league data from external source
export async function refreshLeagueData(): Promise<boolean> {
  // In a real implementation, this would fetch from an API or scrape data
  console.log('Refreshing league data...');
  return true;
}
