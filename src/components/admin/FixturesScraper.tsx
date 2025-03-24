
import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { RefreshCw, Check, Download, AlertCircle, Info, Link2 } from "lucide-react";
import { scrapeAndStoreFixtures } from '@/services/supabase/fixtures/importExport'; 
import { toast } from 'sonner';
import { ScrapedFixture } from '@/types/fixtures';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { FirecrawlService } from '@/utils/FirecrawlService';

export default function FixturesScraper() {
  const [isLoading, setIsLoading] = useState(false);
  const [results, setResults] = useState<ScrapedFixture[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [htmlSample, setHtmlSample] = useState<string | null>(null);
  const [dataFormatting, setDataFormatting] = useState<string | null>(null);
  const [transfermarktUrl, setTransfermarktUrl] = useState<string>(
    'https://www.transfermarkt.com/banks-o-dee-fc/spielplandatum/verein/25442/saison_id/2024'
  );
  
  const handleFetchFromTransfermarkt = async () => {
    try {
      setIsLoading(true);
      setError(null);
      setSuccess(false);
      setResults([]);
      setHtmlSample(null);
      setDataFormatting(null);
      
      console.log('Starting fixture scraping from Transfermarkt website...');
      toast.info('Scraping fixtures from Transfermarkt... This may take a moment.');
      
      // Call the FirecrawlService to fetch and parse Transfermarkt fixtures
      const { success, data, error, htmlSample } = await FirecrawlService.fetchTransfermarktFixtures(transfermarktUrl);
      
      if (!success || !data) {
        const errorMessage = error || 'Failed to fetch fixtures from Transfermarkt';
        console.error('Transfermarkt scraper error:', errorMessage);
        setError(errorMessage);
        
        // If we have an HTML sample for debugging, show it
        if (htmlSample) {
          setHtmlSample(htmlSample);
          console.log('HTML sample from failed scraping:', htmlSample);
        }
        
        toast.error(errorMessage);
        return;
      }
      
      if (data.length === 0) {
        setError('No fixtures found on the Transfermarkt website');
        toast.error('No fixtures found');
        return;
      }
      
      processScrapedFixtures(data, 'Transfermarkt');
      
    } catch (error) {
      console.error('Error fetching fixtures:', error);
      setError(error instanceof Error ? error.message : 'An unknown error occurred');
      toast.error('An error occurred while fetching fixtures');
    } finally {
      setIsLoading(false);
    }
  };

  const processScrapedFixtures = (fixtures: any[], source: string) => {
    console.log(`Fixtures fetch successful from ${source}, proceeding with import...`, fixtures);
    
    // Log a sample of the data to check format
    if (fixtures.length > 0) {
      const sample = fixtures[0];
      const formattingInfo = `
Sample fixture data format from ${source}:
- Date: "${sample.date}"
- Time: "${sample.time}"
- Home Team: "${sample.homeTeam}"
- Away Team: "${sample.awayTeam}"
- Competition: "${sample.competition}"
${sample.venue ? `- Venue: "${sample.venue}"` : ''}
${sample.isCompleted ? `- Completed: "${sample.isCompleted}"` : ''}
${sample.homeScore !== undefined ? `- Home Score: "${sample.homeScore}"` : ''}
${sample.awayScore !== undefined ? `- Away Score: "${sample.awayScore}"` : ''}
`;
      setDataFormatting(formattingInfo);
      console.log(formattingInfo);
    }
    
    // Format the data as ScrapedFixture objects
    const formattedFixtures = fixtures.map((item: any): ScrapedFixture => ({
      homeTeam: item.homeTeam,
      awayTeam: item.awayTeam,
      date: item.date,
      time: item.time || '15:00',
      competition: item.competition || 'Highland League',
      venue: item.venue || 'TBD',
      isCompleted: !!item.isCompleted,
      homeScore: item.isCompleted ? item.homeScore : null,
      awayScore: item.isCompleted ? item.awayScore : null
    }));
    
    // Show a preview of the data before storing
    setResults(formattedFixtures);
    setSuccess(true);
    toast.success(`Found ${formattedFixtures.length} fixtures from Transfermarkt`);
  };

  const handleStoreFixtures = async () => {
    if (results.length === 0) {
      toast.error('No fixtures to store');
      return;
    }
    
    try {
      setIsLoading(true);
      toast.info('Storing fixtures in database...');
      
      // Store fixtures
      const success = await scrapeAndStoreFixtures(results);
      
      if (!success) {
        setError('Failed to store fixtures. The data format might be incorrect, or there might be RLS policy issues.');
        toast.error('Failed to store fixtures in database - check console for details');
        return;
      }
      
      setSuccess(true);
      toast.success(`Successfully imported ${results.length} fixtures`);
    } catch (error) {
      console.error('Error storing fixtures:', error);
      setError(error instanceof Error ? error.message : 'An unknown error occurred');
      toast.error('An error occurred while storing fixtures');
    } finally {
      setIsLoading(false);
    }
  };

  const handleExportFixtures = () => {
    if (results.length === 0) {
      toast.error('No fixtures to export');
      return;
    }

    const dataStr = JSON.stringify(results, null, 2);
    const dataUri = 'data:application/json;charset=utf-8,'+ encodeURIComponent(dataStr);
    const exportFileDefaultName = `banks-o-dee-fixtures-${new Date().toISOString().split('T')[0]}.json`;

    const linkElement = document.createElement('a');
    linkElement.setAttribute('href', dataUri);
    linkElement.setAttribute('download', exportFileDefaultName);
    linkElement.click();
    
    toast.success('Fixtures exported to JSON file');
  };
  
  return (
    <Card>
      <CardHeader>
        <CardTitle>Fixtures Importer</CardTitle>
        <CardDescription>
          Fetch and import fixtures from Transfermarkt
        </CardDescription>
      </CardHeader>
      
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="transfermarktUrl">Transfermarkt URL</Label>
          <div className="flex gap-2">
            <Input 
              id="transfermarktUrl" 
              value={transfermarktUrl} 
              onChange={(e) => setTransfermarktUrl(e.target.value)}
              placeholder="Enter Transfermarkt URL"
              className="flex-1"
            />
            <Button 
              variant="outline" 
              size="icon"
              onClick={() => window.open(transfermarktUrl, '_blank')}
              title="Open URL in new tab"
            >
              <Link2 className="h-4 w-4" />
            </Button>
          </div>
          <p className="text-xs text-muted-foreground">
            The default URL fetches fixtures for Banks O' Dee FC from the current season on Transfermarkt.
          </p>
        </div>
        
        <Button
          className="w-full"
          onClick={handleFetchFromTransfermarkt}
          disabled={isLoading}
        >
          {isLoading ? (
            <>
              <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
              Fetching from Transfermarkt...
            </>
          ) : (
            <>
              <RefreshCw className="mr-2 h-4 w-4" />
              Fetch from Transfermarkt
            </>
          )}
        </Button>
        
        {error && (
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>Error</AlertTitle>
            <AlertDescription className="space-y-2">
              <p>{error}</p>
              {htmlSample && (
                <details className="mt-2">
                  <summary className="text-xs cursor-pointer">HTML Sample (for debugging)</summary>
                  <pre className="mt-2 text-xs bg-gray-100 p-2 rounded-md overflow-x-auto max-h-40">
                    {htmlSample}
                  </pre>
                </details>
              )}
            </AlertDescription>
          </Alert>
        )}
        
        {dataFormatting && (
          <Alert className="bg-blue-50 border-blue-200">
            <Info className="h-4 w-4 text-blue-600" />
            <AlertTitle className="text-blue-800">Data Sample</AlertTitle>
            <AlertDescription className="text-blue-700">
              <pre className="text-xs bg-blue-50 p-2 rounded-md overflow-x-auto whitespace-pre-wrap">
                {dataFormatting}
              </pre>
            </AlertDescription>
          </Alert>
        )}
        
        {success && (
          <Alert className="bg-green-50 border-green-200">
            <Check className="h-4 w-4 text-green-600" />
            <AlertTitle className="text-green-800">Success</AlertTitle>
            <AlertDescription className="text-green-700">
              Successfully fetched {results.length} fixtures
            </AlertDescription>
          </Alert>
        )}
        
        {results.length > 0 && (
          <div className="mt-4">
            <h3 className="font-medium mb-2">Fetched Fixtures ({results.length}):</h3>
            <div className="max-h-60 overflow-y-auto border rounded-md p-4">
              {results.map((fixture, index) => (
                <div key={index} className="mb-2 text-sm">
                  {fixture.date} {fixture.time}: {fixture.homeTeam} vs {fixture.awayTeam}
                  {fixture.isCompleted && (
                    <span className="ml-2 text-green-600">
                      ({fixture.homeScore} - {fixture.awayScore})
                    </span>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}
      </CardContent>
      
      <CardFooter className="flex flex-col gap-3 sm:flex-row">
        {results.length > 0 && (
          <>
            <Button
              className="w-full"
              onClick={handleStoreFixtures}
              disabled={isLoading}
            >
              {isLoading ? (
                <>
                  <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                  Storing Fixtures...
                </>
              ) : (
                <>
                  <RefreshCw className="mr-2 h-4 w-4" />
                  Store Fixtures in Database
                </>
              )}
            </Button>
            
            <Button
              variant="outline"
              className="w-full"
              onClick={handleExportFixtures}
            >
              <Download className="mr-2 h-4 w-4" />
              Export to JSON
            </Button>
          </>
        )}
      </CardFooter>
    </Card>
  );
}
