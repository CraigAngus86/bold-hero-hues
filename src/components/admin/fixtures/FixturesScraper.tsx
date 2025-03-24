
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { useFixtureScraping } from '@/hooks/useFixtureScraping';
import ScraperStatusAlerts from './ScraperStatusAlerts';
import FixturesList from './FixturesList';
import ScraperActionButtons from './ScraperActionButtons';

export default function FixturesScraper() {
  const {
    isLoading,
    testLoading,
    results,
    error,
    success,
    handleTestFetch,
    handleFetchFromBBC,
    handleFetchFromHFL,
    handleExportFixtures
  } = useFixtureScraping();
  
  return (
    <Card>
      <CardHeader>
        <CardTitle>Highland League Fixtures Importer</CardTitle>
        <CardDescription>
          Fetch fixtures from official Highland League sources using Supabase Edge Functions
        </CardDescription>
      </CardHeader>
      
      <CardContent className="space-y-4">
        <ScraperStatusAlerts 
          error={error} 
          success={success} 
          resultsCount={results.length} 
        />
        
        {results.length > 0 && (
          <FixturesList 
            fixtures={results}
            onExport={handleExportFixtures}
          />
        )}
      </CardContent>
      
      <CardFooter className="flex flex-col gap-3 sm:flex-row sm:flex-wrap">
        <ScraperActionButtons
          isLoading={isLoading}
          testLoading={testLoading}
          onTestFetch={handleTestFetch}
          onFetchFromBBC={handleFetchFromBBC}
          onFetchFromHFL={handleFetchFromHFL}
          success={success}
        />
      </CardFooter>
    </Card>
  );
}
