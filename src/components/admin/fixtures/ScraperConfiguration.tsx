
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { toast } from 'sonner';
import { Clock, Play, Settings, BookOpen, Save, RotateCw, Calendar } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Textarea } from '@/components/ui/textarea';
import { ScraperLogs } from '@/components/admin/fixtures/ScraperLogs';

export const ScraperConfiguration: React.FC = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [activeTab, setActiveTab] = useState('settings');
  
  const [config, setConfig] = useState({
    enabled: true,
    schedule: 'daily',
    scheduleTime: '09:00',
    sourceUrl: 'https://www.bbc.com/sport/football/scottish-highland-league/scores-fixtures',
    teamMapping: JSON.stringify({
      'Banks o\' Dee': 'Banks o\' Dee FC',
      'Brechin': 'Brechin City FC',
      'Brora Rangers': 'Brora Rangers FC',
      'Buckie Thistle': 'Buckie Thistle FC',
      'Clachnacuddin': 'Clachnacuddin FC',
      'Deveronvale': 'Deveronvale FC',
      'Formartine Utd': 'Formartine United FC',
      'Forres Mechanics': 'Forres Mechanics FC',
      'Fraserburgh': 'Fraserburgh FC',
      'Huntly': 'Huntly FC',
      'Inverurie Loco Works': 'Inverurie Loco Works FC',
      'Keith': 'Keith FC',
      'Lossiemouth': 'Lossiemouth FC',
      'Nairn County': 'Nairn County FC',
      'Rothes': 'Rothes FC',
      'Strathspey Thistle': 'Strathspey Thistle FC',
      'Turriff Utd': 'Turriff United FC',
      'Wick Academy': 'Wick Academy FC',
    }, null, 2),
    competitionMapping: JSON.stringify({
      'Scottish Highland': 'Highland League',
      'Highland League Cup': 'Highland League Cup',
      'Scottish Cup': 'Scottish Cup',
    }, null, 2),
    saveUnmatchedTeams: true,
    overwriteExistingResults: false,
  });
  
  const handleSaveConfig = async () => {
    setIsLoading(true);
    try {
      // Mock API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      toast.success('Scraper configuration saved successfully');
    } catch (error) {
      console.error('Error saving configuration:', error);
      toast.error('Failed to save configuration');
    } finally {
      setIsLoading(false);
    }
  };
  
  const handleRunScraper = async () => {
    setIsLoading(true);
    try {
      // Mock API call
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      toast.success('Scraper executed successfully, 8 fixtures imported');
    } catch (error) {
      console.error('Error running scraper:', error);
      toast.error('Failed to run scraper');
    } finally {
      setIsLoading(false);
    }
  };
  
  return (
    <Card>
      <CardHeader>
        <CardTitle>BBC Scraper Configuration</CardTitle>
      </CardHeader>
      <CardContent>
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="mb-6">
            <TabsTrigger value="settings">
              <Settings className="h-4 w-4 mr-2" /> Settings
            </TabsTrigger>
            <TabsTrigger value="logs">
              <BookOpen className="h-4 w-4 mr-2" /> Logs
            </TabsTrigger>
            <TabsTrigger value="docs">
              <BookOpen className="h-4 w-4 mr-2" /> Documentation
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="settings" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="text-base font-medium">General Settings</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label>Enable Scraper</Label>
                      <p className="text-sm text-muted-foreground">
                        Activate or deactivate the scraper
                      </p>
                    </div>
                    <Switch
                      checked={config.enabled}
                      onCheckedChange={(checked) => setConfig({...config, enabled: checked})}
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label>Schedule</Label>
                    <Select
                      value={config.schedule}
                      onValueChange={(value) => setConfig({...config, schedule: value})}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select schedule" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="daily">Daily</SelectItem>
                        <SelectItem value="weekly">Weekly</SelectItem>
                        <SelectItem value="manual">Manual Only</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  {config.schedule !== 'manual' && (
                    <div className="space-y-2">
                      <Label>Schedule Time</Label>
                      <div className="relative">
                        <Clock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                        <Input
                          type="time"
                          value={config.scheduleTime}
                          onChange={(e) => setConfig({...config, scheduleTime: e.target.value})}
                          className="pl-10"
                        />
                      </div>
                    </div>
                  )}
                  
                  <div className="space-y-2">
                    <Label>Source URL</Label>
                    <Input
                      value={config.sourceUrl}
                      onChange={(e) => setConfig({...config, sourceUrl: e.target.value})}
                      placeholder="URL to scrape"
                    />
                    <p className="text-xs text-muted-foreground">
                      URL of the BBC Sport fixtures page to scrape
                    </p>
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader>
                  <CardTitle className="text-base font-medium">Data Handling</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label>Save Unmatched Teams</Label>
                      <p className="text-sm text-muted-foreground">
                        Save fixtures with team names that don't match the mapping
                      </p>
                    </div>
                    <Switch
                      checked={config.saveUnmatchedTeams}
                      onCheckedChange={(checked) => setConfig({...config, saveUnmatchedTeams: checked})}
                    />
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label>Overwrite Existing Results</Label>
                      <p className="text-sm text-muted-foreground">
                        Update scores for existing completed fixtures
                      </p>
                    </div>
                    <Switch
                      checked={config.overwriteExistingResults}
                      onCheckedChange={(checked) => setConfig({...config, overwriteExistingResults: checked})}
                    />
                  </div>
                </CardContent>
              </Card>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="text-base font-medium">Team Name Mapping</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <Label>Map BBC Team Names to Your Database Names</Label>
                    <Textarea
                      value={config.teamMapping}
                      onChange={(e) => setConfig({...config, teamMapping: e.target.value})}
                      className="h-[300px] font-mono text-sm"
                    />
                    <p className="text-xs text-muted-foreground">
                      JSON mapping of BBC team names to your database team names
                    </p>
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader>
                  <CardTitle className="text-base font-medium">Competition Mapping</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <Label>Map BBC Competition Names to Your Database Names</Label>
                    <Textarea
                      value={config.competitionMapping}
                      onChange={(e) => setConfig({...config, competitionMapping: e.target.value})}
                      className="h-[300px] font-mono text-sm"
                    />
                    <p className="text-xs text-muted-foreground">
                      JSON mapping of BBC competition names to your database competition names
                    </p>
                  </div>
                </CardContent>
              </Card>
            </div>
            
            <div className="flex space-x-3 justify-end">
              <Button
                onClick={handleRunScraper}
                variant="outline"
                disabled={isLoading}
              >
                <Play className="mr-2 h-4 w-4" />
                Run Now
              </Button>
              
              <Button
                onClick={handleSaveConfig}
                disabled={isLoading}
              >
                <Save className="mr-2 h-4 w-4" />
                Save Configuration
              </Button>
            </div>
          </TabsContent>
          
          <TabsContent value="logs">
            <ScraperLogs />
          </TabsContent>
          
          <TabsContent value="docs">
            <Card>
              <CardHeader>
                <CardTitle>BBC Scraper Documentation</CardTitle>
              </CardHeader>
              <CardContent className="prose prose-sm max-w-none dark:prose-invert">
                <h3>Overview</h3>
                <p>
                  The BBC Scraper automatically retrieves fixture data from the BBC Sport website
                  and imports it into your database, saving you the time and effort of manual entry.
                </p>
                
                <h3>Key Features</h3>
                <ul>
                  <li>Automated scraping on a schedule (daily or weekly)</li>
                  <li>Custom team name and competition mapping</li>
                  <li>Automatic fixture creation and score updates</li>
                  <li>Detailed logging for troubleshooting</li>
                </ul>
                
                <h3>Configuration</h3>
                <p>
                  <strong>Team Name Mapping</strong> - This JSON object maps BBC team names (keys) to your 
                  database team names (values). Any team names not in this mapping will either be skipped 
                  or saved with their original name depending on your settings.
                </p>
                
                <p>
                  <strong>Competition Mapping</strong> - Similar to team mapping, this JSON object maps 
                  BBC competition names to your database competition names.
                </p>
                
                <h3>Best Practices</h3>
                <ul>
                  <li>Run the scraper manually after configuration changes to verify it works correctly</li>
                  <li>Check the logs regularly to ensure data is being imported correctly</li>
                  <li>Keep your mappings up to date as team names may change</li>
                </ul>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};
