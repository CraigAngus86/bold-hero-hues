
import React from 'react';
import {
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle,
  CardFooter
} from '@/components/ui/card';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Separator } from '@/components/ui/separator';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from '@/components/ui/dialog';
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { MailIcon, Send, CheckCircle2, AlertCircle, FileCode, RefreshCcw } from 'lucide-react';
import { toast } from '@/hooks/use-toast';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';

// Define form schema
const emailConfigSchema = z.object({
  emailProvider: z.string(),
  smtpHost: z.string().min(1, "SMTP host is required"),
  smtpPort: z.string().regex(/^\d+$/, "Port must be a number"),
  smtpUsername: z.string().min(1, "SMTP username is required"),
  smtpPassword: z.string().min(1, "SMTP password is required"),
  fromEmail: z.string().email("Please enter a valid email address"),
  fromName: z.string().min(1, "From name is required"),
  useTls: z.boolean().default(true),
  useTestMode: z.boolean().default(false),
});

type EmailConfigValues = z.infer<typeof emailConfigSchema>;

// Test email schema
const testEmailSchema = z.object({
  recipient: z.string().email("Please enter a valid email address"),
  subject: z.string().min(1, "Subject is required"),
  message: z.string().min(1, "Message is required"),
});

type TestEmailValues = z.infer<typeof testEmailSchema>;

// Mock templates
const emailTemplates = [
  { id: 'welcome', name: 'Welcome Email', usedFor: 'New user registration' },
  { id: 'password-reset', name: 'Password Reset', usedFor: 'Password reset requests' },
  { id: 'ticket-purchase', name: 'Ticket Confirmation', usedFor: 'After ticket purchase' },
  { id: 'newsletter', name: 'Newsletter', usedFor: 'Weekly club news' },
  { id: 'match-reminder', name: 'Match Reminder', usedFor: 'Upcoming match notification' },
];

// Mock email logs
const emailLogs = [
  { id: 1, recipient: 'fan@example.com', subject: 'Match Tickets Confirmed', status: 'delivered', date: '2025-04-06 09:12:34' },
  { id: 2, recipient: 'member@example.com', subject: 'Welcome to Banks o\' Dee FC', status: 'delivered', date: '2025-04-05 14:23:45' },
  { id: 3, recipient: 'sponsor@example.com', subject: 'Sponsorship Package Details', status: 'opened', date: '2025-04-04 11:45:12' },
  { id: 4, recipient: 'info@example.com', subject: 'Newsletter April 2025', status: 'bounced', date: '2025-04-03 08:30:00' },
  { id: 5, recipient: 'contact@example.com', subject: 'Weekly Update', status: 'delivered', date: '2025-04-02 16:15:22' },
];

