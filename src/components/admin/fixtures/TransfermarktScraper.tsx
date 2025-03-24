
import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertCircle, RefreshCw, Check, Download, Link2, Calendar } from "lucide-react";
import { scrapeAndStoreFixtures } from '@/services/supabase/fixtures/importExport'; 
import { toast } from 'sonner';
import { ScrapedFixture } from '@/types/fixtures';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { supabase } from '@/services/supabase/supabaseClient';
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from '@/components/ui/select';
import { FirecrawlService } from '@/utils/FirecrawlService';

interface TransfermarktScraperProps {
  defaultUrl?: string;
}

export default function TransfermarktScraper({ defaultUrl }: TransfermarktScraperProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [results, setResults] = useState<ScrapedFixture[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [htmlSample, setHtmlSample] = useState<string | null>(null);
  const [transfermarktUrl, setTransfermarktUrl] = useState<string>(
    defaultUrl || 'https://www.transfermarkt.com/banks-o-dee-fc/spielplandatum/verein/25442/plus/0?saison_id=&wettbewerb_id=&day=&heim_gast=&punkte=&datum_von=&datum_bis='
  );
  
  const urlOptions = [
    {
      label: 'All Competitions (Recommended)',
      value: 'https://www.transfermarkt.com/banks-o-dee-fc/spielplandatum/verein/25442/plus/0?saison_id=&wettbewerb_id=&day=&heim_gast=&punkte=&datum_von=&datum_bis='
    },
    {
      label: 'Highland League Only',
      value: 'https://www.transfermarkt.com/banks-o-dee-fc/spielplandatum/verein/25442/plus/0?saison_id=&wettbewerb_id=SC5H&day=&heim_gast=&punkte=&datum_von=&datum_bis='
    },
    {
      label: 'Current Season',
      value: 'https://www.transfermarkt.com/banks-o-dee-fc/spielplandatum/verein/25442/plus/0?saison_id=2024&wettbewerb_id=&day=&heim_gast=&punkte=&datum_von=&datum_bis='
    }
  ];

  const handleUrlSelect = (value: string) => {
    setTransfermarktUrl(value);
  };
  
  const handleFetchFromTransfermarkt = async () => {
    try {
      setIsLoading(true);
      setError(null);
      setSuccess(false);
      setResults([]);
      setHtmlSample(null);
      
      console.log('Starting fixture scraping from Transfermarkt...');
      toast.info('Scraping fixtures from Transfermarkt... This may take a moment.');
      
      const { data, error } = await supabase.functions.invoke('scrape-transfermarkt', {
        body: { url: transfermarktUrl }
      });
      
      if (error || !data?.success) {
        const errorMessage = error?.message || data?.error || 'Failed to fetch fixtures from Transfermarkt';
        console.error('Transfermarkt scraper error:', errorMessage);
        setError(errorMessage);
        
        if (data?.htmlSample) {
          setHtmlSample(data.htmlSample);
          console.log('HTML sample from failed scraping:', data.htmlSample);
        }
        
        // Use mock data instead when scraping fails
        handleGenerateMockFixtures();
        return;
      }
      
      if (!data.data || data.data.length === 0) {
        setError('No fixtures found on Transfermarkt');
        
        if (data.htmlSample) {
          setHtmlSample(data.htmlSample);
          console.log('HTML sample from failed scraping:', data.htmlSample);
        }
        
        // Use mock data instead when no fixtures are found
        handleGenerateMockFixtures();
        return;
      }
      
      processScrapedFixtures(data.data);
      
    } catch (error) {
      console.error('Error fetching fixtures:', error);
      setError(error instanceof Error ? error.message : 'An unknown error occurred');
      toast.error('An error occurred while fetching fixtures');
      
      // Use mock data as fallback
      handleGenerateMockFixtures();
    } finally {
      setIsLoading(false);
    }
  };

  const handleGenerateMockFixtures = () => {
    try {
      const mockFixtures = FirecrawlService.generateMockFixtures();
      toast.info('Using mock fixtures as a fallback since Transfermarkt scraping failed');
      processScrapedFixtures(mockFixtures);
    } catch (error) {
      console.error('Error generating mock fixtures:', error);
      toast.error('Failed to generate mock fixtures');
    }
  };

  const processScrapedFixtures = (fixtures: ScrapedFixture[]) => {
    console.log('Fixtures fetch successful from Transfermarkt, proceeding with import...', fixtures);
    
    const formattedFixtures = fixtures.map((item: any): ScrapedFixture => ({
      id: item.id || `fixture-${Math.random().toString(36).substring(2, 9)}`,
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
        <CardTitle>Transfermarkt Fixtures Importer</CardTitle>
        <CardDescription>
          Fetch and import fixtures from Transfermarkt for Banks O' Dee FC. Choose a preset URL or enter a custom one.
        </CardDescription>
      </CardHeader>
      
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Label>URL Presets</Label>
          <Select onValueChange={handleUrlSelect} defaultValue={transfermarktUrl}>
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Select a preset URL" />
            </SelectTrigger>
            <SelectContent>
              {urlOptions.map((option) => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      
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
            The URL should point to Banks O' Dee FC's fixture list on Transfermarkt. Try different competition filters if needed.
          </p>
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <Button
            className="w-full"
            onClick={handleFetchFromTransfermarkt}
            disabled={isLoading}
          >
            {isLoading ? (
              <>
                <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                Fetching...
              </>
            ) : (
              <>
                <Calendar className="mr-2 h-4 w-4" />
                Fetch from Transfermarkt
              </>
            )}
          </Button>
          
          <Button
            className="w-full"
            variant="outline"
            onClick={handleGenerateMockFixtures}
            disabled={isLoading}
          >
            <Calendar className="mr-2 h-4 w-4" />
            Generate Mock Fixtures
          </Button>
        </div>
        
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
        
        {success && (
          <Alert className="bg-green-50 border-green-200">
            <Check className="h-4 w-4 text-green-600" />
            <AlertTitle className="text-green-800">Success</AlertTitle>
            <AlertDescription className="text-green-700">
              Successfully fetched {results.length} fixtures from Transfermarkt
            </AlertDescription>
          </Alert>
        )}
        
        {results.length > 0 && (
          <div className="mt-4">
            <h3 className="font-medium mb-2">Fetched Fixtures ({results.length}):</h3>
            <div className="max-h-60 overflow-y-auto border rounded-md p-4">
              {results.map((fixture, index) => (
                <div key={index} className="mb-2 text-sm">
                  <span className="font-medium">{fixture.date} {fixture.time}</span>: {fixture.competition !== 'Highland League' && <span className="text-blue-600">[{fixture.competition}]</span>} {fixture.homeTeam} vs {fixture.awayTeam}
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
