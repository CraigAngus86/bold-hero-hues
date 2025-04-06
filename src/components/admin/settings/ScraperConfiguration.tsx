
import React, { useState } from 'react';
import {
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle,
  CardFooter
} from '@/components/ui/card';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Separator } from '@/components/ui/separator';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { 
  RotateCcw, 
  Clock, 
  AlertCircle, 
  CheckCircle2, 
  Play, 
  Calendar, 
  Settings, 
  ListFilter,
  AlertTriangle,
  FileJson,
  Activity,
  ClipboardCheck
} from 'lucide-react';
import { toast } from '@/hooks/use-toast';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';

// Define the schema for scraper configuration form
const scraperConfigSchema = z.object({
  // Schedule Settings
  isAutomatic: z.boolean().default(true),
  frequency: z.string(),
  timeOfDay: z.string(),
  daysOfWeek: z.string().array(),
  
  // BBC Highland League Scraper
  bbcUrl: z.string().url({ message: "Please enter a valid URL" }),
  teamMapping: z.string(),
  includePreSeason: z.boolean().default(false),
  
  // Notification Settings
  emailNotifications: z.boolean().default(true),
  notificationEmail: z.string().email({ message: "Please enter a valid email" }).optional(),
  failureAlerts: z.boolean().default(true),
  successAlerts: z.boolean().default(false),
});

type ScraperConfigValues = z.infer<typeof scraperConfigSchema>;

// Mock scraper logs data
const scraperLogs = [
  { 
    id: '1', 
    timestamp: '2025-04-06 08:30:22', 
    source: 'BBC Highland League', 
    status: 'success', 
    matches: 12, 
    added: 3, 
    updated: 2,
    message: 'Successfully fetched fixtures data'
  },
  { 
    id: '2', 
    timestamp: '2025-04-05 08:30:15', 
    source: 'BBC Highland League', 
    status: 'success', 
    matches: 12, 
    added: 0, 
    updated: 0,
    message: 'No new fixtures found'
  },
  { 
    id: '3', 
    timestamp: '2025-04-04 08:30:20', 
    source: 'BBC Highland League', 
    status: 'error', 
    matches: 0, 
    added: 0, 
    updated: 0,
    message: 'Failed to connect to BBC website'
  },
  { 
    id: '4', 
    timestamp: '2025-04-03 08:30:18', 
    source: 'BBC Highland League', 
    status: 'success', 
    matches: 12, 
    added: 0, 
    updated: 2,
    message: 'Successfully updated fixtures data'
  },
  { 
    id: '5', 
    timestamp: '2025-04-02 08:30:12', 
    source: 'BBC Highland League', 
    status: 'success', 
    matches: 12, 
    added: 0, 
    updated: 5,
    message: 'Successfully updated fixtures data'
  },
];

