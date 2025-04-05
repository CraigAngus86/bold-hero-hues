
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Card } from "@/components/ui/card";

const ScraperDocumentation = () => {
  return (
    <Card className="p-6">
      <h2 className="text-2xl font-semibold mb-4">Fixtures Management Documentation</h2>
      
      <div className="mb-6">
        <p className="text-gray-600">
          This documentation explains how to use the fixture scraping and management tools.
        </p>
      </div>
      
      <ScrollArea className="h-[500px] pr-4">
        <Accordion type="single" collapsible className="space-y-4">
          <AccordionItem value="about">
            <AccordionTrigger className="text-lg font-medium">About the Scraper</AccordionTrigger>
            <AccordionContent className="space-y-3 text-gray-600">
              <p>
                The fixture scraper automatically retrieves Banks o' Dee FC match data from official sources:
              </p>
              <ul className="list-disc pl-6 space-y-1">
                <li>BBC Sport (Highland League fixtures and results)</li>
                <li>Highland Football League website (comprehensive fixture list)</li>
              </ul>
              <p className="mt-2">
                Edge functions deployed on Supabase handle the actual web scraping operations 
                in the background, keeping the process secure and efficient.
              </p>
            </AccordionContent>
          </AccordionItem>
          
          <AccordionItem value="usage">
            <AccordionTrigger className="text-lg font-medium">How to Use</AccordionTrigger>
            <AccordionContent className="space-y-3 text-gray-600">
              <h4 className="font-medium text-gray-800">Step 1: Test the Connection</h4>
              <p>
                Start by clicking "Test Connection" to verify that the scraper service is available.
                This performs a quick check without actually importing any data.
              </p>
              
              <h4 className="font-medium text-gray-800 mt-3">Step 2: Import Fixtures</h4>
              <p>
                Choose one of the import sources:
              </p>
              <ul className="list-disc pl-6 space-y-1">
                <li><strong>Import from BBC Sport</strong> - Gets the most up-to-date results and upcoming fixtures from BBC Sport</li>
                <li><strong>Import from HFL Website</strong> - Retrieves all scheduled Highland League fixtures</li>
              </ul>
              
              <h4 className="font-medium text-gray-800 mt-3">Step 3: Review and Export</h4>
              <p>
                After importing, review the fixtures in the table below. 
                Use the Export button to download the data as JSON if needed.
              </p>
            </AccordionContent>
          </AccordionItem>
          
          <AccordionItem value="format">
            <AccordionTrigger className="text-lg font-medium">Fixture Data Format</AccordionTrigger>
            <AccordionContent className="space-y-3 text-gray-600">
              <p>The standard fixture format contains these fields:</p>
              
              <pre className="bg-gray-50 p-3 rounded overflow-x-auto my-2 text-xs">
{`{
  "date": "2023-08-26",       // Match date (YYYY-MM-DD)
  "time": "15:00",            // Kick-off time (24h format)
  "homeTeam": "Banks o' Dee", // Home team name
  "awayTeam": "Formartine",   // Away team name
  "competition": "Highland League", // Competition name
  "venue": "Spain Park",      // Stadium/venue (optional)
  "isCompleted": true,        // Whether match is completed
  "homeScore": 2,             // Home team score (for completed matches)
  "awayScore": 1              // Away team score (for completed matches)
}`}
              </pre>
              
              <p>
                When importing data manually, ensure it follows this format or the alternative
                Claude export format as described in the Import section.
              </p>
            </AccordionContent>
          </AccordionItem>
          
          <AccordionItem value="database">
            <AccordionTrigger className="text-lg font-medium">Database Structure</AccordionTrigger>
            <AccordionContent className="space-y-3 text-gray-600">
              <p>
                Fixtures are stored in the Supabase <code>fixtures</code> table with the following structure:
              </p>
              
              <table className="min-w-full text-xs mt-2">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="p-2 text-left">Column</th>
                    <th className="p-2 text-left">Type</th>
                    <th className="p-2 text-left">Description</th>
                  </tr>
                </thead>
                <tbody className="divide-y">
                  <tr>
                    <td className="p-2 font-mono">id</td>
                    <td className="p-2">UUID</td>
                    <td className="p-2">Unique identifier (auto-generated)</td>
                  </tr>
                  <tr>
                    <td className="p-2 font-mono">date</td>
                    <td className="p-2">DATE</td>
                    <td className="p-2">Match date</td>
                  </tr>
                  <tr>
                    <td className="p-2 font-mono">time</td>
                    <td className="p-2">TEXT</td>
                    <td className="p-2">Kick-off time</td>
                  </tr>
                  <tr>
                    <td className="p-2 font-mono">home_team</td>
                    <td className="p-2">TEXT</td>
                    <td className="p-2">Home team name</td>
                  </tr>
                  <tr>
                    <td className="p-2 font-mono">away_team</td>
                    <td className="p-2">TEXT</td>
                    <td className="p-2">Away team name</td>
                  </tr>
                  <tr>
                    <td className="p-2 font-mono">competition</td>
                    <td className="p-2">TEXT</td>
                    <td className="p-2">Competition name</td>
                  </tr>
                  <tr>
                    <td className="p-2 font-mono">is_completed</td>
                    <td className="p-2">BOOLEAN</td>
                    <td className="p-2">Whether match is completed</td>
                  </tr>
                  <tr>
                    <td className="p-2 font-mono">home_score</td>
                    <td className="p-2">INTEGER</td>
                    <td className="p-2">Home team score (nullable)</td>
                  </tr>
                  <tr>
                    <td className="p-2 font-mono">away_score</td>
                    <td className="p-2">INTEGER</td>
                    <td className="p-2">Away team score (nullable)</td>
                  </tr>
                  <tr>
                    <td className="p-2 font-mono">venue</td>
                    <td className="p-2">TEXT</td>
                    <td className="p-2">Stadium/venue (nullable)</td>
                  </tr>
                  <tr>
                    <td className="p-2 font-mono">source</td>
                    <td className="p-2">TEXT</td>
                    <td className="p-2">Source of the data (bbc-sport, highland-league, manual-import)</td>
                  </tr>
                </tbody>
              </table>
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      </ScrollArea>
    </Card>
  );
};

export default ScraperDocumentation;
