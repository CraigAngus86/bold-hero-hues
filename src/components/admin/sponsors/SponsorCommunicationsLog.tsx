import React, { useState, useEffect } from 'react';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { PlusCircle, Download, Trash2, FileContract, Receipt, FileSignature, FileText } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import { toast } from 'sonner';
import { useAuth } from '@/hooks/useAuth';
import { addSponsorCommunication, fetchSponsorCommunications, deleteSponsorCommunication } from '@/services/sponsorsService';
import { SponsorCommunication } from '@/types/sponsors';
import { fetchSponsorContacts } from '@/services/sponsorsService';
import { SponsorContact } from '@/types/sponsors';

interface SponsorCommunicationsLogProps {
  sponsorId: string;
}

const SponsorCommunicationsLog: React.FC<SponsorCommunicationsLogProps> = ({ sponsorId }) => {
  const [communications, setCommunications] = useState<SponsorCommunication[]>([]);
  const [sortedCommunications, setSortedCommunications] = useState<SponsorCommunication[]>([]);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [contacts, setContacts] = useState<SponsorContact[]>([]);
  const auth = useAuth();

  useEffect(() => {
    loadCommunications();
    loadContacts();
  }, [sponsorId]);

  const loadCommunications = async () => {
    try {
      const response = await fetchSponsorCommunications(sponsorId);
      if (response.success && response.data) {
        setCommunications(response.data);
        setSortedCommunications([...response.data].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()));
      } else {
        toast.error(response.error || 'Failed to load communications');
      }
    } catch (error) {
      console.error('Error loading communications:', error);
      toast.error('Failed to load communications');
    }
  };

  const loadContacts = async () => {
    try {
      const response = await fetchSponsorContacts(sponsorId);
      if (response.success && response.data) {
        setContacts(response.data);
      } else {
        toast.error(response.error || 'Failed to load contacts');
      }
    } catch (error) {
      console.error('Error loading contacts:', error);
      toast.error('Failed to load contacts');
    }
  };

  const handleOpenDialog = () => {
    setIsDialogOpen(true);
  };

  const handleCloseDialog = () => {
    setIsDialogOpen(false);
  };

  const handleAddCommunication = async (values: any) => {
    try {
      setIsSubmitting(true);
      
      const communicationData = {
        sponsor_id: sponsorId,
        created_by: auth.user?.id || 'system',
        type: values.type,
        content: values.content,
        date: values.date instanceof Date ? values.date.toISOString() : values.date, // Convert Date to string
        subject: values.subject,
        contact_id: values.contact_id,
      };
      
      await addSponsorCommunication(communicationData as any);
      
      setSortedCommunications(prev => [
        ...prev,
        { ...communicationData, id: Date.now().toString() }
      ]);
      
      toast.success('Communication logged successfully');
      handleCloseDialog();
    } catch (error: any) {
      toast.error(error.error || 'Failed to log communication');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteCommunication = async (id: string) => {
    try {
      await deleteSponsorCommunication(id);
      setSortedCommunications(prev => prev.filter(c => c.id !== id));
      toast.success('Communication deleted successfully');
    } catch (error: any) {
      toast.error(error.error || 'Failed to delete communication');
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Communications Log</CardTitle>
        <CardDescription>Log of all communications with this sponsor</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="mb-4">
          <Dialog>
            <DialogTrigger asChild>
              <Button variant="outline">
                <PlusCircle className="mr-2 h-4 w-4" />
                Add Communication
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
              <DialogHeader>
                <DialogTitle>Add Communication</DialogTitle>
                <DialogDescription>
                  Log a new communication with the sponsor.
                </DialogDescription>
              </DialogHeader>
              <AddCommunicationForm
                contacts={contacts}
                onSubmit={handleAddCommunication}
                onClose={handleCloseDialog}
                isSubmitting={isSubmitting}
              />
            </DialogContent>
          </Dialog>
        </div>

        {sortedCommunications.length === 0 ? (
          <div className="text-center py-4">No communications logged yet.</div>
        ) : (
          <div className="space-y-3">
            {sortedCommunications.map((communication) => (
              <div key={communication.id} className="p-4 border rounded-md bg-white">
                <div className="flex justify-between items-center">
                  <div className="font-medium">{communication.subject}</div>
                  <div className="text-xs text-gray-500">
                    {formatDistanceToNow(new Date(communication.date), { addSuffix: true })}
                  </div>
                </div>
                <div className="text-sm text-gray-700 mt-1">{communication.content}</div>
                <div className="flex justify-end mt-2">
                  <Button variant="ghost" size="sm" onClick={() => handleDeleteCommunication(communication.id)}>
                    <Trash2 className="h-4 w-4 mr-2" />
                    Delete
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

interface AddCommunicationFormProps {
  contacts: SponsorContact[];
  onSubmit: (values: any) => Promise<void>;
  onClose: () => void;
  isSubmitting: boolean;
}

const AddCommunicationForm: React.FC<AddCommunicationFormProps> = ({ contacts, onSubmit, onClose, isSubmitting }) => {
  const [type, setType] = useState('email');
  const [subject, setSubject] = useState('');
  const [content, setContent] = useState('');
  const [date, setDate] = useState<Date | null>(new Date());
  const [contactId, setContactId] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!type || !subject || !content || !date) {
      toast.error('Please fill in all fields.');
      return;
    }

    await onSubmit({
      type,
      subject,
      content,
      date,
      contact_id: contactId,
    });
  };

  return (
    <form onSubmit={handleSubmit} className="grid gap-4">
      <div className="grid gap-2">
        <Label htmlFor="type">Type</Label>
        <Select value={type} onValueChange={setType}>
          <SelectTrigger>
            <SelectValue placeholder="Select a type" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="email">Email</SelectItem>
            <SelectItem value="call">Call</SelectItem>
            <SelectItem value="meeting">Meeting</SelectItem>
            <SelectItem value="other">Other</SelectItem>
          </SelectContent>
        </Select>
      </div>
      <div className="grid gap-2">
        <Label htmlFor="contact">Contact</Label>
        <Select value={contactId} onValueChange={setContactId}>
          <SelectTrigger>
            <SelectValue placeholder="Select a contact" />
          </SelectTrigger>
          <SelectContent>
            {contacts.map((contact) => (
              <SelectItem key={contact.id} value={contact.id}>
                {contact.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      <div className="grid gap-2">
        <Label htmlFor="subject">Subject</Label>
        <Input
          id="subject"
          placeholder="Subject of communication"
          value={subject}
          onChange={(e) => setSubject(e.target.value)}
        />
      </div>
      <div className="grid gap-2">
        <Label htmlFor="content">Content</Label>
        <Textarea
          id="content"
          placeholder="Content of communication"
          value={content}
          onChange={(e) => setContent(e.target.value)}
        />
      </div>
      <div className="grid gap-2">
        <Label htmlFor="date">Date</Label>
        <Input
          type="datetime-local"
          id="date"
          value={date ? date.toISOString().slice(0, 16) : ''}
          onChange={(e) => setDate(e.target.value ? new Date(e.target.value) : null)}
        />
      </div>
      <Button type="submit" disabled={isSubmitting}>
        {isSubmitting ? (
          <svg className="animate-spin h-5 w-5 mr-2" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
        ) : (
          <PlusCircle className="mr-2 h-4 w-4" />
        )}
        Add Communication
      </Button>
    </form>
  );
};

export default SponsorCommunicationsLog;
