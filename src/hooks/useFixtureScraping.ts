
import { useState } from 'react';
import { toast } from 'sonner';
import { supabase } from '@/services/supabase/supabaseClient';
import { scrapeAndStoreFixtures } from '@/services/supabase/fixtures/importExport';
import { ScrapedFixture } from '@/types/fixtures';

export const useFixtureScraping = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [testLoading, setTestLoading] = useState(false);
  const [results, setResults] = useState<ScrapedFixture[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  // Test the scraping function with BBC Sport
  const handleTestFetch = async () => {
    try {
      setTestLoading(true);
      setError(null);
      setSuccess(false);
      setResults([]);
      
      console.log('Testing fixture scraping from BBC Sport website...');
      toast.info('Testing connection to BBC Sport website...');
      
      // Call the Edge Function directly
      const { data, error: fnError } = await supabase.functions.invoke('scrape-bbc-fixtures', {
        body: { url: 'https://www.bbc.com/sport/football/scottish-highland-league/scores-fixtures' }
      });
      
      if (fnError || !data?.success) {
        const errorMsg = fnError?.message || data?.error || 'Failed to fetch fixtures';
        console.error('Test fetch failed:', errorMsg);
        setError(errorMsg);
        toast.error(errorMsg);
        return;
      }
      
      console.log('Test fetch successful, found', data.data.length, 'fixtures');
      setResults(data.data);
      setSuccess(true);
      toast.success(`Successfully fetched ${data.data.length} fixtures from BBC Sport`);
      
    } catch (error) {
      console.error('Error testing fetch:', error);
      setError(error instanceof Error ? error.message : 'An unknown error occurred');
      toast.error('An error occurred while testing the connection');
    } finally {
      setTestLoading(false);
    }
  };
  
  // Fetch from BBC Sport
  const handleFetchFromBBC = async () => {
    try {
      setIsLoading(true);
      setError(null);
      setSuccess(false);
      setResults([]);
      
      console.log('Starting fixture scraping from BBC Sport...');
      toast.info('Scraping fixtures from BBC Sport...');
      
      // Get fixtures using the BBC Sport Edge Function
      const { data, error: fnError } = await supabase.functions.invoke('scrape-bbc-fixtures', {
        body: { url: 'https://www.bbc.com/sport/football/scottish-highland-league/scores-fixtures' }
      });
      
      if (fnError || !data?.success) {
        const errorMsg = fnError?.message || data?.error || 'Failed to fetch fixtures';
        console.error('Fetch failed:', errorMsg);
        setError(errorMsg);
        toast.error(errorMsg);
        return;
      }
      
      console.log('Fixtures fetch successful, proceeding with import...');
      
      // Store fixtures
      const success = await scrapeAndStoreFixtures(data.data);
      
      if (!success) {
        setError('Failed to store fixtures. Check the console for details.');
        toast.error('Failed to store fixtures in database');
        return;
      }
      
      // Get the data to display
      setResults(data.data);
      setSuccess(true);
      toast.success(`Successfully imported ${data.data.length} fixtures from BBC Sport`);
      
    } catch (error) {
      console.error('Error fetching fixtures:', error);
      setError(error instanceof Error ? error.message : 'An unknown error occurred');
      toast.error('An error occurred while fetching fixtures');
    } finally {
      setIsLoading(false);
    }
  };

  // Fetch from Highland League website
  const handleFetchFromHFL = async () => {
    try {
      setIsLoading(true);
      setError(null);
      setSuccess(false);
      setResults([]);
      
      console.log('Starting fixture scraping from Highland League website...');
      toast.info('Scraping fixtures from Highland League website...');
      
      // Get fixtures using the Highland League Edge Function
      const { data, error: fnError } = await supabase.functions.invoke('scrape-fixtures', {
        body: { url: 'http://www.highlandfootballleague.com/Fixtures/' }
      });
      
      if (fnError || !data?.success) {
        const errorMsg = fnError?.message || data?.error || 'Failed to fetch fixtures';
        console.error('Fetch failed:', errorMsg);
        setError(errorMsg);
        toast.error(errorMsg);
        return;
      }
      
      console.log('Fixtures fetch successful, proceeding with import...');
      
      // Store fixtures
      const success = await scrapeAndStoreFixtures(data.data);
      
      if (!success) {
        setError('Failed to store fixtures. Check the console for details.');
        toast.error('Failed to store fixtures in database');
        return;
      }
      
      // Get the data to display
      setResults(data.data);
      setSuccess(true);
      toast.success(`Successfully imported ${data.data.length} fixtures from Highland League website`);
      
    } catch (error) {
      console.error('Error fetching fixtures:', error);
      setError(error instanceof Error ? error.message : 'An unknown error occurred');
      toast.error('An error occurred while fetching fixtures');
    } finally {
      setIsLoading(false);
    }
  };

  const handleExportFixtures = () => {
    try {
      if (results.length === 0) {
        toast.warning('No fixtures to export');
        return;
      }
      
      const jsonData = JSON.stringify(results, null, 2);
      const blob = new Blob([jsonData], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      
      const a = document.createElement('a');
      a.href = url;
      a.download = `highland-league-fixtures-${new Date().toISOString().split('T')[0]}.json`;
      document.body.appendChild(a);
      a.click();
      
      setTimeout(() => {
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
      }, 0);
      
      toast.success('Fixtures exported successfully');
    } catch (error) {
      console.error('Failed to export fixtures:', error);
      toast.error('Failed to export fixtures');
    }
  };

  return {
    isLoading,
    testLoading,
    results,
    error,
    success,
    handleTestFetch,
    handleFetchFromBBC,
    handleFetchFromHFL,
    handleExportFixtures
  };
};
