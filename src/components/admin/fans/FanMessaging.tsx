
import React, { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Calendar as CalendarIcon, Send, Users, CheckCircle2 } from 'lucide-react';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { format } from 'date-fns';
import { cn } from '@/lib/utils';
import { Calendar } from '@/components/ui/calendar';
import { toast } from '@/hooks/use-toast';

export const FanMessaging = () => {
  const [scheduledDate, setScheduledDate] = useState<Date>();
  const [messageType, setMessageType] = useState("all");
  const [selectedTemplate, setSelectedTemplate] = useState("");
  
  const templates = [
    { id: "match-day", name: "Match Day Reminder" },
    { id: "ticket-promo", name: "Ticket Promotion" },
    { id: "newsletter", name: "Weekly Newsletter" },
    { id: "event-invite", name: "Event Invitation" },
  ];
  
  const sentMessages = [
    { id: 1, title: "Match Day Reminder", date: "2025-04-02", recipients: 2345, openRate: "42%" },
    { id: 2, title: "Season Tickets Available", date: "2025-03-28", recipients: 2400, openRate: "38%" },
    { id: 3, title: "Community Day Invitation", date: "2025-03-21", recipients: 2350, openRate: "45%" },
    { id: 4, title: "Weekly Newsletter", date: "2025-03-14", recipients: 2380, openRate: "33%" },
  ];

  const handleSendMessage = () => {
    toast({
      title: "Message scheduled",
      description: scheduledDate 
        ? `Your message has been scheduled for ${format(scheduledDate, 'PPP')}`
        : "Your message has been sent successfully",
    });
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Fan Messaging</CardTitle>
          <CardDescription>
            Communicate with fans through notifications, emails, and app messages
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="compose">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="compose">Compose Message</TabsTrigger>
              <TabsTrigger value="history">Sending History</TabsTrigger>
            </TabsList>
            
            <TabsContent value="compose" className="space-y-4 mt-4">
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="subject">Message Subject</Label>
                    <Input id="subject" placeholder="Enter subject line" />
                  </div>
                  <div className="space-y-2">
                    <Label>Template</Label>
                    <Select value={selectedTemplate} onValueChange={setSelectedTemplate}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select a template" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="">No Template</SelectItem>
                        {templates.map(template => (
                          <SelectItem key={template.id} value={template.id}>
                            {template.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="message-content">Message Content</Label>
                  <Textarea 
                    id="message-content"
                    placeholder="Write your message here..."
                    className="min-h-[200px]"
                  />
                </div>
                
                <div className="space-y-2">
                  <Label>Recipients</Label>
                  <RadioGroup defaultValue="all" onValueChange={setMessageType}>
                    <div className="flex flex-col space-y-2">
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="all" id="all" />
                        <Label htmlFor="all">All Subscribers (2,450)</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="season-ticket" id="season-ticket" />
                        <Label htmlFor="season-ticket">Season Ticket Holders (875)</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="members" id="members" />
                        <Label htmlFor="members">Club Members (1,230)</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="custom" id="custom" />
                        <Label htmlFor="custom">Custom Group</Label>
                      </div>
                    </div>
                  </RadioGroup>
                </div>
                
                <div className="flex items-center space-x-4">
                  <div className="flex items-center space-x-2">
                    <Switch id="schedule" />
                    <Label htmlFor="schedule">Schedule for later</Label>
                  </div>
                  
                  <div>
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button
                          variant={"outline"}
                          className={cn(
                            "w-[240px] justify-start text-left font-normal",
                            !scheduledDate && "text-muted-foreground"
                          )}
                        >
                          <CalendarIcon className="mr-2 h-4 w-4" />
                          {scheduledDate ? format(scheduledDate, "PPP") : "Pick a date"}
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0" align="start">
                        <Calendar
                          mode="single"
                          selected={scheduledDate}
                          onSelect={setScheduledDate}
                          initialFocus
                        />
                      </PopoverContent>
                    </Popover>
                  </div>
                </div>
                
                <div className="flex justify-between">
                  <Button variant="outline">Save as Draft</Button>
                  <Button onClick={handleSendMessage}>
                    <Send className="mr-2 h-4 w-4" />
                    {scheduledDate ? 'Schedule Message' : 'Send Message'}
                  </Button>
                </div>
              </div>
            </TabsContent>
            
            <TabsContent value="history">
              <div className="rounded-md border">
                <div className="grid grid-cols-12 px-4 py-3 bg-muted font-medium">
                  <div className="col-span-5">Message</div>
                  <div className="col-span-2">Date</div>
                  <div className="col-span-2">Recipients</div>
                  <div className="col-span-2">Open Rate</div>
                  <div className="col-span-1"></div>
                </div>
                {sentMessages.map((message) => (
                  <div 
                    key={message.id}
                    className="grid grid-cols-12 px-4 py-3 border-t items-center"
                  >
                    <div className="col-span-5 font-medium">{message.title}</div>
                    <div className="col-span-2 text-sm">{message.date}</div>
                    <div className="col-span-2 text-sm">
                      <div className="flex items-center">
                        <Users className="h-3 w-3 mr-1" />
                        {message.recipients}
                      </div>
                    </div>
                    <div className="col-span-2 text-sm">
                      <div className="flex items-center">
                        <CheckCircle2 className="h-3 w-3 mr-1" />
                        {message.openRate}
                      </div>
                    </div>
                    <div className="col-span-1 text-right">
                      <Button variant="ghost" size="sm">View</Button>
                    </div>
                  </div>
                ))}
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
};

export default FanMessaging;
