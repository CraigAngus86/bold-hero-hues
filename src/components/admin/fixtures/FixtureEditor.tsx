
import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { Calendar as CalendarIcon, Clock, MapPin, Ticket, Trophy, X, Check, Loader2 } from 'lucide-react';
import { format } from 'date-fns';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Textarea } from '@/components/ui/textarea';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';
import { cn } from '@/lib/utils';

// Define form schema
const fixtureFormSchema = z.object({
  date: z.date({
    required_error: "Date is required",
  }),
  time: z.string().min(1, "Time is required"),
  home_team: z.string().min(1, "Home team is required"),
  away_team: z.string().min(1, "Away team is required"),
  competition: z.string().min(1, "Competition is required"),
  venue: z.string().optional(),
  is_completed: z.boolean().default(false),
  home_score: z.number().nullable().optional(),
  away_score: z.number().nullable().optional(),
  ticket_link: z.string().url().optional().or(z.literal('')),
  season: z.string().optional(),
  match_report: z.string().optional(),
});

type FixtureFormType = z.infer<typeof fixtureFormSchema>;

interface FixtureEditorProps {
  fixtureId?: string;
  onSave?: () => void;
  onCancel?: () => void;
}

const FixtureEditor: React.FC<FixtureEditorProps> = ({ 
  fixtureId, 
  onSave,
  onCancel
}) => {
  const [isLoading, setIsLoading] = useState(false);
  const [venues, setVenues] = useState<string[]>([]);
  const [teams, setTeams] = useState<string[]>([]);
  const [competitions, setCompetitions] = useState<string[]>([]);
  const [seasons, setSeasons] = useState<string[]>(['2023-2024', '2024-2025']);

  // Initialize form
  const form = useForm<FixtureFormType>({
    resolver: zodResolver(fixtureFormSchema),
    defaultValues: {
      date: new Date(),
      time: "15:00",
      home_team: "",
      away_team: "",
      competition: "",
      venue: "",
      is_completed: false,
      home_score: null,
      away_score: null,
      ticket_link: "",
      season: seasons[0],
      match_report: "",
    },
  });

  // Watch is_completed to show/hide score fields
  const isCompleted = form.watch("is_completed");
  
  // Fetch fixture data if editing an existing fixture
  useEffect(() => {
    if (fixtureId) {
      setIsLoading(true);
      supabase
        .from('fixtures')
        .select('*')
        .eq('id', fixtureId)
        .single()
        .then(({ data, error }) => {
          if (error) {
            toast.error('Error loading fixture');
            console.error('Error loading fixture:', error);
            return;
          }
          
          if (data) {
            form.reset({
              date: data.date ? new Date(data.date) : new Date(),
              time: data.time || "15:00",
              home_team: data.home_team || "",
              away_team: data.away_team || "",
              competition: data.competition || "",
              venue: data.venue || "",
              is_completed: data.is_completed || false,
              home_score: data.home_score,
              away_score: data.away_score,
              ticket_link: data.ticket_link || "",
              season: data.season || seasons[0],
              match_report: "",
            });
          }
        })
        .catch(err => {
          console.error('Error:', err);
          toast.error('Failed to load fixture data');
        })
        .finally(() => {
          setIsLoading(false);
        });
    }
  }, [fixtureId, form, seasons]);
  
  // Fetch all venues, teams, and competitions for dropdowns
  useEffect(() => {
    Promise.all([
      // Get unique venues
      supabase
        .from('fixtures')
        .select('venue')
        .then(({ data }) => {
          const uniqueVenues = [...new Set(data?.map(item => item.venue).filter(Boolean))];
          setVenues(uniqueVenues);
        }),
      
      // Get unique teams
      supabase
        .from('fixtures')
        .select('home_team, away_team')
        .then(({ data }) => {
          if (data) {
            const allTeams = data.flatMap(item => [item.home_team, item.away_team]);
            const uniqueTeams = [...new Set(allTeams)].sort();
            setTeams(uniqueTeams);
          }
        }),
      
      // Get unique competitions
      supabase
        .from('fixtures')
        .select('competition')
        .then(({ data }) => {
          const uniqueCompetitions = [...new Set(data?.map(item => item.competition))];
          setCompetitions(uniqueCompetitions);
        }),
    ]).catch(error => {
      console.error('Error loading form data:', error);
    });
  }, []);
  
  // Handle form submission
  const onSubmit = async (values: FixtureFormType) => {
    setIsLoading(true);
    
    try {
      const fixtureData = {
        ...values,
        date: format(values.date, 'yyyy-MM-dd'),
        // Only include scores if the match is completed
        home_score: values.is_completed ? values.home_score : null,
        away_score: values.is_completed ? values.away_score : null,
      };
      
      let response;
      if (fixtureId) {
        // Update existing fixture
        response = await supabase
          .from('fixtures')
          .update(fixtureData)
          .eq('id', fixtureId);
      } else {
        // Create new fixture
        response = await supabase
          .from('fixtures')
          .insert([fixtureData]);
      }
      
      if (response.error) throw response.error;
      
      toast.success(fixtureId ? 'Fixture updated successfully' : 'Fixture created successfully');
      if (onSave) onSave();
    } catch (error) {
      console.error('Error saving fixture:', error);
      toast.error('Failed to save fixture');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card className="w-full max-w-4xl mx-auto">
      <CardHeader>
        <CardTitle>{fixtureId ? 'Edit Fixture' : 'Add New Fixture'}</CardTitle>
      </CardHeader>
      <CardContent>
        {isLoading && !form.formState.isSubmitting ? (
          <div className="flex justify-center p-8">
            <Loader2 className="h-8 w-8 animate-spin text-primary mr-2" />
            <p>Loading fixture data...</p>
          </div>
        ) : (
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Date and Time */}
                <div className="space-y-4">
                  <FormField
                    control={form.control}
                    name="date"
                    render={({ field }) => (
                      <FormItem className="flex flex-col">
                        <FormLabel>Match Date</FormLabel>
                        <Popover>
                          <PopoverTrigger asChild>
                            <FormControl>
                              <Button
                                variant={"outline"}
                                className={cn(
                                  "w-full pl-3 text-left font-normal",
                                  !field.value && "text-muted-foreground"
                                )}
                              >
                                <CalendarIcon className="mr-2 h-4 w-4" />
                                {field.value ? (
                                  format(field.value, "PPP")
                                ) : (
                                  <span>Pick a date</span>
                                )}
                              </Button>
                            </FormControl>
                          </PopoverTrigger>
                          <PopoverContent className="w-auto p-0" align="start">
                            <Calendar
                              mode="single"
                              selected={field.value}
                              onSelect={field.onChange}
                              initialFocus
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
                            <Input type="time" {...field} className="pl-10" />
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
                            <SelectTrigger className="w-full">
                              <SelectValue placeholder="Select competition" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {competitions.map((comp) => (
                              <SelectItem key={comp} value={comp}>
                                {comp}
                              </SelectItem>
                            ))}
                            <SelectItem value="Highland League">Highland League</SelectItem>
                            <SelectItem value="Scottish Cup">Scottish Cup</SelectItem>
                            <SelectItem value="League Cup">League Cup</SelectItem>
                            <SelectItem value="Friendly">Friendly</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="season"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Season</FormLabel>
                        <Select
                          onValueChange={field.onChange}
                          defaultValue={field.value}
                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select season" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {seasons.map((season) => (
                              <SelectItem key={season} value={season}>
                                {season}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                {/* Teams */}
                <div className="space-y-4">
                  <FormField
                    control={form.control}
                    name="home_team"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Home Team</FormLabel>
                        <Select
                          onValueChange={field.onChange}
                          defaultValue={field.value}
                        >
                          <FormControl>
                            <SelectTrigger className="w-full">
                              <SelectValue placeholder="Select home team" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {teams.map((team) => (
                              <SelectItem key={team} value={team}>
                                {team}
                              </SelectItem>
                            ))}
                            <SelectItem value="Banks o' Dee">Banks o' Dee</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="away_team"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Away Team</FormLabel>
                        <Select
                          onValueChange={field.onChange}
                          defaultValue={field.value}
                        >
                          <FormControl>
                            <SelectTrigger className="w-full">
                              <SelectValue placeholder="Select away team" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {teams.map((team) => (
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
                    name="venue"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Venue</FormLabel>
                        <Select
                          onValueChange={field.onChange}
                          defaultValue={field.value}
                        >
                          <FormControl>
                            <SelectTrigger className="w-full">
                              <SelectValue placeholder="Select venue" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {venues.map((venue) => (
                              <SelectItem key={venue} value={venue}>
                                {venue}
                              </SelectItem>
                            ))}
                            <SelectItem value="Spain Park">Spain Park</SelectItem>
                            <SelectItem value="TBD">To Be Determined</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="ticket_link"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Ticket Link</FormLabel>
                        <FormControl>
                          <div className="relative">
                            <Ticket className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                            <Input {...field} className="pl-10" placeholder="https://..." />
                          </div>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </div>

              {/* Match Status and Result */}
              <div className="border rounded-md p-4 space-y-4">
                <FormField
                  control={form.control}
                  name="is_completed"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-center justify-between">
                      <div className="space-y-0.5">
                        <FormLabel>Match Completed</FormLabel>
                        <p className="text-sm text-muted-foreground">
                          Mark the match as completed to enter scores
                        </p>
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
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="home_score"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Home Score</FormLabel>
                          <FormControl>
                            <Input
                              type="number"
                              min="0"
                              {...field}
                              onChange={(e) => field.onChange(e.target.value ? parseInt(e.target.value, 10) : null)}
                              value={field.value ?? ''}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="away_score"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Away Score</FormLabel>
                          <FormControl>
                            <Input
                              type="number"
                              min="0"
                              {...field}
                              onChange={(e) => field.onChange(e.target.value ? parseInt(e.target.value, 10) : null)}
                              value={field.value ?? ''}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                )}
              </div>

              {/* Match Report */}
              <FormField
                control={form.control}
                name="match_report"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Match Report</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Enter match report details..."
                        className="min-h-[120px]"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="flex justify-end space-x-2">
                {onCancel && (
                  <Button
                    type="button"
                    variant="outline"
                    onClick={onCancel}
                    disabled={form.formState.isSubmitting}
                  >
                    Cancel
                  </Button>
                )}
                <Button
                  type="submit"
                  disabled={form.formState.isSubmitting}
                >
                  {form.formState.isSubmitting ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Saving...
                    </>
                  ) : fixtureId ? (
                    <>
                      <Check className="mr-2 h-4 w-4" />
                      Update Fixture
                    </>
                  ) : (
                    <>
                      <Check className="mr-2 h-4 w-4" />
                      Create Fixture
                    </>
                  )}
                </Button>
              </div>
            </form>
          </Form>
        )}
      </CardContent>
    </Card>
  );
};

export default FixtureEditor;
