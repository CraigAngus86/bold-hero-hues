
import { supabase } from "@/integrations/supabase/client";

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
 * Get email configuration
 */
export async function getEmailConfig(): Promise<EmailConfig | null> {
  try {
    // Email config is stored as individual settings
    const { data: settings, error } = await supabase
      .from('settings')
      .select('*')
      .in('key', [
        'email.host',
        'email.port',
        'email.secure',
        'email.username',
        'email.from_name',
        'email.from_email',
        'email.reply_to',
      ]);
      
    if (error) throw error;
    
    // Convert array of settings to EmailConfig object
    if (!settings || settings.length === 0) return null;
    
    const config: Record<string, any> = {};
    settings.forEach(setting => {
      const key = setting.key.replace('email.', '').replace(/_([a-z])/g, (g) => g[1].toUpperCase());
      
      if (key === 'port') {
        config[key] = parseInt(setting.value, 10);
      } else if (key === 'secure') {
        config[key] = setting.value === 'true';
      } else {
        config[key] = setting.value;
      }
    });
    
    // Check if all required fields are present
    const requiredKeys = ['host', 'port', 'username', 'fromName', 'fromEmail'];
    const hasAllRequired = requiredKeys.every(key => config[key]);
    
    if (!hasAllRequired) return null;
    
    return config as EmailConfig;
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
    // Convert EmailConfig to array of settings
    const settings = [
      { key: 'email.host', value: config.host },
      { key: 'email.port', value: config.port.toString() },
      { key: 'email.secure', value: config.secure.toString() },
      { key: 'email.username', value: config.username },
      { key: 'email.from_name', value: config.fromName },
      { key: 'email.from_email', value: config.fromEmail },
      { key: 'email.reply_to', value: config.replyTo || config.fromEmail },
    ];
    
    if (config.password) {
      settings.push({ key: 'email.password', value: config.password });
    }
    
    // Update each setting
    for (const setting of settings) {
      const { error } = await supabase
        .from('settings')
        .upsert(setting, { onConflict: 'key' });
        
      if (error) throw error;
    }
    
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
    const { data, error } = await supabase
      .from('email_templates')
      .select('*')
      .order('name');
      
    if (error) throw error;
    
    return data as EmailTemplate[];
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
    const { data, error } = await supabase
      .from('email_templates')
      .select('*')
      .eq('id', id)
      .single();
      
    if (error) throw error;
    
    return data as EmailTemplate;
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
    const { data, error } = await supabase
      .from('email_templates')
      .insert([template])
      .select()
      .single();
      
    if (error) throw error;
    
    return { template: data as EmailTemplate, error: null };
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
    const { error } = await supabase
      .from('email_templates')
      .update(updates)
      .eq('id', id);
      
    if (error) throw error;
    
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
    const { error } = await supabase
      .from('email_templates')
      .delete()
      .eq('id', id);
      
    if (error) throw error;
    
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
    const { data, count, error } = await supabase
      .from('email_logs')
      .select('*', { count: 'exact' })
      .order('sent_at', { ascending: false })
      .range(offset, offset + limit - 1);
      
    if (error) throw error;
    
    return {
      logs: data as EmailLog[],
      count: count || 0
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
    // This will call the edge function to send a test email
    const { data, error } = await supabase.functions.invoke('send-test-email', {
      body: {
        recipient
      }
    });
    
    if (error) throw error;
    
    if (data?.success) {
      return { 
        success: true, 
        messageId: data.messageId 
      };
    } else {
      return { 
        success: false, 
        error: data?.error || 'Failed to send test email'
      };
    }
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
    // This will call the edge function to send an email from a template
    const { data: responseData, error } = await supabase.functions.invoke('send-template-email', {
      body: {
        templateId,
        recipient,
        data
      }
    });
    
    if (error) throw error;
    
    if (responseData?.success) {
      return { 
        success: true, 
        messageId: responseData.messageId 
      };
    } else {
      return { 
        success: false, 
        error: responseData?.error || 'Failed to send email'
      };
    }
  } catch (error) {
    console.error('Error sending template email:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'An unknown error occurred'
    };
  }
}
