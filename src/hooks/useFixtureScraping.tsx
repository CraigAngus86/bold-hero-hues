
import { useState } from 'react';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';
import { generateFixturesExport } from '@/services/supabase/fixtures/testUtils';
import { ScrapedFixture } from '@/types/fixtures';

export function useFixtureScraping() {
  const [results, setResults] = useState<ScrapedFixture[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [testLoading, setTestLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  // Function to test the scraper connection
  const handleTestFetch = async () => {
    setTestLoading(true);
    setError(null);
    setSuccess(null);

    try {
      const { data, error } = await supabase.functions.invoke('scrape-fixtures', {
        body: { action: 'test' }
      });

      if (error) {
        throw new Error(error.message);
      }

      if (data?.success) {
        setSuccess('Connection successful. Scraper is working.');
        toast.success('Scraper test successful');
      } else {
        throw new Error(data?.message || 'Unknown error');
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to test scraper';
      setError(`Test failed: ${errorMessage}`);
      toast.error('Scraper test failed');
      console.error('Error testing scraper:', err);
    } finally {
      setTestLoading(false);
    }
  };

  // Function to fetch fixtures from BBC Sport
  const handleFetchFromBBC = async () => {
    setIsLoading(true);
    setError(null);
    setSuccess(null);
    setResults([]);

    try {
      const { data, error } = await supabase.functions.invoke('scrape-fixtures', {
        body: { action: 'bbc' }
      });

      if (error) {
        throw new Error(error.message);
      }

      if (data?.success) {
        setSuccess(`Successfully fetched ${data.fixtures.length} fixtures from BBC Sport`);
        setResults(data.fixtures);
        toast.success(`Found ${data.fixtures.length} Banks o' Dee fixtures`);
      } else {
        throw new Error(data?.message || 'No fixtures found');
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to fetch fixtures';
      setError(`BBC Sport fetch failed: ${errorMessage}`);
      toast.error('Failed to fetch fixtures from BBC Sport');
      console.error('Error fetching from BBC:', err);
    } finally {
      setIsLoading(false);
    }
  };

  // Function to fetch fixtures from Highland Football League
  const handleFetchFromHFL = async () => {
    setIsLoading(true);
    setError(null);
    setSuccess(null);
    setResults([]);

    try {
      const { data, error } = await supabase.functions.invoke('scrape-fixtures', {
        body: { action: 'hfl' }
      });

      if (error) {
        throw new Error(error.message);
      }

      if (data?.success) {
        setSuccess(`Successfully fetched ${data.fixtures.length} fixtures from Highland Football League`);
        setResults(data.fixtures);
        toast.success(`Found ${data.fixtures.length} Banks o' Dee fixtures`);
      } else {
        throw new Error(data?.message || 'No fixtures found');
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to fetch fixtures';
      setError(`HFL fetch failed: ${errorMessage}`);
      toast.error('Failed to fetch fixtures from Highland Football League');
      console.error('Error fetching from HFL:', err);
    } finally {
      setIsLoading(false);
    }
  };

  // Function to export fixtures to JSON
  const handleExportFixtures = async () => {
    if (results.length === 0) {
      toast.error('No fixtures to export');
      return;
    }

    try {
      // Create and download JSON file
      const dataStr = JSON.stringify(results, null, 2);
      const dataUri = `data:application/json;charset=utf-8,${encodeURIComponent(dataStr)}`;
      
      const exportFileDefaultName = `scraped-fixtures-${new Date().toISOString().split('T')[0]}.json`;
      
      const linkElement = document.createElement('a');
      linkElement.setAttribute('href', dataUri);
      linkElement.setAttribute('download', exportFileDefaultName);
      linkElement.click();
      linkElement.remove();
      
      toast.success(`Exported ${results.length} fixtures to JSON`);
    } catch (err) {
      console.error('Error exporting fixtures:', err);
      toast.error('Failed to export fixtures');
    }
  };

  return {
    results,
    isLoading,
    testLoading,
    error,
    success,
    handleTestFetch,
    handleFetchFromBBC,
    handleFetchFromHFL,
    handleExportFixtures,
    generateFixturesExport
  };
}
