
import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Link, Calendar, Edit, ExternalLink, Loader2 } from 'lucide-react';
import { toast } from 'sonner';
import { Fixture } from '@/types/fixtures';
import { addTicketLinkToFixture } from '@/services/fixturesDbService';
import { format } from 'date-fns';
import { supabase } from '@/integrations/supabase/client';

const FixturesManager = () => {
  const [fixtures, setFixtures] = useState<Fixture[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedFixture, setSelectedFixture] = useState<Fixture | null>(null);
  const [ticketLink, setTicketLink] = useState('');
  const [dialogOpen, setDialogOpen] = useState(false);

  useEffect(() => {
    fetchFixtures();
  }, []);

  const fetchFixtures = async () => {
    setLoading(true);
    try {
      // Fetch fixtures from Supabase
      const { data, error } = await supabase
        .from('fixtures')
        .select('*')
        .order('date', { ascending: true });
      
      if (error) throw error;
      
      // Convert DB format to our app format
      const formattedFixtures = data.map(fixture => ({
        id: fixture.id,
        date: fixture.date,
        time: fixture.time,
        homeTeam: fixture.home_team,
        awayTeam: fixture.away_team,
        competition: fixture.competition,
        venue: fixture.venue,
        isCompleted: fixture.is_completed,
        homeScore: fixture.home_score,
        awayScore: fixture.away_score,
        ticketLink: fixture.ticket_link,
        source: fixture.source
      }));
      
      setFixtures(formattedFixtures);
      toast.success(`Loaded ${formattedFixtures.length} fixtures`);
    } catch (error) {
      console.error('Error fetching fixtures:', error);
      toast.error('Failed to load fixtures data');
    } finally {
      setLoading(false);
    }
  };

  const handleOpenTicketDialog = (fixture: Fixture) => {
    setSelectedFixture(fixture);
    setTicketLink(fixture.ticketLink || '');
    setDialogOpen(true);
  };

  const handleSaveTicketLink = async () => {
    if (!selectedFixture) return;

    try {
      // Update ticket link in database
      const { error } = await supabase
        .from('fixtures')
        .update({ ticket_link: ticketLink })
        .eq('id', selectedFixture.id);
        
      if (error) throw error;
      
      // Update local state
      setFixtures(fixtures.map(f => 
        f.id === selectedFixture.id ? {...f, ticketLink} : f
      ));
      
      toast.success('Ticket link updated successfully');
      setDialogOpen(false);
    } catch (error) {
      console.error('Error updating ticket link:', error);
      toast.error('Failed to update ticket link');
    }
  };

  const formatDate = (dateStr: string) => {
    try {
      return format(new Date(dateStr), 'dd MMM yyyy');
    } catch (e) {
      return dateStr;
    }
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-lg font-medium">Fixtures Management</h3>
        <Button onClick={fetchFixtures} variant="outline" size="sm" disabled={loading}>
          <Calendar className={`h-4 w-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
          Refresh Fixtures
        </Button>
      </div>

      {loading ? (
        <div className="flex justify-center p-8">
          <Loader2 className="h-8 w-8 animate-spin text-primary mr-2" />
          <p>Loading fixtures...</p>
        </div>
      ) : (
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Date</TableHead>
              <TableHead>Home</TableHead>
              <TableHead>Away</TableHead>
              <TableHead>Competition</TableHead>
              <TableHead>Venue</TableHead>
              <TableHead>Ticket Link</TableHead>
              <TableHead className="w-[100px]">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {fixtures.length === 0 ? (
              <TableRow>
                <TableCell colSpan={7} className="text-center py-4 text-gray-500">
                  No fixtures found
                </TableCell>
              </TableRow>
            ) : (
              fixtures.map((fixture) => (
                <TableRow key={fixture.id}>
                  <TableCell>
                    {formatDate(fixture.date)} - {fixture.time}
                  </TableCell>
                  <TableCell>{fixture.homeTeam}</TableCell>
                  <TableCell>{fixture.awayTeam}</TableCell>
                  <TableCell>{fixture.competition}</TableCell>
                  <TableCell>{fixture.venue || 'TBD'}</TableCell>
                  <TableCell>
                    {fixture.ticketLink ? (
                      <a 
                        href={fixture.ticketLink} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="flex items-center text-blue-600 hover:text-blue-800"
                      >
                        <ExternalLink className="h-4 w-4 mr-1" />
                        Ticket Link
                      </a>
                    ) : (
                      <span className="text-gray-400">No link</span>
                    )}
                  </TableCell>
                  <TableCell>
                    <Button variant="ghost" size="sm" onClick={() => handleOpenTicketDialog(fixture)}>
                      <Link className="h-4 w-4 mr-1" />
                      {fixture.ticketLink ? 'Edit' : 'Add'} Link
                    </Button>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      )}

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="sm:max-w-[550px]">
          <DialogHeader>
            <DialogTitle>
              {selectedFixture?.ticketLink ? 'Edit' : 'Add'} Ticket Link
            </DialogTitle>
          </DialogHeader>

          <div className="py-4">
            <p className="mb-4">
              {selectedFixture?.homeTeam} vs {selectedFixture?.awayTeam} on {selectedFixture?.date}
            </p>
            <div className="grid grid-cols-4 items-center gap-4">
              <label htmlFor="ticketLink" className="text-right text-sm font-medium">Ticket URL</label>
              <Input
                id="ticketLink"
                value={ticketLink}
                onChange={(e) => setTicketLink(e.target.value)}
                className="col-span-3"
                placeholder="https://example.com/tickets"
              />
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" type="button" onClick={() => setDialogOpen(false)}>
              Cancel
            </Button>
            <Button type="button" onClick={handleSaveTicketLink}>
              Save
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default FixturesManager;
