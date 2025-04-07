
import { supabase } from "@/integrations/supabase/client";
import { executeQuery } from '@/lib/supabase';

export interface EmailConfig {
  host: string;
  port: number;
  secure: boolean;
  username: string;
  password: string;
  fromName: string;
  fromEmail: string;
  replyTo: string;
}

export interface EmailTemplate {
  id: string;
  name: string;
  subject: string;
  content: string;
  description?: string;
  createdAt: string;
  updatedAt: string;
}

export interface EmailSendResult {
  success: boolean;
  messageId?: string;
  error?: string;
}

export interface EmailLog {
  id: string;
  template_id: string | null;
  recipient: string;
  subject: string;
  status: 'sent' | 'failed' | 'delivered' | 'opened' | 'clicked';
  sent_at: string;
  error?: string;
  opened_at?: string;
  clicked_at?: string;
}

/**
 * Mock email functions to avoid database errors
 */

/**
 * Get email configuration
 */
export async function getEmailConfig(): Promise<EmailConfig | null> {
  try {
    // Return mock data to avoid database errors
    return {
      host: 'smtp.example.com',
      port: 587,
      secure: true,
      username: 'user@example.com',
      password: '********',
      fromName: 'Banks o\' Dee FC',
      fromEmail: 'noreply@banksofdee.com',
      replyTo: 'info@banksofdee.com'
    };
  } catch (error) {
    console.error('Error fetching email configuration:', error);
    return null;
  }
}

/**
 * Update email configuration
 */
export async function updateEmailConfig(config: EmailConfig): Promise<{ success: boolean; error: string | null }> {
  try {
    // Mock successful update
    console.log('Would update email config:', config);
    return { success: true, error: null };
  } catch (error) {
    console.error('Error updating email configuration:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'An unknown error occurred'
    };
  }
}

/**
 * Get all email templates
 */
export async function getEmailTemplates(): Promise<EmailTemplate[]> {
  try {
    // Return mock data
    return [
      {
        id: '1',
        name: 'Welcome Email',
        subject: 'Welcome to Banks o\' Dee FC!',
        content: 'Hello {{name}},\n\nWelcome to Banks o\' Dee FC!',
        description: 'Sent to new subscribers',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      },
      {
        id: '2',
        name: 'Newsletter',
        subject: 'Monthly Newsletter',
        content: 'Hello {{name}},\n\nHere is our monthly newsletter!',
        description: 'Monthly newsletter',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      }
    ];
  } catch (error) {
    console.error('Error fetching email templates:', error);
    return [];
  }
}

/**
 * Get email template by ID
 */
export async function getEmailTemplateById(id: string): Promise<EmailTemplate | null> {
  try {
    // Return mock data
    const templates = await getEmailTemplates();
    return templates.find(template => template.id === id) || null;
  } catch (error) {
    console.error(`Error fetching email template (${id}):`, error);
    return null;
  }
}

/**
 * Create email template
 */
export async function createEmailTemplate(template: Omit<EmailTemplate, 'id' | 'createdAt' | 'updatedAt'>): Promise<{ template: EmailTemplate | null; error: string | null }> {
  try {
    // Mock successful creation
    const newTemplate: EmailTemplate = {
      id: Date.now().toString(),
      ...template,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    
    console.log('Would create template:', newTemplate);
    
    return { template: newTemplate, error: null };
  } catch (error) {
    console.error('Error creating email template:', error);
    return {
      template: null,
      error: error instanceof Error ? error.message : 'An unknown error occurred'
    };
  }
}

/**
 * Update email template
 */
export async function updateEmailTemplate(id: string, updates: Partial<EmailTemplate>): Promise<{ success: boolean; error: string | null }> {
  try {
    // Mock successful update
    console.log(`Would update template ${id} with:`, updates);
    return { success: true, error: null };
  } catch (error) {
    console.error(`Error updating email template (${id}):`, error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'An unknown error occurred'
    };
  }
}

/**
 * Delete email template
 */
export async function deleteEmailTemplate(id: string): Promise<{ success: boolean; error: string | null }> {
  try {
    // Mock successful deletion
    console.log(`Would delete template ${id}`);
    return { success: true, error: null };
  } catch (error) {
    console.error(`Error deleting email template (${id}):`, error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'An unknown error occurred'
    };
  }
}

/**
 * Get email logs
 */
export async function getEmailLogs(limit = 50, offset = 0): Promise<{ logs: EmailLog[]; count: number }> {
  try {
    // Mock email logs
    const mockLogs: EmailLog[] = [
      {
        id: '1',
        template_id: '1',
        recipient: 'user@example.com',
        subject: 'Welcome to Banks o\' Dee FC!',
        status: 'sent',
        sent_at: new Date().toISOString(),
      },
      {
        id: '2',
        template_id: '2',
        recipient: 'other@example.com',
        subject: 'Monthly Newsletter',
        status: 'delivered',
        sent_at: new Date(Date.now() - 86400000).toISOString(),
        opened_at: new Date(Date.now() - 80000000).toISOString(),
      }
    ];
    
    return {
      logs: mockLogs.slice(offset, offset + limit),
      count: mockLogs.length
    };
  } catch (error) {
    console.error('Error fetching email logs:', error);
    return { logs: [], count: 0 };
  }
}

/**
 * Send test email
 */
export async function sendTestEmail(recipient: string): Promise<EmailSendResult> {
  try {
    // Mock successful email send
    console.log(`Would send test email to ${recipient}`);
    return { 
      success: true, 
      messageId: `test-${Date.now()}` 
    };
  } catch (error) {
    console.error('Error sending test email:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'An unknown error occurred'
    };
  }
}

/**
 * Send email using template
 */
export async function sendTemplateEmail(
  templateId: string,
  recipient: string,
  data?: Record<string, any>
): Promise<EmailSendResult> {
  try {
    // Mock successful template email send
    console.log(`Would send template email ${templateId} to ${recipient} with data:`, data);
    return { 
      success: true, 
      messageId: `template-${Date.now()}` 
    };
  } catch (error) {
    console.error('Error sending template email:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'An unknown error occurred'
    };
  }
}
