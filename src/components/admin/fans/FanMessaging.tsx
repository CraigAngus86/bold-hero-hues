
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogTrigger } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { 
  Plus, 
  Search, 
  Mail, 
  Send, 
  Clock, 
  Eye, 
  Pencil, 
  Trash2, 
  CheckCircle, 
  BarChart, 
  Users, 
  CalendarIcon,
  HelpCircle
} from "lucide-react";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { format } from "date-fns";
import { Switch } from "@/components/ui/switch";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { cn } from "@/lib/utils";
import DataTable from '@/components/admin/common/DataTable';
import { toast } from "sonner";
import { FanMessage, AudienceGroup } from '@/types/fans';

// Mock data for development
const mockMessages = [
  {
    id: '1',
    title: 'Match Day Information',
    type: 'email',
    sentDate: '2023-06-01T10:00:00Z',
    status: 'sent',
    audienceSize: 248,
    opens: 156,
    clicks: 82,
    template: 'match-day',
    content: '<div>Dear supporter,<br><br>We are excited to welcome you to Spain Park this Saturday for our match against Formartine United. Please find attached important information about the match day.<br><br>Gates open: 2:00 PM<br>Kick-off: 3:00 PM<br><br>Best regards,<br>Banks o\' Dee FC</div>'
  },
  {
    id: '2',
    title: 'Season Ticket Renewal',
    type: 'email',
    sentDate: null,
    status: 'draft',
    audienceSize: 120,
    opens: 0,
    clicks: 0,
    template: 'season-ticket',
    content: '<div>Dear season ticket holder,<br><br>As the current season draws to a close, we would like to invite you to renew your season ticket for the 2023/24 season.<br><br>Early bird pricing will be available until July 15th.<br><br>Best regards,<br>Banks o\' Dee FC</div>'
  },
  {
    id: '3',
    title: 'Upcoming Youth Team Trials',
    type: 'email',
    sentDate: '2023-06-15T08:00:00Z',
    status: 'scheduled',
    audienceSize: 85,
    opens: 0,
    clicks: 0,
    template: 'youth-team',
    content: '<div>Dear parents,<br><br>We are pleased to announce that trials for our youth teams will be held on Sunday, July 2nd at Spain Park.<br><br>Times:<br>Under 10s: 10:00 AM<br>Under 12s: 11:30 AM<br>Under 14s: 1:00 PM<br>Under 16s: 2:30 PM<br><br>Please register your interest by replying to this email.<br><br>Best regards,<br>Banks o\' Dee Youth Academy</div>'
  }
];

const mockGroups = [
  { id: '1', name: 'Season Ticket Holders', count: 120, tags: ['members', 'tickets'] },
  { id: '2', name: 'Youth Team Parents', count: 85, tags: ['youth', 'family'] },
  { id: '3', name: 'Newsletter Subscribers', count: 340, tags: ['general'] },
  { id: '4', name: 'Club Volunteers', count: 48, tags: ['volunteer', 'staff'] },
  { id: '5', name: 'Corporate Partners', count: 24, tags: ['sponsors', 'business'] }
];

const mockTemplates = [
  { id: '1', name: 'Match Day Information', subject: 'Your Match Day Guide: {team} vs {opponent}' },
  { id: '2', name: 'Season Ticket', subject: 'Season Ticket Information for {season}' },
  { id: '3', name: 'General Newsletter', subject: 'Banks o\' Dee FC Newsletter: {month} {year}' },
  { id: '4', name: 'Youth Team Updates', subject: 'Youth Team Update: {month} {year}' }
];

const templateHelpers = [
  { placeholder: '{team}', description: 'Club name (Banks o\' Dee FC)' },
  { placeholder: '{opponent}', description: 'Opponent team name' },
  { placeholder: '{date}', description: 'Match date' },
  { placeholder: '{time}', description: 'Match time' },
  { placeholder: '{venue}', description: 'Venue name' },
  { placeholder: '{recipient_name}', description: 'Recipient\'s name' },
  { placeholder: '{season}', description: 'Season (e.g., 2023/24)' },
  { placeholder: '{month}', description: 'Current month' },
  { placeholder: '{year}', description: 'Current year' }
];

