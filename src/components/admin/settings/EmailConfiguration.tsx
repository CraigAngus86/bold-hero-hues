
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Switch } from '@/components/ui/switch';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/Table';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { AlertCircle, CheckCircle, Mail, Send, Settings, Templates, Clock, History } from 'lucide-react';
import { toast } from 'sonner';
import { useForm } from 'react-hook-form';

const EmailConfiguration = () => {
  const [activeTab, setActiveTab] = useState('settings');
  const [testEmailLoading, setTestEmailLoading] = useState(false);
  
  const form = useForm({
    defaultValues: {
      smtpServer: 'smtp.gmail.com',
      smtpPort: '587',
      smtpUsername: 'notifications@banksofdeefc.co.uk',
      smtpPassword: '',
      fromEmail: 'notifications@banksofdeefc.co.uk',
      fromName: 'Banks o\' Dee FC',
      useTLS: true
    }
  });
  
  const sendTestEmail = () => {
    setTestEmailLoading(true);
    setTimeout(() => {
      toast.success('Test email sent successfully');
      setTestEmailLoading(false);
    }, 2000);
  };
  
  // Mock email logs
  const emailLogs = [
    { 
      id: '1', 
      timestamp: '2025-04-06 14:32:22', 
      recipient: 'member@example.com', 
      subject: 'Match Day Reminder', 
      status: 'delivered' 
    },
    { 
      id: '2', 
      timestamp: '2025-04-06 10:15:03', 
      recipient: 'sponsor@company.com', 
      subject: 'Sponsorship Renewal', 
      status: 'delivered' 
    },
    { 
      id: '3', 
      timestamp: '2025-04-05 18:22:45', 
      recipient: 'fan@gmail.com', 
      subject: 'Ticket Confirmation', 
      status: 'opened' 
    },
    { 
      id: '4', 
      timestamp: '2025-04-04 09:11:32', 
      recipient: 'press@sportsnews.com', 
      subject: 'Press Release', 
      status: 'failed' 
    },
    { 
      id: '5', 
      timestamp: '2025-04-03 16:45:10', 
      recipient: 'committee@banksofdee.co.uk', 
      subject: 'Meeting Minutes', 
      status: 'delivered' 
    }
  ];
  
  // Mock email templates
  const emailTemplates = [
    {
      id: '1',
      name: 'Match Day Reminder',
      subject: 'Upcoming Match: Banks o\' Dee vs {{opponent}}',
      lastEdited: '2025-03-15',
      type: 'automatic'
    },
    {
      id: '2',
      name: 'Ticket Confirmation',
      subject: 'Your Banks o\' Dee FC Ticket Confirmation',
      lastEdited: '2025-03-10',
      type: 'automatic'
    },
    {
      id: '3',
      name: 'Welcome Email',
      subject: 'Welcome to Banks o\' Dee FC!',
      lastEdited: '2025-02-28',
      type: 'automatic'
    },
    {
      id: '4',
      name: 'Newsletter',
      subject: 'Banks o\' Dee FC Monthly Newsletter',
      lastEdited: '2025-04-01',
      type: 'manual'
    },
    {
      id: '5',
      name: 'Password Reset',
      subject: 'Reset Your Banks o\' Dee FC Password',
      lastEdited: '2025-01-20',
      type: 'automatic'
    }
  ];
  
  // Mock scheduled emails
  const scheduledEmails = [
    {
      id: '1',
      template: 'Match Day Reminder',
      scheduledFor: '2025-04-08 09:00',
      recipients: 'All Members',
      status: 'pending'
    },
    {
      id: '2',
      template: 'Newsletter',
      scheduledFor: '2025-04-15 12:00',
      recipients: 'All Subscribers',
      status: 'pending'
    },
    {
      id: '3',
      template: 'Sponsorship Thank You',
      scheduledFor: '2025-04-10 15:30',
      recipients: 'Sponsors Group',
      status: 'pending'
    }
  ];
  
  return (
    <div className="space-y-6">
      <Tabs defaultValue={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="settings">
            <Settings className="h-4 w-4 mr-2" />
            SMTP Settings
          </TabsTrigger>
          <TabsTrigger value="templates">
            <Templates className="h-4 w-4 mr-2" />
            Email Templates
          </TabsTrigger>
          <TabsTrigger value="logs">
            <History className="h-4 w-4 mr-2" />
            Logs
          </TabsTrigger>
          <TabsTrigger value="scheduled">
            <Clock className="h-4 w-4 mr-2" />
            Scheduled Emails
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="settings" className="space-y-4 pt-4">
          <Card>
            <CardHeader>
              <CardTitle>SMTP Configuration</CardTitle>
              <CardDescription>
                Configure your email server settings
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <form className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="smtp-server">SMTP Server</Label>
                    <Input 
                      id="smtp-server" 
                      placeholder="e.g. smtp.gmail.com" 
                      {...form.register('smtpServer')}
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="smtp-port">SMTP Port</Label>
                    <Input 
                      id="smtp-port" 
                      placeholder="e.g. 587" 
                      {...form.register('smtpPort')}
                    />
                  </div>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="smtp-username">SMTP Username</Label>
                    <Input 
                      id="smtp-username" 
                      placeholder="Your email username" 
                      {...form.register('smtpUsername')}
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="smtp-password">SMTP Password</Label>
                    <Input 
                      id="smtp-password" 
                      type="password" 
                      placeholder="Your email password" 
                      {...form.register('smtpPassword')}
                    />
                  </div>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="from-email">From Email</Label>
                    <Input 
                      id="from-email" 
                      placeholder="notifications@banksofdeefc.co.uk" 
                      {...form.register('fromEmail')}
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="from-name">From Name</Label>
                    <Input 
                      id="from-name" 
                      placeholder="Banks o' Dee FC" 
                      {...form.register('fromName')}
                    />
                  </div>
                </div>
                
                <div className="flex items-center space-x-2">
                  <Switch 
                    id="use-tls" 
                    checked={form.watch('useTLS')}
                    onCheckedChange={(checked) => form.setValue('useTLS', checked)}
                  />
                  <Label htmlFor="use-tls">Use TLS encryption</Label>
                </div>
                
                <div className="flex flex-col sm:flex-row sm:justify-between gap-3 pt-4">
                  <div className="flex gap-3">
                    <Button type="button" variant="outline" onClick={sendTestEmail} disabled={testEmailLoading}>
                      {testEmailLoading ? (
                        <>Sending</>
                      ) : (
                        <>
                          <Send className="h-4 w-4 mr-2" />
                          Send Test Email
                        </>
                      )}
                    </Button>
                    
                    <Button type="button" variant="outline">
                      <Mail className="h-4 w-4 mr-2" />
                      Verify Configuration
                    </Button>
                  </div>
                  
                  <Button type="submit">
                    Save Settings
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle>Notification Settings</CardTitle>
              <CardDescription>
                Configure email notification preferences
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <h4 className="text-sm font-semibold">Match Updates</h4>
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label className="text-sm">Pre-Match Notifications</Label>
                      <p className="text-xs text-muted-foreground">
                        Send 24 hours before each match
                      </p>
                    </div>
                    <Switch defaultChecked />
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label className="text-sm">Match Result Notifications</Label>
                      <p className="text-xs text-muted-foreground">
                        Send after match completion
                      </p>
                    </div>
                    <Switch defaultChecked />
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label className="text-sm">Fixture Changes</Label>
                      <p className="text-xs text-muted-foreground">
                        Send when match details change
                      </p>
                    </div>
                    <Switch defaultChecked />
                  </div>
                </div>
                
                <div className="space-y-4">
                  <h4 className="text-sm font-semibold">News & Content</h4>
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label className="text-sm">News Articles</Label>
                      <p className="text-xs text-muted-foreground">
                        Send when new articles are published
                      </p>
                    </div>
                    <Switch defaultChecked />
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label className="text-sm">Club Announcements</Label>
                      <p className="text-xs text-muted-foreground">
                        Major official announcements
                      </p>
                    </div>
                    <Switch defaultChecked />
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label className="text-sm">Weekly Newsletter</Label>
                      <p className="text-xs text-muted-foreground">
                        Summary of club activities
                      </p>
                    </div>
                    <Switch />
                  </div>
                </div>
              </div>
              
              <div className="pt-4">
                <h4 className="text-sm font-semibold mb-3">Newsletter Schedule</h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Day of Week</Label>
                    <Select defaultValue="1">
                      <SelectTrigger>
                        <SelectValue placeholder="Select day" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="1">Monday</SelectItem>
                        <SelectItem value="2">Tuesday</SelectItem>
                        <SelectItem value="3">Wednesday</SelectItem>
                        <SelectItem value="4">Thursday</SelectItem>
                        <SelectItem value="5">Friday</SelectItem>
                        <SelectItem value="6">Saturday</SelectItem>
                        <SelectItem value="0">Sunday</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label>Time of Day</Label>
                    <Input type="time" defaultValue="10:00" />
                  </div>
                </div>
              </div>
              
              <div className="flex justify-end pt-4">
                <Button type="button">Save Notification Settings</Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="templates" className="space-y-4 pt-4">
          <Card>
            <CardHeader>
              <div className="flex justify-between items-center">
                <div>
                  <CardTitle>Email Templates</CardTitle>
                  <CardDescription>
                    Manage and edit your email templates
                  </CardDescription>
                </div>
                <Button>
                  Create New Template
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Template Name</TableHead>
                    <TableHead>Subject</TableHead>
                    <TableHead>Last Modified</TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {emailTemplates.map((template) => (
                    <TableRow key={template.id}>
                      <TableCell className="font-medium">{template.name}</TableCell>
                      <TableCell>{template.subject}</TableCell>
                      <TableCell>{template.lastEdited}</TableCell>
                      <TableCell>
                        <Badge variant={template.type === 'automatic' ? 'outline' : 'secondary'}>
                          {template.type === 'automatic' ? 'Automatic' : 'Manual'}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right">
                        <Button variant="ghost" size="sm">
                          Edit
                        </Button>
                        <Button variant="ghost" size="sm">
                          Preview
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="logs" className="space-y-4 pt-4">
          <Card>
            <CardHeader>
              <CardTitle>Email Logs</CardTitle>
              <CardDescription>
                Monitor sent emails and delivery status
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Date & Time</TableHead>
                    <TableHead>Recipient</TableHead>
                    <TableHead>Subject</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {emailLogs.map((log) => (
                    <TableRow key={log.id}>
                      <TableCell>{log.timestamp}</TableCell>
                      <TableCell>{log.recipient}</TableCell>
                      <TableCell>{log.subject}</TableCell>
                      <TableCell>
                        {log.status === 'delivered' && (
                          <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
                            <CheckCircle className="h-3 w-3 mr-1" />
                            Delivered
                          </Badge>
                        )}
                        {log.status === 'opened' && (
                          <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">
                            <CheckCircle className="h-3 w-3 mr-1" />
                            Opened
                          </Badge>
                        )}
                        {log.status === 'failed' && (
                          <Badge variant="destructive">
                            <AlertCircle className="h-3 w-3 mr-1" />
                            Failed
                          </Badge>
                        )}
                      </TableCell>
                      <TableCell className="text-right">
                        <Button variant="ghost" size="sm">
                          View Details
                        </Button>
                        <Button variant="ghost" size="sm">
                          Resend
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="scheduled" className="space-y-4 pt-4">
          <Card>
            <CardHeader>
              <div className="flex justify-between items-center">
                <div>
                  <CardTitle>Scheduled Emails</CardTitle>
                  <CardDescription>
                    Manage your upcoming scheduled emails
                  </CardDescription>
                </div>
                <Button>
                  Schedule New Email
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Template</TableHead>
                    <TableHead>Scheduled For</TableHead>
                    <TableHead>Recipients</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {scheduledEmails.map((email) => (
                    <TableRow key={email.id}>
                      <TableCell className="font-medium">{email.template}</TableCell>
                      <TableCell>{email.scheduledFor}</TableCell>
                      <TableCell>{email.recipients}</TableCell>
                      <TableCell>
                        <Badge variant="outline" className="bg-yellow-50 text-yellow-700 border-yellow-200">
                          Scheduled
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right">
                        <Button variant="ghost" size="sm">
                          Edit
                        </Button>
                        <Button variant="ghost" size="sm">
                          Cancel
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default EmailConfiguration;
