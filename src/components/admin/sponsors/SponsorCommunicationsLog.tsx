// Fix imports and type definitions
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { Calendar, Plus, FileText, Mail, Phone } from 'lucide-react';
import { formatDistance } from 'date-fns';
import { useAuth } from '@/hooks/useAuth';
import { createSponsorCommunication, fetchSponsorCommunications } from '@/services/sponsorsService';
import { toast } from 'sonner';

interface SponsorCommunicationsLogProps {
  sponsorId: string;
}

const SponsorCommunicationsLog: React.FC<SponsorCommunicationsLogProps> = ({ sponsorId }) => {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [communications, setCommunications] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [communicationType, setCommunicationType] = useState<string | null>(null);
  const [content, setContent] = useState('');
  const [date, setDate] = useState<Date | null>(null);
  const [subject, setSubject] = useState('');
  const [contactId, setContactId] = useState<string | null>(null);
  const { auth } = useAuth();

  const loadCommunications = async () => {
    setIsLoading(true);
    try {
      const data = await fetchSponsorCommunications(sponsorId);
      setCommunications(data);
    } catch (error) {
      console.error("Error loading communications:", error);
      toast.error("Failed to load communication logs");
    } finally {
      setIsLoading(false);
    }
  };

  React.useEffect(() => {
    if (sponsorId) {
      loadCommunications();
    }
  }, [sponsorId]);

  const resetForm = () => {
    setCommunicationType(null);
    setContent('');
    setDate(null);
    setSubject('');
    setContactId(null);
  };

  // Fix the form submission function to use the correct method name and auth access
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!sponsorId) {
      toast.error("Sponsor ID is missing");
      return;
    }
    
    try {
      const userId = auth.user?.id || "unknown";
      const username = auth.user?.email || "System";
      
      await createSponsorCommunication({
        sponsor_id: sponsorId,
        created_by: username,
        type: communicationType as "email" | "call" | "meeting" | "other",
        content: content || undefined,
        date: date ? new Date(date).toISOString() : undefined,
        subject: subject || undefined,
        contact_id: contactId || undefined
      });
      
      await loadCommunications();
      setIsDialogOpen(false);
      resetForm();
      toast.success("Communication record added successfully");
    } catch (error) {
      toast.error("An error occurred while adding the communication record");
      console.error(error);
    }
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-medium">Communication Log</h3>
        <Button onClick={() => setIsDialogOpen(true)} className="flex items-center">
          <Plus className="mr-2 h-4 w-4" />
          Add Communication
        </Button>
      </div>

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Date</TableHead>
            <TableHead>Type</TableHead>
            <TableHead>Subject</TableHead>
            <TableHead>Content</TableHead>
            <TableHead>Created By</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {isLoading ? (
            <TableRow>
              <TableCell colSpan={6} className="text-center">Loading...</TableCell>
            </TableRow>
          ) : communications.length === 0 ? (
            <TableRow>
              <TableCell colSpan={6} className="text-center">No communications recorded.</TableCell>
            </TableRow>
          ) : (
            communications.map((communication: any) => (
              <TableRow key={communication.id}>
                <TableCell>{communication.date ? formatDistance(new Date(communication.date), new Date(), { addSuffix: true }) : 'N/A'}</TableCell>
                <TableCell>{communication.type}</TableCell>
                <TableCell>{communication.subject}</TableCell>
                <TableCell>{communication.content}</TableCell>
                <TableCell>{communication.created_by}</TableCell>
                <TableCell>
                  <Button variant="ghost" size="sm">
                    <FileText className="h-4 w-4" />
                  </Button>
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-[550px]">
          <DialogHeader>
            <DialogTitle>Add Communication Record</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSubmit}>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="type" className="text-right">Type</Label>
                <Select onValueChange={setCommunicationType}>
                  <SelectTrigger className="col-span-3">
                    <SelectValue placeholder="Select type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="email">
                      <Mail className="mr-2 h-4 w-4" />
                      Email
                    </SelectItem>
                    <SelectItem value="call">
                      <Phone className="mr-2 h-4 w-4" />
                      Call
                    </SelectItem>
                    <SelectItem value="meeting">
                      <Users className="mr-2 h-4 w-4" />
                      Meeting
                    </SelectItem>
                    <SelectItem value="other">Other</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="date" className="text-right">Date</Label>
                <Input
                  type="datetime-local"
                  id="date"
                  className="col-span-3"
                  onChange={(e) => setDate(new Date(e.target.value))}
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="subject" className="text-right">Subject</Label>
                <Input
                  type="text"
                  id="subject"
                  className="col-span-3"
                  onChange={(e) => setSubject(e.target.value)}
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="contact" className="text-right">Contact</Label>
                <Input
                  type="text"
                  id="contact"
                  className="col-span-3"
                  onChange={(e) => setContactId(e.target.value)}
                />
              </div>
              <div className="grid grid-cols-4 items-start gap-4">
                <Label htmlFor="content" className="text-right">Content</Label>
                <Textarea
                  id="content"
                  className="col-span-3"
                  onChange={(e) => setContent(e.target.value)}
                />
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
                Cancel
              </Button>
              <Button type="submit">Save</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default SponsorCommunicationsLog;
