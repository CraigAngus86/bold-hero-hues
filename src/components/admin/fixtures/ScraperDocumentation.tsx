
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { InfoIcon } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

export default function ScraperDocumentation() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Fixtures Integration Documentation</CardTitle>
        <CardDescription>
          How to use the fixtures scraper and importer with Supabase
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <Alert>
          <InfoIcon className="h-4 w-4" />
          <AlertTitle>Integration Guide</AlertTitle>
          <AlertDescription>
            This guide explains how the Banks o' Dee FC fixtures scraper and importer integrate with Supabase.
          </AlertDescription>
        </Alert>
        
        <Tabs defaultValue="overview">
          <TabsList>
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="scraper">Using the Scraper</TabsTrigger>
            <TabsTrigger value="importer">Using the Importer</TabsTrigger>
            <TabsTrigger value="formats">Data Formats</TabsTrigger>
          </TabsList>
          
          <TabsContent value="overview" className="space-y-4">
            <h3 className="text-lg font-medium">Data Flow Architecture</h3>
            <div className="p-4 bg-gray-50 border rounded-md">
              <p className="text-muted-foreground">
                <code>BBC Sport Website → Web Scraper → Supabase Database → Website Display</code>
              </p>
              <ol className="mt-2 space-y-1 list-decimal list-inside text-sm">
                <li>The scraper fetches fixture data from BBC Sport</li>
                <li>The data is processed and stored in Supabase</li>
                <li>The frontend retrieves the data from Supabase</li>
                <li>The fixtures are displayed on your website</li>
              </ol>
            </div>
            
            <h3 className="text-lg font-medium">Database Structure</h3>
            <p className="text-sm text-muted-foreground">
              All fixtures are stored in the <code>fixtures</code> table in Supabase with the following key fields:
            </p>
            <div className="text-xs font-mono p-4 bg-gray-50 border rounded-md">
              <ul className="space-y-1">
                <li>id (uuid): Unique identifier</li>
                <li>home_team (text): Home team name</li>
                <li>away_team (text): Away team name</li>
                <li>date (text): Match date</li>
                <li>time (text): Kick-off time</li>
                <li>competition (text): Competition name</li>
                <li>venue (text): Venue name</li>
                <li>is_completed (boolean): Whether the match is completed</li>
                <li>home_score (integer): Home team score</li>
                <li>away_score (integer): Away team score</li>
                <li>source (text): Data source (e.g. "bbc-sport")</li>
                <li>import_date (timestamp): When the fixture was imported</li>
              </ul>
            </div>
          </TabsContent>
          
          <TabsContent value="scraper" className="space-y-4">
            <h3 className="text-lg font-medium">Using the Scraper</h3>
            <p className="text-sm text-muted-foreground mb-4">
              The scraper allows you to fetch fixtures data from official sources and store it in the database.
            </p>
            
            <h4 className="font-medium">Scraper Functions:</h4>
            <ul className="list-disc list-inside text-sm space-y-2">
              <li><strong>Test Fetch</strong>: Tests the connection and retrieves a sample of fixtures without storing them</li>
              <li><strong>Fetch BBC Sport</strong>: Scrapes fixtures from BBC Sport and stores them in the database</li>
              <li><strong>Fetch Highland League</strong>: Retrieves fixtures from the Highland Football League website</li>
            </ul>
            
            <div className="p-4 bg-amber-50 border border-amber-200 rounded-md mt-4">
              <h4 className="font-medium text-amber-800">Troubleshooting:</h4>
              <ul className="list-disc list-inside text-sm text-amber-700 space-y-1 mt-2">
                <li>If the scraper fails, check the console for detailed error messages</li>
                <li>The BBC Sport website structure may change, requiring scraper updates</li>
                <li>You can export fixtures to JSON as a backup before attempting updates</li>
              </ul>
            </div>
          </TabsContent>
          
          <TabsContent value="importer" className="space-y-4">
            <h3 className="text-lg font-medium">Using the Importer</h3>
            <p className="text-sm text-muted-foreground">
              The importer allows you to upload fixture data from a JSON file, useful for bulk imports or restoring from backups.
            </p>
            
            <h4 className="font-medium">Import Process:</h4>
            <ol className="list-decimal list-inside text-sm space-y-1">
              <li>Prepare a JSON file with fixture data in one of the supported formats</li>
              <li>Upload the file using the file selector</li>
              <li>The system will validate the JSON structure</li>
              <li>If valid, fixtures will be imported into the database</li>
              <li>Existing fixtures are updated, new fixtures are added</li>
            </ol>
            
            <div className="p-4 bg-blue-50 border border-blue-200 rounded-md mt-4">
              <h4 className="font-medium text-blue-800">Best Practices:</h4>
              <ul className="list-disc list-inside text-sm text-blue-700 space-y-1 mt-2">
                <li>Always export current fixtures before large imports as a backup</li>
                <li>Test imports with a small number of fixtures first</li>
                <li>Check the format documentation to ensure your JSON matches expected format</li>
              </ul>
            </div>
          </TabsContent>
          
          <TabsContent value="formats" className="space-y-4">
            <h3 className="text-lg font-medium">Supported Data Formats</h3>
            <p className="text-sm text-muted-foreground">
              The system supports multiple JSON formats for fixture data.
            </p>
            
            <div className="space-y-4 mt-4">
              <div>
                <h4 className="font-medium">Standard Format:</h4>
                <div className="text-xs font-mono p-4 bg-gray-50 border rounded-md">
{`[
  {
    "homeTeam": "Banks o' Dee FC",
    "awayTeam": "Opponent Team",
    "date": "2023-04-15",
    "time": "15:00",
    "competition": "Highland League",
    "venue": "Stadium Name",
    "isCompleted": false,
    "homeScore": null,
    "awayScore": null
  }
]`}
                </div>
              </div>
              
              <div>
                <h4 className="font-medium">Claude Format:</h4>
                <div className="text-xs font-mono p-4 bg-gray-50 border rounded-md">
{`[
  {
    "opposition": "Opponent Team",
    "location": "Home",
    "date": "2023-04-15",
    "kickOffTime": "15:00",
    "competition": "Highland League",
    "score": "2-1",
    "isCompleted": true
  }
]`}
                </div>
                <p className="text-xs text-muted-foreground mt-1">
                  Note: In Claude format, "Banks o' Dee FC" is always assumed to be one of the teams, with the other being the "opposition".
                </p>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
}
