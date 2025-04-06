
import { serve } from "https://deno.land/std@0.190.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

interface TestEmailRequest {
  recipient: string;
}

const handler = async (req: Request): Promise<Response> => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { recipient }: TestEmailRequest = await req.json();

    // Here we would normally connect to an email service like Resend, SendGrid, etc.
    // For demo purposes, we'll just simulate a successful email send
    const messageId = `test-${Date.now()}`;
    
    console.log(`[TEST] Would send email to ${recipient} with message ID: ${messageId}`);

    // In a real implementation, this is where you would send the actual email
    // const emailResponse = await emailService.send({ ... })
    
    // For now, simulate a successful response
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
    console.error("Error in send-test-email function:", error);
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