const ScraperConfiguration = () => {
  const [activeTab, setActiveTab] = useState('settings');
  const [isRunning, setIsRunning] = useState(false);
  
  // Setup form with validation
  const form = useForm<ScraperConfigValues>({
    resolver: zodResolver(scraperConfigSchema),
    defaultValues: {
      isAutomatic: true,
      frequency: 'daily',
      timeOfDay: '08:30',
      daysOfWeek: ['1', '2', '3', '4', '5', '6', '7'],
      bbcUrl: 'https://www.bbc.co.uk/sport/football/highland-league/scores-fixtures',
      teamMapping: JSON.stringify({
        "Banks O' Dee": "Banks o' Dee FC",
        "Fraserburgh": "Fraserburgh FC",
        "Buckie Thistle": "Buckie Thistle FC"
      }, null, 2),
      includePreSeason: false,
      emailNotifications: true,
      notificationEmail: 'admin@banksofdeefc.co.uk',
      failureAlerts: true,
      successAlerts: false,
    },
  });

  // Handle form submission
  const onSubmit = (values: ScraperConfigValues) => {
    console.log(values);
    
    toast({
      title: "Settings saved",
      description: "Scraper configuration has been updated.",
    });
  };
  
  // Trigger manual scrape
  const handleManualScrape = () => {
    setIsRunning(true);
    
    // Simulate scraping operation
    setTimeout(() => {
      setIsRunning(false);
      toast({
        title: "Scraper completed",
        description: "Fixtures data has been updated successfully.",
      });
    }, 3000);
  };

  return (
    <div className="space-y-6">
      <Tabs defaultValue={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="settings">
            <Settings className="h-4 w-4 mr-2" />
            Configuration
          </TabsTrigger>
          <TabsTrigger value="logs">
            <Activity className="h-4 w-4 mr-2" />
            Logs & History
          </TabsTrigger>
          <TabsTrigger value="manual">
            <Play className="h-4 w-4 mr-2" />
            Manual Run
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="settings" className="space-y-4 pt-4">
          <Card>
            <CardHeader>
              <CardTitle>Scraper Configuration</CardTitle>
              <CardDescription>
                Configure the fixtures and results scraper settings
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                  {/* Schedule Settings */}
                  <div className="space-y-4">
                    <h3 className="text-lg font-medium">Schedule Settings</h3>
                    <Separator />

                    <FormField
                      control={form.control}
                      name="isAutomatic"
                      render={({ field }) => (
                        <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                          <div className="space-y-0.5">
                            <FormLabel className="text-base">Automatic Scraping</FormLabel>
                            <FormDescription>
                              Enable scheduled automatic data collection
                            </FormDescription>
                          </div>
                          <FormControl>
                            <Switch
                              checked={field.value}
                              onCheckedChange={field.onChange}
                            />
                          </FormControl>
                        </FormItem>
                      )}
                    />

                    <div className={!form.watch('isAutomatic') ? 'opacity-50 pointer-events-none' : ''}>
                      <FormField
                        control={form.control}
                        name="frequency"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Scraping Frequency</FormLabel>
                            <Select 
                              disabled={!form.watch('isAutomatic')}
                              onValueChange={field.onChange} 
                              defaultValue={field.value}
                            >
                              <FormControl>
                                <SelectTrigger>
                                  <SelectValue placeholder="Select frequency" />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                <SelectItem value="hourly">Hourly</SelectItem>
                                <SelectItem value="daily">Daily</SelectItem>
                                <SelectItem value="weekly">Weekly</SelectItem>
                              </SelectContent>
                            </Select>
                            <FormDescription>
                              <Clock className="h-3.5 w-3.5 inline mr-1" />
                              How often the scraper should run
                            </FormDescription>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="timeOfDay"
                        render={({ field }) => (
                          <FormItem className="mt-4">
                            <FormLabel>Time of Day</FormLabel>
                            <FormControl>
                              <Input 
                                type="time"
                                {...field}
                                disabled={!form.watch('isAutomatic')}
                              />
                            </FormControl>
                            <FormDescription>
                              <Clock className="h-3.5 w-3.5 inline mr-1" />
                              When the scraper should run (24-hour format)
                            </FormDescription>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                  </div>

                  {/* BBC Highland League Scraper */}
                  <div className="space-y-4 pt-4">
                    <h3 className="text-lg font-medium">BBC Highland League Scraper</h3>
                    <Separator />

                    <FormField
                      control={form.control}
                      name="bbcUrl"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Source URL</FormLabel>
                          <FormControl>
                            <Input {...field} />
                          </FormControl>
                          <FormDescription>
                            URL of the BBC Highland League fixtures page
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="teamMapping"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Team Name Mapping</FormLabel>
                          <FormControl>
                            <textarea
                              className="flex min-h-[150px] w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50 font-mono"
                              {...field}
                            />
                          </FormControl>
                          <FormDescription>
                            <FileJson className="h-3.5 w-3.5 inline mr-1" />
                            JSON mapping of BBC team names to your database team names
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="includePreSeason"
                      render={({ field }) => (
                        <FormItem className="flex flex-row items-center space-x-3 rounded-md border p-4">
                          <FormControl>
                            <Switch
                              checked={field.value}
                              onCheckedChange={field.onChange}
                            />
                          </FormControl>
                          <div className="space-y-0.5">
                            <FormLabel>Include Pre-Season Fixtures</FormLabel>
                            <FormDescription>
                              Collect friendly and pre-season fixture data
                            </FormDescription>
                          </div>
                        </FormItem>
                      )}
                    />
                  </div>

                  {/* Notification Settings */}
                  <div className="space-y-4 pt-4">
                    <h3 className="text-lg font-medium">Notification Settings</h3>
                    <Separator />

                    <FormField
                      control={form.control}
                      name="emailNotifications"
                      render={({ field }) => (
                        <FormItem className="flex flex-row items-center space-x-3 rounded-md border p-4">
                          <FormControl>
                            <Switch
                              checked={field.value}
                              onCheckedChange={field.onChange}
                            />
                          </FormControl>
                          <div className="space-y-0.5">
                            <FormLabel>Email Notifications</FormLabel>
                            <FormDescription>
                              Receive email alerts about scraper activity
                            </FormDescription>
                          </div>
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="notificationEmail"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Notification Email</FormLabel>
                          <FormControl>
                            <Input 
                              {...field} 
                              disabled={!form.watch('emailNotifications')}
                            />
                          </FormControl>
                          <FormDescription>
                            Where to send scraper notifications
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <div className={!form.watch('emailNotifications') ? 'opacity-50 pointer-events-none' : ''}>
                      <div className="grid grid-cols-2 gap-4 mt-2">
                        <FormField
                          control={form.control}
                          name="failureAlerts"
                          render={({ field }) => (
                            <FormItem className="flex flex-row items-center space-x-2 rounded-md border p-3">
                              <FormControl>
                                <Switch
                                  checked={field.value}
                                  onCheckedChange={field.onChange}
                                  disabled={!form.watch('emailNotifications')}
                                />
                              </FormControl>
                              <div>
                                <FormLabel>Failure Alerts</FormLabel>
                                <FormDescription className="text-xs">
                                  Send email on errors
                                </FormDescription>
                              </div>
                            </FormItem>
                          )}
                        />
                        
                        <FormField
                          control={form.control}
                          name="successAlerts"
                          render={({ field }) => (
                            <FormItem className="flex flex-row items-center space-x-2 rounded-md border p-3">
                              <FormControl>
                                <Switch
                                  checked={field.value}
                                  onCheckedChange={field.onChange}
                                  disabled={!form.watch('emailNotifications')}
                                />
                              </FormControl>
                              <div>
                                <FormLabel>Success Alerts</FormLabel>
                                <FormDescription className="text-xs">
                                  Send email on success
                                </FormDescription>
                              </div>
                            </FormItem>
                          )}
                        />
                      </div>
                    </div>
                  </div>

                  <CardFooter className="flex justify-end border-t pt-5 mt-6">
                    <Button type="submit">Save Configuration</Button>
                  </CardFooter>
                </form>
              </Form>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="logs" className="space-y-4 pt-4">
          <Card>
            <CardHeader>
              <CardTitle>Scraper Logs</CardTitle>
              <CardDescription>
                View historical scraper activity and outcomes
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Date & Time</TableHead>
                    <TableHead>Source</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Matches</TableHead>
                    <TableHead>Changes</TableHead>
                    <TableHead>Message</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {scraperLogs.map((log) => (
                    <TableRow key={log.id}>
                      <TableCell>{log.timestamp}</TableCell>
                      <TableCell>{log.source}</TableCell>
                      <TableCell>
                        {log.status === 'success' ? (
                          <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
                            <CheckCircle2 className="h-3 w-3 mr-1" />
                            Success
                          </Badge>
                        ) : (
                          <Badge variant="destructive">
                            <AlertCircle className="h-3 w-3 mr-1" />
                            Error
                          </Badge>
                        )}
                      </TableCell>
                      <TableCell>{log.matches}</TableCell>
                      <TableCell>
                        {log.added > 0 || log.updated > 0 ? (
                          <span className="text-xs">
                            {log.added > 0 && <span className="text-green-600">+{log.added}</span>}
                            {log.added > 0 && log.updated > 0 && ', '}
                            {log.updated > 0 && <span className="text-amber-600">{log.updated} updated</span>}
                          </span>
                        ) : (
                          <span className="text-xs text-gray-500">No changes</span>
                        )}
                      </TableCell>
                      <TableCell className="max-w-[200px] truncate">
                        {log.message}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
            <CardFooter className="flex justify-between border-t pt-5">
              <div className="text-sm text-muted-foreground">
                Showing most recent 5 entries
              </div>
              <Button variant="outline" size="sm">View All Logs</Button>
            </CardFooter>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle>Scraper Statistics</CardTitle>
              <CardDescription>
                Key metrics about the scraper's performance
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="rounded-lg border p-4">
                  <div className="text-muted-foreground text-sm">Success Rate</div>
                  <div className="text-2xl font-bold mt-1">80%</div>
                  <div className="text-xs text-muted-foreground mt-1">Last 30 days</div>
                </div>
                
                <div className="rounded-lg border p-4">
                  <div className="text-muted-foreground text-sm">Average Execution Time</div>
                  <div className="text-2xl font-bold mt-1">4.2s</div>
                  <div className="text-xs text-muted-foreground mt-1">Last 30 days</div>
                </div>
                
                <div className="rounded-lg border p-4">
                  <div className="text-muted-foreground text-sm">Fixtures Updated</div>
                  <div className="text-2xl font-bold mt-1">42</div>
                  <div className="text-xs text-muted-foreground mt-1">Last 30 days</div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="manual" className="space-y-4 pt-4">
          <Card>
            <CardHeader>
              <CardTitle>Manual Scraper Execution</CardTitle>
              <CardDescription>
                Manually trigger the scraper to collect fixture data
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <Alert className="bg-amber-50 text-amber-800 border-amber-200">
                <AlertTriangle className="h-4 w-4" />
                <AlertTitle>Manual Run</AlertTitle>
                <AlertDescription>
                  This will immediately execute the scraper using your current configuration.
                  Depending on the amount of data, this process might take a few minutes.
                </AlertDescription>
              </Alert>
              
              <div className="flex flex-col sm:flex-row items-center gap-4 sm:gap-8 p-4 border rounded-lg">
                <div className="flex-1 flex flex-col items-center sm:items-start text-center sm:text-left">
                  <h3 className="font-semibold mb-1">BBC Highland League Scraper</h3>
                  <p className="text-sm text-muted-foreground">
                    Scrapes fixtures and results from the BBC Highland League website
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <div className="flex items-center text-sm">
                    <Calendar className="h-4 w-4 mr-1" />
                    <span>Last run: {scraperLogs[0].timestamp}</span>
                  </div>
                  <Button 
                    onClick={handleManualScrape} 
                    disabled={isRunning}
                  >
                    {isRunning ? (
                      <>
                        <RotateCcw className="h-4 w-4 mr-2 animate-spin" />
                        Running...
                      </>
                    ) : (
                      <>
                        <Play className="h-4 w-4 mr-2" />
                        Run Now
                      </>
                    )}
                  </Button>
                </div>
              </div>
              
              <div className="mt-4">
                <h3 className="font-semibold mb-3">Options</h3>
                <div className="space-y-3">
                  <div className="flex items-center space-x-2">
                    <Checkbox id="manual-validate" />
                    <label 
                      htmlFor="manual-validate"
                      className="text-sm leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                    >
                      Validate data only (don't save to database)
                    </label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Checkbox id="manual-force" />
                    <label 
                      htmlFor="manual-force"
                      className="text-sm leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                    >
                      Force update all fixtures (even unchanged)
                    </label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Checkbox id="manual-log" defaultChecked />
                    <label 
                      htmlFor="manual-log"
                      className="text-sm leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                    >
                      Generate detailed log report
                    </label>
                  </div>
                </div>
              </div>
            </CardContent>
            
            <CardFooter className="flex-col items-start border-t pt-5 gap-4">
              <div>
                <h4 className="font-medium mb-1">Data Sources</h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2">
                  <div className="flex items-center space-x-2">
                    <Checkbox id="source-bbc" defaultChecked />
                    <label htmlFor="source-bbc">BBC Sport</label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Checkbox id="source-highland" />
                    <label htmlFor="source-highland">Highland League Official</label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Checkbox id="source-club" />
                    <label htmlFor="source-club">Club Website</label>
                  </div>
                </div>
              </div>
              
              <div className="w-full flex justify-between items-center">
                <div className="flex items-center">
                  <ClipboardCheck className="h-4 w-4 mr-1" />
                  <span className="text-sm text-muted-foreground">
                    Log all operations during execution
                  </span>
                </div>
                <Button 
                  variant="outline" 
                  onClick={() => toast({
                    title: "Test Connection",
                    description: "Connection to BBC Sport was successful.",
                  })}
                >
                  <ListFilter className="h-4 w-4 mr-2" />
                  Test Connection
                </Button>
              </div>
            </CardFooter>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default ScraperConfiguration;