// Simplified email editor for the prototype
const EmailEditor = ({ value, onChange }) => {
  return (
    <div className="border rounded-md p-4">
      <div className="bg-gray-50 p-3 rounded-md mb-3">
        <div className="text-xs text-gray-500 mb-2">This is a simplified editor for the prototype. In a real implementation, a rich text editor would be used.</div>
        <div className="flex flex-wrap gap-2">
          {templateHelpers.map((helper, index) => (
            <div key={index} className="flex items-center gap-1 text-xs bg-white px-2 py-1 rounded border">
              <code className="text-blue-600">{helper.placeholder}</code>
              <Popover>
                <PopoverTrigger asChild>
                  <Button variant="ghost" size="icon" className="h-4 w-4 p-0">
                    <HelpCircle size={12} />
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-48 p-2 text-xs">
                  {helper.description}
                </PopoverContent>
              </Popover>
            </div>
          ))}
        </div>
      </div>
      <textarea
        className="w-full min-h-[300px] p-2 border rounded"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder="Enter your email content here. You can use HTML for formatting."
      />
    </div>
  );
};

// Component to display message analytics
const MessageAnalytics = ({ message }) => {
  const openRate = message.audienceSize > 0 ? (message.opens / message.audienceSize * 100).toFixed(1) : '0';
  const clickRate = message.opens > 0 ? (message.clicks / message.opens * 100).toFixed(1) : '0';
  
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
      <div className="bg-gray-50 p-4 rounded-md">
        <div className="text-sm text-gray-500 mb-1">Audience Size</div>
        <div className="text-2xl font-bold">{message.audienceSize}</div>
      </div>
      <div className="bg-gray-50 p-4 rounded-md">
        <div className="text-sm text-gray-500 mb-1">Open Rate</div>
        <div className="flex items-end gap-2">
          <div className="text-2xl font-bold">{openRate}%</div>
          <div className="text-sm text-gray-500 mb-1">({message.opens} opens)</div>
        </div>
      </div>
      <div className="bg-gray-50 p-4 rounded-md">
        <div className="text-sm text-gray-500 mb-1">Click Rate</div>
        <div className="flex items-end gap-2">
          <div className="text-2xl font-bold">{clickRate}%</div>
          <div className="text-sm text-gray-500 mb-1">({message.clicks} clicks)</div>
        </div>
      </div>
    </div>
  );
};

