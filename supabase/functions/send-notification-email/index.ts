import React from 'npm:react@18.3.1';
import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { Resend } from "npm:resend@4.0.0";
import { renderAsync } from 'npm:@react-email/components@0.0.22';
import { ApplicationConfirmationEmail } from './_templates/application-confirmation.tsx';
import { InterviewScheduledEmail } from './_templates/interview-scheduled.tsx';
import { OfferLetterEmail } from './_templates/offer-letter.tsx';
import { BackgroundCheckEmail } from './_templates/background-check.tsx';

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
    candidateName: string;
    jobTitle: string;
    companyName?: string;
    interviewDate?: string;
    interviewTime?: string;
    interviewType?: string;
    meetingLink?: string;
    location?: string;
    salary?: string;
    startDate?: string;
    consentLink?: string;
  };
}

const handler = async (req: Request): Promise<Response> => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { to, subject, type, data }: EmailRequest = await req.json();

    let html = "";

    switch (type) {
      case 'application':
        html = await renderAsync(
          React.createElement(ApplicationConfirmationEmail, {
            candidateName: data.candidateName,
            jobTitle: data.jobTitle,
            companyName: data.companyName,
          })
        );
        break;

      case 'interview':
        html = await renderAsync(
          React.createElement(InterviewScheduledEmail, {
            candidateName: data.candidateName,
            jobTitle: data.jobTitle,
            interviewDate: data.interviewDate || '',
            interviewTime: data.interviewTime || '',
            interviewType: data.interviewType || '',
            meetingLink: data.meetingLink,
            location: data.location,
          })
        );
        break;

      case 'offer':
        html = await renderAsync(
          React.createElement(OfferLetterEmail, {
            candidateName: data.candidateName,
            jobTitle: data.jobTitle,
            salary: data.salary || '',
            startDate: data.startDate,
            companyName: data.companyName,
          })
        );
        break;

      case 'background-check':
        html = await renderAsync(
          React.createElement(BackgroundCheckEmail, {
            candidateName: data.candidateName,
            jobTitle: data.jobTitle,
            consentLink: data.consentLink || '',
            companyName: data.companyName,
          })
        );
        break;

      default:
        throw new Error(`Unknown email type: ${type}`);
    }

    const emailResponse = await resend.emails.send({
      from: "HRM8 <onboarding@resend.dev>",
      to: [to],
      subject: subject,
      html: html,
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
