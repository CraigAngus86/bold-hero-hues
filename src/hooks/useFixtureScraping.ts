
import { useState } from 'react';
import { ScrapedFixture } from '@/types/fixtures';
import { triggerFixturesUpdate, getFixturesForLovable } from '@/services/supabase/fixtures/integrationService';
import { scrapeAndStoreFixtures, importHistoricFixtures } from '@/services/supabase/fixtures/importExport';
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
      
      // Use our integration service
      const fixturesData = await getFixturesForLovable({
        forceUpdate: true, // Force update
        upcomingLimit: 5,
        recentLimit: 5
      });
      
      if (!fixturesData.success || !fixturesData.data) {
        throw new Error(fixturesData.error || 'Failed to fetch test data');
      }
      
      // Convert matches to scraped fixtures for display
      const testResults = fixturesData.data.all.map(match => ({
        id: match.id,
        homeTeam: match.homeTeam,
        awayTeam: match.awayTeam,
        date: match.date,
        time: match.time,
        competition: match.competition,
        venue: match.venue,
        isCompleted: match.isCompleted,
        homeScore: match.homeScore,
        awayScore: match.awayScore,
        source: 'test',
      }));
      
      setResults(testResults);
      setSuccess(`Test successful! Retrieved ${testResults.length} fixtures.`);
    } catch (error) {
      console.error('Error in test fetch:', error);
      setError(`Test fetch failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
      toast.error('Test fetch failed');
    } finally {
      setTestLoading(false);
    }
  };

  // Fetch from BBC Sport using edge function
  const handleFetchFromBBC = async () => {
    try {
      setIsLoading(true);
      setError(null);
      setSuccess(null);
      
      const response = await triggerFixturesUpdate('bbc');
      
      if (!response.success) {
        throw new Error(response.message);
      }
      
      if (response.fixtures) {
        // Convert matches to scraped fixtures for display
        const scrapedFixtures = response.fixtures.map(match => ({
          id: match.id,
          homeTeam: match.homeTeam,
          awayTeam: match.awayTeam,
          date: match.date,
          time: match.time,
          competition: match.competition,
          venue: match.venue,
          isCompleted: match.isCompleted,
          homeScore: match.homeScore,
          awayScore: match.awayScore,
          source: 'bbc-sport',
        }));
        
        setResults(scrapedFixtures);
      }
      
      setSuccess(response.message);
      toast.success(response.message);
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
      
      // This would be implemented with an edge function
      toast.error('Highland League scraper not implemented yet');
      setError('Highland League scraper not implemented yet');
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
