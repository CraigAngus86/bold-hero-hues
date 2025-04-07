
import React, { useState, useEffect } from 'react';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { PlusCircle, Calendar, Mail, Phone, FileText, UserCircle, ExternalLink } from "lucide-react";
import { SponsorCommunication, Sponsor } from '@/types/sponsors';
import { fetchSponsorCommunications, createSponsorCommunication } from '@/services/sponsorsService';
import { format, formatDistanceToNow } from 'date-fns';
import { useAuth } from '@/hooks/useAuth';

interface SponsorCommunicationsLogProps {
  sponsor: Sponsor;
}

const SponsorCommunicationsLog: React.FC<SponsorCommunicationsLogProps> = ({ sponsor }) => {
  const [communications, setCommunications] = useState<any[]>([]);
  const [newCommunication, setNewCommunication] = useState({
    type: 'email',
    subject: '',
    content: '',
  });
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { user } = useAuth();

  useEffect(() => {
    const loadCommunications = async () => {
      if (sponsor?.id) {
        const result = await fetchSponsorCommunications(sponsor.id);
        if (result.success) {
          setCommunications(result.data || []);
        }
      }
    };

    loadCommunications();
  }, [sponsor]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setNewCommunication({
      ...newCommunication,
      [e.target.name]: e.target.value
    });
  };

  const handleTypeChange = (value: string) => {
    setNewCommunication({
      ...newCommunication,
      type: value as 'email' | 'call' | 'meeting' | 'other'
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const result = await createSponsorCommunication({
        sponsor_id: sponsor.id,
        type: newCommunication.type as 'email' | 'call' | 'meeting' | 'other',
        subject: newCommunication.subject,
        content: newCommunication.content,
        date: new Date().toISOString(),
        created_by: user?.name || 'System'
      });

      if (result.success) {
        setCommunications([result.data!, ...communications]);
        setNewCommunication({
          type: 'email',
          subject: '',
          content: '',
        });
        setIsDialogOpen(false);
      }
    } catch (error) {
      console.error('Error adding communication:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'email':
        return <Mail className="h-4 w-4" />;
      case 'call':
        return <Phone className="h-4 w-4" />;
      case 'meeting':
        return <UserCircle className="h-4 w-4" />;
      default:
        return <FileText className="h-4 w-4" />;
    }
  };

  return (
    <Card>
      <CardHeader className="pb-3">
        <div className="flex justify-between items-center">
          <CardTitle>Communications Log</CardTitle>
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button size="sm">
                <PlusCircle className="mr-2 h-4 w-4" />
                Add Communication
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Add New Communication</DialogTitle>
                <DialogDescription>
                  Record a new communication with {sponsor.name}
                </DialogDescription>
              </DialogHeader>

              <form onSubmit={handleSubmit}>
                <div className="grid gap-4 py-4">
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="type" className="text-right">
                      Type
                    </Label>
                    <Select
                      value={newCommunication.type}
                      onValueChange={handleTypeChange}
                    >
                      <SelectTrigger className="col-span-3">
                        <SelectValue placeholder="Select type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="email">Email</SelectItem>
                        <SelectItem value="call">Call</SelectItem>
                        <SelectItem value="meeting">Meeting</SelectItem>
                        <SelectItem value="other">Other</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="subject" className="text-right">
                      Subject
                    </Label>
                    <Input
                      id="subject"
                      name="subject"
                      className="col-span-3"
                      value={newCommunication.subject}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="content" className="text-right">
                      Content
                    </Label>
                    <Textarea
                      id="content"
                      name="content"
                      className="col-span-3"
                      value={newCommunication.content}
                      onChange={handleInputChange}
                      rows={5}
                    />
                  </div>
                </div>
                <DialogFooter>
                  <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)}>
                    Cancel
                  </Button>
                  <Button type="submit" disabled={isLoading}>
                    {isLoading ? 'Saving...' : 'Save Communication'}
                  </Button>
                </DialogFooter>
              </form>
            </DialogContent>
          </Dialog>
        </div>
        <CardDescription>
          Record of communications with {sponsor.name}
        </CardDescription>
      </CardHeader>
      <CardContent className="pb-6">
        {communications.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">
            No communications recorded yet
          </div>
        ) : (
          <div className="space-y-4">
            {communications.map((comm: SponsorCommunication) => (
              <div key={comm.id} className="border rounded-lg p-4 bg-card">
                <div className="flex justify-between items-start mb-2">
                  <div className="flex items-center">
                    <div className="bg-primary/10 p-2 rounded-full mr-3">
                      {getTypeIcon(comm.type)}
                    </div>
                    <div>
                      <h4 className="font-medium">{comm.subject}</h4>
                      <div className="flex items-center text-sm text-muted-foreground space-x-3">
                        <span className="flex items-center">
                          <Calendar className="h-3 w-3 mr-1" />
                          {format(new Date(comm.date), 'MMM d, yyyy')}
                        </span>
                        <span className="flex items-center">
                          <UserCircle className="h-3 w-3 mr-1" />
                          {comm.created_by}
                        </span>
                      </div>
                    </div>
                  </div>
                  <span className="text-xs text-muted-foreground">
                    {formatDistanceToNow(new Date(comm.date), { addSuffix: true })}
                  </span>
                </div>
                {comm.content && (
                  <div className="mt-2 text-sm pl-11">
                    <p>{comm.content}</p>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default SponsorCommunicationsLog;
