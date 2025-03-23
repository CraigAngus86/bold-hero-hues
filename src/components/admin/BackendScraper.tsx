
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { fetchLeagueData } from '@/services/leagueDataService';

const BackendScraper = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<string | null>(null);
  
  const handleScrape = async () => {
    try {
      setIsLoading(true);
      setResult(null);
      
      // In a real implementation, this would be a call to a backend API endpoint
      // that handles the scraping of the Highland Football League website
      const data = await fetchLeagueData();
      
      setResult(`Scraping completed successfully! 
      - League Table: ${data.leagueTable.length} teams
      - Fixtures: ${data.fixtures.length} upcoming matches
      - Results: ${data.results.length} past matches`);
    } catch (error) {
      console.error('Error scraping data:', error);
      setResult(`Error: ${error instanceof Error ? error.message : 'Failed to scrape data'}`);
    } finally {
      setIsLoading(false);
    }
  };
  
  return (
    <Card className="max-w-md mx-auto">
      <CardHeader>
        <CardTitle>Highland League Data Scraper</CardTitle>
      </CardHeader>
      <CardContent>
        <p className="mb-4 text-gray-600">
          Click the button below to manually trigger a scrape of the Highland Football League website
          to update the fixtures, results, and league table data.
        </p>
        
        <div className="flex flex-col space-y-4">
          <Button 
            onClick={handleScrape} 
            disabled={isLoading}
            className="bg-team-blue hover:bg-team-navy"
          >
            {isLoading ? 'Scraping...' : 'Scrape League Data'}
          </Button>
          
          {result && (
            <div className={`p-4 rounded-md ${result.includes('Error') ? 'bg-red-50 text-red-800' : 'bg-green-50 text-green-800'}`}>
              <pre className="whitespace-pre-wrap">{result}</pre>
            </div>
          )}
          
          <div className="mt-4 text-xs text-gray-500">
            <p>Note: In a production environment, this would be implemented as:</p>
            <ul className="list-disc pl-5 mt-1 space-y-1">
              <li>A server-side function that runs on a schedule</li>
              <li>An API endpoint to manually trigger the scrape</li>
              <li>Proper error handling and data validation</li>
              <li>Storage of the scraped data in a database</li>
            </ul>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default BackendScraper;
