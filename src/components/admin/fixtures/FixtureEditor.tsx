
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Calendar } from '@/components/ui/calendar';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { toast } from 'sonner';
import { CalendarIcon, Save, X, LinkIcon, Clock } from 'lucide-react';
import { format } from 'date-fns';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';

const FixtureFormSchema = z.object({
  date: z.date({
    required_error: "Date is required",
  }),
  time: z.string().min(1, "Time is required"),
  homeTeam: z.string().min(1, "Home team is required"),
  awayTeam: z.string().min(1, "Away team is required"),
  competition: z.string().min(1, "Competition is required"),
  venue: z.string().optional(),
  isCompleted: z.boolean().default(false),
  homeScore: z.number().optional(),
  awayScore: z.number().optional(),
  matchReport: z.string().optional(),
  ticketLink: z.string().url().optional().or(z.literal('')),
});

export interface FixtureFormValues extends z.infer<typeof FixtureFormSchema> {}

interface FixtureEditorProps {
  fixtureId?: string;
  onSave?: () => void;
  onCancel?: () => void;
}

export const FixtureEditor: React.FC<FixtureEditorProps> = ({ 
  fixtureId, 
  onSave, 
  onCancel 
}) => {
  const [isLoading, setIsLoading] = useState(false);
  
  // Define form with validation
  const form = useForm<FixtureFormValues>({
    resolver: zodResolver(FixtureFormSchema),
    defaultValues: {
      date: new Date(),
      time: '15:00',
      homeTeam: '',
      awayTeam: '',
      competition: '',
      venue: '',
      isCompleted: false,
      homeScore: undefined,
      awayScore: undefined,
      matchReport: '',
      ticketLink: '',
    },
  });
  
  // Check if editing existing fixture
  useEffect(() => {
    const loadFixture = async () => {
      if (!fixtureId) return;
      
      setIsLoading(true);
      try {
        // Replace with actual API call
        const response = await fetch(`/api/fixtures/${fixtureId}`);
        const fixtureData = await response.json();
        
        // Format the date from string to Date object
        const formattedData = {
          ...fixtureData,
          date: fixtureData.date ? new Date(fixtureData.date) : new Date(),
          homeScore: fixtureData.homeScore ? Number(fixtureData.homeScore) : undefined,
          awayScore: fixtureData.awayScore ? Number(fixtureData.awayScore) : undefined,
        };
        
        form.reset(formattedData);
      } catch (error) {
        console.error('Error loading fixture:', error);
        toast.error('Failed to load fixture data');
      } finally {
        setIsLoading(false);
      }
    };
    
    loadFixture();
  }, [fixtureId, form]);
  
  const isCompleted = form.watch('isCompleted');
  
  const onSubmit = async (values: FixtureFormValues) => {
    setIsLoading(true);
    try {
      // Replace with actual API call
      const method = fixtureId ? 'PUT' : 'POST';
      const url = fixtureId ? `/api/fixtures/${fixtureId}` : '/api/fixtures';
      
      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(values),
      });
      
      if (!response.ok) {
        throw new Error('Failed to save fixture');
      }
      
      toast.success(fixtureId ? 'Fixture updated successfully' : 'Fixture created successfully');
      if (onSave) onSave();
      
      // If not editing, reset the form
      if (!fixtureId) {
        form.reset({
          date: new Date(),
          time: '15:00',
          homeTeam: '',
          awayTeam: '',
          competition: '',
          venue: '',
          isCompleted: false,
          homeScore: undefined,
          awayScore: undefined,
          matchReport: '',
          ticketLink: '',
        });
      }
    } catch (error) {
      console.error('Error saving fixture:', error);
      toast.error('Failed to save fixture');
    } finally {
      setIsLoading(false);
    }
  };
  
  const teams = [
    'Banks o\' Dee FC', 'Brechin City FC', 'Brora Rangers FC', 'Buckie Thistle FC',
    'Clachnacuddin FC', 'Deveronvale FC', 'Formartine United FC', 'Forres Mechanics FC',
    'Fraserburgh FC', 'Huntly FC', 'Inverurie Loco Works FC', 'Keith FC',
    'Lossiemouth FC', 'Nairn County FC', 'Rothes FC', 'Strathspey Thistle FC',
    'Turriff United FC', 'Wick Academy FC'
  ];
  
  const competitions = [
    'Highland League', 'Highland League Cup', 'Scottish Cup', 'North of Scotland Cup',
    'Aberdeenshire Cup', 'Aberdeenshire Shield', 'Evening Express Aberdeenshire Cup', 'Friendly'
  ];
  
  const venues = [
    'Spain Park', 'Glebe Park', 'Dudgeon Park', 'Victoria Park',
    'Grant Street Park', 'Princess Royal Park', 'North Lodge Park', 'Mosset Park',
    'Bellslea Park', 'Christie Park', 'Harlaw Park', 'Kynoch Park',
    'Grant Park', 'Station Park', 'Mackessack Park', 'Seafield Park',
    'The Haughs', 'Harmsworth Park'
  ];
  
  return (
    <Card>
      <CardHeader>
        <CardTitle>{fixtureId ? 'Edit Fixture' : 'Add New Fixture'}</CardTitle>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <FormField
                  control={form.control}
                  name="date"
                  render={({ field }) => (
                    <FormItem className="flex flex-col">
                      <FormLabel>Date</FormLabel>
                      <Popover>
                        <PopoverTrigger asChild>
                          <FormControl>
                            <Button
                              variant="outline"
                              className={`w-full pl-3 text-left font-normal ${!field.value && 'text-muted-foreground'}`}
                            >
                              {field.value ? (
                                format(field.value, 'PPP')
                              ) : (
                                <span>Select a date</span>
                              )}
                              <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                            </Button>
                          </FormControl>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0 pointer-events-auto" align="start">
                          <Calendar
                            mode="single"
                            selected={field.value}
                            onSelect={field.onChange}
                            initialFocus
                            className="p-3 pointer-events-auto"
                          />
                        </PopoverContent>
                      </Popover>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="time"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Kick-off Time</FormLabel>
                      <FormControl>
                        <div className="relative">
                          <Clock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                          <Input 
                            placeholder="HH:MM" 
                            className="pl-10"
                            {...field} 
                          />
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="competition"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Competition</FormLabel>
                      <Select 
                        onValueChange={field.onChange} 
                        defaultValue={field.value}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select competition" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {competitions.map(competition => (
                            <SelectItem key={competition} value={competition}>
                              {competition}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="venue"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Venue</FormLabel>
                      <Select 
                        onValueChange={field.onChange} 
                        defaultValue={field.value}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select venue" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {venues.map(venue => (
                            <SelectItem key={venue} value={venue}>
                              {venue}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="ticketLink"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Ticket Link</FormLabel>
                      <FormControl>
                        <div className="relative">
                          <LinkIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                          <Input 
                            placeholder="https://..." 
                            className="pl-10"
                            {...field} 
                          />
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              
              <div className="space-y-4">
                <FormField
                  control={form.control}
                  name="homeTeam"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Home Team</FormLabel>
                      <Select 
                        onValueChange={field.onChange} 
                        defaultValue={field.value}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select home team" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {teams.map(team => (
                            <SelectItem key={team} value={team}>
                              {team}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="awayTeam"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Away Team</FormLabel>
                      <Select 
                        onValueChange={field.onChange} 
                        defaultValue={field.value}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select away team" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {teams.map(team => (
                            <SelectItem key={team} value={team}>
                              {team}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="isCompleted"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3 shadow-sm">
                      <div className="space-y-0.5">
                        <FormLabel>Match Completed</FormLabel>
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
                
                {isCompleted && (
                  <div className="grid grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="homeScore"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Home Score</FormLabel>
                          <FormControl>
                            <Input 
                              type="number" 
                              min="0"
                              {...field}
                              onChange={(e) => field.onChange(Number(e.target.value))}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={form.control}
                      name="awayScore"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Away Score</FormLabel>
                          <FormControl>
                            <Input 
                              type="number" 
                              min="0"
                              {...field}
                              onChange={(e) => field.onChange(Number(e.target.value))}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                )}
                
                <FormField
                  control={form.control}
                  name="matchReport"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Match Report</FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="Enter match report details..."
                          className="h-32 resize-none"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </div>
            
            <div className="space-y-2">
              <h3 className="text-lg font-medium">Fixture Preview</h3>
              <Card className="p-4">
                <div className="flex flex-col items-center space-y-2">
                  <div className="text-sm text-muted-foreground">
                    {form.watch('date') && format(form.watch('date'), 'EEEE, MMMM d, yyyy')}
                  </div>
                  <div className="text-xs font-medium bg-primary/10 px-2 py-0.5 rounded-full">
                    {form.watch('competition')}
                  </div>
                  <div className="text-xs text-muted-foreground">
                    {form.watch('time')} - {form.watch('venue') || 'Venue TBD'}
                  </div>
                  
                  <div className="flex items-center justify-center w-full mt-2">
                    <div className="text-right flex-1">
                      <div className="font-bold">{form.watch('homeTeam') || 'Home Team'}</div>
                      {isCompleted && <div className="text-2xl font-bold">{form.watch('homeScore') ?? '0'}</div>}
                    </div>
                    <div className="mx-4 text-xl font-bold">vs</div>
                    <div className="text-left flex-1">
                      <div className="font-bold">{form.watch('awayTeam') || 'Away Team'}</div>
                      {isCompleted && <div className="text-2xl font-bold">{form.watch('awayScore') ?? '0'}</div>}
                    </div>
                  </div>
                </div>
              </Card>
            </div>
            
            <div className="flex justify-end space-x-2">
              {onCancel && (
                <Button
                  type="button"
                  variant="outline"
                  onClick={onCancel}
                  disabled={isLoading}
                >
                  <X className="mr-2 h-4 w-4" />
                  Cancel
                </Button>
              )}
              <Button 
                type="submit"
                disabled={isLoading || !form.formState.isDirty}
              >
                <Save className="mr-2 h-4 w-4" />
                {fixtureId ? 'Update Fixture' : 'Add Fixture'}
              </Button>
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
};
