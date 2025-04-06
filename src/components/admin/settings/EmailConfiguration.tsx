import React, { useState, useEffect } from 'react';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  CardFooter
} from "@/components/ui/card";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import {
  Mail,
  Save,
  Send,
  Plus,
  Trash2,
  Edit2,
  RefreshCw,
  Check,
  X,
  Eye,
  AlertCircle
} from "lucide-react";
import { toast } from "@/hooks/use-toast";
import { 
  EmailConfig, 
  getEmailConfig, 
  updateEmailConfig,
  sendTestEmail,
  EmailTemplate,
  getEmailTemplates,
  createEmailTemplate,
  updateEmailTemplate,
  deleteEmailTemplate,
  EmailLog,
  getEmailLogs
} from '@/services/emailService';
import { format, parseISO } from 'date-fns';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

// Schema for email configuration form
const emailConfigSchema = z.object({
  host: z.string().min(1, { message: "SMTP host is required" }),
  port: z.coerce.number().int().positive(),
  secure: z.boolean().default(true),
  username: z.string().min(1, { message: "Username is required" }),
  password: z.string().optional(),
  fromName: z.string().min(1, { message: "From name is required" }),
  fromEmail: z.string().email({ message: "Valid email is required" }),
  replyTo: z.string().email({ message: "Valid email is required" }).optional(),
});

// Schema for email template form
const emailTemplateSchema = z.object({
  name: z.string().min(1, { message: "Template name is required" }),
  subject: z.string().min(1, { message: "Subject is required" }),
  content: z.string().min(1, { message: "Content is required" }),
  description: z.string().optional(),
});

// Schema for test email form
const testEmailSchema = z.object({
  recipient: z.string().email({ message: "Valid email is required" }),
});