const EmailConfiguration = () => {
  const [activeTab, setActiveTab] = React.useState('settings');
  const [isTestDialogOpen, setIsTestDialogOpen] = React.useState(false);
  const [selectedTemplate, setSelectedTemplate] = React.useState(emailTemplates[0]);
  const [templateHtml, setTemplateHtml] = React.useState(`
<!DOCTYPE html>
<html>
<head>
  <style>
    body { font-family: Arial, sans-serif; }
    .header { background-color: #00105a; color: white; padding: 20px; }
    .content { padding: 20px; }
    .footer { background-color: #f3f4f6; padding: 10px; font-size: 12px; }
  </style>
</head>
<body>
  <div class="header">
    <h1>Welcome to Banks o' Dee FC</h1>
  </div>
  <div class="content">
    <p>Hello {{name}},</p>
    <p>Thank you for registering with Banks o' Dee FC. We're delighted to have you join our community.</p>
    <p>Your account has been created successfully.</p>
    <p>Best regards,<br>The Banks o' Dee FC Team</p>
  </div>
  <div class="footer">
    <p>Banks o' Dee Football Club, Spain Park, Aberdeen</p>
  </div>
</body>
</html>
  `);
  
  // Setup email config form
  const form = useForm<EmailConfigValues>({
    resolver: zodResolver(emailConfigSchema),
    defaultValues: {
      emailProvider: 'smtp',
      smtpHost: 'smtp.banksofdeefc.co.uk',
      smtpPort: '587',
      smtpUsername: 'notifications@banksofdeefc.co.uk',
      smtpPassword: '••••••••••••••',
      fromEmail: 'notifications@banksofdeefc.co.uk',
      fromName: 'Banks o\' Dee FC',
      useTls: true,
      useTestMode: false,
    },
  });
  
  // Setup test email form
  const testEmailForm = useForm<TestEmailValues>({
    resolver: zodResolver(testEmailSchema),
    defaultValues: {
      recipient: '',
      subject: 'Test Email from Banks o\' Dee FC',
      message: 'This is a test email from the Banks o\' Dee FC admin system.',
    },
  });
  
  const onSubmit = (values: EmailConfigValues) => {
    console.log(values);
    
    toast({
      title: "Email settings saved",
      description: "Your email configuration has been updated successfully.",
    });
  };
  
  const onSendTestEmail = (values: TestEmailValues) => {
    console.log(values);
    
    // Simulating sending process
    toast({
      title: "Sending test email...",
      description: "Please wait while we send your test email.",
    });
    
    setTimeout(() => {
      toast({
        title: "Test email sent",
        description: `Email sent successfully to ${values.recipient}`,
      });
      setIsTestDialogOpen(false);
      testEmailForm.reset();
    }, 1500);
  };
  
  const handleTemplateChange = (templateId: string) => {
    const template = emailTemplates.find(t => t.id === templateId);
    if (template) {
      setSelectedTemplate(template);
      // In a real application, we would load the template HTML from the backend
      setTemplateHtml(templateHtml);
    }
  };
  
  const handleSaveTemplate = () => {
    toast({
      title: "Template saved",
      description: `Changes to the ${selectedTemplate.name} template have been saved.`,
    });
  };

  return (
    <div className="space-y-6">
      <Tabs defaultValue={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="settings">Email Settings</TabsTrigger>
          <TabsTrigger value="templates">Email Templates</TabsTrigger>
          <TabsTrigger value="logs">Sending Logs</TabsTrigger>
        </TabsList>
        
        <TabsContent value="settings" className="space-y-4 mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Email Configuration</CardTitle>
              <CardDescription>
                Configure your SMTP settings for sending emails
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                  <FormField
                    control={form.control}
                    name="emailProvider"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Email Provider</FormLabel>
                        <Select 
                          onValueChange={field.onChange} 
                          defaultValue={field.value}
                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select provider" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="smtp">Custom SMTP</SelectItem>
                            <SelectItem value="sendgrid">SendGrid</SelectItem>
                            <SelectItem value="mailchimp">Mailchimp</SelectItem>
                            <SelectItem value="resend">Resend</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormDescription>
                          Choose your email service provider
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <FormField
                      control={form.control}
                      name="smtpHost"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>SMTP Host</FormLabel>
                          <FormControl>
                            <Input placeholder="smtp.example.com" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={form.control}
                      name="smtpPort"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>SMTP Port</FormLabel>
                          <FormControl>
                            <Input placeholder="587" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <FormField
                      control={form.control}
                      name="smtpUsername"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>SMTP Username</FormLabel>
                          <FormControl>
                            <Input placeholder="username" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={form.control}
                      name="smtpPassword"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>SMTP Password</FormLabel>
                          <FormControl>
                            <Input 
                              type="password" 
                              placeholder="••••••••••••"
                              {...field} 
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <FormField
                      control={form.control}
                      name="fromEmail"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>From Email</FormLabel>
                          <FormControl>
                            <Input 
                              placeholder="notifications@example.com" 
                              {...field} 
                            />
                          </FormControl>
                          <FormDescription>
                            The email address that will appear in the From field
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={form.control}
                      name="fromName"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>From Name</FormLabel>
                          <FormControl>
                            <Input 
                              placeholder="Your Organization Name" 
                              {...field} 
                            />
                          </FormControl>
                          <FormDescription>
                            The name that will appear in the From field
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                  
                  <div className="flex flex-col gap-4">
                    <FormField
                      control={form.control}
                      name="useTls"
                      render={({ field }) => (
                        <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3">
                          <div className="space-y-0.5">
                            <FormLabel>Use TLS Encryption</FormLabel>
                            <FormDescription>
                              Enable TLS for secure email transmission
                            </FormDescription>
                          </div>
                          <FormControl>
                            <Switch
                              checked={field.value}
                              onCheckedChange={field.onChange}
                            />
                          </FormControl>
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={form.control}
                      name="useTestMode"
                      render={({ field }) => (
                        <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3">
                          <div className="space-y-0.5">
                            <FormLabel>Test Mode</FormLabel>
                            <FormDescription>
                              When enabled, emails will not be actually sent
                            </FormDescription>
                          </div>
                          <FormControl>
                            <Switch
                              checked={field.value}
                              onCheckedChange={field.onChange}
                            />
                          </FormControl>
                        </FormItem>
                      )}
                    />
                  </div>
                  
                  <CardFooter className="flex justify-between px-0 pt-5 border-t">
                    <Dialog open={isTestDialogOpen} onOpenChange={setIsTestDialogOpen}>
                      <DialogTrigger asChild>
                        <Button variant="outline" type="button">
                          <Send className="h-4 w-4 mr-2" />
                          Send Test Email
                        </Button>
                      </DialogTrigger>
                      <DialogContent>
                        <DialogHeader>
                          <DialogTitle>Send Test Email</DialogTitle>
                          <DialogDescription>
                            Send a test email to verify your configuration
                          </DialogDescription>
                        </DialogHeader>
                        
                        <Form {...testEmailForm}>
                          <form onSubmit={testEmailForm.handleSubmit(onSendTestEmail)} className="space-y-4 py-4">
                            <FormField
                              control={testEmailForm.control}
                              name="recipient"
                              render={({ field }) => (
                                <FormItem>
                                  <FormLabel>Recipient Email</FormLabel>
                                  <FormControl>
                                    <Input placeholder="test@example.com" {...field} />
                                  </FormControl>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />
                            
                            <FormField
                              control={testEmailForm.control}
                              name="subject"
                              render={({ field }) => (
                                <FormItem>
                                  <FormLabel>Subject</FormLabel>
                                  <FormControl>
                                    <Input {...field} />
                                  </FormControl>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />
                            
                            <FormField
                              control={testEmailForm.control}
                              name="message"
                              render={({ field }) => (
                                <FormItem>
                                  <FormLabel>Message</FormLabel>
                                  <FormControl>
                                    <Textarea {...field} rows={4} />
                                  </FormControl>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />
                            
                            <DialogFooter className="pt-4">
                              <Button variant="outline" type="button" onClick={() => setIsTestDialogOpen(false)}>
                                Cancel
                              </Button>
                              <Button type="submit">
                                <Send className="h-4 w-4 mr-2" />
                                Send Test
                              </Button>
                            </DialogFooter>
                          </form>
                        </Form>
                      </DialogContent>
                    </Dialog>
                    
                    <div className="ml-auto">
                      <Button variant="outline" className="mr-2" type="button" onClick={() => form.reset()}>
                        Reset
                      </Button>
                      <Button type="submit">
                        Save Settings
                      </Button>
                    </div>
                  </CardFooter>
                </form>
              </Form>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="templates" className="space-y-4 mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Email Templates</CardTitle>
              <CardDescription>
                Manage and customize your email templates
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                <div className="md:col-span-1 space-y-4">
                  <div className="font-medium mb-2">Available Templates</div>
                  <ul className="space-y-2">
                    {emailTemplates.map((template) => (
                      <li key={template.id}>
                        <Button
                          variant={selectedTemplate.id === template.id ? 'default' : 'ghost'}
                          className="w-full justify-start"
                          onClick={() => handleTemplateChange(template.id)}
                        >
                          <MailIcon className="h-4 w-4 mr-2" />
                          {template.name}
                        </Button>
                      </li>
                    ))}
                  </ul>
                  
                  <div className="pt-4">
                    <Button variant="outline" className="w-full">
                      <FileCode className="h-4 w-4 mr-2" />
                      Create New Template
                    </Button>
                  </div>
                </div>
                
                <div className="md:col-span-3">
                  <div className="space-y-4">
                    <div>
                      <h3 className="text-lg font-medium">{selectedTemplate.name}</h3>
                      <p className="text-muted-foreground text-sm">
                        Used for: {selectedTemplate.usedFor}
                      </p>
                    </div>
                    
                    <div className="space-y-2">
                      <label className="text-sm font-medium">Subject Line</label>
                      <Input 
                        defaultValue={`Welcome to Banks o' Dee FC{{#if name}}, {{name}}{{/if}}!`}
                      />
                      <p className="text-xs text-muted-foreground">
                        You can use variables in double curly braces like {{'{{'}}variable{{'}}'}}
                      </p>
                    </div>
                    
                    <div className="space-y-2">
                      <label className="text-sm font-medium">Template HTML</label>
                      <div className="border rounded-md">
                        <textarea
                          className="w-full h-[300px] p-4 font-mono text-sm focus:outline-none focus:ring-2 focus:ring-primary-400 rounded-md"
                          value={templateHtml}
                          onChange={(e) => setTemplateHtml(e.target.value)}
                        />
                      </div>
                      <p className="text-xs text-muted-foreground">
                        Available variables: {{'{{'}}name{{'}}'}}, {{'{{'}}email{{'}}'}}, {{'{{'}}date{{'}}'}}
                      </p>
                    </div>
                    
                    <div className="flex justify-between pt-4">
                      <Button variant="outline">
                        <RefreshCcw className="h-4 w-4 mr-2" />
                        Reset to Default
                      </Button>
                      
                      <div>
                        <Dialog>
                          <DialogTrigger asChild>
                            <Button variant="outline" className="mr-2">
                              <Send className="h-4 w-4 mr-2" />
                              Preview
                            </Button>
                          </DialogTrigger>
                          <DialogContent className="max-w-[800px] max-h-[600px] overflow-y-auto">
                            <DialogHeader>
                              <DialogTitle>Template Preview</DialogTitle>
                              <DialogDescription>
                                This is how your email template will look
                              </DialogDescription>
                            </DialogHeader>
                            <div className="py-4">
                              <iframe
                                srcDoc={templateHtml}
                                title="Email Preview"
                                className="w-full h-[400px] border rounded"
                              />
                            </div>
                          </DialogContent>
                        </Dialog>
                        
                        <Button onClick={handleSaveTemplate}>
                          Save Template
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="logs" className="space-y-4 mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Email Sending Logs</CardTitle>
              <CardDescription>
                View the history of sent emails and their delivery status
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="rounded-lg border p-4 flex flex-col">
                    <span className="text-muted-foreground text-sm">Emails Sent (30 days)</span>
                    <span className="text-2xl font-bold mt-2">247</span>
                    <span className="text-xs text-emerald-600 mt-1">↑ 12% from last month</span>
                  </div>
                  
                  <div className="rounded-lg border p-4 flex flex-col">
                    <span className="text-muted-foreground text-sm">Delivery Rate</span>
                    <span className="text-2xl font-bold mt-2">98.2%</span>
                    <span className="text-xs text-emerald-600 mt-1">↑ 0.5% from last month</span>
                  </div>
                  
                  <div className="rounded-lg border p-4 flex flex-col">
                    <span className="text-muted-foreground text-sm">Open Rate</span>
                    <span className="text-2xl font-bold mt-2">45.7%</span>
                    <span className="text-xs text-amber-600 mt-1">↓ 2.1% from last month</span>
                  </div>
                </div>
                
                <div className="relative overflow-x-auto mt-6">
                  <table className="w-full text-sm text-left text-gray-500 dark:text-gray-400">
                    <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
                      <tr>
                        <th scope="col" className="px-6 py-3">Date & Time</th>
                        <th scope="col" className="px-6 py-3">Recipient</th>
                        <th scope="col" className="px-6 py-3">Subject</th>
                        <th scope="col" className="px-6 py-3">Status</th>
                      </tr>
                    </thead>
                    <tbody>
                      {emailLogs.map((log) => (
                        <tr key={log.id} className="bg-white border-b dark:bg-gray-800 dark:border-gray-700">
                          <td className="px-6 py-4">{log.date}</td>
                          <td className="px-6 py-4">{log.recipient}</td>
                          <td className="px-6 py-4 max-w-[200px] truncate">{log.subject}</td>
                          <td className="px-6 py-4">
                            {log.status === 'delivered' && (
                              <div className="flex items-center text-green-600">
                                <CheckCircle2 className="h-4 w-4 mr-1" />
                                Delivered
                              </div>
                            )}
                            {log.status === 'opened' && (
                              <div className="flex items-center text-blue-600">
                                <CheckCircle2 className="h-4 w-4 mr-1" />
                                Opened
                              </div>
                            )}
                            {log.status === 'bounced' && (
                              <div className="flex items-center text-red-600">
                                <AlertCircle className="h-4 w-4 mr-1" />
                                Bounced
                              </div>
                            )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </CardContent>
            <CardFooter className="flex justify-between border-t pt-5">
              <div className="text-sm text-muted-foreground">
                Showing the most recent 5 emails
              </div>
              <Button variant="outline">View All Logs</Button>
            </CardFooter>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default EmailConfiguration;
