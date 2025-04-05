
/**
 * This file handles competitions-related functions for fixtures
 */

import { supabase } from '@/integrations/supabase/client';

// Get unique competitions from fixtures table
export const getUniqueCompetitions = async (): Promise<string[]> => {
  try {
    const { data, error } = await supabase
      .from('fixtures')
      .select('competition')
      .order('competition');

    if (error) {
      console.error('Error fetching competitions:', error);
      return [];
    }

    // Extract unique competition names
    const competitions = Array.from(new Set(
      data
        .filter(item => item.competition)
        .map(item => item.competition)
    ));

    return competitions;
  } catch (error) {
    console.error('Error in getUniqueCompetitions:', error);
    return [];
  }
};

// Get counts of matches by competition
export const getCompetitionCounts = async (): Promise<Record<string, number>> => {
  try {
    const { data, error } = await supabase
      .from('fixtures')
      .select('competition');

    if (error) {
      console.error('Error fetching competition counts:', error);
      return {};
    }

    // Count occurrences of each competition
    const counts: Record<string, number> = {};
    data.forEach(item => {
      if (item.competition) {
        counts[item.competition] = (counts[item.competition] || 0) + 1;
      }
    });

    return counts;
  } catch (error) {
    console.error('Error in getCompetitionCounts:', error);
    return {};
  }
};

// Export competition-related constants
export const HIGHLAND_LEAGUE = 'Highland League';
export const SCOTTISH_CUP = 'Scottish Cup';
export const LEAGUE_CUP = 'League Cup';
export const ABERDEENSHIRE_CUP = 'Aberdeenshire Cup';
export const ABERDEENSHIRE_SHIELD = 'Aberdeenshire Shield';
export const FRIENDLY = 'Friendly';

// All supported competitions
export const ALL_COMPETITIONS = [
  HIGHLAND_LEAGUE,
  SCOTTISH_CUP,
  LEAGUE_CUP, 
  ABERDEENSHIRE_CUP,
  ABERDEENSHIRE_SHIELD,
  FRIENDLY
];
