import React, { useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/services/supabase/supabaseClient';
import { toast } from 'sonner';
import { Link, Pencil, ExternalLink, Calendar } from 'lucide-react';
import { Fixture } from '@/types/fixtures';
import { formatMatchDate } from '@/components/home/fixtures/utils';
import { updateTicketLink, getFixturesWithTickets } from '@/services/ticketsService';

import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import CustomTable from '@/components/ui/CustomTable';
import { Skeleton } from '@/components/ui/skeleton';

const MatchTicketing: React.FC = () => {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedFixture, setSelectedFixture] = useState<Fixture | null>(null);
  const [ticketLink, setTicketLink] = useState('');
  const queryClient = useQueryClient();

  // Fetch upcoming fixtures that don't have ticket links yet
  const { data: upcomingFixtures, isLoading: loadingFixtures } = useQuery({
    queryKey: ['fixtures', 'upcoming'],
    queryFn: async () => {
      const today = new Date().toISOString().split('T')[0];
      const { data, error } = await supabase
        .from('fixtures')
        .select('*')
        .gte('date', today)
        .order('date', { ascending: true });
      
      if (error) throw new Error(error.message);
      
      // Convert database fixture format to Fixture type
      return (data || []).map(item => ({
        id: item.id,
        date: item.date,
        time: item.time || "",
        home_team: item.home_team,
        away_team: item.away_team,
        competition: item.competition,
        venue: item.venue,
        season: item.season,
        is_completed: item.is_completed,
        home_score: item.home_score,
        away_score: item.away_score,
        ticket_link: item.ticket_link,
      })) as Fixture[];
    },
  });

  // Fetch fixtures that already have ticket links
  const { data: fixturesWithTickets, isLoading: loadingTicketFixtures } = useQuery({
    queryKey: ['fixtures', 'tickets'],
    queryFn: async () => {
      const { data, error } = await getFixturesWithTickets();
      if (error) throw error;
      return data as Fixture[];
    },
  });

  // Mutation to update ticket link
  const updateTicketMutation = useMutation({
    mutationFn: async ({ fixtureId, link }: { fixtureId: string; link: string }) => {
      const { data, error } = await updateTicketLink(fixtureId, link);
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['fixtures'] });
      toast.success('Ticket link updated successfully');
      setIsDialogOpen(false);
      setSelectedFixture(null);
    },
    onError: (error) => {
      toast.error(`Failed to update ticket link: ${error.message}`);
    },
  });

  const handleOpenDialog = (fixture: Fixture) => {
    setSelectedFixture(fixture);
    setTicketLink(fixture.ticket_link || '');
    setIsDialogOpen(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedFixture) return;
    
    updateTicketMutation.mutate({
      fixtureId: selectedFixture.id,
      link: ticketLink,
    });
  };

  const handleCloseDialog = () => {
    setIsDialogOpen(false);
    setSelectedFixture(null);
  };

  const columns = [
    {
      key: 'date',
      title: 'Date',
      render: (fixture: Fixture) => (
        <div className="flex items-center">
          <Calendar size={16} className="mr-2 text-gray-500" />
          <span>{formatMatchDate(fixture.date)}</span>
        </div>
      ),
      sortable: true,
    },
    {
      key: 'match',
      title: 'Match',
      render: (fixture: Fixture) => (
        <span className="font-medium">
          {fixture.home_team} vs {fixture.away_team}
        </span>
      ),
    },
    {
      key: 'competition',
      title: 'Competition',
      render: (fixture: Fixture) => (
        <span className="text-sm">{fixture.competition}</span>
      ),
      sortable: true,
    },
    {
      key: 'ticket_link',
      title: 'Ticket Link',
      render: (fixture: Fixture) => (
        fixture.ticket_link ? (
          <div className="flex items-center space-x-2">
            <a 
              href={fixture.ticket_link} 
              target="_blank" 
              rel="noopener noreferrer" 
              className="text-blue-600 hover:text-blue-800 flex items-center"
            >
              <span className="truncate max-w-[200px]">{fixture.ticket_link}</span>
              <ExternalLink size={16} className="ml-1" />
            </a>
          </div>
        ) : (
          <span className="text-gray-400">No link added</span>
        )
      ),
    },
    {
      key: 'actions',
      title: 'Actions',
      render: (fixture: Fixture) => (
        <Button
          variant="outline"
          size="sm"
          onClick={() => handleOpenDialog(fixture)}
        >
          <Pencil size={16} className="mr-2" />
          {fixture.ticket_link ? 'Edit Link' : 'Add Link'}
        </Button>
      ),
    },
  ];

  if (loadingFixtures || loadingTicketFixtures) {
    return (
      <div className="bg-white rounded-lg shadow-sm border p-6">
        <Skeleton className="h-8 w-1/3 mb-4" />
        <Skeleton className="h-4 w-2/3 mb-8" />
        <div className="space-y-2">
          {[1, 2, 3, 4].map(i => (
            <Skeleton key={i} className="h-12 w-full" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-sm border">
      <div className="p-6">
        <h2 className="text-xl font-semibold mb-2">Match Tickets</h2>
        <p className="text-gray-600 mb-6">
          Add or edit ticket purchase links for upcoming matches. These links will be displayed on the website.
        </p>
        
        <div className="mb-8">
          <h3 className="text-lg font-medium mb-4">Upcoming Matches</h3>
          <CustomTable
            data={upcomingFixtures || []}
            columns={columns}
            noDataMessage="No upcoming matches found"
            initialSortKey="date"
            initialSortDirection="asc"
          />
        </div>

        {fixturesWithTickets && fixturesWithTickets.length > 0 && (
          <div>
            <h3 className="text-lg font-medium mb-4">Fixtures with Ticket Links</h3>
            <CustomTable
              data={fixturesWithTickets}
              columns={columns}
              noDataMessage="No fixtures with ticket links"
              initialSortKey="date"
              initialSortDirection="asc"
            />
          </div>
        )}
      </div>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {selectedFixture?.ticket_link ? 'Edit Ticket Link' : 'Add Ticket Link'}
            </DialogTitle>
            <DialogDescription>
              {selectedFixture && (
                <>
                  {formatMatchDate(selectedFixture.date)} - {selectedFixture.home_team} vs {selectedFixture.away_team}
                </>
              )}
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleSubmit}>
            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <Label htmlFor="ticket-link">Ticket Link URL</Label>
                <Input
                  id="ticket-link"
                  value={ticketLink}
                  onChange={(e) => setTicketLink(e.target.value)}
                  placeholder="https://ticketseller.com/match-ticket"
                />
              </div>
            </div>
            <DialogFooter>
              <Button type="button" variant="outline" onClick={handleCloseDialog}>
                Cancel
              </Button>
              <Button 
                type="submit"
                disabled={updateTicketMutation.isPending}
              >
                {updateTicketMutation.isPending ? 'Saving...' : 'Save'}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default MatchTicketing;
