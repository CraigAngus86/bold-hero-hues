
import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.36.0";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

interface TemplateEmailRequest {
  templateId: string;
  recipient: string;
  data?: Record<string, any>;
}

const handler = async (req: Request): Promise<Response> => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  const supabase = createClient(
    Deno.env.get("SUPABASE_URL") || '',
    Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") || ''
  );

  try {
    const { templateId, recipient, data }: TemplateEmailRequest = await req.json();

    // Get the template from the database
    const { data: template, error: templateError } = await supabase
      .from("email_templates")
      .select("*")
      .eq("id", templateId)
      .single();

    if (templateError) {
      throw new Error(`Template not found: ${templateError.message}`);
    }

    // Process the template with variables
    let content = template.content;
    let subject = template.subject;

    if (data) {
      // Replace variables in the template
      Object.entries(data).forEach(([key, value]) => {
        const regex = new RegExp(`{{\\s*${key}\\s*}}`, 'g');
        content = content.replace(regex, String(value));
        subject = subject.replace(regex, String(value));
      });
    }

    // Here we would normally connect to an email service like Resend, SendGrid, etc.
    // For demo purposes, we'll just simulate a successful email send
    const messageId = `template-${Date.now()}`;
    
    console.log(`[TEST] Would send template email to ${recipient} using template "${template.name}" with message ID: ${messageId}`);

    // Log this send in the email_logs table
    const { error: logError } = await supabase
      .from("email_logs")
      .insert({
        template_id: templateId,
        recipient,
        subject,
        status: "sent",
        sent_at: new Date().toISOString(),
      });

    if (logError) {
      console.error("Error logging email:", logError);
    }

    // Return success response
    return new Response(
      JSON.stringify({
        success: true,
        messageId,
      }),
      {
        status: 200,
        headers: {
          "Content-Type": "application/json",
          ...corsHeaders,
        },
      }
    );
  } catch (error: any) {
    console.error("Error in send-template-email function:", error);
    return new Response(
      JSON.stringify({ success: false, error: error.message }),
      {
        status: 500,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      }
    );
  }
};

serve(handler);