// Audience selector component
const AudienceSelector = ({ groups, selectedGroups, onSelectionChange }) => {
  const handleToggle = (groupId) => {
    if (selectedGroups.includes(groupId)) {
      onSelectionChange(selectedGroups.filter(id => id !== groupId));
    } else {
      onSelectionChange([...selectedGroups, groupId]);
    }
  };
  
  return (
    <div className="space-y-2">
      <div className="flex justify-between mb-2">
        <div className="text-sm">
          Selected: {selectedGroups.length} group(s) - 
          {selectedGroups.length > 0 
            ? ` ${groups.filter(g => selectedGroups.includes(g.id)).reduce((acc, g) => acc + g.count, 0)} recipients` 
            : ' 0 recipients'}
        </div>
      </div>
      
      {groups.map((group) => (
        <div 
          key={group.id}
          className={cn(
            "flex items-center justify-between p-3 rounded-md border cursor-pointer transition-colors",
            selectedGroups.includes(group.id) ? "border-primary bg-primary/5" : "border-gray-200 hover:bg-gray-50"
          )}
          onClick={() => handleToggle(group.id)}
        >
          <div>
            <div className="font-medium text-gray-800">{group.name}</div>
            <div className="text-sm text-gray-600">{group.count} recipient(s)</div>
            <div className="flex gap-1 mt-1">
              {group.tags.map((tag, i) => (
                <Badge key={i} variant="outline" className="text-xs">{tag}</Badge>
              ))}
            </div>
          </div>
          <div>
            <div className={cn(
              "w-5 h-5 rounded border flex items-center justify-center",
              selectedGroups.includes(group.id) ? "bg-primary border-primary text-white" : "border-gray-300"
            )}>
              {selectedGroups.includes(group.id) && <CheckCircle size={14} />}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

const FanMessaging = () => {
  const [activeTab, setActiveTab] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [messages, setMessages] = useState(mockMessages);
  const [groups, setGroups] = useState(mockGroups);
  const [templates, setTemplates] = useState(mockTemplates);
  const [isComposeDialogOpen, setIsComposeDialogOpen] = useState(false);
  const [isViewDialogOpen, setIsViewDialogOpen] = useState(false);
  const [currentMessage, setCurrentMessage] = useState(null);
  
  // New message form state
  const [newMessage, setNewMessage] = useState({
    title: '',
    type: 'email',
    subject: '',
    content: '',
    selectedGroups: [],
    scheduledDate: null,
    scheduledTime: '09:00',
    isScheduled: false,
    selectedTemplate: '',
  });
  
  // Handle view message details
  const handleViewMessage = (message) => {
    setCurrentMessage(message);
    setIsViewDialogOpen(true);
  };
  
  // Handle create message
  const handleCreateMessage = () => {
    if (!validateForm()) return;
    
    // Calculate audience size
    const audienceSize = newMessage.selectedGroups
      .map(groupId => groups.find(g => g.id === groupId)?.count || 0)
      .reduce((acc, count) => acc + count, 0);
    
    // Determine status based on scheduling
    const status = newMessage.isScheduled ? 'scheduled' : 'draft';
    const sentDate = (!newMessage.isScheduled || !newMessage.scheduledDate) 
      ? null 
      : new Date(
          new Date(newMessage.scheduledDate).setHours(
            parseInt(newMessage.scheduledTime.split(':')[0], 10),
            parseInt(newMessage.scheduledTime.split(':')[1], 10)
          )
        ).toISOString();
    
    // In a real implementation, we would save to the database
    const newMessageItem = {
      id: Date.now().toString(),
      title: newMessage.title,
      type: newMessage.type,
      sentDate,
      status,
      audienceSize,
      opens: 0,
      clicks: 0,
      template: newMessage.selectedTemplate,
      content: newMessage.content
    };
    
    setMessages([newMessageItem, ...messages]);
    toast.success('Message created successfully');
    setIsComposeDialogOpen(false);
    resetForm();
  };
  
  // Handle send message now
  const handleSendNow = () => {
    if (!validateForm()) return;
    
    // Calculate audience size
    const audienceSize = newMessage.selectedGroups
      .map(groupId => groups.find(g => g.id === groupId)?.count || 0)
      .reduce((acc, count) => acc + count, 0);
    
    // In a real implementation, we would save to the database and send the message
    const newMessageItem = {
      id: Date.now().toString(),
      title: newMessage.title,
      type: newMessage.type,
      sentDate: new Date().toISOString(),
      status: 'sent',
      audienceSize,
      opens: 0,
      clicks: 0,
      template: newMessage.selectedTemplate,
      content: newMessage.content
    };
    
    setMessages([newMessageItem, ...messages]);
    toast.success('Message sent successfully');
    setIsComposeDialogOpen(false);
    resetForm();
  };
  
  // Validate the form
  const validateForm = () => {
    if (!newMessage.title.trim()) {
      toast.error('Title is required');
      return false;
    }
    
    if (!newMessage.subject.trim()) {
      toast.error('Subject is required');
      return false;
    }
    
    if (!newMessage.content.trim()) {
      toast.error('Content is required');
      return false;
    }
    
    if (newMessage.selectedGroups.length === 0) {
      toast.error('At least one audience group must be selected');
      return false;
    }
    
    if (newMessage.isScheduled && !newMessage.scheduledDate) {
      toast.error('Scheduled date is required');
      return false;
    }
    
    return true;
  };
  
  // Reset the form
  const resetForm = () => {
    setNewMessage({
      title: '',
      type: 'email',
      subject: '',
      content: '',
      selectedGroups: [],
      scheduledDate: null,
      scheduledTime: '09:00',
      isScheduled: false,
      selectedTemplate: '',
    });
  };
  
  // Handle template selection
  const handleTemplateChange = (templateId) => {
    setNewMessage({
      ...newMessage,
      selectedTemplate: templateId
    });
    
    // In a real implementation, we would load the template content
    const template = templates.find(t => t.id === templateId);
    if (template) {
      setNewMessage(prev => ({
        ...prev,
        subject: template.subject,
        content: `<div>This is a template for ${template.name}. The actual content would be loaded from the database in a real implementation.</div>`
      }));
      toast.info('Template loaded');
    }
  };
  
  // Filter messages based on activeTab and searchQuery
  const filteredMessages = messages.filter(message => {
    // Filter by tab
    if (activeTab === 'all') {
      // No filter
    } else if (activeTab === 'drafts') {
      if (message.status !== 'draft') return false;
    } else if (activeTab === 'sent') {
      if (message.status !== 'sent') return false;
    } else if (activeTab === 'scheduled') {
      if (message.status !== 'scheduled') return false;
    }
    
    // Filter by search query
    if (searchQuery) {
      return message.title.toLowerCase().includes(searchQuery.toLowerCase());
    }
    
    return true;
  });
  
  // Column definitions for the data table
  const columns = [
    { 
      key: 'title', 
      header: 'Message',
      cell: (message) => (
        <div>
          <div className="font-medium">{message.title}</div>
          <div className="flex items-center mt-1">
            <Badge variant={message.type === 'email' ? 'default' : 'secondary'}>
              {message.type === 'email' ? 'Email' : 'Notification'}
            </Badge>
            <Badge variant="outline" className={`ml-2 ${message.status === 'sent' ? 'bg-green-100 text-green-800' : message.status === 'scheduled' ? 'bg-blue-100 text-blue-800' : ''}`}>
              {message.status.charAt(0).toUpperCase() + message.status.slice(1)}
            </Badge>
          </div>
        </div>
      ),
      sortable: true
    },
    {
      key: 'schedule',
      header: 'Date',
      cell: (message) => (
        <div className="text-sm">
          {message.status === 'sent' ? (
            <div className="flex items-center text-gray-700">
              <Send className="h-3.5 w-3.5 mr-1.5 text-green-600" />
              Sent: {message.sentDate ? new Date(message.sentDate).toLocaleString() : 'Unknown'}
            </div>
          ) : message.status === 'scheduled' ? (
            <div className="flex items-center text-gray-700">
              <Clock className="h-3.5 w-3.5 mr-1.5 text-blue-600" />
              Scheduled: {message.sentDate ? new Date(message.sentDate).toLocaleString() : 'Unknown'}
            </div>
          ) : (
            <div className="flex items-center text-gray-500">
              <Clock className="h-3.5 w-3.5 mr-1.5" />
              Draft
            </div>
          )}
        </div>
      )
    },
    {
      key: 'stats',
      header: 'Performance',
      cell: (message) => (
        <div className="space-y-1">
          <div className="flex items-center">
            <Users className="h-4 w-4 mr-1.5 text-gray-600" />
            <span>{message.audienceSize} recipients</span>
          </div>
          {message.status === 'sent' && (
            <>
              <div className="flex items-center">
                <Mail className="h-4 w-4 mr-1.5 text-blue-600" />
                <span>{message.opens} opens ({(message.opens / message.audienceSize * 100).toFixed(1)}%)</span>
              </div>
              <div className="flex items-center">
                <BarChart className="h-4 w-4 mr-1.5 text-green-600" />
                <span>{message.clicks} clicks ({(message.clicks / message.opens * 100).toFixed(1)}%)</span>
              </div>
            </>
          )}
        </div>
      )
    },
    {
      key: 'actions',
      header: 'Actions',
      cell: (message) => (
        <div className="flex justify-end gap-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => handleViewMessage(message)}
          >
            <Eye size={16} />
          </Button>
          {message.status !== 'sent' && (
            <>
              <Button variant="ghost" size="sm">
                <Pencil size={16} />
              </Button>
              <Button variant="ghost" size="sm" className="text-red-600">
                <Trash2 size={16} />
              </Button>
            </>
          )}
        </div>
      )
    }
  ];
  
  return (
    <div className="bg-white rounded-lg shadow-sm border p-6">
      <div className="flex flex-col md:flex-row md:justify-between md:items-center mb-6">
        <div>
          <h2 className="text-xl font-semibold">Fan Messaging</h2>
          <p className="text-gray-600">Send emails and notifications to fans and subscribers</p>
        </div>
        
        <div className="mt-4 md:mt-0 flex flex-col md:flex-row gap-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
            <Input
              placeholder="Search messages..."
              className="pl-9 w-full md:w-64"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <Dialog open={isComposeDialogOpen} onOpenChange={setIsComposeDialogOpen}>
            <DialogTrigger asChild>
              <Button className="flex items-center gap-2">
                <Plus size={16} />
                <span>Compose Message</span>
              </Button>
            </DialogTrigger>
            
            <DialogContent className="max-w-4xl overflow-y-auto max-h-[90vh]">
              <DialogHeader>
                <DialogTitle>Compose New Message</DialogTitle>
              </DialogHeader>
              
              <div className="overflow-y-auto max-h-[calc(90vh-140px)]">
                <div className="py-4 space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="title">Title (Internal Reference)</Label>
                      <Input
                        id="title"
                        value={newMessage.title}
                        onChange={(e) => setNewMessage({...newMessage, title: e.target.value})}
                        className="mt-1"
                        placeholder="Enter a title for internal reference"
                      />
                    </div>
                    <div>
                      <Label htmlFor="type">Type</Label>
                      <Select
                        value={newMessage.type}
                        onValueChange={(value) => setNewMessage({...newMessage, type: value})}
                      >
                        <SelectTrigger className="mt-1">
                          <SelectValue placeholder="Select message type" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="email">Email</SelectItem>
                          <SelectItem value="notification">Notification</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  
                  <div>
                    <Label htmlFor="template">Template (Optional)</Label>
                    <Select
                      value={newMessage.selectedTemplate}
                      onValueChange={handleTemplateChange}
                    >
                      <SelectTrigger className="mt-1">
                        <SelectValue placeholder="Select a template or start from scratch" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="">No Template (Start from scratch)</SelectItem>
                        {templates.map(template => (
                          <SelectItem key={template.id} value={template.id}>{template.name}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div>
                    <Label htmlFor="subject">Subject</Label>
                    <Input
                      id="subject"
                      value={newMessage.subject}
                      onChange={(e) => setNewMessage({...newMessage, subject: e.target.value})}
                      className="mt-1"
                      placeholder="Enter message subject"
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="content">Content</Label>
                    <EmailEditor
                      value={newMessage.content}
                      onChange={(content) => setNewMessage({...newMessage, content})}
                    />
                  </div>
                  
                  <div className="border-t pt-4">
                    <Label className="mb-2 block">Audience</Label>
                    <AudienceSelector
                      groups={groups}
                      selectedGroups={newMessage.selectedGroups}
                      onSelectionChange={(selected) => setNewMessage({...newMessage, selectedGroups: selected})}
                    />
                  </div>
                  
                  <div className="border-t pt-4">
                    <div className="flex items-center space-x-2 mb-4">
                      <Switch
                        id="schedule"
                        checked={newMessage.isScheduled}
                        onCheckedChange={(checked) => setNewMessage({...newMessage, isScheduled: checked})}
                      />
                      <Label htmlFor="schedule">Schedule this message for later</Label>
                    </div>
                    
                    {newMessage.isScheduled && (
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <Label htmlFor="date">Date</Label>
                          <div className="mt-1">
                            <Popover>
                              <PopoverTrigger asChild>
                                <Button
                                  variant="outline"
                                  className={cn(
                                    "w-full justify-start text-left font-normal",
                                    !newMessage.scheduledDate && "text-muted-foreground"
                                  )}
                                >
                                  <CalendarIcon className="mr-2 h-4 w-4" />
                                  {newMessage.scheduledDate ? format(new Date(newMessage.scheduledDate), "PPP") : <span>Select date</span>}
                                </Button>
                              </PopoverTrigger>
                              <PopoverContent className="w-auto p-0">
                                <Calendar
                                  mode="single"
                                  selected={newMessage.scheduledDate ? new Date(newMessage.scheduledDate) : undefined}
                                  onSelect={(date) => setNewMessage({...newMessage, scheduledDate: date?.toISOString()})}
                                  initialFocus
                                  disabled={(date) => date < new Date()}
                                />
                              </PopoverContent>
                            </Popover>
                          </div>
                        </div>
                        <div>
                          <Label htmlFor="time">Time</Label>
                          <Input
                            id="time"
                            type="time"
                            value={newMessage.scheduledTime}
                            onChange={(e) => setNewMessage({...newMessage, scheduledTime: e.target.value})}
                            className="mt-1"
                          />
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
              
              <DialogFooter>
                <Button variant="outline" onClick={() => setIsComposeDialogOpen(false)}>
                  Cancel
                </Button>
                <Button variant="secondary" onClick={handleCreateMessage}>
                  Save as Draft
                </Button>
                {newMessage.isScheduled ? (
                  <Button onClick={handleCreateMessage}>
                    Schedule Message
                  </Button>
                ) : (
                  <Button onClick={handleSendNow}>
                    Send Now
                  </Button>
                )}
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </div>
      
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
        <TabsList>
          <TabsTrigger value="all">All Messages</TabsTrigger>
          <TabsTrigger value="drafts">Drafts</TabsTrigger>
          <TabsTrigger value="scheduled">Scheduled</TabsTrigger>
          <TabsTrigger value="sent">Sent</TabsTrigger>
        </TabsList>
        
        <TabsContent value={activeTab} className="pt-2">
          <Card>
            <CardContent className="p-0">
              <DataTable
                columns={columns}
                data={filteredMessages}
                noDataMessage="No messages found"
              />
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
      
      {/* View Message Dialog */}
      <Dialog open={isViewDialogOpen} onOpenChange={setIsViewDialogOpen}>
        {currentMessage && (
          <DialogContent className="max-w-3xl overflow-y-auto max-h-[90vh]">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                {currentMessage.title}
                <Badge variant={currentMessage.type === 'email' ? 'default' : 'secondary'}>
                  {currentMessage.type === 'email' ? 'Email' : 'Notification'}
                </Badge>
                <Badge variant="outline" className={`ml-2 ${currentMessage.status === 'sent' ? 'bg-green-100 text-green-800' : currentMessage.status === 'scheduled' ? 'bg-blue-100 text-blue-800' : ''}`}>
                  {currentMessage.status.charAt(0).toUpperCase() + currentMessage.status.slice(1)}
                </Badge>
              </DialogTitle>
            </DialogHeader>
            
            <div className="overflow-y-auto max-h-[calc(90vh-140px)]">
              <div className="py-2">
                <div className="flex flex-wrap gap-y-2 items-center text-sm text-gray-700 mb-4">
                  {currentMessage.sentDate ? (
                    <div className="flex items-center mr-4">
                      {currentMessage.status === 'sent' ? (
                        <>
                          <Send className="h-3.5 w-3.5 mr-1.5 text-green-600" />
                          <span>Sent: {new Date(currentMessage.sentDate).toLocaleString()}</span>
                        </>
                      ) : (
                        <>
                          <Clock className="h-3.5 w-3.5 mr-1.5 text-blue-600" />
                          <span>Scheduled: {new Date(currentMessage.sentDate).toLocaleString()}</span>
                        </>
                      )}
                    </div>
                  ) : (
                    <div className="flex items-center mr-4">
                      <Clock className="h-3.5 w-3.5 mr-1.5" />
                      <span>Draft</span>
                    </div>
                  )}
                </div>
                
                {currentMessage.status === 'sent' && <MessageAnalytics message={currentMessage} />}
                
                <div className="space-y-4">
                  <div>
                    <Label className="block mb-1">Subject</Label>
                    <div className="p-3 border rounded-md bg-gray-50">
                      {currentMessage.subject || 'No subject set'}
                    </div>
                  </div>
                  
                  <div>
                    <Label className="block mb-1">Content</Label>
                    <div 
                      className="p-3 border rounded-md min-h-[200px] bg-white"
                      dangerouslySetInnerHTML={{ __html: currentMessage.content }}
                    />
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label className="block mb-1">Audience</Label>
                      <div className="p-3 border rounded-md bg-gray-50">
                        {currentMessage.audienceSize} recipients
                      </div>
                    </div>
                    <div>
                      <Label className="block mb-1">Template</Label>
                      <div className="p-3 border rounded-md bg-gray-50">
                        {templates.find(t => t.id === currentMessage.template)?.name || 'No template used'}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsViewDialogOpen(false)}>
                Close
              </Button>
              {currentMessage.status === 'sent' && (
                <Button>
                  Export Analytics
                </Button>
              )}
              {currentMessage.status !== 'sent' && (
                <Button variant={currentMessage.status === 'scheduled' ? 'default' : 'secondary'}>
                  {currentMessage.status === 'scheduled' ? 'Edit Schedule' : 'Edit Draft'}
                </Button>
              )}
            </DialogFooter>
          </DialogContent>
        )}
      </Dialog>
    </div>
  );
};

export default FanMessaging;
