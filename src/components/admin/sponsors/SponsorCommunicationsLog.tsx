import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { format } from 'date-fns';
import { 
  MessageSquare, 
  Phone, 
  Mail, 
  Plus, 
  Loader2, 
  CalendarIcon, 
  Users 
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { toast } from 'sonner';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { cn } from '@/lib/utils';

import { 
  fetchSponsorCommunications, 
  createSponsorCommunication, 
  deleteSponsorCommunication,
  fetchSponsorContacts
} from '@/services/sponsorsService';
import { SponsorCommunication } from '@/types/sponsors';

const communicationSchema = z.object({
  type: z.enum(['email', 'call', 'meeting', 'other']),
  subject: z.string().min(2, "Subject is required"),
  content: z.string().optional(),
  date: z.date(),
  contact_id: z.string().optional(),
});

interface SponsorCommunicationsLogProps {
  sponsorId: string;
}

const SponsorCommunicationsLog: React.FC<SponsorCommunicationsLogProps> = ({ sponsorId }) => {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const queryClient = useQueryClient();
  
  const { data: communications = [], isLoading } = useQuery({
    queryKey: ['sponsorCommunications', sponsorId],
    queryFn: async () => {
      const response = await fetchSponsorCommunications(sponsorId);
      if (!response.success) {
        throw new Error(response.error || 'Failed to load communications');
      }
      return response.data;
    },
  });
  
  const { data: contacts = [] } = useQuery({
    queryKey: ['sponsorContacts', sponsorId],
    queryFn: async () => {
      const response = await fetchSponsorContacts(sponsorId);
      if (!response.success) {
        throw new Error(response.error || 'Failed to load contacts');
      }
      return response.data;
    },
  });
  
  const form = useForm<z.infer<typeof communicationSchema>>({
    resolver: zodResolver(communicationSchema),
    defaultValues: {
      type: 'email',
      subject: '',
      content: '',
      date: new Date(),
      contact_id: undefined,
    },
  });
  
  const createMutation = useMutation({
    mutationFn: (data: z.infer<typeof communicationSchema>) => {
      return createSponsorCommunication({
        ...data,
        sponsor_id: sponsorId,
        created_by: 'Admin User', // This would normally be the current user
        type: data.type, // Ensure type is always set
      });
    },
    onSuccess: () => {
      toast.success('Communication logged successfully');
      queryClient.invalidateQueries({ queryKey: ['sponsorCommunications', sponsorId] });
      resetAndCloseDialog();
    },
    onError: (error) => {
      toast.error(`Failed to log communication: ${error.message}`);
    },
  });
  
  const deleteMutation = useMutation({
    mutationFn: (id: string) => {
      return deleteSponsorCommunication(id);
    },
    onSuccess: () => {
      toast.success('Communication deleted');
      queryClient.invalidateQueries({ queryKey: ['sponsorCommunications', sponsorId] });
    },
    onError: (error) => {
      toast.error(`Failed to delete communication: ${error.message}`);
    },
  });
  
  const resetAndCloseDialog = () => {
    form.reset({
      type: 'email',
      subject: '',
      content: '',
      date: new Date(),
      contact_id: undefined,
    });
    setIsDialogOpen(false);
  };
  
  const onSubmit = async (data: z.infer<typeof communicationSchema>) => {
    createMutation.mutate(data);
  };
  
  const handleDelete = async (id: string) => {
    if (confirm('Are you sure you want to delete this communication log?')) {
      deleteMutation.mutate(id);
    }
  };
  
  const renderTypeIcon = (type: string) => {
    switch (type) {
      case 'email':
        return <Mail className="h-5 w-5 text-blue-600" />;
      case 'call':
        return <Phone className="h-5 w-5 text-green-600" />;
      case 'meeting':
        return <Users className="h-5 w-5 text-purple-600" />;
      default:
        return <MessageSquare className="h-5 w-5 text-gray-600" />;
    }
  };
  
  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-medium">Communication History</h3>
        <Button onClick={() => setIsDialogOpen(true)} size="sm">
          <Plus className="mr-2 h-4 w-4" /> Log Communication
        </Button>
      </div>
      
      {isLoading ? (
        <div className="flex justify-center p-8">
          <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
        </div>
      ) : communications.length === 0 ? (
        <div className="text-center p-8 border rounded-md bg-muted/10">
          <MessageSquare className="h-10 w-10 mx-auto text-muted-foreground mb-2" />
          <h3 className="text-lg font-medium">No Communications Yet</h3>
          <p className="text-muted-foreground mb-4">
            Keep track of all interactions with this sponsor
          </p>
          <Button variant="outline" onClick={() => setIsDialogOpen(true)}>
            <Plus className="mr-2 h-4 w-4" /> Log First Communication
          </Button>
        </div>
      ) : (
        <div className="border rounded-md p-4 space-y-4 max-h-[500px] overflow-y-auto">
          {communications.map((comm) => (
            <div key={comm.id} className="flex gap-4 p-3 border-b last:border-0 hover:bg-gray-50 rounded-md">
              <div className="flex-shrink-0 p-2 rounded-full bg-gray-100">
                {renderTypeIcon(comm.type)}
              </div>
              
              <div className="flex-grow">
                <div className="flex justify-between">
                  <div>
                    <h4 className="font-medium">{comm.subject}</h4>
                    <p className="text-sm text-gray-600">
                      {format(new Date(comm.date), 'PPP')} - {comm.type.charAt(0).toUpperCase() + comm.type.slice(1)}
                    </p>
                  </div>
                  <Button 
                    variant="ghost" 
                    size="sm"
                    className="text-red-500 hover:bg-red-50"
                    onClick={() => handleDelete(comm.id)}
                  >
                    Delete
                  </Button>
                </div>
                {comm.content && (
                  <div className="mt-2 text-sm whitespace-pre-wrap">{comm.content}</div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Log Communication</DialogTitle>
          </DialogHeader>

          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <FormField
                control={form.control}
                name="type"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Communication Type</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select type" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="email">Email</SelectItem>
                        <SelectItem value="call">Phone Call</SelectItem>
                        <SelectItem value="meeting">Meeting</SelectItem>
                        <SelectItem value="other">Other</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="subject"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Subject*</FormLabel>
                    <FormControl>
                      <Input placeholder="e.g. Sponsorship Renewal Discussion" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="date"
                  render={({ field }) => (
                    <FormItem className="flex flex-col">
                      <FormLabel>Date*</FormLabel>
                      <Popover>
                        <PopoverTrigger asChild>
                          <FormControl>
                            <Button
                              variant={"outline"}
                              className={cn(
                                "pl-3 text-left font-normal",
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
                  name="contact_id"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Contact</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select contact" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {contacts.length === 0 ? (
                            <SelectItem value="" disabled>
                              No contacts available
                            </SelectItem>
                          ) : (
                            <>
                              <SelectItem value="">No specific contact</SelectItem>
                              {contacts.map((contact) => (
                                <SelectItem key={contact.id} value={contact.id}>
                                  {contact.name} {contact.role ? `(${contact.role})` : ''}
                                </SelectItem>
                              ))}
                            </>
                          )}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              
              <FormField
                control={form.control}
                name="content"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Details</FormLabel>
                    <FormControl>
                      <Textarea 
                        placeholder="Summary of the communication..."
                        className="min-h-[120px]"
                        {...field}
                        value={field.value || ''}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <DialogFooter>
                <Button
                  type="button"
                  variant="outline"
                  onClick={resetAndCloseDialog}
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  disabled={createMutation.isPending}
                >
                  {createMutation.isPending && (
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  )}
                  Save Communication
                </Button>
              </DialogFooter>
            </form>
          </Form>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default SponsorCommunicationsLog;
