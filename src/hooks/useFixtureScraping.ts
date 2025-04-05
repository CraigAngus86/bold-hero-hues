
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
  const [progress, setProgress] = useState(0); // Add progress state

  // Generic scrape function that both handleFetchFromBBC and handleFetchFromHFL will use
  const scrapeFixtures = async (source: string, customParam?: string) => {
    setIsLoading(true);
    setError(null);
    setSuccess(null);
    setResults([]);
    setProgress(0);
    
    try {
      // Set up progress tracking
      const progressInterval = setInterval(() => {
        setProgress(prev => {
          if (prev >= 90) return prev;
          return prev + 10;
        });
      }, 500);
      
      // Call supabase function with appropriate action
      const { data, error } = await supabase.functions.invoke('scrape-fixtures', {
        body: { 
          action: source,
          params: customParam ? { url: customParam } : undefined
        }
      });
      
      clearInterval(progressInterval);
      setProgress(100);
      
      if (error) throw new Error(error.message);
      
      if (data?.success) {
        setSuccess(`Successfully fetched ${data.fixtures.length} fixtures from ${source}`);
        setResults(data.fixtures);
        toast.success(`Found ${data.fixtures.length} fixtures`);
        return data.fixtures;
      } else {
        throw new Error(data?.message || `No fixtures found from ${source}`);
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : `Failed to fetch fixtures from ${source}`;
      setError(errorMessage);
      toast.error(`Failed to fetch fixtures from ${source}`);
      console.error(`Error fetching from ${source}:`, err);
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

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
    return scrapeFixtures('bbc');
  };

  // Fetch from Highland League
  const handleFetchFromHFL = async () => {
    return scrapeFixtures('hfl');
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
    progress,
    scrapeFixtures,
    handleTestFetch,
    handleFetchFromBBC,
    handleFetchFromHFL,
    handleExportFixtures
  };
};
