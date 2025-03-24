
import { ScrapedFixture } from '@/types/fixtures';
import { storeFixtures } from './storeService';
import { toast } from 'sonner';

/**
 * Imports historic fixtures from a JSON file
 */
export const importHistoricFixtures = async (fixtures: ScrapedFixture[], source: string) => {
  try {
    const result = await storeFixtures(fixtures, source);
    
    if (result.success) {
      toast.success(`Successfully imported ${result.added + result.updated} historic fixtures`);
      return true;
    } else {
      toast.error(result.message);
      return false;
    }
  } catch (error) {
    console.error('Error importing historic fixtures:', error);
    toast.error(`Error importing historic fixtures: ${error instanceof Error ? error.message : 'Unknown error'}`);
    return false;
  }
};

/**
 * Scrapes and store fixtures from a provided source
 */
export const scrapeAndStoreFixtures = async (fixtures: ScrapedFixture[]) => {
  if (!fixtures || fixtures.length === 0) {
    toast.error('No fixtures found to import');
    return false;
  }
  
  try {
    const source = 'manual-import';
    const result = await storeFixtures(fixtures, source);
    
    if (result.success) {
      toast.success(`Successfully imported ${result.added + result.updated} fixtures`);
      return true;
    } else {
      toast.error(result.message);
      return false;
    }
  } catch (error) {
    console.error('Error in scrapeAndStoreFixtures:', error);
    toast.error(`Error importing fixtures: ${error instanceof Error ? error.message : 'Unknown error'}`);
    return false;
  }
};
