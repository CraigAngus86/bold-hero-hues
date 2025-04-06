
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { 
  Search, 
  Send, 
  Users, 
  Clock, 
  Mail,
  FileText, 
  BarChart3, 
  Copy, 
  Trash, 
  Edit,
  Bell,
  Tag,
  Smartphone,
  ArrowRight,
  PlusCircle,
  Filter
} from 'lucide-react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

// Mock data for fan messages
const mockMessages = [
  {
    id: '1',
    title: 'Match Day Information: Banks o\' Dee vs Fraserburgh',
    type: 'email',
    sentDate: '2023-05-14T10:00:00',
    status: 'sent',
    audienceSize: 1245,
    opens: 873,
    clicks: 341,
    template: 'match-day',
  },
  {
    id: '2',
    title: 'Season Ticket Early Bird Offer Ending Soon',
    type: 'email',
    sentDate: '2023-05-10T09:30:00',
    status: 'sent',
    audienceSize: 1245,
    opens: 912,
    clicks: 456,
    template: 'promotion',
  },
  {
    id: '3',
    title: 'New Kit Launch',
    type: 'notification',
    sentDate: '2023-05-05T14:15:00',
    status: 'sent',
    audienceSize: 856,
    opens: 712,
    clicks: 324,
    template: 'announcement',
  },
  {
    id: '4',
    title: 'End of Season Awards Night',
    type: 'email',
    sentDate: null,
    status: 'draft',
    audienceSize: 1245,
    opens: 0,
    clicks: 0,
    template: 'event',
  },
  {
    id: '5',
    title: 'Youth Team Victory Update',
    type: 'notification',
    sentDate: '2023-05-01T18:45:00',
    status: 'sent',
    audienceSize: 856,
    opens: 623,
    clicks: 215,
    template: 'news-update',
  },
];

// Mock audience groups
const mockAudienceGroups = [
  {
    id: '1',
    name: 'All Subscribers',
    count: 1245,
    tags: ['all', 'subscribers']
  },
  {
    id: '2',
    name: 'Season Ticket Holders',
    count: 387,
    tags: ['season-ticket']
  },
  {
    id: '3',
    name: 'App Users',
    count: 856,
    tags: ['app-users', 'mobile']
  },
  {
    id: '4',
    name: 'Junior Supporters',
    count: 231,
    tags: ['youth', 'junior']
  },
  {
    id: '5',
    name: 'Local Supporters',
    count: 678,
    tags: ['local', 'aberdeen']
  }
];

// Status badge styles
const statusStyles = {
  sent: 'bg-green-100 text-green-800',
  scheduled: 'bg-yellow-100 text-yellow-800',
  draft: 'bg-blue-100 text-blue-800',
};

// Type badge styles
const typeStyles = {
  email: 'bg-purple-100 text-purple-800',
  notification: 'bg-indigo-100 text-indigo-800',
};

// Template icons
const templateIcons = {
  'match-day': Clock,
  'promotion': Tag,
  'announcement': Bell,
  'news-update': FileText,
  'event': Calendar
};

const Calendar = Clock; // Using Clock as Calendar for this example

