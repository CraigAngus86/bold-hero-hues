
import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { 
  Form, 
  FormControl, 
  FormField, 
  FormItem, 
  FormLabel, 
  FormMessage 
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { format } from 'date-fns';
import { CalendarIcon, Check, ChevronsUpDown } from 'lucide-react';
import { Match } from '@/components/fixtures/types';
import { Switch } from '@/components/ui/switch';
import { cn } from '@/lib/utils';
import { fetchCompetitionsFromSupabase, addMatchToSupabase, updateMatchInSupabase } from '@/services/supabase/fixturesService';
import { toast } from 'sonner';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem } from '@/components/ui/command';

interface MatchFormProps {
  match?: Match | null;
  onSubmit: (match: Match) => void;
  onCancel: () => void;
  mode: 'add' | 'edit';
}

const formSchema = z.object({
  homeTeam: z.string().min(1, "Home team is required"),
  awayTeam: z.string().min(1, "Away team is required"),
  date: z.date({ required_error: "Date is required" }),
  time: z.string().min(1, "Time is required"),
  competition: z.string().min(1, "Competition is required"),
  venue: z.string().min(1, "Venue is required"),
  isCompleted: z.boolean().default(false),
  homeScore: z.number().optional(),
  awayScore: z.number().optional(),
  visible: z.boolean().default(true)
});

type FormValues = z.infer<typeof formSchema>;

const MatchForm: React.FC<MatchFormProps> = ({ match, onSubmit, onCancel, mode }) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [competitions, setCompetitions] = useState<string[]>([]);
  const [competitionOpen, setCompetitionOpen] = useState(false);

  useEffect(() => {
    const loadCompetitions = async () => {
      try {
        const comps = await fetchCompetitionsFromSupabase();
        setCompetitions(comps);
      } catch (error) {
        console.error('Error loading competitions:', error);
        // Fallback
        setCompetitions(["Highland League", "Scottish Cup", "Highland League Cup", "Aberdeenshire Cup", "Aberdeenshire Shield", "Evening Express Aberdeenshire Cup", "North of Scotland Cup", "Morrison Motors (Turriff) Aberdeenshire Shield", "Friendly"]);
      }
    };
    
    loadCompetitions();
  }, []);

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      homeTeam: match?.homeTeam || '',
      awayTeam: match?.awayTeam || '',
      date: match?.date ? new Date(match.date) : new Date(),
      time: match?.time || '15:00',
      competition: match?.competition || '',
      venue: match?.venue || '',
      isCompleted: match?.isCompleted || false,
      homeScore: match?.homeScore !== undefined ? match.homeScore : 0,
      awayScore: match?.awayScore !== undefined ? match.awayScore : 0,
      visible: (match as any)?.visible !== false
    }
  });

  const handleSubmit = async (values: FormValues) => {
    setIsSubmitting(true);
    try {
      const matchData: Partial<Match> = {
        homeTeam: values.homeTeam,
        awayTeam: values.awayTeam,
        date: values.date.toISOString().split('T')[0], // Format as YYYY-MM-DD
        time: values.time,
        competition: values.competition,
        venue: values.venue,
        isCompleted: values.isCompleted,
      };

      if (values.isCompleted && values.homeScore !== undefined && values.awayScore !== undefined) {
        matchData.homeScore = values.homeScore;
        matchData.awayScore = values.awayScore;
      }

      let success = false;
      
      if (mode === 'add') {
        const id = await addMatchToSupabase(matchData);
        success = !!id;
        if (success) {
          matchData.id = id;
        }
      } else if (match?.id) {
        success = await updateMatchInSupabase(match.id.toString(), matchData);
        if (success) {
          matchData.id = match.id;
        }
      }

      if (success) {
        onSubmit(matchData as Match);
      } else {
        toast.error('Failed to save match');
      }
    } catch (error) {
      console.error('Error saving match:', error);
      toast.error('Failed to save match');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="homeTeam"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Home Team</FormLabel>
                <FormControl>
                  <Input {...field} placeholder="Enter home team" />
                </FormControl>
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
                <FormControl>
                  <Input {...field} placeholder="Enter away team" />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
                        variant={"outline"}
                        className={cn(
                          "w-full pl-3 text-left font-normal",
                          !field.value && "text-muted-foreground"
                        )}
                      >
                        {field.value ? (
                          format(field.value, "PPP")
                        ) : (
                          <span>Pick a date</span>
                        )}
                        <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
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
                <FormLabel>Time</FormLabel>
                <FormControl>
                  <Input {...field} placeholder="15:00" />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        
        <FormField
          control={form.control}
          name="competition"
          render={({ field }) => (
            <FormItem className="flex flex-col">
              <FormLabel>Competition</FormLabel>
              <Popover open={competitionOpen} onOpenChange={setCompetitionOpen}>
                <PopoverTrigger asChild>
                  <FormControl>
                    <Button
                      variant="outline"
                      role="combobox"
                      aria-expanded={competitionOpen}
                      className={cn(
                        "w-full justify-between",
                        !field.value && "text-muted-foreground"
                      )}
                    >
                      {field.value || "Select competition"}
                      <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                    </Button>
                  </FormControl>
                </PopoverTrigger>
                <PopoverContent className="w-full p-0">
                  <Command>
                    <CommandInput placeholder="Search competition..." />
                    <CommandEmpty>No competition found.</CommandEmpty>
                    <CommandGroup>
                      {competitions.map((competition) => (
                        <CommandItem
                          key={competition}
                          value={competition}
                          onSelect={() => {
                            form.setValue("competition", competition);
                            setCompetitionOpen(false);
                          }}
                        >
                          <Check
                            className={cn(
                              "mr-2 h-4 w-4",
                              competition === field.value
                                ? "opacity-100"
                                : "opacity-0"
                            )}
                          />
                          {competition}
                        </CommandItem>
                      ))}
                    </CommandGroup>
                  </Command>
                </PopoverContent>
              </Popover>
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
              <FormControl>
                <Input {...field} placeholder="Enter venue" />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <FormField
          control={form.control}
          name="isCompleted"
          render={({ field }) => (
            <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3">
              <div className="space-y-0.5">
                <FormLabel>Match Complete</FormLabel>
                <div className="text-sm text-muted-foreground">
                  Mark this match as completed with a score
                </div>
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
        
        {form.watch('isCompleted') && (
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
                      value={field.value || 0}
                      onChange={e => field.onChange(parseInt(e.target.value) || 0)}
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
                      value={field.value || 0}
                      onChange={e => field.onChange(parseInt(e.target.value) || 0)}
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
          name="visible"
          render={({ field }) => (
            <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3">
              <div className="space-y-0.5">
                <FormLabel>Visible</FormLabel>
                <div className="text-sm text-muted-foreground">
                  Show this match on the website
                </div>
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
        
        <div className="flex justify-end gap-2 pt-2">
          <Button type="button" variant="outline" onClick={onCancel} disabled={isSubmitting}>
            Cancel
          </Button>
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting ? 'Saving...' : mode === 'add' ? 'Add Match' : 'Update Match'}
          </Button>
        </div>
      </form>
    </Form>
  );
};

export default MatchForm;
