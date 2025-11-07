import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { Resend } from "npm:resend@2.0.0";

const resend = new Resend(Deno.env.get("RESEND_API_KEY"));

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

interface EmailRequest {
  to: string;
  subject: string;
  type: 'application' | 'interview' | 'offer' | 'background-check';
  data: {
    candidateName?: string;
    jobTitle?: string;
    interviewDate?: string;
    interviewTime?: string;
    interviewType?: string;
    meetingLink?: string;
    offerDetails?: string;
    [key: string]: any;
  };
}

const handler = async (req: Request): Promise<Response> => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { to, subject, type, data }: EmailRequest = await req.json();

    let htmlContent = "";

    switch (type) {
      case 'application':
        htmlContent = `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
            <h1 style="color: #333;">Application Received</h1>
            <p>Dear ${data.candidateName},</p>
            <p>Thank you for applying for the <strong>${data.jobTitle}</strong> position.</p>
            <p>We have received your application and our team will review it shortly. We'll be in touch soon.</p>
            <p>Best regards,<br>The Hiring Team</p>
          </div>
        `;
        break;

      case 'interview':
        htmlContent = `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
            <h1 style="color: #333;">Interview Scheduled</h1>
            <p>Dear ${data.candidateName},</p>
            <p>Your interview for <strong>${data.jobTitle}</strong> has been scheduled.</p>
            <div style="background-color: #f5f5f5; padding: 20px; border-radius: 8px; margin: 20px 0;">
              <p><strong>Date:</strong> ${data.interviewDate}</p>
              <p><strong>Time:</strong> ${data.interviewTime}</p>
              <p><strong>Type:</strong> ${data.interviewType}</p>
              ${data.meetingLink ? `<p><strong>Meeting Link:</strong> <a href="${data.meetingLink}">${data.meetingLink}</a></p>` : ''}
            </div>
            <p>Please join the meeting 5 minutes early. Looking forward to speaking with you!</p>
            <p>Best regards,<br>The Hiring Team</p>
          </div>
        `;
        break;

      case 'offer':
        htmlContent = `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
            <h1 style="color: #333;">Congratulations! Job Offer</h1>
            <p>Dear ${data.candidateName},</p>
            <p>We are pleased to extend you an offer for the <strong>${data.jobTitle}</strong> position.</p>
            <p>Please review the attached offer letter carefully and let us know your decision.</p>
            <p>We're excited about the possibility of you joining our team!</p>
            <p>Best regards,<br>The Hiring Team</p>
          </div>
        `;
        break;

      case 'background-check':
        htmlContent = `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
            <h1 style="color: #333;">Background Check Required</h1>
            <p>Dear ${data.candidateName},</p>
            <p>As part of our hiring process, we need to conduct a background check.</p>
            <p>Please click the link below to provide your consent and necessary information.</p>
            <div style="margin: 30px 0; text-align: center;">
              <a href="${data.consentLink}" style="background-color: #007bff; color: white; padding: 12px 24px; text-decoration: none; border-radius: 4px; display: inline-block;">
                Provide Consent
              </a>
            </div>
            <p>This is a standard procedure and helps us ensure a safe workplace for everyone.</p>
            <p>Best regards,<br>The Hiring Team</p>
          </div>
        `;
        break;

      default:
        htmlContent = `<p>Notification email</p>`;
    }

    const emailResponse = await resend.emails.send({
      from: "HRM8 <onboarding@resend.dev>",
      to: [to],
      subject: subject,
      html: htmlContent,
    });

    console.log("Email sent successfully:", emailResponse);

    return new Response(JSON.stringify(emailResponse), {
      status: 200,
      headers: { "Content-Type": "application/json", ...corsHeaders },
    });
  } catch (error: any) {
    console.error("Error sending email:", error);
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        status: 500,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      }
    );
  }
};

serve(handler);
