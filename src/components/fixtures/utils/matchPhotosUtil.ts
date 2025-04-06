
import { supabase } from '@/integrations/supabase/client';
import { Match } from '../types';

/**
 * Checks if photos exist for a specific match in storage
 */
export const checkMatchPhotosExist = async (match: Match): Promise<boolean> => {
  const matchDate = new Date(match.date);
  const formattedDate = `${matchDate.getFullYear()}-${String(matchDate.getMonth() + 1).padStart(2, '0')}-${String(matchDate.getDate()).padStart(2, '0')}`;
  
  const awayTeam = match.awayTeam.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '');
  const folderPath = `highland-league-matches/${awayTeam}-${formattedDate}`;
  
  try {
    const { data, error } = await supabase
      .storage
      .from('images')
      .list(folderPath);
    
    if (error) throw error;
    
    return data && data.filter(item => !item.name.endsWith('.folder')).length > 0;
  } catch (error) {
    console.log('No match photos found:', error);
    return false;
  }
};