const FanMessaging: React.FC = () => {
  const [messages, setMessages] = useState(mockMessages);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState('all');
  const [step, setStep] = useState(1);
  
  // Filter messages based on search query and active tab
  const filteredMessages = messages.filter(message => {
    // Filter by search query
    const matchesSearch = 
      message.title.toLowerCase().includes(searchQuery.toLowerCase());
    
    // Filter by tab
    if (activeTab === 'all') return matchesSearch;
    if (activeTab === 'email') return matchesSearch && message.type === 'email';
    if (activeTab === 'notification') return matchesSearch && message.type === 'notification';
    if (activeTab === 'sent') return matchesSearch && message.status === 'sent';
    if (activeTab === 'draft') return matchesSearch && message.status === 'draft';
    
    return matchesSearch;
  });
  
  // Start new message
  const startNewMessage = () => {
    setStep(1);
  };
  
  const MessageComposer = () => (
    <div className="space-y-8">
      {/* Step indicators */}
      <div className="flex justify-center mb-4 pb-6 border-b">
        <div className="flex items-center">
          <div className={`rounded-full w-8 h-8 ${step === 1 ? 'bg-team-blue text-white' : 'bg-gray-200'} flex items-center justify-center`}>1</div>
          <div className="h-1 w-12 bg-gray-200 mx-2"></div>
          <div className={`rounded-full w-8 h-8 ${step === 2 ? 'bg-team-blue text-white' : 'bg-gray-200'} flex items-center justify-center`}>2</div>
          <div className="h-1 w-12 bg-gray-200 mx-2"></div>
          <div className={`rounded-full w-8 h-8 ${step === 3 ? 'bg-team-blue text-white' : 'bg-gray-200'} flex items-center justify-center`}>3</div>
        </div>
      </div>
      
      {/* Step 1: Message Type & Template */}
      {step === 1 && (
        <div>
          <h3 className="text-xl font-semibold mb-6">Create New Message</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Mail className="mr-2" size={18} />
                  Email Message
                </CardTitle>
                <CardDescription>Send an HTML email to your subscribers</CardDescription>
              </CardHeader>
              <CardFooter className="border-t pt-4">
                <Button className="w-full" onClick={() => setStep(2)}>
                  Select Email
                </Button>
              </CardFooter>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Bell className="mr-2" size={18} />
                  Push Notification
                </CardTitle>
                <CardDescription>Send a notification to app users</CardDescription>
              </CardHeader>
              <CardFooter className="border-t pt-4">
                <Button className="w-full" onClick={() => setStep(2)}>
                  Select Notification
                </Button>
              </CardFooter>
            </Card>
          </div>
          
          <div className="mt-8">
            <h4 className="font-medium mb-4">Message Templates</h4>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {['match-day', 'promotion', 'announcement', 'news-update', 'event'].map(template => {
                const TemplateIcon = templateIcons[template as keyof typeof templateIcons];
                return (
                  <Card key={template} className="cursor-pointer hover:border-team-blue transition-colors">
                    <CardHeader className="pb-2">
                      <CardTitle className="text-base flex items-center">
                        <TemplateIcon size={16} className="mr-2" />
                        {template.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')}
                      </CardTitle>
                    </CardHeader>
                    <CardFooter className="pt-2">
                      <Button variant="ghost" size="sm" className="ml-auto" onClick={() => setStep(2)}>
                        Use Template
                      </Button>
                    </CardFooter>
                  </Card>
                );
              })}
            </div>
          </div>
        </div>
      )}
      
      {/* Step 2: Compose Message */}
      {step === 2 && (
        <div>
          <h3 className="text-xl font-semibold mb-6">Compose Message</h3>
          
          <div className="space-y-4">
            <div>
              <label htmlFor="title" className="block text-sm font-medium mb-1">Message Title</label>
              <Input id="title" placeholder="Enter message title" />
            </div>
            
            <div>
              <label htmlFor="subject" className="block text-sm font-medium mb-1">Email Subject</label>
              <Input id="subject" placeholder="Enter email subject" />
            </div>
            
            <div>
              <label htmlFor="content" className="block text-sm font-medium mb-1">Message Content</label>
              <Textarea id="content" placeholder="Compose your message..." className="min-h-[200px]" />
            </div>
            
            <div>
              <label className="block text-sm font-medium mb-1">Preview</label>
              <Card>
                <CardContent className="p-4">
                  <p className="text-gray-500 text-center py-8">Message preview will appear here</p>
                </CardContent>
              </Card>
            </div>
          </div>
          
          <div className="flex justify-between mt-6">
            <Button variant="outline" onClick={() => setStep(1)}>Back</Button>
            <Button onClick={() => setStep(3)}>Continue to Audience <ArrowRight size={16} className="ml-2" /></Button>
          </div>
        </div>
      )}
      
      {/* Step 3: Select Audience & Schedule */}
      {step === 3 && (
        <div>
          <h3 className="text-xl font-semibold mb-6">Select Audience & Schedule</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="space-y-4">
              <h4 className="font-medium">Audience</h4>
              <div className="space-y-2">
                {mockAudienceGroups.map(group => (
                  <Card key={group.id}>
                    <CardContent className="p-3 flex justify-between items-center">
                      <div>
                        <p className="font-medium">{group.name}</p>
                        <div className="flex items-center text-sm text-gray-500">
                          <Users size={14} className="mr-1" />
                          {group.count} recipients
                        </div>
                      </div>
                      <Button variant="outline" size="sm">
                        Select
                      </Button>
                    </CardContent>
                  </Card>
                ))}
              </div>
              
              <Button variant="outline" className="w-full flex items-center justify-center">
                <PlusCircle size={16} className="mr-2" />
                Create New Audience
              </Button>
            </div>
            
            <div className="space-y-4">
              <h4 className="font-medium">Schedule</h4>
              <Card>
                <CardContent className="p-4 space-y-4">
                  <div>
                    <label className="block text-sm font-medium mb-1">Send date</label>
                    <Input type="date" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">Send time</label>
                    <Input type="time" />
                  </div>
                  <div className="pt-2">
                    <Button className="w-full">Schedule</Button>
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardContent className="p-4">
                  <Button className="w-full bg-green-600 hover:bg-green-700">
                    <Send size={16} className="mr-2" />
                    Send Now
                  </Button>
                </CardContent>
              </Card>
            </div>
          </div>
          
          <div className="flex justify-between mt-6">
            <Button variant="outline" onClick={() => setStep(2)}>Back</Button>
            <Button variant="outline">Save as Draft</Button>
          </div>
        </div>
      )}
    </div>
  );

  return (
    <div className="bg-white rounded-lg shadow-sm border p-6">
      {step > 0 ? (
        <MessageComposer />
      ) : (
        <>
          {/* Header */}
          <div className="flex flex-col md:flex-row md:justify-between md:items-center mb-6">
            <div>
              <h2 className="text-xl font-semibold">Fan Messaging</h2>
              <p className="text-gray-600">Manage communications with fans</p>
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
              <Button variant="outline" className="flex items-center gap-2">
                <Filter size={16} />
                <span className="hidden md:inline">Filter</span>
              </Button>
              <Button onClick={startNewMessage} className="flex items-center gap-2">
                <PlusCircle size={16} />
                <span>New Message</span>
              </Button>
            </div>
          </div>
          
          {/* Tabs */}
          <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
            <TabsList>
              <TabsTrigger value="all">All Messages</TabsTrigger>
              <TabsTrigger value="email">Emails</TabsTrigger>
              <TabsTrigger value="notification">Notifications</TabsTrigger>
              <TabsTrigger value="sent">Sent</TabsTrigger>
              <TabsTrigger value="draft">Drafts</TabsTrigger>
            </TabsList>
            
            <TabsContent value={activeTab}>
              {/* Messages table */}
              <Card>
                <CardContent className="p-0">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Title</th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Type</th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Analytics</th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {filteredMessages.map((message) => (
                        <tr key={message.id} className="hover:bg-gray-50">
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="flex items-center">
                              {message.type === 'email' ? (
                                <Mail size={16} className="mr-2 text-gray-400" />
                              ) : (
                                <Bell size={16} className="mr-2 text-gray-400" />
                              )}
                              <span className="text-sm font-medium">{message.title}</span>
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <Badge className={typeStyles[message.type as keyof typeof typeStyles]}>
                              {message.type.charAt(0).toUpperCase() + message.type.slice(1)}
                            </Badge>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <Badge className={statusStyles[message.status as keyof typeof statusStyles]}>
                              {message.status.charAt(0).toUpperCase() + message.status.slice(1)}
                            </Badge>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {message.sentDate 
                              ? new Date(message.sentDate).toLocaleString() 
                              : <span className="italic">Not sent</span>
                            }
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            {message.status === 'sent' ? (
                              <div className="flex space-x-4 text-xs">
                                <div>
                                  <span className="block font-medium text-gray-900">{message.opens}</span>
                                  <span className="text-gray-500">Opens</span>
                                </div>
                                <div>
                                  <span className="block font-medium text-gray-900">{message.clicks}</span>
                                  <span className="text-gray-500">Clicks</span>
                                </div>
                              </div>
                            ) : (
                              <span className="text-sm text-gray-500">-</span>
                            )}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="flex space-x-2">
                              <Button size="sm" variant="ghost" className="h-8 w-8 p-0">
                                <BarChart3 size={16} />
                              </Button>
                              {message.status === 'draft' && (
                                <Button size="sm" variant="ghost" className="h-8 w-8 p-0">
                                  <Edit size={16} />
                                </Button>
                              )}
                              <Button size="sm" variant="ghost" className="h-8 w-8 p-0">
                                <Copy size={16} />
                              </Button>
                              <Button size="sm" variant="ghost" className="h-8 w-8 p-0 text-red-600">
                                <Trash size={16} />
                              </Button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                  
                  {filteredMessages.length === 0 && (
                    <div className="text-center py-12 text-gray-500">
                      <p>No messages found for your search criteria.</p>
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
          
          {/* Analytics summary */}
          <div className="mt-8">
            <h3 className="text-lg font-medium mb-4">Messaging Analytics</h3>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-base">Total Subscribers</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center">
                    <Users size={20} className="text-team-blue mr-2" />
                    <span className="text-2xl font-bold">1,245</span>
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-base">Average Open Rate</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center">
                    <Mail size={20} className="text-team-blue mr-2" />
                    <span className="text-2xl font-bold">72%</span>
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-base">Average Click Rate</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center">
                    <Mail size={20} className="text-team-blue mr-2" />
                    <span className="text-2xl font-bold">28%</span>
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-base">Active Mobile Users</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center">
                    <Smartphone size={20} className="text-team-blue mr-2" />
                    <span className="text-2xl font-bold">856</span>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
          
          <div className="border-t mt-8 pt-6 text-center text-sm text-gray-500">
            <p>This is a demonstration with sample content. In a future update, these will be stored in and retrieved from Supabase.</p>
          </div>
        </>
      )}
    </div>
  );
};

export default FanMessaging;