const EmailConfiguration = () => {
  const [activeTab, setActiveTab] = useState("settings");
  const [emailConfig, setEmailConfig] = useState<EmailConfig | null>(null);
  const [isLoadingConfig, setIsLoadingConfig] = useState(true);
  const [isSendingTest, setIsSendingTest] = useState(false);
  const [templates, setTemplates] = useState<EmailTemplate[]>([]);
  const [isLoadingTemplates, setIsLoadingTemplates] = useState(true);
  const [selectedTemplate, setSelectedTemplate] = useState<EmailTemplate | null>(null);
  const [isCreateTemplateOpen, setIsCreateTemplateOpen] = useState(false);
  const [isEditTemplateOpen, setIsEditTemplateOpen] = useState(false);
  const [logs, setLogs] = useState<EmailLog[]>([]);
  const [isLoadingLogs, setIsLoadingLogs] = useState(true);

  // Email config form
  const configForm = useForm<z.infer<typeof emailConfigSchema>>({
    resolver: zodResolver(emailConfigSchema),
    defaultValues: {
      host: "",
      port: 587,
      secure: true,
      username: "",
      password: "",
      fromName: "",
      fromEmail: "",
      replyTo: "",
    },
  });

  // Email template form
  const templateForm = useForm<z.infer<typeof emailTemplateSchema>>({
    resolver: zodResolver(emailTemplateSchema),
    defaultValues: {
      name: "",
      subject: "",
      content: "",
      description: "",
    },
  });

  // Test email form
  const testEmailForm = useForm<z.infer<typeof testEmailSchema>>({
    resolver: zodResolver(testEmailSchema),
    defaultValues: {
      recipient: "",
    },
  });

  // Load email configuration on mount
  useEffect(() => {
    loadEmailConfig();
  }, []);

  // Load templates when templates tab is selected
  useEffect(() => {
    if (activeTab === "templates") {
      loadEmailTemplates();
    }
  }, [activeTab]);

  // Load logs when logs tab is selected
  useEffect(() => {
    if (activeTab === "logs") {
      loadEmailLogs();
    }
  }, [activeTab]);

  // Set form values when email config is loaded
  useEffect(() => {
    if (emailConfig) {
      configForm.reset({
        host: emailConfig.host,
        port: emailConfig.port,
        secure: emailConfig.secure,
        username: emailConfig.username,
        password: "", // Don't populate password
        fromName: emailConfig.fromName,
        fromEmail: emailConfig.fromEmail,
        replyTo: emailConfig.replyTo || emailConfig.fromEmail,
      });
    }
  }, [emailConfig]);

  // Set template form values when selected template changes
  useEffect(() => {
    if (selectedTemplate) {
      templateForm.reset({
        name: selectedTemplate.name,
        subject: selectedTemplate.subject,
        content: selectedTemplate.content,
        description: selectedTemplate.description || "",
      });
    } else {
      templateForm.reset({
        name: "",
        subject: "",
        content: "",
        description: "",
      });
    }
  }, [selectedTemplate]);

  const loadEmailConfig = async () => {
    setIsLoadingConfig(true);
    try {
      const config = await getEmailConfig();
      setEmailConfig(config);
    } catch (error) {
      console.error("Error loading email configuration:", error);
      toast({
        title: "Error",
        description: "Failed to load email configuration",
        variant: "destructive",
      });
    } finally {
      setIsLoadingConfig(false);
    }
  };

  const loadEmailTemplates = async () => {
    setIsLoadingTemplates(true);
    try {
      const loadedTemplates = await getEmailTemplates();
      setTemplates(loadedTemplates);
    } catch (error) {
      console.error("Error loading email templates:", error);
      toast({
        title: "Error",
        description: "Failed to load email templates",
        variant: "destructive",
      });
    } finally {
      setIsLoadingTemplates(false);
    }
  };

  const loadEmailLogs = async () => {
    setIsLoadingLogs(true);
    try {
      const result = await getEmailLogs();
      setLogs(result.logs);
    } catch (error) {
      console.error("Error loading email logs:", error);
      toast({
        title: "Error",
        description: "Failed to load email logs",
        variant: "destructive",
      });
    } finally {
      setIsLoadingLogs(false);
    }
  };

  const onConfigSubmit = async (values: z.infer<typeof emailConfigSchema>) => {
    try {
      const result = await updateEmailConfig({
        ...values,
        password: values.password || "", // Handle empty password
        replyTo: values.replyTo || values.fromEmail,
      });

      if (result.success) {
        toast({
          title: "Success",
          description: "Email configuration saved successfully",
        });
        loadEmailConfig(); // Reload config
      } else {
        throw new Error(result.error || "Unknown error");
      }
    } catch (error) {
      console.error("Error saving email configuration:", error);
      toast({
        title: "Error",
        description:
          error instanceof Error
            ? error.message
            : "Failed to save email configuration",
        variant: "destructive",
      });
    }
  };

  const onTestEmailSubmit = async (values: z.infer<typeof testEmailSchema>) => {
    setIsSendingTest(true);
    try {
      const result = await sendTestEmail(values.recipient);

      if (result.success) {
        toast({
          title: "Success",
          description: `Test email sent to ${values.recipient}`,
        });
        testEmailForm.reset();
      } else {
        throw new Error(result.error || "Unknown error");
      }
    } catch (error) {
      console.error("Error sending test email:", error);
      toast({
        title: "Error",
        description:
          error instanceof Error
            ? error.message
            : "Failed to send test email",
        variant: "destructive",
      });
    } finally {
      setIsSendingTest(false);
    }
  };

  const onCreateTemplateSubmit = async (values: z.infer<typeof emailTemplateSchema>) => {
    try {
      const result = await createEmailTemplate(values);

      if (result.template) {
        toast({
          title: "Success",
          description: "Email template created successfully",
        });
        setIsCreateTemplateOpen(false);
        templateForm.reset();
        loadEmailTemplates(); // Reload templates
      } else {
        throw new Error(result.error || "Unknown error");
      }
    } catch (error) {
      console.error("Error creating email template:", error);
      toast({
        title: "Error",
        description:
          error instanceof Error
            ? error.message
            : "Failed to create email template",
        variant: "destructive",
      });
    }
  };

  const onUpdateTemplateSubmit = async (values: z.infer<typeof emailTemplateSchema>) => {
    if (!selectedTemplate) return;
    
    try {
      const result = await updateEmailTemplate(selectedTemplate.id, values);

      if (result.success) {
        toast({
          title: "Success",
          description: "Email template updated successfully",
        });
        setIsEditTemplateOpen(false);
        loadEmailTemplates(); // Reload templates
      } else {
        throw new Error(result.error || "Unknown error");
      }
    } catch (error) {
      console.error("Error updating email template:", error);
      toast({
        title: "Error",
        description:
          error instanceof Error
            ? error.message
            : "Failed to update email template",
        variant: "destructive",
      });
    }
  };

  const handleDeleteTemplate = async (templateId: string) => {
    if (!window.confirm("Are you sure you want to delete this template?")) {
      return;
    }
    
    try {
      const result = await deleteEmailTemplate(templateId);

      if (result.success) {
        toast({
          title: "Success",
          description: "Email template deleted successfully",
        });
        if (selectedTemplate?.id === templateId) {
          setSelectedTemplate(null);
        }
        loadEmailTemplates(); // Reload templates
      } else {
        throw new Error(result.error || "Unknown error");
      }
    } catch (error) {
      console.error("Error deleting email template:", error);
      toast({
        title: "Error",
        description:
          error instanceof Error
            ? error.message
            : "Failed to delete email template",
        variant: "destructive",
      });
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "sent":
        return <Badge variant="outline">Sent</Badge>;
      case "delivered":
        return <Badge variant="success">Delivered</Badge>;
      case "opened":
        return <Badge variant="secondary">Opened</Badge>;
      case "clicked":
        return <Badge variant="default">Clicked</Badge>;
      case "failed":
        return <Badge variant="destructive">Failed</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  return (
    <div className="space-y-6">
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="settings">SMTP Settings</TabsTrigger>
          <TabsTrigger value="templates">Email Templates</TabsTrigger>
          <TabsTrigger value="logs">Email Logs</TabsTrigger>
        </TabsList>

        {/* SMTP Settings Tab */}
        <TabsContent value="settings" className="space-y-6 mt-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Mail className="mr-2 h-5 w-5" />
                SMTP Configuration
              </CardTitle>
              <CardDescription>
                Configure your email server settings for sending emails
              </CardDescription>
            </CardHeader>
            <CardContent>
              {isLoadingConfig ? (
                <div className="flex justify-center py-8">
                  <RefreshCw className="h-8 w-8 animate-spin text-muted-foreground" />
                </div>
              ) : (
                <Form {...configForm}>
                  <form
                    onSubmit={configForm.handleSubmit(onConfigSubmit)}
                    className="space-y-6"
                  >
                    <div className="space-y-4">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <FormField
                          control={configForm.control}
                          name="host"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>SMTP Server</FormLabel>
                              <FormControl>
                                <Input
                                  placeholder="smtp.example.com"
                                  {...field}
                                />
                              </FormControl>
                              <FormDescription>
                                Your mail server hostname
                              </FormDescription>
                              <FormMessage />
                            </FormItem>
                          )}
                        />

                        <FormField
                          control={configForm.control}
                          name="port"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Port</FormLabel>
                              <FormControl>
                                <Input
                                  type="number"
                                  placeholder="587"
                                  {...field}
                                />
                              </FormControl>
                              <FormDescription>
                                Usually 25, 465, or 587
                              </FormDescription>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>

                      <FormField
                        control={configForm.control}
                        name="secure"
                        render={({ field }) => (
                          <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                            <div className="space-y-0.5">
                              <FormLabel>Use Secure Connection (SSL/TLS)</FormLabel>
                              <FormDescription>
                                Enable SSL/TLS encryption for sending emails
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

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <FormField
                          control={configForm.control}
                          name="username"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Username</FormLabel>
                              <FormControl>
                                <Input
                                  placeholder="username@example.com"
                                  {...field}
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />

                        <FormField
                          control={configForm.control}
                          name="password"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Password</FormLabel>
                              <FormControl>
                                <Input
                                  type="password"
                                  placeholder={
                                    emailConfig?.password
                                      ? "••••••••••••"
                                      : "Enter password"
                                  }
                                  {...field}
                                />
                              </FormControl>
                              <FormDescription>
                                Leave blank to keep existing password
                              </FormDescription>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <FormField
                          control={configForm.control}
                          name="fromName"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>From Name</FormLabel>
                              <FormControl>
                                <Input
                                  placeholder="Banks o' Dee FC"
                                  {...field}
                                />
                              </FormControl>
                              <FormDescription>
                                Sender name for outgoing emails
                              </FormDescription>
                              <FormMessage />
                            </FormItem>
                          )}
                        />

                        <FormField
                          control={configForm.control}
                          name="fromEmail"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>From Email</FormLabel>
                              <FormControl>
                                <Input
                                  placeholder="noreply@banksofdeefc.co.uk"
                                  type="email"
                                  {...field}
                                />
                              </FormControl>
                              <FormDescription>
                                Sender email address
                              </FormDescription>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>

                      <FormField
                        control={configForm.control}
                        name="replyTo"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Reply-To Email</FormLabel>
                            <FormControl>
                              <Input
                                placeholder="info@banksofdeefc.co.uk"
                                type="email"
                                {...field}
                              />
                            </FormControl>
                            <FormDescription>
                              Email address for recipients to reply to (optional)
                            </FormDescription>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>

                    <Button type="submit" className="mr-4">
                      <Save className="mr-2 h-4 w-4" />
                      Save Settings
                    </Button>
                  </form>
                </Form>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Test Email</CardTitle>
              <CardDescription>
                Send a test email to verify your configuration
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Form {...testEmailForm}>
                <form
                  onSubmit={testEmailForm.handleSubmit(onTestEmailSubmit)}
                  className="space-y-4"
                >
                  <FormField
                    control={testEmailForm.control}
                    name="recipient"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Recipient Email</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="your-email@example.com"
                            type="email"
                            {...field}
                          />
                        </FormControl>
                        <FormDescription>
                          Enter your email to receive a test message
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <Button
                    type="submit"
                    disabled={isSendingTest || isLoadingConfig || !emailConfig}
                  >
                    {isSendingTest ? (
                      <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                    ) : (
                      <Send className="mr-2 h-4 w-4" />
                    )}
                    Send Test Email
                  </Button>
                </form>
              </Form>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Email Templates Tab */}
        <TabsContent value="templates" className="space-y-6 mt-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle>Email Templates</CardTitle>
                <CardDescription>
                  Create and manage email templates for your communications
                </CardDescription>
              </div>
              <Button onClick={() => setIsCreateTemplateOpen(true)}>
                <Plus className="mr-2 h-4 w-4" />
                Create Template
              </Button>
            </CardHeader>
            <CardContent>
              {isLoadingTemplates ? (
                <div className="flex justify-center py-8">
                  <RefreshCw className="h-8 w-8 animate-spin text-muted-foreground" />
                </div>
              ) : templates.length === 0 ? (
                <div className="text-center py-10 text-muted-foreground">
                  <Mail className="mx-auto h-10 w-10 mb-2 opacity-50" />
                  <p>No email templates found.</p>
                  <p className="text-sm">
                    Create your first template to get started.
                  </p>
                </div>
              ) : (
                <div>
                  <div className="rounded-md border overflow-hidden">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Name</TableHead>
                          <TableHead>Subject</TableHead>
                          <TableHead>Last Updated</TableHead>
                          <TableHead className="w-[120px]">Actions</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {templates.map((template) => (
                          <TableRow key={template.id}>
                            <TableCell className="font-medium">
                              {template.name}
                            </TableCell>
                            <TableCell>{template.subject}</TableCell>
                            <TableCell>
                              {format(
                                parseISO(template.updatedAt),
                                "MMM d, yyyy"
                              )}
                            </TableCell>
                            <TableCell>
                              <div className="flex space-x-1">
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => {
                                    setSelectedTemplate(template);
                                    setIsEditTemplateOpen(true);
                                  }}
                                  title="Edit"
                                >
                                  <Edit2 className="h-4 w-4" />
                                </Button>
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() =>
                                    handleDeleteTemplate(template.id)
                                  }
                                  title="Delete"
                                >
                                  <Trash2 className="h-4 w-4 text-destructive" />
                                </Button>
                              </div>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Create Template Dialog */}
          <Dialog
            open={isCreateTemplateOpen}
            onOpenChange={setIsCreateTemplateOpen}
          >
            <DialogContent className="sm:max-w-[600px]">
              <DialogHeader>
                <DialogTitle>Create Email Template</DialogTitle>
                <DialogDescription>
                  Create a new template for your email communications
                </DialogDescription>
              </DialogHeader>

              <Form {...templateForm}>
                <form
                  onSubmit={templateForm.handleSubmit(onCreateTemplateSubmit)}
                  className="space-y-4"
                >
                  <FormField
                    control={templateForm.control}
                    name="name"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Template Name</FormLabel>
                        <FormControl>
                          <Input placeholder="Welcome Email" {...field} />
                        </FormControl>
                        <FormDescription>
                          A descriptive name for the template
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={templateForm.control}
                    name="description"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Description (Optional)</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="Used for welcoming new subscribers"
                            {...field}
                          />
                        </FormControl>
                        <FormDescription>
                          Brief description of when to use this template
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={templateForm.control}
                    name="subject"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Email Subject</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="Welcome to Banks o' Dee FC!"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={templateForm.control}
                    name="content"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Email Content</FormLabel>
                        <FormControl>
                          <Textarea
                            placeholder="Dear {{name}},

Thank you for subscribing to Banks o' Dee FC updates!

Best regards,
The Banks o' Dee FC Team"
                            className="min-h-[200px] font-mono"
                            {...field}
                          />
                        </FormControl>
                        <FormDescription>
                          Use placeholders like {{name}} for dynamic content
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <DialogFooter>
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => setIsCreateTemplateOpen(false)}
                    >
                      Cancel
                    </Button>
                    <Button type="submit">Create Template</Button>
                  </DialogFooter>
                </form>
              </Form>
            </DialogContent>
          </Dialog>

          {/* Edit Template Dialog */}
          <Dialog
            open={isEditTemplateOpen}
            onOpenChange={setIsEditTemplateOpen}
          >
            <DialogContent className="sm:max-w-[600px]">
              <DialogHeader>
                <DialogTitle>Edit Email Template</DialogTitle>
                <DialogDescription>
                  Modify the selected email template
                </DialogDescription>
              </DialogHeader>

              <Form {...templateForm}>
                <form
                  onSubmit={templateForm.handleSubmit(onUpdateTemplateSubmit)}
                  className="space-y-4"
                >
                  <FormField
                    control={templateForm.control}
                    name="name"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Template Name</FormLabel>
                        <FormControl>
                          <Input {...field} />
                        </FormControl>
                        <FormDescription>
                          A descriptive name for the template
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={templateForm.control}
                    name="description"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Description (Optional)</FormLabel>
                        <FormControl>
                          <Input {...field} />
                        </FormControl>
                        <FormDescription>
                          Brief description of when to use this template
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={templateForm.control}
                    name="subject"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Email Subject</FormLabel>
                        <FormControl>
                          <Input {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={templateForm.control}
                    name="content"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Email Content</FormLabel>
                        <FormControl>
                          <Textarea
                            className="min-h-[200px] font-mono"
                            {...field}
                          />
                        </FormControl>
                        <FormDescription>
                          Use placeholders like {{name}} for dynamic content
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <DialogFooter>
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => {
                        setIsEditTemplateOpen(false);
                        setSelectedTemplate(null);
                      }}
                    >
                      Cancel
                    </Button>
                    <Button type="submit">Update Template</Button>
                  </DialogFooter>
                </form>
              </Form>
            </DialogContent>
          </Dialog>
        </TabsContent>

        {/* Email Logs Tab */}
        <TabsContent value="logs" className="space-y-6 mt-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle>Email Logs</CardTitle>
                <CardDescription>
                  Track delivery and engagement metrics for your emails
                </CardDescription>
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={loadEmailLogs}
                disabled={isLoadingLogs}
              >
                <RefreshCw
                  className={`mr-2 h-4 w-4 ${
                    isLoadingLogs ? "animate-spin" : ""
                  }`}
                />
                Refresh
              </Button>
            </CardHeader>
            <CardContent>
              {isLoadingLogs ? (
                <div className="flex justify-center py-8">
                  <RefreshCw className="h-8 w-8 animate-spin text-muted-foreground" />
                </div>
              ) : logs.length === 0 ? (
                <div className="text-center py-10 text-muted-foreground">
                  <Mail className="mx-auto h-10 w-10 mb-2 opacity-50" />
                  <p>No email logs found.</p>
                  <p className="text-sm">Logs will appear here once emails are sent.</p>
                </div>
              ) : (
                <div>
                  <Alert className="mb-4">
                    <AlertCircle className="h-4 w-4" />
                    <AlertTitle>Email Analytics Coming Soon</AlertTitle>
                    <AlertDescription>
                      Advanced email analytics, including open rates and click tracking,
                      will be available in a future update.
                    </AlertDescription>
                  </Alert>

                  <div className="rounded-md border overflow-hidden">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Recipient</TableHead>
                          <TableHead>Subject</TableHead>
                          <TableHead>Status</TableHead>
                          <TableHead>Sent Date</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {logs.map((log) => (
                          <TableRow key={log.id}>
                            <TableCell className="font-medium">
                              {log.recipient}
                            </TableCell>
                            <TableCell>{log.subject}</TableCell>
                            <TableCell>{getStatusBadge(log.status)}</TableCell>
                            <TableCell>
                              {format(
                                parseISO(log.sent_at),
                                "MMM d, yyyy HH:mm"
                              )}
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default EmailConfiguration;
