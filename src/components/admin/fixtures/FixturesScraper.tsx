import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Progress } from '@/components/ui/progress';
import { RefreshCw, Search, AlertTriangle, Check } from 'lucide-react';
import { toast } from 'sonner';
import { useFixtureScraping } from '@/hooks/useFixtureScraping';
import { Match } from '@/components/fixtures/types';

interface ScrapedFixture extends Omit<Match, 'id'> {
  id?: string;
}

const FixturesScraper: React.FC = () => {
  const [source, setSource] = useState('bbc');
  const [url, setUrl] = useState('');
  const [searchTerms, setSearchTerms] = useState('');
  const [scrapedMatches, setScrapedMatches] = useState<Match[]>([]);
  const { isLoading, progress, error, scrapeFixtures } = useFixtureScraping();
  
  // Function to handle scraping
  const handleScrape = async () => {
    if (source === 'custom' && !url) {
      toast.error('Please enter a URL for custom scraping');
      return;
    }
    
    if (source === 'search' && !searchTerms) {
      toast.error('Please enter search terms for scraping');
      return;
    }
    
    try {
      if (source === 'custom') {
        await scrapeFixtures(source, url);
      } else if (source === 'search') {
        await scrapeFixtures(source, searchTerms);
      } else {
        await scrapeFixtures(source);
      }
    } catch (err) {
      console.error('Scraping error:', err);
      toast.error('Failed to scrape fixtures');
    }
  };
  
  // Function to handle scraped matches
  const handleScrapedMatches = (scraped: ScrapedFixture[]) => {
    // Convert ScrapedFixture[] to Match[] by ensuring all items have IDs
    const matches: Match[] = scraped.map(fixture => ({
      ...fixture,
      id: fixture.id || `temp-${Date.now()}-${Math.random().toString(36).substr(2, 9)}` // Generate ID if missing
    }));
    
    setScrapedMatches(matches);
  };
  
  return (
    <Card>
      <CardHeader>
        <CardTitle>Scrape Fixtures</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <Alert variant="outline">
          <AlertTitle>Select a Source</AlertTitle>
          <AlertDescription>
            Choose a source to scrape fixtures from.
          </AlertDescription>
        </Alert>
        
        <div className="grid gap-4">
          <Select value={source} onValueChange={setSource}>
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Select a source" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="bbc">BBC Sport</SelectItem>
              <SelectItem value="hfl">Highland League</SelectItem>
              <SelectItem value="custom">Custom URL</SelectItem>
              <SelectItem value="search">Search Terms</SelectItem>
            </SelectContent>
          </Select>
          
          {source === 'custom' && (
            <Input 
              type="url" 
              placeholder="Enter URL to scrape" 
              value={url} 
              onChange={(e) => setUrl(e.target.value)} 
            />
          )}
          
          {source === 'search' && (
            <Input 
              type="text" 
              placeholder="Enter search terms" 
              value={searchTerms} 
              onChange={(e) => setSearchTerms(e.target.value)} 
            />
          )}
          
          <Button 
            onClick={handleScrape} 
            disabled={isLoading}
            className="w-full"
          >
            {isLoading ? (
              <>
                <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                Scraping... ({progress}%)
              </>
            ) : (
              <>
                <Search className="h-4 w-4 mr-2" />
                Start Scraping
              </>
            )}
          </Button>
          
          {isLoading && (
            <Progress value={progress} />
          )}
          
          {error && (
            <Alert variant="destructive">
              <AlertTriangle className="h-4 w-4" />
              <AlertTitle>Error</AlertTitle>
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}
          
          {scrapedMatches.length > 0 && (
            <Alert variant="success">
              <Check className="h-4 w-4" />
              <AlertTitle>Scraped Matches</AlertTitle>
              <AlertDescription>
                Successfully scraped {scrapedMatches.length} matches.
              </AlertDescription>
            </Alert>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default FixturesScraper;
