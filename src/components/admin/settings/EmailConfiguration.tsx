import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { toast } from 'sonner';
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { CheckCircle, AlertTriangle, Copy, Mail, Settings } from 'lucide-react';

// Define a schema for the form
const formSchema = z.object({
  smtpHost: z.string().min(2, {
    message: "SMTP Host must be at least 2 characters.",
  }),
  smtpPort: z.string().min(1, {
    message: "SMTP Port must be at least 1 character.",
  }),
  smtpUsername: z.string().email({
    message: "Please enter a valid email.",
  }),
  smtpPassword: z.string().min(8, {
    message: "SMTP Password must be at least 8 characters.",
  }),
  fromEmail: z.string().email({
    message: "Please enter a valid email.",
  }),
  testEmail: z.string().email({
    message: "Please enter a valid email.",
  }),
  enableTLS: z.boolean().default(false),
  templateNewUser: z.string().min(10, {
    message: "Template must be at least 10 characters.",
  }),
  templateForgotPassword: z.string().min(10, {
    message: "Template must be at least 10 characters.",
  }),
  templateNewSubscriber: z.string().min(10, {
    message: "Template must be at least 10 characters.",
  }),
})

const TabContent = ({ children, value, selected }: { children: React.ReactNode, value: string, selected: string }) => {
  return (
    <div className={`${value === selected ? 'block' : 'hidden'} py-4`}>
      {children}
    </div>
  );
};

const EmailConfiguration = () => {
  const [activeTab, setActiveTab] = useState('general');
  const [isCopied, setIsCopied] = useState(false);

  // Initialize form
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      smtpHost: "mail.example.com",
      smtpPort: "587",
      smtpUsername: "user@example.com",
      smtpPassword: "password",
      fromEmail: "noreply@example.com",
      testEmail: "test@example.com",
      enableTLS: true,
      templateNewUser: "Welcome to our platform!",
      templateForgotPassword: "Reset your password here.",
      templateNewSubscriber: "Thanks for subscribing!",
    },
  })

  // Handler for form submission
  const onSubmit = (values: z.infer<typeof formSchema>) => {
    // Display success message
    toast.success("Settings saved successfully!");
    // Log the form values
    console.log(values)
  }

  // Function to copy settings
  const handleCopySettings = () => {
    const settingsString = JSON.stringify(form.getValues(), null, 2);
    navigator.clipboard.writeText(settingsString);
    setIsCopied(true);
    setTimeout(() => setIsCopied(false), 2000);
  };

  return (
    <Card className="w-[100%]">
      <CardHeader>
        <CardTitle>Email Configuration</CardTitle>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="general" className="w-[400px]" value={activeTab} onValueChange={setActiveTab}>
          <TabsList>
            <TabsTrigger value="general">General</TabsTrigger>
            <TabsTrigger value="templates">Templates</TabsTrigger>
            <TabsTrigger value="test">Test Email</TabsTrigger>
          </TabsList>
          <TabContent value="general" selected={activeTab}>
            <h3 className="text-lg font-semibold mb-4">General Settings</h3>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                <FormField
                  control={form.control}
                  name="smtpHost"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>SMTP Host</FormLabel>
                      <FormControl>
                        <Input placeholder="SMTP Host" {...field} />
                      </FormControl>
                      <FormDescription>
                        The hostname of your SMTP server.
                      </FormDescription>
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
                        <Input placeholder="SMTP Port" {...field} />
                      </FormControl>
                      <FormDescription>
                        The port number your SMTP server uses.
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="smtpUsername"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>SMTP Username</FormLabel>
                      <FormControl>
                        <Input placeholder="SMTP Username" {...field} />
                      </FormControl>
                      <FormDescription>
                        The username for your SMTP server.
                      </FormDescription>
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
                        <Input type="password" placeholder="SMTP Password" {...field} />
                      </FormControl>
                      <FormDescription>
                        The password for your SMTP server.
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="fromEmail"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>From Email</FormLabel>
                      <FormControl>
                        <Input placeholder="From Email" {...field} />
                      </FormControl>
                      <FormDescription>
                        The email address used as the sender.
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="enableTLS"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-center space-x-3 space-y-0 rounded-md border p-4">
                      <FormControl>
                        <Switch
                          checked={field.value}
                          onCheckedChange={field.onChange}
                        />
                      </FormControl>
                      <div className="space-y-1 leading-none">
                        <FormLabel>Enable TLS</FormLabel>
                        <FormDescription>
                          Enable Transport Layer Security.
                        </FormDescription>
                      </div>
                    </FormItem>
                  )}
                />
                <Button type="submit">Save Settings</Button>
              </form>
            </Form>
          </TabContent>
          <TabContent value="templates" selected={activeTab}>
            <h3 className="text-lg font-semibold mb-4">Email Templates</h3>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                <FormField
                  control={form.control}
                  name="templateNewUser"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>New User Template</FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="New User Template"
                          className="resize-none"
                          {...field}
                        />
                      </FormControl>
                      <FormDescription>
                        The template for new user emails.
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="templateForgotPassword"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Forgot Password Template</FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="Forgot Password Template"
                          className="resize-none"
                          {...field}
                        />
                      </FormControl>
                      <FormDescription>
                        The template for forgot password emails.
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="templateNewSubscriber"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>New Subscriber Template</FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="New Subscriber Template"
                          className="resize-none"
                          {...field}
                        />
                      </FormControl>
                      <FormDescription>
                        The template for new subscriber emails.
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <Button type="submit">Save Templates</Button>
              </form>
            </Form>
          </TabContent>
          <TabContent value="test" selected={activeTab}>
            <h3 className="text-lg font-semibold mb-4">Test Email</h3>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                <FormField
                  control={form.control}
                  name="testEmail"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Test Email Address</FormLabel>
                      <FormControl>
                        <Input placeholder="Test Email Address" {...field} />
                      </FormControl>
                      <FormDescription>
                        The email address to send a test email to.
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <Button type="submit">Send Test Email</Button>
              </form>
            </Form>
          </TabContent>
        </Tabs>
        <div className="mt-4">
          <Button variant="secondary" size="sm" onClick={handleCopySettings} disabled={isCopied}>
            {isCopied ? (
              <>
                <CheckCircle className="mr-2 h-4 w-4" />
                Copied!
              </>
            ) : (
              <>
                <Copy className="mr-2 h-4 w-4" />
                Copy Settings
              </>
            )}
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}

export default EmailConfiguration;
