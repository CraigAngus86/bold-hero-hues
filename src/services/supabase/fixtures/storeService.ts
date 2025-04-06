
import { supabase } from '@/integrations/supabase/client';
import { logScrapeOperation } from './loggingService';
import { ScrapedFixture } from '@/types/fixtures';
import { ImportResult } from './types';

// Store fixtures in the database
export const storeFixtures = async (fixtures: ScrapedFixture[], source: string): Promise<ImportResult> => {
  try {
    let added = 0;
    let updated = 0;

    for (const fixture of fixtures) {
      const { data: existingFixture, error: selectError } = await supabase
        .from('fixtures')
        .select('id')
        .eq('home_team', fixture.home_team)
        .eq('away_team', fixture.away_team)
        .eq('date', fixture.date)
        .eq('time', fixture.time)
        .single();

      if (selectError && selectError.code !== 'PGRST116') {
        console.error('Error checking existing fixture:', selectError);
        continue; // Skip to the next fixture
      }

      if (existingFixture) {
        // Update existing fixture
        const { error: updateError } = await supabase
          .from('fixtures')
          .update(fixture)
          .eq('id', existingFixture.id);

        if (updateError) {
          console.error('Error updating fixture:', updateError);
        } else {
          updated++;
        }
      } else {
        // Insert new fixture
        const { error: insertError } = await supabase
          .from('fixtures')
          .insert([fixture]);

        if (insertError) {
          console.error('Error inserting fixture:', insertError);
        } else {
          added++;
        }
      }
    }

    await logScrapeOperation(source, added, updated);

    return {
      success: true,
      added,
      updated,
      message: `Stored fixtures successfully: ${added} added, ${updated} updated`
    };
  } catch (error) {
    console.error('Error storing fixtures:', error);
    return {
      success: false,
      added: 0,
      updated: 0,
      message: `Error storing fixtures: ${error instanceof Error ? error.message : 'Unknown error'}`
    };
  }
};
