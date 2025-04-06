
import { supabase } from '@/lib/supabase';
import { Fixture } from '@/types/fixtures';

/**
 * Update is_next_match, is_latest_result, and date_passed flags for fixtures
 */
export async function updateFixtureFlags(): Promise<boolean> {
  try {
    const today = new Date().toISOString().split('T')[0];
    
    // First, reset all the flags
    await supabase
      .from('fixtures')
      .update({
        is_next_match: false,
        is_latest_result: false,
        date_passed: false
      })
      .neq('id', '');
    
    // Mark all past fixtures as date_passed
    await supabase
      .from('fixtures')
      .update({ date_passed: true })
      .lt('date', today);
    
    // Get the next match (first upcoming fixture, not completed)
    const { data: nextMatch } = await supabase
      .from('fixtures')
      .select('id')
      .eq('is_completed', false)
      .gte('date', today)
      .order('date', { ascending: true })
      .limit(1)
      .single();
    
    if (nextMatch) {
      // Update the next match
      await supabase
        .from('fixtures')
        .update({ is_next_match: true })
        .eq('id', nextMatch.id);
    }
    
    // Get the latest result (most recent completed fixture)
    const { data: latestResult } = await supabase
      .from('fixtures')
      .select('id')
      .eq('is_completed', true)
      .order('date', { ascending: false })
      .limit(1)
      .single();
    
    if (latestResult) {
      // Update the latest result
      await supabase
        .from('fixtures')
        .update({ is_latest_result: true })
        .eq('id', latestResult.id);
    }
    
    return true;
  } catch (error) {
    console.error('Error updating fixture flags:', error);
    return false;
  }
}

/**
 * Update fixtures data when fixtures change
 */
export async function registerFixtureHooks() {
  // Call once initially
  await updateFixtureFlags();
  
  // Set up subscription to fixture changes
  const fixturesSubscription = supabase
    .channel('fixture-changes')
    .on(
      'postgres_changes',
      {
        event: '*',
        schema: 'public',
        table: 'fixtures',
      },
      () => {
        // When any fixture changes, update flags
        updateFixtureFlags();
      }
    )
    .subscribe();
  
  return fixturesSubscription;
}
