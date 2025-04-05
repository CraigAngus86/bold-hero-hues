
import { useState } from 'react';
import { ScrapedFixture } from '@/types/fixtures';
import { supabase } from '@/integrations/supabase/client';
import { importFixturesFromJson, scrapeAndStoreFixtures } from '@/services/supabase/fixtures/importExport';
import { toast } from 'sonner';

// Function to convert fixtures to downloadable JSON
const convertFixturesToJson = (fixtures: ScrapedFixture[]): string => {
  return JSON.stringify(fixtures, null, 2);
};

// Hook to manage fixture scraping operations
export const useFixtureScraping = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [testLoading, setTestLoading] = useState(false);
  const [results, setResults] = useState<ScrapedFixture[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  // Test fetch for debugging
  const handleTestFetch = async () => {
    try {
      setTestLoading(true);
      setError(null);
      setSuccess(null);
      
      // Call supabase function to get test data
      const { data, error } = await supabase.functions.invoke('scrape-fixtures', {
        body: { action: 'test' }
      });
      
      if (error || !data?.success) {
        throw new Error(error?.message || data?.message || 'Failed to fetch test data');
      }
      
      // Set test results
      if (data.fixtures && Array.isArray(data.fixtures)) {
        setResults(data.fixtures);
        setSuccess(`Test successful! Retrieved ${data.fixtures.length} fixtures.`);
        toast.success(`Test retrieved ${data.fixtures.length} fixtures`);
      } else {
        throw new Error('No fixture data returned from test');
      }
    } catch (error) {
      console.error('Error in test fetch:', error);
      setError(`Test fetch failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
      toast.error('Test fetch failed');
    } finally {
      setTestLoading(false);
    }
  };

  // Fetch from BBC Sport
  const handleFetchFromBBC = async () => {
    try {
      setIsLoading(true);
      setError(null);
      setSuccess(null);
      
      // Call scrapeAndStoreFixtures with 'bbc' source
      const response = await scrapeAndStoreFixtures('bbc', []);
      
      if (!response.success) {
        throw new Error(response.message || 'Failed to scrape fixtures from BBC Sport');
      }
      
      // Call supabase function as fallback if needed
      const { data, error } = await supabase.functions.invoke('scrape-fixtures', {
        body: { action: 'bbc' }
      });
      
      if (error) {
        throw new Error(`Edge function error: ${error.message}`);
      }
      
      if (data?.success && data.fixtures && Array.isArray(data.fixtures)) {
        setResults(data.fixtures);
        setSuccess(`Successfully scraped ${data.fixtures.length} fixtures from BBC Sport`);
        toast.success(`Scraped ${data.fixtures.length} fixtures from BBC Sport`);
      } else {
        throw new Error(data?.message || 'No fixtures returned from BBC Sport');
      }
    } catch (error) {
      console.error('Error fetching from BBC:', error);
      setError(`BBC Sport fetch failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
      toast.error('Failed to fetch fixtures from BBC Sport');
    } finally {
      setIsLoading(false);
    }
  };

  // Fetch from Highland League
  const handleFetchFromHFL = async () => {
    try {
      setIsLoading(true);
      setError(null);
      setSuccess(null);
      
      // Call scrapeAndStoreFixtures with 'highland-league' source
      const response = await scrapeAndStoreFixtures('highland-league', []);
      
      if (!response.success) {
        throw new Error(response.message || 'Highland League scraper not implemented yet');
      }
      
      // Call supabase function as fallback if needed
      const { data, error } = await supabase.functions.invoke('scrape-fixtures', {
        body: { action: 'hfl' }
      });
      
      if (error) {
        throw new Error(`Edge function error: ${error.message}`);
      }
      
      if (data?.success && data.fixtures && Array.isArray(data.fixtures)) {
        setResults(data.fixtures);
        setSuccess(`Successfully scraped ${data.fixtures.length} fixtures from Highland League`);
        toast.success(`Scraped ${data.fixtures.length} fixtures from Highland League`);
      } else {
        throw new Error(data?.message || 'No fixtures returned from Highland League');
      }
    } catch (error) {
      console.error('Error fetching from Highland League:', error);
      setError(`Highland League fetch failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
      toast.error('Failed to fetch fixtures from Highland League');
    } finally {
      setIsLoading(false);
    }
  };

  // Export fixtures as JSON
  const handleExportFixtures = () => {
    if (results.length === 0) {
      toast.error('No fixtures to export');
      return;
    }

    try {
      const jsonString = convertFixturesToJson(results);
      const blob = new Blob([jsonString], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      
      const a = document.createElement('a');
      a.href = url;
      a.download = `fixtures-export-${new Date().toISOString().split('T')[0]}.json`;
      document.body.appendChild(a);
      a.click();
      
      // Cleanup
      setTimeout(() => {
        document.body.removeChild(a);
        window.URL.revokeObjectURL(url);
      }, 0);
      
      toast.success(`Exported ${results.length} fixtures`);
    } catch (error) {
      console.error('Error exporting fixtures:', error);
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
