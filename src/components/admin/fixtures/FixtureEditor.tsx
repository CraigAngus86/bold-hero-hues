
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Form, FormField, FormItem, FormLabel, FormControl, FormMessage } from '@/components/ui/form';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { format } from 'date-fns';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { Loader2, Calendar, Check } from 'lucide-react';

interface FixtureEditorProps {
  fixtureId?: string;
  onSave: () => void;
  onCancel: () => void;
}

// Define the fixture schema
const fixtureSchema = z.object({
  date: z.string().min(1, 'Date is required'),
  time: z.string().min(1, 'Time is required'),
  home_team: z.string().min(1, 'Home team is required'),
  away_team: z.string().min(1, 'Away team is required'),
  competition: z.string().min(1, 'Competition is required'),
  venue: z.string().optional(),
  is_completed: z.boolean().default(false),
  home_score: z.number().nullable().optional(),
  away_score: z.number().nullable().optional(),
  ticket_link: z.string().optional(),
  season: z.string().optional(),
  match_report: z.string().optional(),
});

type FixtureFormValues = z.infer<typeof fixtureSchema>;

const FixtureEditor: React.FC<FixtureEditorProps> = ({ fixtureId, onSave, onCancel }) => {
  const [loading, setLoading] = useState<boolean>(false);
  const [competitions, setCompetitions] = useState<string[]>([]);
  const [teams, setTeams] = useState<string[]>([]);
  const [venues, setVenues] = useState<string[]>([]);

  const form = useForm<FixtureFormValues>({
    resolver: zodResolver(fixtureSchema),
    defaultValues: {
      date: format(new Date(), 'yyyy-MM-dd'),
      time: '15:00',
      home_team: '',
      away_team: '',
      competition: '',
      venue: '',
      is_completed: false,
      home_score: null,
      away_score: null,
      ticket_link: '',
      season: '2024-2025',
      match_report: '',
    },
  });

  // Fetch competition, team, and venue data
  useEffect(() => {
    const fetchReferenceData = async () => {
      try {
        // Get unique competitions
        const { data: fixtureCompetitions, error: compError } = await supabase
          .from('fixtures')
          .select('competition')
          .order('competition');
        
        if (compError) throw compError;
        
        // Get unique teams
        const { data: fixtureTeams, error: teamsError } = await supabase
          .from('fixtures')
          .select('home_team, away_team');
        
        if (teamsError) throw teamsError;
        
        // Get unique venues
        const { data: fixtureVenues, error: venuesError } = await supabase
          .from('fixtures')
          .select('venue');
        
        if (venuesError) throw venuesError;
        
        // Extract unique values
        const uniqueCompetitions = [...new Set(fixtureCompetitions.map(f => f.competition))].filter(Boolean).sort();
        
        const allTeams = fixtureTeams.flatMap(fixture => [fixture.home_team, fixture.away_team]);
        const uniqueTeams = [...new Set(allTeams)].filter(Boolean).sort();
        
        const uniqueVenues = [...new Set(fixtureVenues.map(f => f.venue))].filter(Boolean).sort();
        
        setCompetitions(uniqueCompetitions);
        setTeams(uniqueTeams);
        setVenues(uniqueVenues);
      } catch (error) {
        console.error('Error fetching reference data:', error);
        toast.error('Failed to load reference data');
      }
    };
    
    fetchReferenceData();
  }, []);

  // Fetch fixture data if editing
  useEffect(() => {
    const fetchFixture = async () => {
      if (!fixtureId) return;
      
      setLoading(true);
      
      try {
        const { data, error } = await supabase
          .from('fixtures')
          .select('*')
          .eq('id', fixtureId)
          .single();
        
        if (error) throw error;
        
        if (data) {
          // Convert match_report to string safely
          const matchReport = data.match_report ? String(data.match_report) : '';
          
          form.reset({
            date: data.date,
            time: data.time || '15:00',
            home_team: data.home_team,
            away_team: data.away_team,
            competition: data.competition,
            venue: data.venue || '',
            is_completed: data.is_completed || false,
            home_score: data.home_score,
            away_score: data.away_score,
            ticket_link: data.ticket_link || '',
            season: data.season || '2024-2025',
            match_report: matchReport,
          });
        }
      } catch (error) {
        console.error('Error fetching fixture:', error);
        toast.error('Failed to load fixture data');
      } finally {
        setLoading(false);
      }
    };
    
    fetchFixture();
  }, [fixtureId, form]);

  // Handle form submission
  const onSubmit = async (values: FixtureFormValues) => {
    setLoading(true);
    
    try {
      if (fixtureId) {
        // Update existing fixture
        const { error } = await supabase
          .from('fixtures')
          .update({
            date: values.date,
            time: values.time,
            home_team: values.home_team,
            away_team: values.away_team,
            competition: values.competition,
            venue: values.venue,
            is_completed: values.is_completed,
            home_score: values.is_completed ? values.home_score : null,
            away_score: values.is_completed ? values.away_score : null,
            ticket_link: values.ticket_link,
            season: values.season,
            match_report: values.match_report,
          })
          .eq('id', fixtureId);
        
        if (error) throw error;
        
        toast.success('Fixture updated successfully');
      } else {
        // Create new fixture
        const { error } = await supabase
          .from('fixtures')
          .insert({
            date: values.date,
            time: values.time,
            home_team: values.home_team,
            away_team: values.away_team,
            competition: values.competition,
            venue: values.venue,
            is_completed: values.is_completed,
            home_score: values.is_completed ? values.home_score : null,
            away_score: values.is_completed ? values.away_score : null,
            ticket_link: values.ticket_link,
            season: values.season,
            match_report: values.match_report,
          });
        
        if (error) throw error;
        
        toast.success('Fixture created successfully');
      }
      
      onSave();
    } catch (error) {
      console.error('Error saving fixture:', error);
      toast.error('Failed to save fixture');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <FormField
          control={form.control}
          name="date"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Date</FormLabel>
              <FormControl>
                <Input type="date" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <FormField
          control={form.control}
          name="time"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Time</FormLabel>
              <FormControl>
                <Input type="time" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <FormField
          control={form.control}
          name="home_team"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Home Team</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select home team" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {teams.map(team => (
                    <SelectItem key={team} value={team}>{team}</SelectItem>
                  ))}
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
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select away team" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {teams.map(team => (
                    <SelectItem key={team} value={team}>{team}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
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
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select competition" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {competitions.map(competition => (
                    <SelectItem key={competition} value={competition}>{competition}</SelectItem>
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
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select venue" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {venues.map(venue => (
                    <SelectItem key={venue} value={venue}>{venue}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <FormField
          control={form.control}
          name="is_completed"
          render={({ field }) => (
            <FormItem className="flex flex-row items-center justify-between rounded-md border p-4">
              <div className="space-y-0.5">
                <FormLabel>Is Completed?</FormLabel>
              </div>
              <FormControl>
                <Checkbox
                  checked={field.value}
                  onCheckedChange={field.onChange}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        
        {form.getValues('is_completed') && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormField
              control={form.control}
              name="home_score"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Home Score</FormLabel>
                  <FormControl>
                    <Input type="number" {...field} />
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
                    <Input type="number" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        )}
        
        <FormField
          control={form.control}
          name="ticket_link"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Ticket Link</FormLabel>
              <FormControl>
                <Input type="url" {...field} placeholder="https://example.com/tickets" />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <FormField
          control={form.control}
          name="match_report"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Match Report</FormLabel>
              <FormControl>
                <Textarea placeholder="Enter match report" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <div className="flex justify-end space-x-2">
          <Button type="button" variant="outline" onClick={onCancel} disabled={loading}>
            Cancel
          </Button>
          <Button type="submit" disabled={loading}>
            {loading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Saving...
              </>
            ) : (
              <>
                <Check className="mr-2 h-4 w-4" />
                Save Fixture
              </>
            )}
          </Button>
        </div>
      </form>
    </Form>
  );
};

export default FixtureEditor;
